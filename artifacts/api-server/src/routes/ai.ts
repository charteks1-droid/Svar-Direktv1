import { Router } from "express";
import { ai } from "@workspace/integrations-gemini-ai";

const router = Router();

export const CASE_TYPES: Record<string, string[]> = {
  Skatteverket: [
    "Felaktig debitering",
    "Ändring av folkbokföring",
    "Deklarationsfråga",
    "Överklagande av beslut",
    "Begära anstånd",
    "Annat",
  ],
  Kronofogden: [
    "Bestrida skuld",
    "Begära skuldsanering",
    "Fråga om utmätning",
    "Begära betalningsplan",
    "Invändning mot betalningsföreläggande",
    "Annat",
  ],
  Försäkringskassan: [
    "Sjukpenning nekad",
    "Föräldrapenning",
    "Handläggning tar för lång tid",
    "Överklaga beslut",
    "Begära omprövning",
    "Aktivitetsersättning",
    "Annat",
  ],
  Migrationsverket: [
    "Uppehållstillstånd",
    "Medborgarskap",
    "Asylansökan",
    "Förlängning av tillstånd",
    "Arbetstillstånd",
    "Annat",
  ],
  Arbetsförmedlingen: [
    "A-kassa nekad",
    "Aktivitetsrapport",
    "Överklagande",
    "Fråga om åtgärder",
    "Annat",
  ],
  Inkasso: [
    "Bestrida inkassokrav",
    "Begära specificering av skuld",
    "Begära betalningsplan",
    "Preskriberad skuld",
    "Felaktigt krav",
    "Annat",
  ],
  Socialtjänsten: [
    "Ekonomiskt bistånd",
    "Överklagande av beslut",
    "Begära utredning",
    "Barnomsorg",
    "Annat",
  ],
  Boverket: ["Bostadsbidrag", "Överklagande", "Fråga om bidrag", "Annat"],
  "Annan myndighet": [
    "Överklagande av beslut",
    "Begära information",
    "Klagomål",
    "Allmän förfrågan",
    "Annat",
  ],
};

router.get("/case-types", (_req, res) => {
  res.json(CASE_TYPES);
});

router.post("/generate", async (req, res) => {
  const { fullName, personnummer, institution, caseType, description } =
    req.body ?? {};

  if (
    !fullName?.trim() ||
    !personnummer?.trim() ||
    !institution?.trim() ||
    !caseType?.trim() ||
    !description?.trim()
  ) {
    return res.status(400).json({ error: "Alla fält måste fyllas i." });
  }

  if (description.trim().length < 20) {
    return res
      .status(400)
      .json({ error: "Problembeskrivningen måste vara minst 20 tecken." });
  }

  const prompt = `Skriv ett komplett formellt brev på svenska. Generera HELA brevet utan avbrott.

Avsändare: ${fullName.trim()}
Personnummer: ${personnummer.trim()}
Mottagare: ${institution.trim()}
Ärendetyp: ${caseType.trim()}
Ärendebeskrivning: ${description.trim()}

Brevstruktur (följ exakt):
1. "Till ${institution.trim()},"
2. Presentation: vem du är, personnummer
3. Syfte: vad ärendet gäller
4. Bakgrund: beskriv situationen (2-3 meningar)
5. Begäran: vad du vill att myndigheten ska göra
6. Avslutning: tackar för behandling av ärendet
7. "Med vänliga hälsningar,"
8. "${fullName.trim()}"

Krav: Skriv brevet på svenska. Formell ton. Minst 8 meningar. Returnera BARA brevtexten.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        maxOutputTokens: 1200,
        temperature: 0.3,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const text = response.text?.trim();
    if (!text) {
      return res
        .status(500)
        .json({ error: "Inget svar från AI. Försök igen." });
    }

    return res.json({ message: text });
  } catch (err) {
    console.error("[ai/generate]", err);
    return res
      .status(500)
      .json({ error: "Ett fel uppstod vid generering. Försök igen om en stund." });
  }
});

export default router;
