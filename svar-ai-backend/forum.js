const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const DATA_FILE = path.join(__dirname, "forum-data.json");
const ADMIN_KEY = process.env.FORUM_ADMIN_KEY || "Polska25!!!";

const CATEGORIES = [
  { id: "kronofogden", name: "Kronofogden", icon: "\u2696\ufe0f", desc: "Skulder, utm\u00e4tning, betalningsanm\u00e4rkningar", color: "#dc2626" },
  { id: "skatteverket", name: "Skatteverket", icon: "\ud83d\udccb", desc: "Deklaration, folkbokf\u00f6ring, personnummer", color: "#0a7ea4" },
  { id: "forsakringskassan", name: "F\u00f6rs\u00e4kringskassan", icon: "\ud83c\udfe5", desc: "Sjukpenning, f\u00f6r\u00e4ldrapenning, bidrag", color: "#059669" },
  { id: "migrationsverket", name: "Migrationsverket", icon: "\ud83c\udf10", desc: "Uppeh\u00e5llstillst\u00e5nd, medborgarskap, asyl", color: "#7c3aed" },
  { id: "arbetsformedlingen", name: "Arbetsf\u00f6rmedlingen", icon: "\ud83d\udcbc", desc: "A-kassa, aktivitetsrapport, \u00e5tg\u00e4rder", color: "#d97706" },
];
const VALID_CAT = new Set(CATEGORIES.map((c) => c.id));

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf8");
      const parsed = JSON.parse(raw);
      return {
        threads: Array.isArray(parsed.threads) ? parsed.threads : [],
        replies: Array.isArray(parsed.replies) ? parsed.replies : [],
        votes: Array.isArray(parsed.votes) ? parsed.votes : [],
        nextThreadId: typeof parsed.nextThreadId === "number" ? parsed.nextThreadId : 1,
        nextReplyId: typeof parsed.nextReplyId === "number" ? parsed.nextReplyId : 1,
      };
    }
  } catch (e) {
    console.error("forum loadData error:", e.message);
  }
  return { threads: [], replies: [], votes: [], nextThreadId: 1, nextReplyId: 1 };
}

function saveData(data) {
  try {
    const tmp = DATA_FILE + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(data), "utf8");
    fs.renameSync(tmp, DATA_FILE);
  } catch (e) {
    console.error("forum saveData error:", e.message);
  }
}

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

function anonName(tokenHash) {
  return "Anonym #" + String(tokenHash).slice(0, 6).toUpperCase();
}

