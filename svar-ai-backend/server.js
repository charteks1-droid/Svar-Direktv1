import express from "express";

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());

const PORT = process.env.PORT || 3000;
const apiKey = process.env.GEMINI_API_KEY;

console.log("API KEY EXISTS:", !!apiKey);
console.log("NODE VERSION:", process.version);

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const DAILY_LIMIT = 10;
const usageMap = new Map();

function todayKey(userId) {
  return `${userId}:${new Date().toISOString().slice(0, 10)}`;
}
function getCount(userId) {
  return usageMap.get(todayKey(userId)) || 0;
}
function increment(userId) {
  const key = todayKey(userId);
  usageMap.set(key, (usageMap.get(key) || 0) + 1);
}

async function askGemini(message, attempt = 1) {
  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: message }] }],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.error("GEMINI ERROR:", res.status, errBody);
    if (attempt < 2) {
      await new Promise((r) => setTimeout(r, 1000));
      return askGemini(message, 2);
    }
    throw new Error(`Gemini ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

app.get("/test", (_req, res) => {
  res.send("OK");
});

// Debug endpoint — shows env var status and tests Gemini
app.get("/debug", async (req, res) => {
  const keyExists = !!apiKey;
  const keyPrefix = apiKey ? apiKey.slice(0, 8) + "..." : "BRAK";

  let geminiStatus = "nie testowano";
  if (keyExists) {
    try {
      const r = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Powiedz: OK" }] }],
        }),
      });
      const body = await r.text();
      geminiStatus = `HTTP ${r.status}: ${body.slice(0, 200)}`;
    } catch (e) {
      geminiStatus = "FETCH ERROR: " + e.message;
    }
  }

  res.json({
    keyExists,
    keyPrefix,
    nodeVersion: process.version,
    geminiStatus,
  });
});

app.post("/api/ai/ask", async (req, res) => {
  if (!apiKey) {
    return res.status(503).json({ error: "Brak GEMINI_API_KEY." });
  }

  const { message, userId } = req.body;
  if (!message || !userId) {
    return res.status(400).json({ error: "Brakuje message lub userId" });
  }

  const used = getCount(userId);
  if (used >= DAILY_LIMIT) {
    return res.status(429).json({ error: "Limit dzienny osiągnięty", remaining: 0 });
  }

  try {
    const reply = await askGemini(message);
    increment(userId);
    const remaining = DAILY_LIMIT - getCount(userId);
    return res.json({ reply, remaining });
  } catch (err) {
    console.error("GEMINI ERROR:", err.message);
    return res.status(500).json({ error: "Gemini failed: " + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend działa na porcie ${PORT}`);
});
