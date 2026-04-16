import { Router, type IRouter, type Request, type Response } from "express";
import { createHash } from "crypto";
import { pool } from "@workspace/db";

const router: IRouter = Router();

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function anonName(tokenHash: string): string {
  return "Anonym #" + tokenHash.slice(0, 6).toUpperCase();
}

function checkAdminKey(req: Request, res: Response): boolean {
  const key = process.env.FORUM_ADMIN_KEY;
  const provided = req.headers["x-admin-key"] || req.body?.admin_key;
  if (!key || !provided || provided !== key) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

const CATEGORIES = [
  { id: "kronofogden", name: "Kronofogden", icon: "⚖️", desc: "Skulder, utmätning, betalningsanmärkningar", color: "#dc2626" },
  { id: "skatteverket", name: "Skatteverket", icon: "📋", desc: "Deklaration, folkbokföring, personnummer", color: "#0a7ea4" },
  { id: "forsakringskassan", name: "Försäkringskassan", icon: "🏥", desc: "Sjukpenning, föräldrapenning, bidrag", color: "#059669" },
  { id: "migrationsverket", name: "Migrationsverket", icon: "🌐", desc: "Uppehållstillstånd, medborgarskap, asyl", color: "#7c3aed" },
  { id: "arbetsformedlingen", name: "Arbetsförmedlingen", icon: "💼", desc: "A-kassa, aktivitetsrapport, åtgärder", color: "#d97706" },
];

const VALID_CATEGORIES = new Set(CATEGORIES.map(c => c.id));

// GET /api/forum/categories
router.get("/categories", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT category, COUNT(*) as thread_count, SUM(reply_count) as total_replies,
             SUM(CASE WHEN is_solved THEN 0 ELSE 1 END) as unanswered
      FROM forum_threads
      WHERE is_hidden = FALSE
      GROUP BY category
    `);
    const counts: Record<string, { threads: number; replies: number; unanswered: number }> = {};
    for (const row of result.rows) {
      counts[row.category] = {
        threads: Number(row.thread_count),
        replies: Number(row.total_replies || 0),
        unanswered: Number(row.unanswered || 0),
      };
    }
    const categories = CATEGORIES.map(c => ({
      ...c,
      threads: counts[c.id]?.threads ?? 0,
      replies: counts[c.id]?.replies ?? 0,
      unanswered: counts[c.id]?.unanswered ?? 0,
    }));
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/forum/threads?category=X&page=1
router.get("/threads", async (req: Request, res: Response) => {
  const { category, page = "1" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limit = 20;
  const offset = (pageNum - 1) * limit;

  try {
    let query = `
      SELECT t.id, t.category, t.title, t.is_solved, t.reply_count, t.created_at,
             LEFT(t.body, 200) as body_preview, t.author_token_hash
      FROM forum_threads t
      WHERE t.is_hidden = FALSE
    `;
    const params: unknown[] = [];
    if (category && VALID_CATEGORIES.has(category)) {
      query += ` AND t.category = $1`;
      params.push(category);
      query += ` ORDER BY t.created_at DESC LIMIT $2 OFFSET $3`;
      params.push(limit, offset);
    } else {
      query += ` ORDER BY t.created_at DESC LIMIT $1 OFFSET $2`;
      params.push(limit, offset);
    }
    const result = await pool.query(query, params);
    res.json(result.rows.map(r => ({
      ...r,
      display_name: anonName(r.author_token_hash),
    })));
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/forum/threads/:id
router.get("/threads/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const threadRes = await pool.query(
      `SELECT * FROM forum_threads WHERE id = $1 AND is_hidden = FALSE`, [id]
    );
    if (!threadRes.rows[0]) {
      return res.status(404).json({ error: "Thread not found" });
    }
    const thread = threadRes.rows[0];

    const repliesRes = await pool.query(
      `SELECT * FROM forum_replies WHERE thread_id = $1 AND is_hidden = FALSE ORDER BY is_best_answer DESC, helpful_count DESC, created_at ASC`,
      [id]
    );

    res.json({
      ...thread,
      display_name: anonName(thread.author_token_hash),
      replies: repliesRes.rows.map(r => ({
        ...r,
        display_name: anonName(r.author_token_hash),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// POST /api/forum/threads
router.post("/threads", async (req: Request, res: Response) => {
  const { category, title, body, author_token } = req.body ?? {};
  if (!category || !title || !body || !author_token) {
    return res.status(400).json({ error: "category, title, body och author_token krävs" });
  }
  if (!VALID_CATEGORIES.has(category)) {
    return res.status(400).json({ error: "Ogiltig kategori" });
  }
  if (title.trim().length < 10) {
    return res.status(400).json({ error: "Titeln måste vara minst 10 tecken" });
  }
  if (body.trim().length < 20) {
    return res.status(400).json({ error: "Frågan måste vara minst 20 tecken" });
  }
  const tokenHash = hashToken(String(author_token));
  try {
    const result = await pool.query(
      `INSERT INTO forum_threads (category, title, body, author_token_hash) VALUES ($1, $2, $3, $4) RETURNING *`,
      [category, title.trim(), body.trim(), tokenHash]
    );
    const row = result.rows[0];
    res.status(201).json({ ...row, display_name: anonName(tokenHash) });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// POST /api/forum/threads/:id/replies
router.post("/threads/:id/replies", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body, author_token, template_name } = req.body ?? {};
  if (!body || !author_token) {
    return res.status(400).json({ error: "body och author_token krävs" });
  }
  if (body.trim().length < 10) {
    return res.status(400).json({ error: "Svaret måste vara minst 10 tecken" });
  }
  const tokenHash = hashToken(String(author_token));
  try {
    const threadCheck = await pool.query(`SELECT id FROM forum_threads WHERE id = $1 AND is_hidden = FALSE`, [id]);
    if (!threadCheck.rows[0]) return res.status(404).json({ error: "Tråd hittades inte" });

    const result = await pool.query(
      `INSERT INTO forum_replies (thread_id, body, author_token_hash, template_name) VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, body.trim(), tokenHash, template_name || null]
    );
    await pool.query(`UPDATE forum_threads SET reply_count = reply_count + 1 WHERE id = $1`, [id]);
    const row = result.rows[0];
    res.status(201).json({ ...row, display_name: anonName(tokenHash) });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// POST /api/forum/replies/:id/helpful