function checkAdmin(req, res) {
  const provided = req.headers["x-admin-key"] || (req.body && req.body.admin_key);
  if (!ADMIN_KEY || !provided || provided !== ADMIN_KEY) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

function publicThread(t) {
  return {
    id: t.id,
    category: t.category,
    title: t.title,
    body: t.body,
    body_preview: (t.body || "").slice(0, 200),
    is_solved: !!t.is_solved,
    is_hidden: !!t.is_hidden,
    reply_count: t.reply_count || 0,
    created_at: t.created_at,
    display_name: anonName(t.author_token_hash),
  };
}

function publicReply(r) {
  return {
    id: r.id,
    thread_id: r.thread_id,
    body: r.body,
    helpful_count: r.helpful_count || 0,
    is_best_answer: !!r.is_best_answer,
    is_hidden: !!r.is_hidden,
    created_at: r.created_at,
    display_name: anonName(r.author_token_hash),
  };
}

// GET /categories
router.get("/categories", (_req, res) => {
  const data = loadData();
  const counts = {};
  for (const t of data.threads) {
    if (t.is_hidden) continue;
    if (!counts[t.category]) counts[t.category] = { threads: 0, replies: 0, unanswered: 0 };
    counts[t.category].threads += 1;
    counts[t.category].replies += t.reply_count || 0;
    if (!t.is_solved) counts[t.category].unanswered += 1;
  }
  const result = CATEGORIES.map((c) => ({
    ...c,
    threads: (counts[c.id] && counts[c.id].threads) || 0,
    replies: (counts[c.id] && counts[c.id].replies) || 0,
    unanswered: (counts[c.id] && counts[c.id].unanswered) || 0,
  }));
  res.json(result);
});

// GET /threads?category=X&page=1
router.get("/threads", (req, res) => {
  const data = loadData();
  const category = req.query.category;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = 20;
  let list = data.threads.filter((t) => !t.is_hidden);
  if (category && VALID_CAT.has(category)) {
    list = list.filter((t) => t.category === category);
  }
  list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const slice = list.slice((page - 1) * limit, page * limit);
  res.json(slice.map(publicThread));
});

// GET /threads/:id
router.get("/threads/:id", (req, res) => {
  const data = loadData();
  const id = parseInt(req.params.id, 10);
  const t = data.threads.find((x) => x.id === id && !x.is_hidden);
  if (!t) return res.status(404).json({ error: "Thread not found" });
  const replies = data.replies
    .filter((r) => r.thread_id === id && !r.is_hidden)
    .sort((a, b) => {
      if (!!b.is_best_answer - !!a.is_best_answer !== 0) return !!b.is_best_answer - !!a.is_best_answer;
      if ((b.helpful_count || 0) !== (a.helpful_count || 0)) return (b.helpful_count || 0) - (a.helpful_count || 0);
      return new Date(a.created_at) - new Date(b.created_at);
    })
    .map(publicReply);
  res.json({ ...publicThread(t), replies });
});

// POST /threads
router.post("/threads", (req, res) => {
  const body = req.body || {};
  const { category, title, author_token } = body;
  const text = body.body;
  if (!category || !title || !text || !author_token) {
    return res.status(400).json({ error: "category, title, body och author_token kr\u00e4vs" });
  }
  if (!VALID_CAT.has(category)) return res.status(400).json({ error: "Ogiltig kategori" });
  if (String(title).trim().length < 10) return res.status(400).json({ error: "Titeln m\u00e5ste vara minst 10 tecken" });
  if (String(text).trim().length < 20) return res.status(400).json({ error: "Fr\u00e5gan m\u00e5ste vara minst 20 tecken" });

  const data = loadData();
  const t = {
    id: data.nextThreadId,
    category,
    title: String(title).trim().slice(0, 200),
    body: String(text).trim().slice(0, 5000),
    author_token_hash: hashToken(author_token),
    is_solved: false,
    is_hidden: false,
    reply_count: 0,
    created_at: new Date().toISOString(),
  };
  data.nextThreadId += 1;
  data.threads.push(t);
  saveData(data);
  res.status(201).json(publicThread(t));
});

// POST /threads/:id/replies
router.post("/threads/:id/replies", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const body = req.body || {};
  const text = body.body;
  const author_token = body.author_token;
  if (!text || !author_token) return res.status(400).json({ error: "body och author_token kr\u00e4vs" });
  if (String(text).trim().length < 10) return res.status(400).json({ error: "Svaret m\u00e5ste vara minst 10 tecken" });

  const data = loadData();
  const t = data.threads.find((x) => x.id === id && !x.is_hidden);
  if (!t) return res.status(404).json({ error: "Tr\u00e5d hittades inte" });

  const r = {
    id: data.nextReplyId,
    thread_id: id,
    body: String(text).trim().slice(0, 5000),
    author_token_hash: hashToken(author_token),
    helpful_count: 0,
    is_best_answer: false,
    is_hidden: false,
    created_at: new Date().toISOString(),
  };
  data.nextReplyId += 1;
  data.replies.push(r);
  t.reply_count = (t.reply_count || 0) + 1;
  saveData(data);
  res.status(201).json(publicReply(r));
});

