#!/usr/bin/env node
// Creates index.html copies at every SPA route so ANY static host works (no server config needed)
// Also injects per-page <title>, <meta description> and JSON-LD for SEO landing pages
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist/public");
const indexHtml = path.join(distDir, "index.html");

// Per-route meta overrides
const META = {
  "blogg": {
    title: "Blogg – Tips om myndigheter och myndighetsbrev | Svar Direkt",
    description: "Läs artiklar om hur du kommunicerar med Kronofogden, Försäkringskassan, Skatteverket och fler. Gratis råd och mallar.",
  },
  "mallar": {
    title: "Gratis mallar till svenska myndigheter – 12 färdiga mallar | Svar Direkt",
    description: "Ladda ner 12 gratis brevmallar till Kronofogden, Försäkringskassan, Skatteverket och Migrationsverket. Klara att kopiera och skicka.",
  },
  "tjanst": {
    title: "Personlig hjälp med myndigheter – 99 kr per svar | Svar Direkt",
    description: "Beskriv ditt ärende och få ett klart svar att skicka till myndigheten. Första svaret gratis. Ytterligare svar 99 kr. Svar inom 24 timmar.",
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Personlig hjälp med myndigheter",
      "provider": { "@type": "Organization", "name": "Svar Direkt", "url": "https://svardirekt.site" },
      "description": "Personlig hjälp att formulera svar och brev till svenska myndigheter.",
      "offers": { "@type": "Offer", "price": "99", "priceCurrency": "SEK", "description": "Första svaret gratis, sedan 99 kr per svar." }
    })
  },
  "hjalp-kronofogden": {
    title: "Hjälp med Kronofogden – bestrida skuld, avbetalningsplan | Svar Direkt",
    description: "Fått brev från Kronofogden? Vi formulerar rätt svar åt dig. Bestrida skuld, avbetalningsplan eller skuldsanering – personlig hjälp. Första svaret gratis.",
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Vad gör jag om jag fått ett betalningsföreläggande från Kronofogden?", "acceptedAnswer": { "@type": "Answer", "text": "Du måste bestrida kravet inom den tid som anges i brevet, annars godkänns skulden automatiskt. Vi hjälper dig formulera ett korrekt bestridande." } },
        { "@type": "Question", "name": "Kan jag begära avbetalningsplan hos Kronofogden?", "acceptedAnswer": { "@type": "Answer", "text": "Ja, du kan ansöka om en avbetalningsplan. Vi hjälper dig skriva ansökan med rätt formulering och argument." } },
        { "@type": "Question", "name": "Hur snabbt svarar ni?", "acceptedAnswer": { "@type": "Answer", "text": "Inom 24 timmar via e-post. Första svaret är alltid gratis." } },
        { "@type": "Question", "name": "Vad kostar tjänsten?", "acceptedAnswer": { "@type": "Answer", "text": "Första svaret är gratis. Ytterligare svar kostar 99 kr per meddelande." } }
      ]
    })
  },
  "hjalp-forsakringskassan": {
    title: "Hjälp med Försäkringskassan – överklagande och komplettering | Svar Direkt",
    description: "Nekad sjukpenning, överklagande eller begäran om komplettering? Vi skriver rätt svar till Försäkringskassan. Personlig hjälp – första svaret gratis.",
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Hur överklagar jag ett beslut från Försäkringskassan?", "acceptedAnswer": { "@type": "Answer", "text": "Du skickar ett skriftligt överklagande till Försäkringskassan inom tre veckor från beslutet. Vi hjälper dig formulera överklagandet med rätt argument." } },
        { "@type": "Question", "name": "Försäkringskassan begär komplettering – vad ska jag skriva?", "acceptedAnswer": { "@type": "Answer", "text": "Du bör svara tydligt på det de efterfrågar och bifoga relevant information. Vi hjälper dig formulera ett komplett och korrekt svar." } },
        { "@type": "Question", "name": "Hur lång tid tar det att få hjälp?", "acceptedAnswer": { "@type": "Answer", "text": "Du får ditt färdiga svar inom 24 timmar via e-post. Första svaret är gratis." } },
        { "@type": "Question", "name": "Gäller hjälpen också aktivitetsersättning?", "acceptedAnswer": { "@type": "Answer", "text": "Ja, vi hjälper med alla typer av ärenden hos Försäkringskassan – sjukpenning, aktivitetsersättning, föräldrapenning och mer." } }
      ]
    })
  },
  "hjalp-skatteverket": {
    title: "Hjälp med Skatteverket – rättelse, anstånd och svar | Svar Direkt",
    description: "Fråga om deklaration, skattekontroll eller begäran om komplettering från Skatteverket? Vi formulerar ett korrekt svar. Första svaret gratis.",
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Skatteverket granskar min deklaration – vad gör jag?", "acceptedAnswer": { "@type": "Answer", "text": "Svara sakligt och bifoga de handlingar de efterfrågar. Vi hjälper dig formulera ett tydligt svar som minskar risken för missförstånd." } },
        { "@type": "Question", "name": "Hur ansöker jag om anstånd med skatt?", "acceptedAnswer": { "@type": "Answer", "text": "Du skickar en skriftlig begäran till Skatteverket och förklarar varför du behöver mer tid. Vi hjälper dig skriva ansökan korrekt." } },
        { "@type": "Question", "name": "Kan jag rätta ett fel i deklarationen?", "acceptedAnswer": { "@type": "Answer", "text": "Ja, du kan begära omprövning av ett beslut inom fem år. Vi hjälper dig formulera rättelsen." } },
        { "@type": "Question", "name": "Hur snabbt får jag hjälp?", "acceptedAnswer": { "@type": "Answer", "text": "Inom 24 timmar. Första svaret är alltid gratis." } }
      ]
    })
  },
  "hjalp-inkasso": {
    title: "Hjälp med inkassokrav – bestrida eller avbetalning | Svar Direkt",
    description: "Fått ett inkassokrav du inte känner igen? Vi hjälper dig formulera ett korrekt bestridande eller begäran om avbetalning. Första svaret gratis.",
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Hur bestrider jag ett inkassokrav?", "acceptedAnswer": { "@type": "Answer", "text": "Du skickar ett skriftligt bestridande till inkassobolaget inom den angivna fristen och förklarar varför du inte anser att skulden är korrekt. Vi hjälper dig formulera bestridandet." } },
        { "@type": "Question", "name": "Vad händer om jag inte svarar på inkassokravet?", "acceptedAnswer": { "@type": "Answer", "text": "Inkassobolaget kan ansöka om betalningsföreläggande hos Kronofogden, vilket kan leda till utmätning. Det är viktigt att agera snabbt." } },
        { "@type": "Question", "name": "Kan jag begära avbetalningsplan direkt med inkassobolaget?", "acceptedAnswer": { "@type": "Answer", "text": "Ja, de flesta inkassobolag godtar avbetalningsplaner. Vi hjälper dig formulera en begäran med rimliga villkor." } },
        { "@type": "Question", "name": "Kostar det något att få hjälp?", "acceptedAnswer": { "@type": "Answer", "text": "Första svaret är gratis. Ytterligare hjälp kostar 99 kr per meddelande." } }
      ]
    })
  },
  "hjalp-migrationsverket": {
    title: "Hjälp med Migrationsverket – uppehållstillstånd och överklagande | Svar Direkt",
    description: "Komplettering, förlängning av uppehållstillstånd eller överklagande? Vi formulerar rätt svar till Migrationsverket. Första svaret gratis.",
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Migrationsverket begär komplettering – vad ska jag skicka?", "acceptedAnswer": { "@type": "Answer", "text": "Du bör svara exakt på det de efterfrågar och inkludera alla relevanta handlingar. Vi hjälper dig formulera ett komplett och tydligt svar." } },
        { "@type": "Question", "name": "Hur överklagar jag ett avslagsbeslut från Migrationsverket?", "acceptedAnswer": { "@type": "Answer", "text": "Du överklagar till Migrations­domstolen inom tre veckor från beslutet. Vi hjälper dig formulera överklagandeskriften." } },
        { "@type": "Question", "name": "Kan ni hjälpa med ansökan om förlängning av uppehållstillstånd?", "acceptedAnswer": { "@type": "Answer", "text": "Ja, vi hjälper dig skriva följebrev och kompletterande information till din ansökan." } },
        { "@type": "Question", "name": "Hur snabbt får jag svar?", "acceptedAnswer": { "@type": "Answer", "text": "Inom 24 timmar via e-post. Första hjälpen är gratis." } }
      ]
    })
  },
  "hjalp-arbetsformedlingen": {
    title: "Hjälp med Arbetsförmedlingen – varning, a-kassa och aktivitetsrapport | Svar Direkt",
    description: "Fått varning eller sanktionsbeslut från Arbetsförmedlingen? Vi hjälper dig formulera rätt svar. Skydda din a-kassa. Första svaret gratis.",
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Fick en varning från Arbetsförmedlingen – vad gör jag?", "acceptedAnswer": { "@type": "Answer", "text": "Du bör svara skriftligt och förklara din situation. Vi hjälper dig formulera ett svar som minimerar risken för sanktion." } },
        { "@type": "Question", "name": "Kan jag överklaga ett sanktionsbeslut om a-kassan?", "acceptedAnswer": { "@type": "Answer", "text": "Ja, du kan begära omprövning hos a-kassan och sedan överklaga till domstol. Vi hjälper dig formulera begäran." } },
        { "@type": "Question", "name": "Vad skriver jag i aktivitetsrapporten?", "acceptedAnswer": { "@type": "Answer", "text": "Vi hjälper dig beskriva dina sökaktiviteter på ett sätt som uppfyller kraven och undviker missförstånd." } },
        { "@type": "Question", "name": "Hur snabbt får jag hjälp?", "acceptedAnswer": { "@type": "Answer", "text": "Inom 24 timmar. Första svaret är alltid gratis." } }
      ]
    })
  },
  "skriv-brev-myndighet": {
    title: "Skriv brev till myndighet på svenska – personlig hjälp | Svar Direkt",
    description: "Hjälp med att skriva formella brev till svenska myndigheter. Korrekt ton och struktur. Kronofogden, Skatteverket, Försäkringskassan m.fl. Första svaret gratis.",
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Hur ska ett brev till en myndighet vara formulerat?", "acceptedAnswer": { "@type": "Answer", "text": "Myndighetsbrev ska vara sakliga, tydliga och välstrukturerade. Undvik känsloladdade formuleringar. Ange alltid personnummer och ärendenummer om det finns." } },
        { "@type": "Question", "name": "Vilka myndigheter kan ni hjälpa med?", "acceptedAnswer": { "@type": "Answer", "text": "Kronofogden, Skatteverket, Försäkringskassan, Migrationsverket, Arbetsförmedlingen, Socialtjänsten, kommunala myndigheter och inkassobolag." } },
        { "@type": "Question", "name": "Behöver jag skapa ett konto?", "acceptedAnswer": { "@type": "Answer", "text": "Nej, du fyller bara i formuläret och anger din e-post. Ingen registrering krävs." } },
        { "@type": "Question", "name": "Hur lång tid tar det?", "acceptedAnswer": { "@type": "Answer", "text": "Svar inom 24 timmar. Första brevet är gratis." } }
      ]
    })
  },
  "svar-myndighet-svenska": {
    title: "Svar till myndighet på svenska – hjälp att formulera rätt | Svar Direkt",
    description: "Behöver du formulera ett svar till en svensk myndighet? Vi skriver det åt dig med rätt ton och struktur. Personlig hjälp – första svaret gratis.",
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Varför är det viktigt att svara myndigheter korrekt?", "acceptedAnswer": { "@type": "Answer", "text": "Myndigheter fattar beslut baserat på vad du skriver. En oklar eller felaktig formulering kan leda till avslag, förseningar eller att skulden godkänns automatiskt." } },
        { "@type": "Question", "name": "Vad behöver ni veta för att hjälpa mig?", "acceptedAnswer": { "@type": "Answer", "text": "Beskriv vilket brev du fått, vad myndigheten vill ha, och vad du vill uppnå. Vi tar hand om formuleringen." } },
        { "@type": "Question", "name": "Är svaret juridiskt giltigt?", "acceptedAnswer": { "@type": "Answer", "text": "Vi är inte jurister men hjälper dig formulera ett korrekt, välstrukturerat svar. Om du behöver juridisk rådgivning rekommenderar vi en advokat." } },
        { "@type": "Question", "name": "Vad kostar det?", "acceptedAnswer": { "@type": "Answer", "text": "Första svaret är gratis. Ytterligare svar kostar 99 kr per meddelande via Payhip." } }
      ]
    })
  },
  "help-swedish-authority": {
    title: "Help responding to Swedish authorities – Kronofogden, Skatteverket | Svar Direkt",
    description: "Need help writing a letter to a Swedish authority? We compose the correct reply for you. Kronofogden, Försäkringskassan, Skatteverket and more. First response free.",
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Which Swedish authorities do you help with?", "acceptedAnswer": { "@type": "Answer", "text": "Kronofogden (enforcement agency), Skatteverket (tax agency), Försäkringskassan (social insurance), Migrationsverket (migration agency), Arbetsförmedlingen (employment agency) and debt collectors." } },
        { "@type": "Question", "name": "Do I need to speak Swedish to use this service?", "acceptedAnswer": { "@type": "Answer", "text": "No. You can describe your situation in English (or Polish), and we will write the formal reply in Swedish for you." } },
        { "@type": "Question", "name": "How quickly will I receive help?", "acceptedAnswer": { "@type": "Answer", "text": "Within 24 hours by email. The first response is always free." } },
        { "@type": "Question", "name": "What does it cost?", "acceptedAnswer": { "@type": "Answer", "text": "The first response is free. Additional replies cost 99 SEK each. No subscription required." } }
      ]
    })
  },
  "swedish-government-letter-help": {
    title: "Swedish government letter writing help – dispute, appeal, respond | Svar Direkt",
    description: "We write formal letters to Swedish government agencies for you. Dispute a debt, appeal a decision or respond to a tax query. First reply free. Reply within 24 hours.",
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "How do I dispute a debt at Kronofogden?", "acceptedAnswer": { "@type": "Answer", "text": "You must submit a written contestation to Kronofogden within the deadline stated in the letter. We help you write a correct and clear contestation." } },
        { "@type": "Question", "name": "Can I appeal a denied benefit from Försäkringskassan in English?", "acceptedAnswer": { "@type": "Answer", "text": "You must appeal in Swedish, but you can describe your case to us in English and we will write the formal appeal for you." } },
        { "@type": "Question", "name": "How long does the process take?", "acceptedAnswer": { "@type": "Answer", "text": "You receive the finished letter within 24 hours by email. The first response is free." } },
        { "@type": "Question", "name": "Is this legal advice?", "acceptedAnswer": { "@type": "Answer", "text": "No, this is not legal advice. We help you compose clear, well-structured letters. For legal representation, consult a lawyer." } }
      ]
    })
  },
  "pomoc-urzad-szwecja": {
    title: "Pomoc z pismem do szwedzkiego urzędu – Kronofogden, Skatteverket | Svar Direkt",
    description: "Otrzymałeś pismo od Kronofogden, Skatteverket lub innego szwedzkiego urzędu? Pomagamy napisać poprawną odpowiedź. Pierwsza odpowiedź gratis. Odpowiedź w 24 godziny.",
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Z jakimi szwedzkimi urzędami pomagacie?", "acceptedAnswer": { "@type": "Answer", "text": "Kronofogden (komornik), Skatteverket (urząd skarbowy), Försäkringskassan (ZUS), Migrationsverket (urząd ds. migracji), Arbetsförmedlingen (urząd pracy) oraz firmy windykacyjne." } },
        { "@type": "Question", "name": "Czy muszę znać szwedzki, żeby skorzystać z usługi?", "acceptedAnswer": { "@type": "Answer", "text": "Nie. Możesz opisać swoją sytuację po polsku, a my napiszemy formalne pismo po szwedzku." } },
        { "@type": "Question", "name": "Jak szybko otrzymam pomoc?", "acceptedAnswer": { "@type": "Answer", "text": "W ciągu 24 godzin na podany adres e-mail. Pierwsza odpowiedź jest zawsze bezpłatna." } },
        { "@type": "Question", "name": "Ile kosztuje usługa?", "acceptedAnswer": { "@type": "Answer", "text": "Pierwsza odpowiedź jest bezpłatna. Kolejne pisma kosztują 99 SEK każde. Bez abonamentu." } }
      ]
    })
  },
  "blogg/overklaga-forsakringskassan-mall": {
    title: "Överklaga Försäkringskassan – gratis mall och guide | Svar Direkt",
    description: "Steg-för-steg guide: hur du överklagar Försäkringskassans beslut. Gratis mall att kopiera. Skriv ett korrekt överklagande och öka dina chanser.",
  },
  "blogg/hur-skriver-man-till-forsakringskassan": {
    title: "Hur skriver man till Försäkringskassan – guide och mallar | Svar Direkt",
    description: "Lär dig rätt ton och struktur för brev till Försäkringskassan. Gratis mallar och råd.",
  },
  "blogg/mall-brev-kronofogden": {
    title: "Mall brev till Kronofogden – gratis och klart att skicka | Svar Direkt",
    description: "Gratis brevmall till Kronofogden för bestridande, avbetalningsplan och skuldsanering. Kopiera och skicka direkt.",
  },
  "blogg/bestrida-kronofogden": {
    title: "Bestrida Kronofogden – så gör du rätt | Svar Direkt",
    description: "Steg-för-steg guide: hur du bestrider ett betalningsföreläggande från Kronofogden. Gratis mall. Agera snabbt – deadline är viktig.",
  },
  "blogg/aterkrav-forsakringskassan-vad-gor-jag": {
    title: "Återkrav Försäkringskassan – vad gör du? | Svar Direkt",
    description: "Fått ett återkrav från Försäkringskassan? Lär dig hur du svarar, vad du kan bestrida och hur du ansöker om avbetalningsplan.",
  },
  "blogg/skuldsanering-ansoekan-mall": {
    title: "Skuldsanering ansökan – mall och guide till Kronofogden | Svar Direkt",
    description: "Gratis guide: hur du ansöker om skuldsanering hos Kronofogden. Vad krävs, hur skriver du och vad händer sedan.",
  },
};

