import { Router } from "express";
import nodemailer from "nodemailer";
import { pool } from "@workspace/db";

const router = Router();

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 587,
  secure: false,
  auth: {
    user: "info@svardirekt.site",
    pass: "Polska25!!!",
  },
});

router.post("/contact", async (req, res) => {
  const {
    fornamn = "", efternamn = "", epost = "",
    myndighet = "", beskrivning = "",
    kategori = "", amne = "", meddelande = "",
  } = req.body;

  if (!epost) {
    return res.status(400).json({ success: false, message: "E-post krävs" });
  }

  const isTjanst = !!beskrivning;
  const subject = isTjanst
    ? `Nytt ärende: ${myndighet || "–"} – ${fornamn} ${efternamn}`.trim()
    : `Fråga från hemsidan: ${amne || kategori || "–"}`;

  const body = isTjanst
    ? [
        "NY FÖRFRÅGAN – svardirekt.se",
        "================================",
        `Förnamn:    ${fornamn || "–"}`,
        `Efternamn:  ${efternamn || "–"}`,
        `E-post:     ${epost}`,
        `Myndighet:  ${myndighet || "–"}`,
        "",
        "BESKRIVNING:",
        beskrivning,
        "",
        "================================",
        `Svara till: ${epost}`,
        "Första svaret är gratis. Fortsättning: 99 kr/svar.",
      ].join("\n")
    : [
        "FRÅGA FRÅN HEMSIDAN – svardirekt.se",
        "======================================",
        `E-post:    ${epost}`,
        `Kategori:  ${kategori || "–"}`,
        `Ämne:      ${amne || "–"}`,
        "",
        "MEDDELANDE:",
        meddelande || "–",
        "",
        "======================================",
        `Svara till: ${epost}`,
      ].join("\n");

  try {
    await transporter.sendMail({
      from: '"Svar Direkt" <info@svardirekt.site>',
      to: "info@svardirekt.site",
      replyTo: epost,
      subject,
      text: body,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ success: false, message: "Kunde inte skicka e-post" });
  }
});

// Newsletter / email lead capture
router.post("/leads", async (req, res) => {
  const { epost = "", kalla = "verktyg" } = req.body;
  if (!epost || !epost.includes("@")) {
    return res.status(400).json({ success: false, message: "Ogiltig e-postadress" });
  }

  try {
    await transporter.sendMail({
      from: '"Svar Direkt" <info@svardirekt.site>',
      to: "info@svardirekt.site",
      subject: `Nytt lead – nyhetsbrev (${kalla})`,
      text: [
        "NYTT LEAD – NYHETSBREV",
        "======================",
        `E-post:  ${epost}`,
        `Källa:   ${kalla}`,
        `Datum:   ${new Date().toLocaleString("sv-SE")}`,
      ].join("\n"),
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Lead email error:", err);
    res.status(500).json({ success: false, message: "Kunde inte spara e-post" });
  }
});

// Lawyer contact lead
router.post("/jurist-kontakt", async (req, res) => {
  const { epost = "", namn = "", beskrivning = "" } = req.body;
  if (!epost || !epost.includes("@")) {
    return res.status(400).json({ success: false, message: "Ogiltig e-postadress" });
  }

  try {
    await transporter.sendMail({
      from: '"Svar Direkt" <info@svardirekt.site>',
      to: "info@svardirekt.site",
      replyTo: epost,
      subject: `Juristkontakt – ${namn || epost}`,
      text: [
        "JURISTKONTAKT – FÖRFRÅGAN",
        "==========================",
        `Namn:    ${namn || "–"}`,
        `E-post:  ${epost}`,
        `Datum:   ${new Date().toLocaleString("sv-SE")}`,
        "",
        "ÄRENDEBESKRIVNING:",
        beskrivning || "–",
      ].join("\n"),
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Jurist contact error:", err);
    res.status(500).json({ success: false, message: "Kunde inte skicka förfrågan" });
  }
});

// Newsletter subscription – saved to PostgreSQL
router.post("/api/tools/newsletter", async (req, res) => {
  const { email = "" } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ success: false, message: "Ogiltig e-postadress" });
  }
  try {
    await pool.query(
      `INSERT INTO newsletter_subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING`,
      [email.trim().toLowerCase()]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Newsletter error:", err);
    res.status(500).json({ success: false });
  }
});

// Newsletter list – admin only
router.get("/api/tools/newsletter", async (req, res) => {
  const key = req.headers["x-admin-key"];
  if (key !== process.env.FORUM_ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const result = await pool.query(
      `SELECT email, created_at FROM newsletter_subscribers ORDER BY created_at DESC`
    );
    res.json({ subscribers: result.rows, count: result.rows.length });
  } catch (err) {
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