// POST /replies/:id/helpful (toggle)
router.post("/replies/:id/helpful", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const body = req.body || {};
  const voter = body.voter_token;
  if (!voter) return res.status(400).json({ error: "voter_token kr\u00e4vs" });

  const data = loadData();
  const reply = data.replies.find((r) => r.id === id);
  if (!reply) return res.status(404).json({ error: "Reply not found" });

  const voterHash = hashToken(voter);
  const existingIdx = data.votes.findIndex((v) => v.reply_id === id && v.voter_token_hash === voterHash);
  if (existingIdx !== -1) {
    data.votes.splice(existingIdx, 1);
    reply.helpful_count = Math.max(0, (reply.helpful_count || 0) - 1);
    saveData(data);
    return res.json({ action: "removed" });
  }
  data.votes.push({ reply_id: id, voter_token_hash: voterHash, created_at: new Date().toISOString() });
  reply.helpful_count = (reply.helpful_count || 0) + 1;
  saveData(data);
  res.json({ action: "added" });
});

// PATCH /threads/:id/solve (author only)
router.patch("/threads/:id/solve", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const body = req.body || {};
  const author_token = body.author_token;
  if (!author_token) return res.status(400).json({ error: "author_token kr\u00e4vs" });

  const data = loadData();
  const t = data.threads.find((x) => x.id === id);
  if (!t) return res.status(404).json({ error: "Not found" });
  if (t.author_token_hash !== hashToken(author_token)) return res.status(403).json({ error: "Inte till\u00e5tet" });
  t.is_solved = !t.is_solved;
  saveData(data);
  res.json({ is_solved: t.is_solved });
});

// ─── ADMIN ────────────────────────────────────────────────────────────────────

router.get("/admin/threads", (req, res) => {
  if (!checkAdmin(req, res)) return;
  const data = loadData();
  const list = data.threads
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 200)
    .map(publicThread);
  res.json(list);
});

router.get("/admin/threads/:id", (req, res) => {
  if (!checkAdmin(req, res)) return;
  const id = parseInt(req.params.id, 10);
  const data = loadData();
  const t = data.threads.find((x) => x.id === id);
  if (!t) return res.status(404).json({ error: "Not found" });
  const replies = data.replies
    .filter((r) => r.thread_id === id)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map(publicReply);
  res.json({ ...publicThread(t), replies });
});

router.patch("/admin/threads/:id/hide", (req, res) => {
  if (!checkAdmin(req, res)) return;
  const id = parseInt(req.params.id, 10);
  const data = loadData();
  const t = data.threads.find((x) => x.id === id);
  if (!t) return res.status(404).json({ error: "Not found" });
  t.is_hidden = !t.is_hidden;
  saveData(data);
  res.json({ id: t.id, is_hidden: t.is_hidden });
});

router.delete("/admin/threads/:id", (req, res) => {
  if (!checkAdmin(req, res)) return;
  const id = parseInt(req.params.id, 10);
  const data = loadData();
  const replyIds = data.replies.filter((r) => r.thread_id === id).map((r) => r.id);
  data.votes = data.votes.filter((v) => !replyIds.includes(v.reply_id));
  data.replies = data.replies.filter((r) => r.thread_id !== id);
  data.threads = data.threads.filter((t) => t.id !== id);
  saveData(data);
  res.json({ deleted: true });
});

router.patch("/admin/replies/:id/hide", (req, res) => {
  if (!checkAdmin(req, res)) return;
  const id = parseInt(req.params.id, 10);
  const data = loadData();
  const r = data.replies.find((x) => x.id === id);
  if (!r) return res.status(404).json({ error: "Not found" });
  r.is_hidden = !r.is_hidden;
  saveData(data);
  res.json({ id: r.id, is_hidden: r.is_hidden });
});

router.delete("/admin/replies/:id", (req, res) => {
  if (!checkAdmin(req, res)) return;
  const id = parseInt(req.params.id, 10);
  const data = loadData();
  const r = data.replies.find((x) => x.id === id);
  if (!r) return res.status(404).json({ error: "Not found" });
  data.votes = data.votes.filter((v) => v.reply_id !== id);
  data.replies = data.replies.filter((x) => x.id !== id);
  const t = data.threads.find((x) => x.id === r.thread_id);
  if (t) t.reply_count = Math.max(0, (t.reply_count || 0) - 1);
  saveData(data);
  res.json({ deleted: true });
});

module.exports = router;
