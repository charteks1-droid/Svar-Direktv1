const express = require("express");
const Stripe = require("stripe");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const https = require("https");

const router = express.Router();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET_WEB = process.env.STRIPE_WEBHOOK_SECRET_WEB || process.env.STRIPE_WEBHOOK_SECRET || "";
const JWT_SECRET = process.env.JWT_SECRET || "svardirekt-web-2024";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const WEB_PRICE_AMOUNT = parseInt(process.env.WEB_PRICE_AMOUNT || "25900");
const WEB_PRICE_CURRENCY = "sek";
const WEB_PRODUCT_NAME = "Svar Direkt AI-assistent (webb)";
const DAILY_LIMIT = parseInt(process.env.WEB_DAILY_LIMIT || "20");
const MONTHLY_LIMIT = parseInt(process.env.WEB_MONTHLY_LIMIT || "200");

const SYSTEM_PROMPT = process.env.WEB_AI_PROMPT ||
  "Du är en professionell textassistent för Svar Direkt. Du hjälper användare att formulera brev, " +
  "ansökningar, klagomål och formella svar till svenska myndigheter, arbetsgivare och företag. " +
  "VIKTIGT: Du ger INTE juridisk rådgivning. Du skapar ENDAST textförslag och mallar på formell, " +
  "korrekt svenska. Svara alltid med ett färdigt textförslag som användaren kan redigera. " +
  "Avsluta varje svar med en ny rad: '---\\nDetta är ett textförslag och inte juridisk rådgivning. " +
  "Kontrollera alltid innehållet innan du använder det.'";

const WEB_USERS_FILE = path.join(__dirname, "web_users.json");
const WEB_USAGE_FILE = path.join(__dirname, "web_usage.json");

let stripe = null;
if (STRIPE_SECRET_KEY) stripe = new Stripe(STRIPE_SECRET_KEY);

function loadWebUsers() {
  try {
    if (fs.existsSync(WEB_USERS_FILE)) return JSON.parse(fs.readFileSync(WEB_USERS_FILE, "utf8"));
  } catch (e) {}
  return {};
}

function saveWebUsers(data) {
  try { fs.writeFileSync(WEB_USERS_FILE, JSON.stringify(data, null, 2), "utf8"); } catch (e) {}
}

function loadWebUsage() {
  try {
    if (fs.existsSync(WEB_USAGE_FILE)) return JSON.parse(fs.readFileSync(WEB_USAGE_FILE, "utf8"));
  } catch (e) {}
  return {};
}

function saveWebUsage(data) {
  try { fs.writeFileSync(WEB_USAGE_FILE, JSON.stringify(data), "utf8"); } catch (e) {}
}

function todayKey() { return new Date().toISOString().slice(0, 10); }
function monthKey() { return new Date().toISOString().slice(0, 7); }

function getDailyCount(email) {
  const u = loadWebUsage();
  return u[email + ":d:" + todayKey()] || 0;
}

function getMonthlyCount(email) {
  const u = loadWebUsage();
  return u[email + ":m:" + monthKey()] || 0;
}

function incrementUsage(email) {
  const u = loadWebUsage();
  const dk = email + ":d:" + todayKey();
  const mk = email + ":m:" + monthKey();
  u[dk] = (u[dk] || 0) + 1;
  u[mk] = (u[mk] || 0) + 1;
  const cm = monthKey();
  Object.keys(u).forEach(k => { if (!k.includes(cm) && !k.includes(todayKey())) delete u[k]; });
  saveWebUsage(u);
}

let cachedPriceId = null;

async function getOrCreateWebPrice() {
  if (cachedPriceId) return cachedPriceId;
  if (!stripe) throw new Error("Stripe ej konfigurerat");
  const products = await stripe.products.search({
    query: "metadata['app']:'svar-direkt-web' AND active:'true'",
    limit: 1,
  });
  let product = products.data[0];
  if (!product) {
    product = await stripe.products.create({
      name: WEB_PRODUCT_NAME,
      description: "AI-assistent för mallar och texter – webbversion",
      metadata: { app: "svar-direkt-web" },
    });
  }
  const prices = await stripe.prices.list({ product: product.id, active: true, limit: 10 });
  let price = prices.data.find(p =>
    p.unit_amount === WEB_PRICE_AMOUNT && p.currency === WEB_PRICE_CURRENCY &&
    p.recurring && p.recurring.interval === "month"
  );
  if (!price) {
    price = await stripe.prices.create({
      product: product.id,
      unit_amount: WEB_PRICE_AMOUNT,
      currency: WEB_PRICE_CURRENCY,
      recurring: { interval: "month" },
    });
  }
  cachedPriceId = price.id;
  return price.id;
}

function webAuthMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Ingen åtkomst.", code: "NO_TOKEN" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== "web") return res.status(401).json({ error: "Ogiltigt token.", code: "INVALID_TOKEN" });
    const users = loadWebUsers();
    const user = users[decoded.sub];
    if (!user) return res.status(401).json({ error: "Kontot hittades inte.", code: "USER_NOT_FOUND" });
    if (user.status !== "active") return res.status(402).json({ error: "Prenumerationen är inaktiv.", code: "INACTIVE" });
    req.webUser = user;
    req.webEmail = decoded.sub;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Token utgånget eller ogiltigt.", code: "INVALID_TOKEN" });
  }
}