const ROUTES = [
  "blogg",
  "paket",
  "kontakt",
  "funktioner",
  "om-appen",
  "mallar",
  "pdf-guider",
  "generator",
  "forum",
  "landing",
  // Blog articles
  "blogg/varfor-ar-det-svart-att-skriva-till-myndigheter",
  "blogg/ratt-ton-i-myndighetsbrev",
  "blogg/svara-pa-krav-fran-kronofogden",
  "blogg/forsakringskassan-skriver-till-dig",
  "blogg/konsten-att-svara-professionellt",
  "blogg/stress-och-radsla-infor-myndighetskontakt",
  "blogg/overvinna-radslan-for-myndigheter",
  "blogg/ekonomi-under-press-vad-gor-du",
  "blogg/radsla-fran-alla-hall-en-otrygg-tid",
  "blogg/vad-hander-om-du-inte-svarar-myndigheter",
  "blogg/skatteverket-6-vanliga-situationer",
  "blogg/hyresgastens-rattigheter-i-sverige",
  // New SEO articles
  "blogg/overklaga-forsakringskassan-mall",
  "blogg/hur-skriver-man-till-forsakringskassan",
  "blogg/mall-brev-kronofogden",
  "blogg/bestrida-kronofogden",
  "blogg/aterkrav-forsakringskassan-vad-gor-jag",
  "blogg/skuldsanering-ansoekan-mall",
  // Tjänst & SEO landing pages
  "tjanst",
  "hjalp-kronofogden",
  "hjalp-forsakringskassan",
  "hjalp-skatteverket",
  "hjalp-inkasso",
  "hjalp-migrationsverket",
  "hjalp-arbetsformedlingen",
  "skriv-brev-myndighet",
  "svar-myndighet-svenska",
  "help-swedish-authority",
  "swedish-government-letter-help",
  "pomoc-urzad-szwecja",
];

const baseHtml = fs.readFileSync(indexHtml, "utf8");
let count = 0;

function injectMeta(html, route) {
  const meta = META[route];
  if (!meta) return html;

  let out = html;

  // Replace <title>
  if (meta.title) {
    out = out.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);
  }

  // Replace <meta name="description">
  if (meta.description) {
    out = out.replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${meta.description.replace(/"/g, '&quot;')}"`
    );
  }

  // Inject JSON-LD before </head>
  if (meta.jsonld) {
    const script = `<script type="application/ld+json">${meta.jsonld}</script>`;
    out = out.replace("</head>", `${script}\n</head>`);
  }

  return out;
}

for (const route of ROUTES) {
  const dir = path.join(distDir, route);
  const dest = path.join(dir, "index.html");
  fs.mkdirSync(dir, { recursive: true });
  const html = injectMeta(baseHtml, route);
  fs.writeFileSync(dest, html);
  count++;
  console.log(`  ✓ /${route}/`);
}

console.log(`\nCreated ${count} static route files.`);
