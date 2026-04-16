import type { Plugin, ViteDevServer } from "vite";
import { GoogleGenAI } from "@google/genai";

function readBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk: Buffer) => { data += chunk.toString(); });
    req.on("end", () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch { reject(new Error("Invalid JSON")); }
    });
    req.on("error", reject);
  });
}

function json(res: any, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

const CASE_TYPES: Record<string, string[]> = {
  Skatteverket: ["Felaktig debitering","Ändring av folkbokföring","Deklarationsfråga","Överklagande av beslut","Begära anstånd","Annat"],
  Kronofogden: ["Bestrida skuld","Begära skuldsanering","Fråga om utmätning","Begära betalningsplan","Invändning mot betalningsföreläggande","Annat"],
  Försäkringskassan: ["Sjukpenning nekad","Föräldrapenning","Handläggning tar för lång tid","Överklaga beslut","Begära omprövning","Aktivitetsersättning","Annat"],
  Migrationsverket: ["Uppehållstillstånd","Medborgarskap","Asylansökan","Förlängning av tillstånd","Arbetstillstånd","Annat"],
  Arbetsförmedlingen: ["A-kassa nekad","Aktivitetsrapport","Överklagande","Fråga om åtgärder","Annat"],
  Inkasso: ["Bestrida inkassokrav","Begära specificering av skuld","Begära betalningsplan","Preskriberad skuld","Felaktigt krav","Annat"],
  Socialtjänsten: ["Ekonomiskt bistånd","Överklagande av beslut","Begära utredning","Barnomsorg","Annat"],
  Boverket: ["Bostadsbidrag","Överklagande","Fråga om bidrag","Annat"],
  "Annan myndighet": ["Överklagande av beslut","Begära information","Klagomål","Allmän förfrågan","Annat"],
};

function getGeminiClient() {
  const baseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
  if (!baseUrl || !apiKey) throw new Error("Gemini env vars not set");
  return new GoogleGenAI({ apiKey, httpOptions: { apiVersion: "", baseUrl } });
}

export function forumApiPlugin(): Plugin {
  return {
    name: "forum-api",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const base = (process.env.BASE_PATH || "/svar-direkt-web/").replace(/\/$/, "");
        const url: string = req.url || "";
        const path = url.startsWith(base) ? url.slice(base.length) : url;
        const [pathname] = path.split("?");
        const method: string = req.method || "GET";

        if (!pathname.startsWith("/api/ai")) return next();

        try {
          if (method === "GET" && pathname === "/api/ai/case-types") {
            return json(res, 200, CASE_TYPES);
          }

          if (method === "POST" && pathname === "/api/ai/generate") {
            const body = await readBody(req);
            const { fullName, personnummer, institution, caseType, description } = body ?? {};
            if (!fullName?.trim() || !personnummer?.trim() || !institution?.trim() || !caseType?.trim() || !description?.trim()) {
              return json(res, 400, { error: "Alla fält måste fyllas i." });
            }
            if (description.trim().length < 20) {
              return json(res, 400, { error: "Problembeskrivningen måste vara minst 20 tecken." });
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

            const ai = getGeminiClient();
            const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              config: {
                maxOutputTokens: 1200,
                temperature: 0.3,
                thinkingConfig: { thinkingBudget: 0 },
              },
            });
            const text = (response.text ?? "").trim();
            if (!text) return json(res, 500, { error: "Inget svar från AI. Försök igen." });
            return json(res, 200, { message: text });
          }

          return json(res, 404, { error: "Route not found" });
        } catch (err) {
          console.error("[ai-api]", err);
          return json(res, 500, { error: "Ett fel uppstod. Försök igen om en stund." });
        }
      });
    },
  };
}