// POST /api/web/checkout
router.post("/checkout", async (req, res) => {
  if (!stripe) return res.status(503).json({ error: "Betalning ej konfigurerad." });
  try {
    const { successUrl, cancelUrl, email } = req.body;
    const priceId = await getOrCreateWebPrice();
    const params = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: (successUrl || "https://svardirekt.site/ai-assistent.html") + "?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: cancelUrl || "https://svardirekt.site/ai-assistent.html",
      metadata: { source: "web" },
    };
    if (email) params.customer_email = email;
    const session = await stripe.checkout.sessions.create(params);
    res.json({ url: session.url });
  } catch (e) {
    console.error("[web/checkout]", e.message);
    res.status(500).json({ error: "Kunde inte starta betalning." });
  }
});

// POST /api/web/token — exchange session_id for JWT
router.post("/token", async (req, res) => {
  if (!stripe) return res.status(503).json({ error: "Stripe ej konfigurerat." });
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: "Saknar session_id." });
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer"],
    });
    if (session.status !== "complete" && session.payment_status !== "paid") {
      return res.status(402).json({ error: "Betalningen är inte genomförd." });
    }
    const email = session.customer_details?.email || session.customer?.email;
    if (!email) return res.status(400).json({ error: "Ingen e-post." });
    const users = loadWebUsers();
    users[email] = {
      email,
      customerId: typeof session.customer === "string" ? session.customer : session.customer?.id,
      subscriptionId: typeof session.subscription === "string" ? session.subscription : session.subscription?.id,
      status: "active",
      createdAt: users[email]?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };
    saveWebUsers(users);
    const token = jwt.sign({ sub: email, type: "web" }, JWT_SECRET, { expiresIn: "35d" });
    res.json({ token, email });
  } catch (e) {
    console.error("[web/token]", e.message);
    res.status(500).json({ error: "Kunde inte aktivera kontot." });
  }
});

// GET /api/web/me
router.get("/me", webAuthMiddleware, (req, res) => {
  const email = req.webEmail;
  res.json({
    email,
    status: req.webUser.status,
    dailyUsed: getDailyCount(email),
    dailyLimit: DAILY_LIMIT,
    monthlyUsed: getMonthlyCount(email),
    monthlyLimit: MONTHLY_LIMIT,
  });
});

// POST /api/web/ask
router.post("/ask", webAuthMiddleware, (req, res) => {
  if (!GEMINI_API_KEY) return res.status(503).json({ error: "AI ej konfigurerad på servern." });
  const email = req.webEmail;
  const { message } = req.body;
  if (!message || !message.trim()) return res.status(400).json({ error: "Saknar meddelande." });

  const daily = getDailyCount(email);
  const monthly = getMonthlyCount(email);
  if (daily >= DAILY_LIMIT) return res.status(429).json({ error: "Daglig gräns nådd (" + DAILY_LIMIT + "/dag). Försök imorgon.", code: "DAILY_LIMIT" });
  if (monthly >= MONTHLY_LIMIT) return res.status(429).json({ error: "Månadsgräns nådd.", code: "MONTHLY_LIMIT" });

  const fullPrompt = SYSTEM_PROMPT + "\n\nAnvändarens förfrågan:\n" + message.trim();
  const body = JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] });
  const options = {
    hostname: "generativelanguage.googleapis.com",
    path: "/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY,
    method: "POST",
    headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
  };

  const apiReq = https.request(options, (apiRes) => {
    let raw = "";
    apiRes.on("data", c => raw += c);
    apiRes.on("end", () => {
      try {
        const parsed = JSON.parse(raw);
        const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) return res.status(500).json({ error: "Inget svar från AI. Försök igen." });
        incrementUsage(email);
        res.json({
          reply: text,
          dailyRemaining: DAILY_LIMIT - getDailyCount(email),
          monthlyRemaining: MONTHLY_LIMIT - getMonthlyCount(email),
        });
      } catch (e) {
        res.status(500).json({ error: "AI-fel. Försök igen." });
      }
    });
  });
  apiReq.on("error", () => res.status(500).json({ error: "AI tillfälligt otillgänglig." }));
  apiReq.setTimeout(30000, () => { apiReq.destroy(); res.status(504).json({ error: "AI svarade inte i tid." }); });
  apiReq.write(body);
  apiReq.end();
});

// Stripe webhook for web subscriptions
router.webhookHandler = async function(req, res) {
  if (!stripe || !STRIPE_WEBHOOK_SECRET_WEB) return res.sendStatus(200);
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET_WEB);
  } catch (e) {
    return res.status(400).send("Webhook error: " + e.message);
  }
  const sub = event.data.object;
  if (["customer.subscription.updated", "customer.subscription.deleted"].includes(event.type)) {
    const users = loadWebUsers();
    const user = Object.values(users).find(u => u.subscriptionId === sub.id);
    if (user) {
      user.status = sub.status === "active" ? "active" : "inactive";
      saveWebUsers(users);
    }
  }
  res.sendStatus(200);
};

module.exports = router;
