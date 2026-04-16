import type { Plugin, ViteDevServer } from "vite";
import { createHash } from "crypto";
import { GoogleGenAI } from "@google/genai";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function anonName(h: string): string {
  return "Anonym #" + h.slice(0, 6).toUpperCase();
}

const CATEGORIES = [
  { id: "kronofogden",       name: "Kronofogden",       icon: "⚖️", desc: "Skulder, utmätning, betalningsanmärkningar", color: "#dc2626" },
  { id: "skatteverket",      name: "Skatteverket",       icon: "📋", desc: "Deklaration, folkbokföring, personnummer",    color: "#0a7ea4" },
  { id: "forsakringskassan", name: "Försäkringskassan",  icon: "🏥", desc: "Sjukpenning, föräldrapenning, bidrag",        color: "#059669" },
  { id: "migrationsverket",  name: "Migrationsverket",   icon: "🌐", desc: "Uppehållstillstånd, medborgarskap, asyl",    color: "#7c3aed" },
  { id: "arbetsformedlingen",name: "Arbetsförmedlingen", icon: "💼", desc: "A-kassa, aktivitetsrapport, åtgärder",       color: "#d97706" },
];
const VALID_CATS = new Set(CATEGORIES.map(c => c.id));

async function readBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk: Buffer) => { data += chunk.toString(); });
    req.on("end", () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch { reject(new Error("Invalid JSON")); }
    });
    req.on("error", reject);
  });
}

function json(res: any, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

function checkAdminKey(req: any): boolean {
  const adminKey = process.env.FORUM_ADMIN_KEY;
  if (!adminKey) return false;
  const provided = req.headers["x-admin-key"] || "";
  return provided === adminKey;
}

const CASE_TYPES: Record<string, string[]> = {
  Skatteverket: ["Felaktig debitering","Ändring av folkbokföring","Deklarationsfråga","Överklagande av beslut","Begära anstånd","Annat"],
  Kronofogden: ["Bestrida skuld","Begära skuldsanering","Fråga om utmätning","Begära betalningsplan","Invändning mot betalningsföreläggande","Annat"],
  Försäkringskassan: ["Sjukpenning nekad","Föräldrapenning","Handläggning tar för lång tid","Överklaga beslut","Begära omprövning","Aktivitetsersättning","Annat"],
  Migrationsverket: ["Uppehållstillstånd","Medborgarskap","Asylansökan","Förlängning av tillstånd","Arbetstillstånd","Annat"],
  Arbetsförmedlingen: ["A-kassa nekad","Aktivitetsrapport","Överklagande","Fråga om åtgärder","Annat"],
  Inkasso: ["Bestrida inkassokrav","Begära specificering av skuld","Begära betalningsplan","Preskriberad skuld","Felaktigt krav","Annat"],
  Socialtjänsten: ["Ekonomiskt bistånd","Överklagande av beslut","Begära utredning","Barnomsorg","Annat"],
  Boverket: ["Bostadsbidrag","Överklagande","Fråga om bidrag","Annat"],
  "Annan myndighet": ["Överklagande av beslut","Begära information","Klagomål","Allmän förfrågan","Annat"],
};

function getGeminiClient() {
  const baseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
  if (!baseUrl || !apiKey) throw new Error("Gemini env vars not set");
  return new GoogleGenAI({ apiKey, httpOptions: { apiVersion: "", baseUrl } });
}

async function handleAiRequest(pathname: string, method: string, body: any, res: any): Promise<void> {
  if (method === "GET" && pathname === "/api/ai/case-types") {
    return json(res, 200, CASE_TYPES);
  }

  if (method === "POST" && pathname === "/api/ai/generate") {
    const { fullName, personnummer, institution, caseType, description } = body ?? {};
    if (!fullName?.trim() || !personnummer?.trim() || !institution?.trim() || !caseType?.trim() || !description?.trim()) {
      return json(res, 400, { error: "Alla fält måste fyllas i." });
    }
    if (description.trim().length < 20) {
      return json(res, 400, { error: "Problembeskrivningen måste vara minst 20 tecken." });
    }

    const prompt = `Skriv ett komplett formellt brev på svenska. Generera HELA brevet utan avbrott.

Avsändare: ${fullName.trim()}
Personnummer: ${personnummer.trim()}
Mottagare: ${institution.trim()}
Ärendetyp: ${caseType.trim()}
Ärendebeskrivning: ${description.trim()}

Brevstruktur (följ exakt):
1. "Till ${institution.trim()},"
2. Presentation: vem du är, personnummer
3. Syfte: vad ärendet gäller
4. Bakgrund: beskriv situationen (2-3 meningar)
5. Begäran: vad du vill att myndigheten ska göra
6. Avslutning: tackar för behandling av ärendet
7. "Med vänliga hälsningar,"
8. "${fullName.trim()}"

Krav: Skriv brevet på svenska. Formell ton. Minst 8 meningar. Returnera BARA brevtexten.`;

    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          maxOutputTokens: 1200,
          temperature: 0.3,
          thinkingConfig: { thinkingBudget: 0 },
        },
      });
      const text = (response.text ?? "").trim();
      if (!text) return json(res, 500, { error: "Inget svar från AI. Försök igen." });
      return json(res, 200, { message: text });
    } catch (err) {
      console.error("[ai-generate]", err);
      return json(res, 500, { error: "Ett fel uppstod vid generering. Försök igen om en stund." });
    }
  }

  return json(res, 404, { error: "Route not found" });
}

