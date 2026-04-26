const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-key");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

const forumRouter = require("./forum");
app.use("/api/forum", forumRouter);

const toolsRouter = require("./tools");
app.use("/api/tools", toolsRouter);

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const DAILY_LIMIT = 10;
const USAGE_FILE = path.join(__dirname, "usage.json");

console.log("=== Backend start ===");
console.log("PORT:", PORT);
console.log("GEMINI_API_KEY set:", !!GEMINI_API_KEY);
console.log("Node.js:", process.version);

function loadUsage() {
  try {
    if (fs.existsSync(USAGE_FILE)) {
      return JSON.parse(fs.readFileSync(USAGE_FILE, "utf8"));
    }
  } catch (e) {}
  return {};
}

function saveUsage(data) {
  try {
    fs.writeFileSync(USAGE_FILE, JSON.stringify(data), "utf8");
  } catch (e) {}
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getCount(userId) {
  const usage = loadUsage();
  return usage[userId + ":" + todayKey()] || 0;
}

function increment(userId) {
  const usage = loadUsage();
  const key = userId + ":" + todayKey();
  usage[key] = (usage[key] || 0) + 1;
  const today = todayKey();
  Object.keys(usage).forEach(function(k) {
    if (k.indexOf(today) === -1) delete usage[k];
  });
  saveUsage(usage);
}

function httpsPost(hostname, path, data) {
  return new Promise(function(resolve, reject) {
    const body = JSON.stringify(data);
    const options = {
      hostname: hostname,
      path: path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };
    const req = https.request(options, function(res) {
      let raw = "";
      res.on("data", function(chunk) { raw += chunk; });
      res.on("end", function() {
        resolve({ status: res.statusCode, body: raw });
      });
    });
    req.on("error", reject);
    req.setTimeout(20000, function() {
      req.destroy(new Error("timeout"));
    });
    req.write(body);
    req.end();
  });
}

function askGemini(message) {
  const apiPath =
    "/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY;
  const data = {
    contents: [{ parts: [{ text: message }] }],
  };
  return httpsPost("generativelanguage.googleapis.com", apiPath, data)
    .then(function(r) {
      if (r.status !== 200) {
        console.error("Gemini HTTP " + r.status + ": " + r.body.slice(0, 200));
        throw new Error("Gemini error " + r.status);
      }
      var parsed = JSON.parse(r.body);
      var text = parsed &&
        parsed.candidates &&
        parsed.candidates[0] &&
        parsed.candidates[0].content &&
        parsed.candidates[0].content.parts &&
        parsed.candidates[0].content.parts[0] &&
        parsed.candidates[0].content.parts[0].text;
      if (!text) throw new Error("Pusta odpowiedź Gemini");
      return text;
    });
}

app.get("/", function(_req, res) {
  res.json({ status: "ok", message: "Svar Direkt API działa" });
});

app.get("/test", function(_req, res) {
  res.send("OK");
});

app.get("/health", function(_req, res) {
  res.json({
    status: "ok",
    uptime: Math.floor(process.uptime()),
    geminiKey: !!GEMINI_API_KEY,
    node: process.version,
    time: new Date().toISOString(),
  });
});

app.get("/debug", function(_req, res) {
  if (!GEMINI_API_KEY) {
    return res.json({ error: "Brak GEMINI_API_KEY", node: process.version });
  }
  var apiPath =
    "/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY;
  var data = { contents: [{ parts: [{ text: "Odpowiedz: OK" }] }] };
  httpsPost("generativelanguage.googleapis.com", apiPath, data)
    .then(function(r) {
      res.json({
        geminiKey: true,
        node: process.version,
        geminiStatus: "HTTP " + r.status + ": " + r.body.slice(0, 200),
      });
    })
    .catch(function(e) {
      res.json({ geminiKey: true, node: process.version, geminiStatus: "ERROR: " + e.message });
    });
});

app.post("/api/ai/ask", function(req, res) {
  if (!GEMINI_API_KEY) {
    return res.status(503).json({ error: "Brak GEMINI_API_KEY na serwerze." });
  }
  var message = req.body && req.body.message;
  var userId = req.body && req.body.userId;
  if (!message || !userId) {
    return res.status(400).json({ error: "Brakuje message lub userId." });
  }
  var used = getCount(userId);
  if (used >= DAILY_LIMIT) {
    return res.status(429).json({ error: "Limit dzienny osiągnięty.", remaining: 0 });
  }
  askGemini(message)
    .then(function(reply) {
      increment(userId);
      var remaining = DAILY_LIMIT - getCount(userId);
      res.json({ reply: reply, remaining: remaining });
    })
    .catch(function(err) {
      console.error("askGemini failed:", err.message);
      res.status(500).json({ error: "AI tymczasowo niedostępne." });
    });
});

app.listen(PORT, function() {
  console.log("Backend działa na porcie " + PORT);
});
