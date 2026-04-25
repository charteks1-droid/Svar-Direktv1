const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const DAILY_LIMIT = 10;
const USAGE_FILE = path.join(__dirname, "usage.json");
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

console.log("=== Backend start ===");
console.log("PORT:", PORT);
console.log("GEMINI_API_KEY ustawiony:", !!GEMINI_API_KEY);
console.log("Node.js:", process.version);

function loadUsage() {
  try {
    if (fs.existsSync(USAGE_FILE)) {
      return JSON.parse(fs.readFileSync(USAGE_FILE, "utf8"));
    }
  } catch (e) {
    console.error("loadUsage error:", e.message);
  }
  return {};
}

function saveUsage(data) {
  try {
    fs.writeFileSync(USAGE_FILE, JSON.stringify(data), "utf8");
  } catch (e) {
    console.error("saveUsage error:", e.message);
  }
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getCount(userId) {
  const usage = loadUsage();
  const key = `${userId}:${todayKey()}`;
  return usage[key] || 0;
}

function increment(userId) {
  const usage = loadUsage();
  const key = `${userId}:${todayKey()}`;
  usage[key] = (usage[key] || 0) + 1;

  // czyść stare wpisy (starsze niż dzisiaj)
  const today = todayKey();
  for (const k of Object.keys(usage)) {
    if (!k.endsWith(today)) delete usage[k];
  }

  saveUsage(usage);
}

async function askGemini(message) {
  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: message }] }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Gemini HTTP", res.status, errText.slice(0, 300));
    throw new Error(`Gemini error ${res.status}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Pusta odpowiedź od Gemini");
  return text;
}

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Svar Direkt API działa" });
});

app.get("/test", (_req, res) => {
  res.send("OK");
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: Math.floor(process.uptime()),
    geminiKey: !!GEMINI_API_KEY,
    time: new Date().toISOString(),
  });
});

app.get("/debug", async (_req, res) => {
  let geminiStatus = "nie testowano";
  if (GEMINI_API_KEY) {
    try {
      const r = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: "Odpowiedz: OK" }] }] }),
      });
      const body = await r.text();
      geminiStatus = `HTTP ${r.status}: ${body.slice(0, 200)}`;
    } catch (e) {
      geminiStatus = "FETCH ERROR: " + e.message;
    }
  }
  res.json({
    geminiKey: !!GEMINI_API_KEY,
    nodeVersion: process.version,
    uptime: Math.floor(process.uptime()),
    geminiStatus,
  });
});

app.post("/api/ai/ask", async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(503).json({ error: "Brak GEMINI_API_KEY na serwerze." });
  }

  const { message, userId } = req.body || {};
  if (!message || !userId) {
    return res.status(400).json({ error: "Brakuje message lub userId." });
  }

  const used = getCount(userId);
  if (used >= DAILY_LIMIT) {
    return res.status(429).json({ error: "Limit dzienny osiągnięty.", remaining: 0 });
  }

  try {
    const reply = await askGemini(message);
    increment(userId);
    const remaining = DAILY_LIMIT - getCount(userId);
    return res.json({ reply, remaining });
  } catch (err) {
    console.error("askGemini failed:", err.message);
    return res.status(500).json({ error: "AI tymczasowo niedostępne." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend działa na porcie ${PORT}`);
});
