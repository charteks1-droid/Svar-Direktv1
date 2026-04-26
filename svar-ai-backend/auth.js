const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const USERS_FILE = path.join(__dirname, "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "svar-direkt-dev-secret-change-me";
const OWNER_EMAIL = "charteks1@gmail.com";

function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    }
  } catch (e) {
    console.error("loadUsers error:", e.message);
  }
  return {};
}

function saveUsers(users) {
  try {
    const tmp = USERS_FILE + "." + process.pid + "." + Date.now() + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(users, null, 2));
    fs.renameSync(tmp, USERS_FILE);
    return true;
  } catch (e) {
    console.error("saveUsers error:", e.message);
    return false;
  }
}

let lockChain = Promise.resolve();
async function withUsersLock(fn) {
  let release;
  const ticket = new Promise((r) => { release = r; });
  const prev = lockChain;
  lockChain = ticket;
  try {
    await prev;
    const users = loadUsers();
    const result = await fn(users);
    return result;
  } finally {
    release();
  }
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isOwner(email) {
  return normalizeEmail(email) === OWNER_EMAIL;
}

function publicUser(user) {
  if (!user) return null;
  const now = Date.now();
  let subscriptionStatus = "none";
  let isPremium = false;
  let trialEndsAt = null;
  let currentPeriodEnd = null;

  if (isOwner(user.email)) {
    subscriptionStatus = "owner";
    isPremium = true;
  } else if (user.subscription) {
    const sub = user.subscription;
    subscriptionStatus = sub.status || "none";
    trialEndsAt = sub.trialEndsAt || null;
    currentPeriodEnd = sub.currentPeriodEnd || null;
    if (sub.status === "trialing" && sub.trialEndsAt && sub.trialEndsAt > now) {
      isPremium = true;
    } else if (sub.status === "active" && (!sub.currentPeriodEnd || sub.currentPeriodEnd > now)) {
      isPremium = true;
    } else if (sub.status === "past_due" && sub.currentPeriodEnd && sub.currentPeriodEnd > now) {
      isPremium = true;
    }
  }

  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    isOwner: isOwner(user.email),
    isPremium,
    subscriptionStatus,
    trialEndsAt,
    currentPeriodEnd,
    stripeCustomerId: user.stripeCustomerId || null,
  };
}

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "365d" }
  );
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const users = loadUsers();
    const user = Object.values(users).find((u) => u.id === decoded.sub);
    if (!user) return res.status(401).json({ error: "User not found" });
    req.user = user;
    req.users = users;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

router.post("/register", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Nieprawidłowy email" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Hasło musi mieć min. 6 znaków" });
    }

    const users = loadUsers();
    if (users[email]) {
      return res.status(409).json({ error: "Konto z tym emailem już istnieje" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = "u_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const user = {
      id,
      email,
      passwordHash,
      createdAt: Date.now(),
      stripeCustomerId: null,
      subscription: null,
    };
    users[email] = user;
    saveUsers(users);

    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (e) {
    console.error("register error:", e);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!isValidEmail(email) || !password) {
      return res.status(400).json({ error: "Podaj email i hasło" });
    }

    const users = loadUsers();
    const user = users[email];
    if (!user) {
      return res.status(401).json({ error: "Nieprawidłowy email lub hasło" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Nieprawidłowy email lub hasło" });
    }

    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (e) {
    console.error("login error:", e);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const oldPassword = String(req.body.oldPassword || "");
    const newPassword = String(req.body.newPassword || "");
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Nowe hasło musi mieć min. 6 znaków" });
    }
    const ok = await bcrypt.compare(oldPassword, req.user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Nieprawidłowe stare hasło" });

    req.user.passwordHash = await bcrypt.hash(newPassword, 10);
    req.users[req.user.email] = req.user;
    saveUsers(req.users);
    res.json({ ok: true });
  } catch (e) {
    console.error("change-password error:", e);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

router.delete("/account", authMiddleware, async (req, res) => {
  try {
    delete req.users[req.user.email];
    saveUsers(req.users);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Błąd serwera" });
  }
});

module.exports = router;
module.exports.authMiddleware = authMiddleware;
module.exports.loadUsers = loadUsers;
module.exports.saveUsers = saveUsers;
module.exports.publicUser = publicUser;
module.exports.isOwner = isOwner;
module.exports.normalizeEmail = normalizeEmail;
