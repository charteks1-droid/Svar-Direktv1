import type { Plugin, ViteDevServer } from "vite";
import { createHash } from "crypto";
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

        if (!pathname.startsWith("/api/forum")) return next();

        const method: string = req.method || "GET";
        const seg = pathname.replace("/api/forum", "").replace(/^\//, "");

        try {
          if (method === "GET" && seg === "categories") {
            const r = await pool.query(`
              SELECT category, COUNT(*) as thread_count,
                     SUM(reply_count) as total_replies,
                     SUM(CASE WHEN is_solved THEN 0 ELSE 1 END) as unanswered
              FROM forum_threads GROUP BY category`);
            const counts: Record<string, any> = {};
            for (const row of r.rows) counts[row.category] = { threads: Number(row.thread_count), replies: Number(row.total_replies || 0), unanswered: Number(row.unanswered || 0) };
            return json(res, 200, CATEGORIES.map(c => ({ ...c, threads: counts[c.id]?.threads ?? 0, replies: counts[c.id]?.replies ?? 0, unanswered: counts[c.id]?.unanswered ?? 0 })));
          }

          if (method === "GET" && seg === "threads") {
            const { category, page = "1" } = query;
            const pageNum = Math.max(1, parseInt(page) || 1);
            const limit = 20;
            const offset = (pageNum - 1) * limit;
            let q = `SELECT id, category, title, is_solved, reply_count, created_at, LEFT(body,200) as body_preview, author_token_hash FROM forum_threads`;
            const params: unknown[] = [];
            if (category && VALID_CATS.has(category)) {
              q += ` WHERE category=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`;
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
            const tr = await pool.query(`SELECT * FROM forum_threads WHERE id=$1`, [id]);
            if (!tr.rows[0]) return json(res, 404, { error: "Not found" });
            const rr = await pool.query(`SELECT * FROM forum_replies WHERE thread_id=$1 ORDER BY is_best_answer DESC, helpful_count DESC, created_at ASC`, [id]);
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
            const tc = await pool.query(`SELECT id FROM forum_threads WHERE id=$1`, [id]);
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
