import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const BASE_URL = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;
const API_KEY = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;

if (!BASE_URL || !API_KEY) {
  console.error("Missing AI_INTEGRATIONS_GEMINI_BASE_URL or AI_INTEGRATIONS_GEMINI_API_KEY");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: BASE_URL,
  },
});

const DAILY_LIMIT = 10;
const usageMap = new Map();

function getTodayKey(userId) {
  const today = new Date().toISOString().slice(0, 10);
  return `${userId}:${today}`;
}

function checkLimit(userId) {
  const key = getTodayKey(userId);
  const count = usageMap.get(key) || 0;
  return count < DAILY_LIMIT;
}

function incrementUsage(userId) {
  const key = getTodayKey(userId);
  usageMap.set(key, (usageMap.get(key) || 0) + 1);
}

async function callGemini(message, attempt = 1) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });
    return response.text;
  } catch (err) {
    if (attempt < 2) {
      await new Promise((r) => setTimeout(r, 1000));
      return callGemini(message, 2);
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

  if (!checkLimit(userId)) {
    return res.status(429).json({ error: "Przekroczono dzienny limit 10 zapytań" });
  }

  try {
    const reply = await callGemini(message);
    incrementUsage(userId);
    return res.json({ reply });
  } catch (err) {
    console.error("Gemini error:", err.message);
    return res.status(500).json({ error: "Błąd serwera AI. Spróbuj ponownie później." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend działa na porcie ${PORT}`);
});
