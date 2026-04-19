import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 587,
  secure: false,
  auth: {
    user: "info@svardirekt.se",
    pass: "Polska25!!!",
  },
});

router.post("/contact", async (req, res) => {
  const { fornamn = "", efternamn = "", epost = "", myndighet = "–", beskrivning = "" } = req.body;

  if (!epost || !beskrivning) {
    return res.status(400).json({ success: false, message: "E-post och beskrivning krävs" });
  }

  try {
    await transporter.sendMail({
      from: '"Svar Direkt" <info@svardirekt.se>',
      to: "info@svardirekt.se",
      replyTo: epost,
      subject: `Nytt ärende: ${myndighet} – ${fornamn} ${efternamn}`.trim(),
      text: [
        "NY FÖRFRÅGAN – svardirekt.site",
        "================================",
        "",
        `Förnamn:    ${fornamn || "–"}`,
        `Efternamn:  ${efternamn || "–"}`,
        `E-post:     ${epost}`,
        `Myndighet:  ${myndighet}`,
        "",
        "BESKRIVNING:",
        beskrivning,
        "",
        "================================",
        `Svara till: ${epost}`,
        "Första svaret är gratis. Fortsättning: 99 kr/svar.",
      ].join("\n"),
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ success: false, message: "Kunde inte skicka e-post" });
  }
});

export default router;
