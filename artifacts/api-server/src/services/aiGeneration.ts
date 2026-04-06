import { openai } from "@workspace/integrations-openai-ai-server";

const SYSTEM_PROMPT = `Du är en specialiserad assistent för att skriva formella brev och meddelanden på svenska. Din uppgift är att hjälpa privatpersoner att kommunicera professionellt och effektivt med myndigheter, hyresvärdar, inkassobolag, arbetsgivare, försäkringsbolag och liknande institutioner.

REGLER DU MÅSTE FÖLJA:
- Skriv ALLTID på korrekt, formell svenska
- Fabricera ALDRIG lagar, paragrafnummer eller rättsfall som du inte är helt säker på existerar – om du refererar till lag, namnge den korrekt eller undvik det
- Håll dig STRIKT till den information användaren anger – lägg inte till fakta eller detaljer som inte nämns
- Strukturera meddelandet tydligt: inledning som anger ärende, kärninnehåll som beskriver situationen och krav, avslutning med förväntat svar och tidsgräns om tillämpligt
- Använd ett professionellt och respektfullt språk, oavsett hur frustrerande situationen är
- Producera ett direkt användbart brev som mottagaren kan ta på allvar
- Undvik chattigt, informellt eller aggressivt språk
- Inkludera platshållare för datum [DATUM], avsändarens namn [NAMN] och kontaktuppgifter [KONTAKTUPPGIFTER] om det är ett brev

Du är INTE en allmän chatbot. Du svarar ENBART med det färdiga meddelandet eller brevet – inga förklaringar, inga kommentarer, inga instruktioner till användaren. Börja direkt med brevhuvudet eller hälsningen.`;

export interface GenerateMessageInput {
  institution: string;
  caseType: string;
  situation: string;
  goal: string;
  tone: "formell" | "assertiv" | "kortfattad" | "detaljerad";
  length: "kort" | "standard" | "detaljerat";
}

export async function generateFormalMessage(input: GenerateMessageInput): Promise<string> {
  const lengthInstruction = {
    kort: "Skriv ett kortfattat meddelande (ca 100–150 ord).",
    standard: "Skriv ett meddelande med normal längd (ca 200–300 ord).",
    detaljerat: "Skriv ett detaljerat och utförligt meddelande (ca 350–500 ord).",
  }[input.length];

  const toneInstruction = {
    formell: "Ton: Formell och professionell.",
    assertiv: "Ton: Bestämd och tydlig, men respektfull.",
    kortfattad: "Ton: Koncis och rakt på sak.",
    detaljerad: "Ton: Grundlig och förklarande.",
  }[input.tone];

  const userPrompt = `Skriv ett formellt meddelande eller brev med följande uppgifter:

Mottagare/Institution: ${input.institution}
Ärendetyp: ${input.caseType}
Beskrivning av situationen: ${input.situation}
Mål – vad jag vill uppnå: ${input.goal}
${toneInstruction}
${lengthInstruction}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5-mini",
    max_completion_tokens: 8192,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("AI returned empty response");
  return content;
}