router.post("/replies/:id/helpful", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { voter_token } = req.body ?? {};
  if (!voter_token) return res.status(400).json({ error: "voter_token krävs" });
  const voterHash = hashToken(String(voter_token));
  try {
    const existing = await pool.query(
      `SELECT id FROM forum_helpful_votes WHERE reply_id = $1 AND voter_token_hash = $2`,
      [id, voterHash]
    );
    if (existing.rows[0]) {
      await pool.query(`DELETE FROM forum_helpful_votes WHERE reply_id = $1 AND voter_token_hash = $2`, [id, voterHash]);
      await pool.query(`UPDATE forum_replies SET helpful_count = GREATEST(0, helpful_count - 1) WHERE id = $1`, [id]);
      res.json({ action: "removed" });
    } else {
      await pool.query(`INSERT INTO forum_helpful_votes (reply_id, voter_token_hash) VALUES ($1, $2)`, [id, voterHash]);
      await pool.query(`UPDATE forum_replies SET helpful_count = helpful_count + 1 WHERE id = $1`, [id]);
      res.json({ action: "added" });
    }
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// PATCH /api/forum/threads/:id/solve
router.patch("/threads/:id/solve", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { author_token } = req.body ?? {};
  if (!author_token) return res.status(400).json({ error: "author_token krävs" });
  const tokenHash = hashToken(String(author_token));
  try {
    const result = await pool.query(
      `UPDATE forum_threads SET is_solved = NOT is_solved WHERE id = $1 AND author_token_hash = $2 RETURNING is_solved`,
      [id, tokenHash]
    );
    if (!result.rows[0]) return res.status(403).json({ error: "Inte tillåtet" });
    res.json({ is_solved: result.rows[0].is_solved });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// ─── ADMIN ENDPOINTS ────────────────────────────────────────────────────────

// GET /api/forum/admin/threads — alla trådar inkl. dolda
router.get("/admin/threads", async (req: Request, res: Response) => {
  if (!checkAdminKey(req, res)) return;
  try {
    const result = await pool.query(`
      SELECT t.id, t.category, t.title, t.is_solved, t.is_hidden,
             t.reply_count, t.created_at, LEFT(t.body, 300) as body_preview,
             t.author_token_hash
      FROM forum_threads t
      ORDER BY t.created_at DESC
      LIMIT 200
    `);
    res.json(result.rows.map(r => ({ ...r, display_name: anonName(r.author_token_hash) })));
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/forum/admin/threads/:id — full tråd med alla svar (inkl. dolda)
router.get("/admin/threads/:id", async (req: Request, res: Response) => {
  if (!checkAdminKey(req, res)) return;
  const { id } = req.params;
  try {
    const threadRes = await pool.query(`SELECT * FROM forum_threads WHERE id = $1`, [id]);
    if (!threadRes.rows[0]) return res.status(404).json({ error: "Not found" });
    const repliesRes = await pool.query(
      `SELECT * FROM forum_replies WHERE thread_id = $1 ORDER BY created_at ASC`, [id]
    );
    const thread = threadRes.rows[0];
    res.json({
      ...thread,
      display_name: anonName(thread.author_token_hash),
      replies: repliesRes.rows.map(r => ({ ...r, display_name: anonName(r.author_token_hash) })),
    });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// PATCH /api/forum/admin/threads/:id/hide — dölj eller visa tråd
router.patch("/admin/threads/:id/hide", async (req: Request, res: Response) => {
  if (!checkAdminKey(req, res)) return;
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE forum_threads SET is_hidden = NOT is_hidden WHERE id = $1 RETURNING id, is_hidden`, [id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE /api/forum/admin/threads/:id — radera tråd permanent
router.delete("/admin/threads/:id", async (req: Request, res: Response) => {
  if (!checkAdminKey(req, res)) return;
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM forum_helpful_votes WHERE reply_id IN (SELECT id FROM forum_replies WHERE thread_id = $1)`, [id]);
    await pool.query(`DELETE FROM forum_replies WHERE thread_id = $1`, [id]);
    await pool.query(`DELETE FROM forum_threads WHERE id = $1`, [id]);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// PATCH /api/forum/admin/replies/:id/hide — dölj eller visa svar
router.patch("/admin/replies/:id/hide", async (req: Request, res: Response) => {
  if (!checkAdminKey(req, res)) return;
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE forum_replies SET is_hidden = NOT is_hidden WHERE id = $1 RETURNING id, is_hidden`, [id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE /api/forum/admin/replies/:id — radera svar permanent
router.delete("/admin/replies/:id", async (req: Request, res: Response) => {
  if (!checkAdminKey(req, res)) return;
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM forum_helpful_votes WHERE reply_id = $1`, [id]);
    await pool.query(`DELETE FROM forum_replies WHERE id = $1`, [id]);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
