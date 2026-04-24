import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("ERROR: GEMINI_API_KEY is not set.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const DAILY_LIMIT = 10;
const usageMap = new Map();

function todayKey(userId) {
  return `${userId}:${new Date().toISOString().slice(0, 10)}`;
}

function withinLimit(userId) {
  return (usageMap.get(todayKey(userId)) || 0) < DAILY_LIMIT;
}

function increment(userId) {
  const key = todayKey(userId);
  usageMap.set(key, (usageMap.get(key) || 0) + 1);
}

async function askGemini(message, attempt = 1) {
  try {
    const result = await model.generateContent(message);
    return result.response.text();
  } catch (err) {
    if (attempt < 2) {
      await new Promise((r) => setTimeout(r, 1000));
      return askGemini(message, 2);
    }
    throw err;
  }
}

app.get("/test", (_req, res) => {
  res.send("Server działa");
});

app.post("/api/ai/ask", async (req, res) => {
  const { message, userId } = req.body;

  if (!message || !userId) {
    return res.status(400).json({ error: "Brakuje message lub userId" });
  }

  if (!withinLimit(userId)) {
    return res.status(429).json({ error: "Przekroczono dzienny limit 10 zapytań" });
  }

  try {
    const reply = await askGemini(message);
    increment(userId);
    return res.json({ reply });
  } catch (err) {
    console.error("Gemini error:", err.message);
    return res.status(500).json({ error: "Błąd serwera AI. Spróbuj ponownie później." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend działa na porcie ${PORT}`);
});