export function forumApiPlugin(): Plugin {
  return {
    name: "forum-api",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const base = (process.env.BASE_PATH || "/svar-direkt-web/").replace(/\/$/, "");
        const url: string = req.url || "";
        const path = url.startsWith(base) ? url.slice(base.length) : url;
        const [pathname, qs] = path.split("?");
        const query = Object.fromEntries(new URLSearchParams(qs || ""));
        const method: string = req.method || "GET";

        if (pathname.startsWith("/api/ai")) {
          const body = method !== "GET" ? await readBody(req) : undefined;
          return handleAiRequest(pathname, method, body, res);
        }

        if (!pathname.startsWith("/api/forum")) return next();
        const seg = pathname.replace("/api/forum", "").replace(/^\//, "");

        try {
          // ── Admin routes ──────────────────────────────────────────────────
          if (seg.startsWith("admin")) {
            if (!checkAdminKey(req)) return json(res, 401, { error: "Unauthorized" });

            const adminSeg = seg.replace(/^admin\/?/, "");

            // GET /api/forum/admin/threads
            if (method === "GET" && adminSeg === "threads") {
              const r = await pool.query(`
                SELECT id, category, title, is_solved, is_hidden,
                       reply_count, created_at, LEFT(body,200) as body_preview,
                       author_token_hash
                FROM forum_threads ORDER BY created_at DESC LIMIT 200`);
              return json(res, 200, r.rows.map(row => ({ ...row, display_name: anonName(row.author_token_hash) })));
            }

            // GET /api/forum/admin/threads/:id
            const adminThreadMatch = adminSeg.match(/^threads\/(\d+)$/);
            if (method === "GET" && adminThreadMatch) {
              const id = adminThreadMatch[1];
              const tr = await pool.query(`SELECT * FROM forum_threads WHERE id=$1`, [id]);
              if (!tr.rows[0]) return json(res, 404, { error: "Not found" });
              const rr = await pool.query(`SELECT * FROM forum_replies WHERE thread_id=$1 ORDER BY created_at ASC`, [id]);
              return json(res, 200, {
                ...tr.rows[0],
                display_name: anonName(tr.rows[0].author_token_hash),
                replies: rr.rows.map(r => ({ ...r, display_name: anonName(r.author_token_hash) }))
              });
            }

            // PATCH /api/forum/admin/threads/:id/hide
            const hideThreadMatch = adminSeg.match(/^threads\/(\d+)\/hide$/);
            if (method === "PATCH" && hideThreadMatch) {
              const id = hideThreadMatch[1];
              const r = await pool.query(
                `UPDATE forum_threads SET is_hidden = NOT is_hidden WHERE id=$1 RETURNING id, is_hidden`, [id]
              );
              if (!r.rows[0]) return json(res, 404, { error: "Not found" });
              return json(res, 200, r.rows[0]);
            }

            // DELETE /api/forum/admin/threads/:id
            const deleteThreadMatch = adminSeg.match(/^threads\/(\d+)$/);
            if (method === "DELETE" && deleteThreadMatch) {
              const id = deleteThreadMatch[1];
              await pool.query(`DELETE FROM forum_replies WHERE thread_id=$1`, [id]);
              const r = await pool.query(`DELETE FROM forum_threads WHERE id=$1 RETURNING id`, [id]);
              if (!r.rows[0]) return json(res, 404, { error: "Not found" });
              return json(res, 200, { deleted: true });
            }

            // PATCH /api/forum/admin/replies/:id/hide
            const hideReplyMatch = adminSeg.match(/^replies\/(\d+)\/hide$/);
            if (method === "PATCH" && hideReplyMatch) {
              const id = hideReplyMatch[1];
              const r = await pool.query(
                `UPDATE forum_replies SET is_hidden = NOT is_hidden WHERE id=$1 RETURNING id, is_hidden`, [id]
              );
              if (!r.rows[0]) return json(res, 404, { error: "Not found" });
              return json(res, 200, r.rows[0]);
            }

            // DELETE /api/forum/admin/replies/:id
            const deleteReplyMatch = adminSeg.match(/^replies\/(\d+)$/);
            if (method === "DELETE" && deleteReplyMatch) {
              const id = deleteReplyMatch[1];
              const r = await pool.query(`DELETE FROM forum_replies WHERE id=$1 RETURNING id, thread_id`, [id]);
              if (!r.rows[0]) return json(res, 404, { error: "Not found" });
              await pool.query(`UPDATE forum_threads SET reply_count=GREATEST(0,reply_count-1) WHERE id=$1`, [r.rows[0].thread_id]);
              return json(res, 200, { deleted: true });
            }

            return json(res, 404, { error: "Admin route not found" });
          }

          // ── Public routes ─────────────────────────────────────────────────
          if (method === "GET" && seg === "categories") {
            const r = await pool.query(`
              SELECT category, COUNT(*) as thread_count,
                     SUM(reply_count) as total_replies,
                     SUM(CASE WHEN is_solved THEN 0 ELSE 1 END) as unanswered
              FROM forum_threads WHERE is_hidden IS NOT TRUE GROUP BY category`);
            const counts: Record<string, any> = {};
            for (const row of r.rows) counts[row.category] = { threads: Number(row.thread_count), replies: Number(row.total_replies || 0), unanswered: Number(row.unanswered || 0) };
            return json(res, 200, CATEGORIES.map(c => ({ ...c, threads: counts[c.id]?.threads ?? 0, replies: counts[c.id]?.replies ?? 0, unanswered: counts[c.id]?.unanswered ?? 0 })));
          }

          if (method === "GET" && seg === "threads") {
            const { category, page = "1" } = query;
            const pageNum = Math.max(1, parseInt(page) || 1);
            const limit = 20;
            const offset = (pageNum - 1) * limit;
            let q = `SELECT id, category, title, is_solved, reply_count, created_at, LEFT(body,200) as body_preview, author_token_hash FROM forum_threads WHERE is_hidden IS NOT TRUE`;
            const params: unknown[] = [];
            if (category && VALID_CATS.has(category)) {
              q += ` AND category=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`;
              params.push(category, limit, offset);
            } else {
              q += ` ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
              params.push(limit, offset);
            }
            const r = await pool.query(q, params);
            return json(res, 200, r.rows.map(row => ({ ...row, display_name: anonName(row.author_token_hash) })));
          }

          const threadMatch = seg.match(/^threads\/(\d+)$/);
          if (method === "GET" && threadMatch) {
            const id = threadMatch[1];
            const tr = await pool.query(`SELECT * FROM forum_threads WHERE id=$1 AND is_hidden IS NOT TRUE`, [id]);
            if (!tr.rows[0]) return json(res, 404, { error: "Not found" });
            const rr = await pool.query(`SELECT * FROM forum_replies WHERE thread_id=$1 AND is_hidden IS NOT TRUE ORDER BY is_best_answer DESC, helpful_count DESC, created_at ASC`, [id]);
            return json(res, 200, { ...tr.rows[0], display_name: anonName(tr.rows[0].author_token_hash), replies: rr.rows.map(r => ({ ...r, display_name: anonName(r.author_token_hash) })) });
          }

          if (method === "POST" && seg === "threads") {
            const body = await readBody(req);
            const { category, title, body: text, author_token } = body ?? {};
            if (!category || !title || !text || !author_token) return json(res, 400, { error: "Fält saknas" });
            if (!VALID_CATS.has(category)) return json(res, 400, { error: "Ogiltig kategori" });
            if (title.trim().length < 10) return json(res, 400, { error: "Titeln måste vara minst 10 tecken" });
            if (text.trim().length < 20) return json(res, 400, { error: "Frågan måste vara minst 20 tecken" });
            const h = hashToken(String(author_token));
            const r = await pool.query(`INSERT INTO forum_threads (category, title, body, author_token_hash) VALUES ($1,$2,$3,$4) RETURNING *`, [category, title.trim(), text.trim(), h]);
            return json(res, 201, { ...r.rows[0], display_name: anonName(h) });
          }

          const replyThreadMatch = seg.match(/^threads\/(\d+)\/replies$/);
          if (method === "POST" && replyThreadMatch) {
            const id = replyThreadMatch[1];
            const body = await readBody(req);
            const { body: text, author_token, template_name } = body ?? {};
            if (!text || !author_token) return json(res, 400, { error: "Fält saknas" });
            if (text.trim().length < 10) return json(res, 400, { error: "Svaret måste vara minst 10 tecken" });
            const h = hashToken(String(author_token));
            const tc = await pool.query(`SELECT id FROM forum_threads WHERE id=$1 AND is_hidden IS NOT TRUE`, [id]);
            if (!tc.rows[0]) return json(res, 404, { error: "Tråd hittades inte" });
            const r = await pool.query(`INSERT INTO forum_replies (thread_id, body, author_token_hash, template_name) VALUES ($1,$2,$3,$4) RETURNING *`, [id, text.trim(), h, template_name || null]);
            await pool.query(`UPDATE forum_threads SET reply_count=reply_count+1 WHERE id=$1`, [id]);
            return json(res, 201, { ...r.rows[0], display_name: anonName(h) });
          }

          const helpfulMatch = seg.match(/^replies\/(\d+)\/helpful$/);
          if (method === "POST" && helpfulMatch) {
            const id = helpfulMatch[1];
            const body = await readBody(req);
            const { voter_token } = body ?? {};
            if (!voter_token) return json(res, 400, { error: "voter_token krävs" });
            const vh = hashToken(String(voter_token));
            const ex = await pool.query(`SELECT id FROM forum_helpful_votes WHERE reply_id=$1 AND voter_token_hash=$2`, [id, vh]);
            if (ex.rows[0]) {
              await pool.query(`DELETE FROM forum_helpful_votes WHERE reply_id=$1 AND voter_token_hash=$2`, [id, vh]);
              await pool.query(`UPDATE forum_replies SET helpful_count=GREATEST(0,helpful_count-1) WHERE id=$1`, [id]);
              return json(res, 200, { action: "removed" });
            } else {
              await pool.query(`INSERT INTO forum_helpful_votes (reply_id, voter_token_hash) VALUES ($1,$2)`, [id, vh]);
              await pool.query(`UPDATE forum_replies SET helpful_count=helpful_count+1 WHERE id=$1`, [id]);
              return json(res, 200, { action: "added" });
            }
          }

          const solveMatch = seg.match(/^threads\/(\d+)\/solve$/);
          if ((method === "PATCH" || method === "POST") && solveMatch) {
            const id = solveMatch[1];
            const body = await readBody(req);
            const { author_token } = body ?? {};
            if (!author_token) return json(res, 400, { error: "author_token krävs" });
            const h = hashToken(String(author_token));
            const r = await pool.query(`UPDATE forum_threads SET is_solved=NOT is_solved WHERE id=$1 AND author_token_hash=$2 RETURNING is_solved`, [id, h]);
            if (!r.rows[0]) return json(res, 403, { error: "Inte tillåtet" });
            return json(res, 200, { is_solved: r.rows[0].is_solved });
          }

          return json(res, 404, { error: "Route not found" });
        } catch (err) {
          console.error("[forum-api]", err);
          return json(res, 500, { error: "Server error" });
        }
      });
    },
  };
}
