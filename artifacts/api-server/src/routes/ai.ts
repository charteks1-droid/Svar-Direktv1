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

  const prompt = `Du är en professionell assistent specialiserad på formell svenska myndighetskommunikation.

Skriv ett formellt brev på svenska baserat på följande uppgifter:
- Avsändare: ${fullName.trim()}
- Personnummer: ${personnummer.trim()}
- Mottagare: ${institution.trim()}
- Ärendetyp: ${caseType.trim()}
- Beskrivning av ärendet: ${description.trim()}

STRIKTA KRAV:
1. Brevet ska vara på svenska
2. Formell och artig ton lämplig för svenska myndigheter
3. Exakt 6-10 meningar totalt
4. Börja med "Till ${institution.trim()},"
5. Andra meningen ska presentera avsändaren med namn och personnummer
6. Var direkt och tydlig om ärendet
7. Avsluta med "Med vänliga hälsningar," på en ny rad, sedan avsändarens fullständiga namn
8. Inga förklaringar, kommentarer eller AI-text utanför brevet
9. Returnera BARA det färdiga brevet`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 600, temperature: 0.25 },
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
