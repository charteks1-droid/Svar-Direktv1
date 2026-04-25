import { useState } from "react";
import { Link } from "wouter";

interface Section {
  heading: string;
  body: string;
  bullets?: string[];
}

interface GuideData {
  slug: string;
  title: string;
  metaDesc: string;
  h1: string;
  intro: string;
  nar: Section;
  vadGoraDu: Section;
  stegForSteg: string[];
  exempelText: string;
  exempelNote: string;
  relatedLinks: { href: string; label: string }[];
}

const guides: GuideData[] = [
  // ================================================================
  // 1. KRONOFOGDEN – SKULDSANERING
  // ================================================================
  {
    slug: "kronofogden-skuldsanering",
    title: "Skuldsanering – Hur du ansöker och skriver till Kronofogden | Svar Direkt",
    metaDesc:
      "Har du skulder du inte kan betala? Lär dig hur du ansöker om skuldsanering hos Kronofogden – steg för steg guide med färdig exempeltext på svenska.",
    h1: "Skuldsanering hos Kronofogden – Guide och färdigt brev",
    intro:
      "Att ha skulder som man inte längre klarar av att betala är en av de svåraste situationerna en person kan hamna i. Räkningarna staplas, inkassokraven kommer och varje dag känns tyngre. Men det finns en utväg: skuldsanering. Kronofogden hanterar skuldsanering i Sverige och processen är mer tillgänglig än många tror. Den här guiden förklarar hur det fungerar och ger dig ett färdigt brev att kopiera direkt.",
    nar: {
      heading: "När uppstår problemet",
      body:
        "Skuldsanering är aktuellt när du har så stora skulder att du inte kan betala av dem inom överskådlig tid – vanligtvis inom fem år. Det spelar ingen roll om skulderna kommer från lån, inkasso, hyresskulder eller gamla räkningar. För att Kronofogden ska bevilja skuldsanering måste du uppfylla vissa villkor:",
      bullets: [
        "Du måste vara permanent bosatt i Sverige",
        "Du ska vara på obestånd – dvs. inte kunna betala dina skulder",
        "Det ska vara osannolikt att du kan betala dem inom fem år",
        "Du ska ha gjort ett ärligt försök att lösa situationen själv",
      ],
    },
    vadGoraDu: {
      heading: "Vad kan du göra",
      body:
        "Det viktigaste steget är att ansöka om skuldsanering hos Kronofogden. Ansökan kan göras digitalt via Kronofogdens webbplats eller via brev. Du behöver redogöra för din ekonomiska situation, lista dina skulder och förklara varför du inte kan betala. Att skriva ett tydligt och ärligt brev ökar dina chanser att ansökan tas på allvar. Kronofogden granskar din ekonomi och dina möjligheter att betala – och fattar sedan ett beslut.",
    },
    stegForSteg: [
      "Samla alla dina skulder – lista borgenärer, belopp och ursprung",
      "Gör en enkel budget som visar att du inte klarar av betalningarna",
      "Skriv ett brev till Kronofogden där du förklarar din situation (se exempel nedan)",
      "Bifoga relevanta handlingar – kontoutdrag, inkomsbevis, skuldintyg",
      "Skicka ansökan digitalt via Kronofogdens e-tjänst eller med post",
      "Vänta på bekräftelse – Kronofogden kontaktar dina fordringsägare",
      "Svar på eventuella följdfrågor snabbt och ärligt",
    ],
    exempelText: `Till Kronofogdemyndigheten

Angående: Ansökan om skuldsanering

Jag skriver till er för att formellt ansöka om skuldsanering. Min ekonomiska situation har under de senaste [ANTAL] åren försämrats avsevärt. Trots att jag aktivt försökt hantera mina skulder och kontaktat mina borgenärer, befinner jag mig nu i en situation där mina samlade skulder uppgår till approximately [BELOPP] kronor, vilket är omöjligt för mig att betala av med min nuvarande inkomst.

Mina månatliga inkomster uppgår till [BELOPP] kronor. Mina nödvändiga levnadskostnader – hyra, mat och transport – uppgår till [BELOPP] kronor per månad. Det lämnar inget utrymme för avbetalning av skulder.

Skulderna härstammar från [KORTFATTAD FÖRKLARING, t.ex. förlorat arbete, sjukdom, separation]. Jag har kontaktat borgenärerna för att försöka nå uppgörelser, utan framgång.

Jag ber vänligen Kronofogdemyndigheten att ta min ansökan under övervägande. Jag är beredd att samarbeta fullt ut och tillhandahålla alla handlingar som behövs.

Med vänlig hälsning
[DITT FULLSTÄNDIGA NAMN]
[PERSONNUMMER]
[ADRESS]
[TELEFON / E-POST]`,
    exempelNote:
      "Ersätt texten inom hakparentes [  ] med dina egna uppgifter. Bifoga alltid relevant dokumentation.",
    relatedLinks: [
      { href: "/hjalp-kronofogden", label: "Hjälp med Kronofogden – gratis mallar" },
      { href: "/mallar-interaktiva", label: "70 interaktiva brevmallar" },
      { href: "/blogg/kronofogden-skulder-2026", label: "Kronofogden och skulder 2026 – aktuell guide" },
    ],
  },

  // ================================================================
  // 2. SKATTEVERKET – PROBLEM MED DEKLARATION
  // ================================================================
  {
    slug: "skatteverket-deklaration",
    title: "Problem med deklaration? Så skriver du till Skatteverket | Svar Direkt",
    metaDesc:
      "Har du fått fel på deklarationen eller vill ändra något? Lär dig hur du skriver ett korrekt brev till Skatteverket – med färdig exempeltext att kopiera.",
    h1: "Brev till Skatteverket – Deklaration och skatteärenden",
    intro:
      "De flesta kontakter med Skatteverket sker digitalt och smidigt – men ibland uppstår problem. Kanske har du fått ett beslut som verkar fel, behöver ändra din deklaration i efterhand, eller vill bestrida ett krav. Att formulera sig korrekt och tydligt i skrift till Skatteverket är avgörande för att ditt ärende ska behandlas snabbt och rättvist. Här förklarar vi hur du gör det rätt.",
    nar: {
      heading: "När uppstår problemet",
      body:
        "Problem med Skatteverket kan uppstå i många situationer. Några av de vanligaste är:",
      bullets: [
        "Du har deklarerat fel och vill rätta det i efterhand",
        "Skatteverket har gjort ett beslut du inte håller med om",
        "Du har fått en skatteskuld du inte förstår eller anser vara felaktig",
        "Du behöver anstånd med skattebetalning på grund av tillfälliga ekonomiska svårigheter",
        "Du vill ändra ditt skatteavdrag (jämkning) för att få rätt nettolön",
      ],
    },
    vadGoraDu: {
      heading: "Vad kan du göra",
      body:
        "Skatteverket fattar formella beslut och det finns tydliga vägar att gå om du inte håller med. Du kan begära omprövning av ett beslut inom sex år från det år beslutet gäller. Du kan också överklaga till förvaltningsrätten om omprövningen inte ger rätt resultat. Om du bara behöver rätta ett fel i deklarationen kan du skicka in en ändringsdeklaration digitalt – eller via brev med tydlig förklaring. Ju tydligare och mer saklig din skrivelse är, desto snabbare hanteras ditt ärende.",
    },
    stegForSteg: [
      "Identifiera exakt vad du vill ändra eller bestrida",
      "Samla bevis – kvitton, kontoutdrag, gamla deklarationer eller avtal",
      "Skriv ett sakligt brev med tydlig rubrik (t.ex. 'Begäran om omprövning')",
      "Ange ditt personnummer och vilket taxeringsår ärendet gäller",
      "Förklara kortfattat vad som är fel och vad du begär",
      "Bifoga relevanta handlingar som stödjer din begäran",
      "Skicka via Skatteverkets e-tjänst eller till din lokala skattemyndighet",
    ],
    exempelText: `Till Skatteverket

Personnummer: [DITT PERSONNUMMER]
Taxeringsår: [ÅÅÅÅ]

Angående: Begäran om omprövning av beslut / Rättelse av deklaration

Jag skriver för att begära omprövning av det beslut som Skatteverket fattade avseende mitt ärende daterat [DATUM].

Skälet till min begäran är att [BESKRIV PROBLEMET KORTFATTAT, t.ex. "jag av misstag utelämnade ett avdrag för resor till arbetet på totalt X kronor" eller "den angivna inkomsten på beslutet stämmer inte överens med min faktiska lön"].

Jag bifogar följande handlingar som stöder min begäran:
- [DOKUMENT 1, t.ex. arbetsgivarintyg]
- [DOKUMENT 2, t.ex. kvitton]

Jag begär att Skatteverket omprövar beslutet och justerar [VÄNDNING, t.ex. "mitt skatteunderlag i enlighet med bifogade handlingar"].

Med vänlig hälsning
[DITT FULLSTÄNDIGA NAMN]
[PERSONNUMMER]
[ADRESS]
[TELEFON / E-POST]`,
    exempelNote:
      "Fyll i de markerade fälten med dina egna uppgifter. Var konkret och bifoga alltid bevis.",
    relatedLinks: [
      { href: "/hjalp-skatteverket", label: "Hjälp med Skatteverket – gratis mallar" },
      { href: "/mallar-interaktiva", label: "70 interaktiva brevmallar" },
      { href: "/blogg/skatteverket-6-vanliga-situationer", label: "6 vanliga situationer med Skatteverket" },
    ],
  },

  // ================================================================
  // 3. FÖRSÄKRINGSKASSAN – NEKAD ERSÄTTNING
  // ================================================================
  {
    slug: "forsakringskassan-nekad-ersattning",
    title: "Försäkringskassan nekade din ansökan – Så överklagar du | Svar Direkt",
    metaDesc:
      "Fick du avslag från Försäkringskassan? Lär dig hur du begär omprövning eller överklagar – steg för steg med färdigt brev på svenska att kopiera.",
    h1: "Nekad ersättning från Försäkringskassan – Guide för omprövning",
    intro:
      "Att få ett avslag från Försäkringskassan kan kännas orättvist och överväldigande. Kanske fick du nej på sjukpenning, föräldrapenning eller aktivitetsersättning – trots att du verkligen behöver stödet. Det är viktigt att veta att ett avslag aldrig är det sista ordet. Du har rätt att begära omprövning, och många beslut ändras när man klagar på rätt sätt. Den här guiden hjälper dig formulera en tydlig och övertygande begäran.",
    nar: {
      heading: "När uppstår problemet",
      body:
        "Försäkringskassan hanterar ett stort antal förmåner och det händer att beslut fattas på felaktiga grunder – ofta på grund av att handläggaren saknat tillräcklig information. Vanliga situationer när du bör överklaga:",
      bullets: [
        "Du fick avslag på sjukpenning trots läkarintyg",
        "Föräldrapenning nekades eller beräknades fel",
        "Aktivitetsersättning avslogs utan tydlig motivering",
        "Försäkringskassan kräver tillbaka pengar du redan fått (återkrav)",
        "Handläggningstiden är orimligt lång utan besked",
      ],
    },
    vadGoraDu: {
      heading: "Vad kan du göra",
      body:
        "Det första steget är att begära omprövning av beslutet hos Försäkringskassan. Du måste göra det inom två månader från att du fick beslutet. Skriver du ett välformulerat brev med tydliga argument och kompletterande handlingar – till exempel uppdaterat läkarintyg eller annan dokumentation – är chansen god att beslutet ändras. Om omprövningen inte går din väg kan du sedan överklaga till förvaltningsrätten.",
    },
    stegForSteg: [
      "Läs avslagsbeslutet noga – förstå exakt vilken grund Försäkringskassan anger",
      "Kontrollera datum – du har två månader på dig att begära omprövning",
      "Samla kompletterande underlag (t.ex. nytt läkarintyg, specialistutlåtande)",
      "Skriv ett sakligt brev med rubriken 'Begäran om omprövning'",
      "Förklara varför du anser att beslutet är felaktigt – punkt för punkt",
      "Hänvisa till bilagda handlingar som stöder din begäran",
      "Skicka till Försäkringskassan via deras webbplats eller med rekommenderat brev",
    ],
    exempelText: `Till Försäkringskassan

Personnummer: [DITT PERSONNUMMER]
Ärendenummer: [ÄRENDENUMMER FRÅN BESLUTET]

Angående: Begäran om omprövning av beslut daterat [DATUM]

Jag har tagit del av Försäkringskassans beslut daterat [DATUM] där min ansökan om [FÖRMÅN, t.ex. sjukpenning / föräldrapenning] avslogs. Jag begär härmed omprövning av detta beslut.

Jag anser att beslutet är felaktigt av följande skäl:

1. [ANGE SKÄL, t.ex. "Mitt läkarintyg styrker att jag inte kan arbeta mer än 25% på grund av diagnosen X. Handläggaren verkar inte ha beaktat detta fullt ut."]

2. [ANGE YTTERLIGARE SKÄL vid behov]

Som stöd för min begäran bifogar jag:
- Uppdaterat läkarintyg daterat [DATUM]
- [YTTERLIGARE DOKUMENT]

Jag begär att Försäkringskassan omprövar beslutet och beviljar min ansökan om [FÖRMÅN] från och med [DATUM].

Med vänlig hälsning
[DITT FULLSTÄNDIGA NAMN]
[PERSONNUMMER]
[ADRESS]
[TELEFON / E-POST]`,
    exempelNote:
      "Fyll i alla fält markerade med hakparentes. Ju mer konkreta och dokumenterade dina argument är, desto bättre.",
    relatedLinks: [
      { href: "/hjalp-forsakringskassan", label: "Hjälp med Försäkringskassan – gratis mallar" },
      { href: "/verktyg", label: "Juridiska verktyg – överklagande och JO-anmälan" },
      { href: "/blogg/forsakringskassan-aterkrav-fel-2026", label: "Försäkringskassan återkrav 2026 – vad gör du?" },
    ],
  },

  // ================================================================
  // 4. MIGRATIONSVERKET – PROBLEM MED ANSÖKAN
  // ================================================================
  {
    slug: "migrationsverket-ansokan",
    title: "Problem med Migrationsverket – Hur du skriver rätt brev | Svar Direkt",
    metaDesc:
      "Fått avslag eller problem med ansökan hos Migrationsverket? Guide med färdigt brev på svenska – för uppehållstillstånd, arbetstillstånd och mer.",
    h1: "Brev till Migrationsverket – Hjälp med ansökan och avslag",
    intro:
      "Kontakter med Migrationsverket kan vara avgörande för din och din familjs framtid i Sverige. Oavsett om du väntar på beslut om uppehållstillstånd, fått avslag på en ansökan eller behöver komplettera ett ärende – rätt formulering i skrift kan göra stor skillnad. Migrationsverket fattar formella beslut baserade på det du skickar in. Den här guiden hjälper dig kommunicera tydligt och effektivt.",
    nar: {
      heading: "När uppstår problemet",
      body:
        "Problem med Migrationsverket uppstår i många olika sammanhang. De vanligaste situationerna är:",
      bullets: [
        "Du har fått avslag på ansökan om uppehållstillstånd",
        "Din ansökan om arbetstillstånd dröjer eller har avslagits",
        "Migrationsverket begär kompletteringar du inte förstår",
        "Du vill förlänga ett tillstånd som håller på att gå ut",
        "Du vill överklaga ett beslut om utvisning eller avvisning",
        "Handläggningstiden är orimligt lång utan svar",
      ],
    },
    vadGoraDu: {
      heading: "Vad kan du göra",
      body:
        "Om du fått ett negativt beslut från Migrationsverket kan du överklaga till Migrationsdomstolen. Du har normalt tre veckor på dig att överklaga från det datum du fick beslutet. Det är viktigt att vara snabb och att formulera överklagandet tydligt. Om du behöver komplettera din pågående ansökan ska du svara på Migrationsverkets begäran så snabbt och fullständigt som möjligt – ofullständiga kompletteringar är en vanlig orsak till avslag.",
    },
    stegForSteg: [
      "Läs beslutet eller förfrågan noga – notera vilket datum som gäller",
      "Identifiera exakt vad Migrationsverket begär eller på vilken grund de avslog",
      "Samla relevanta handlingar – pass, anställningsavtal, hyresavtal, familjebevis",
      "Skriv ett tydligt brev med rubriken 'Överklagande' eller 'Komplettering av ansökan'",
      "Hänvisa till ärendenummer och ditt namn och personnummer/dossiernummer",
      "Förklara din situation sakligt och bifoga alla begärda dokument",
      "Skicka in via Migrationsverkets e-tjänst eller med rekommenderat brev",
    ],
    exempelText: `Till Migrationsverket

Fullständigt namn: [DITT FULLSTÄNDIGA NAMN]
Dossiernummer / Ärendenummer: [NUMMER FRÅN BREVET]
Personnummer / Födelsedatum: [DITT PERSONNUMMER]

Angående: Överklagande av beslut daterat [DATUM] / Komplettering av ansökan

Jag skriver med anledning av Migrationsverkets beslut daterat [DATUM] där min ansökan om [TILLSTÅNDSTYP, t.ex. uppehållstillstånd / arbetstillstånd] avslogs / begäran om komplettering ställdes.

[VÄLJ ETT ALTERNATIV:]

ALTERNATIV 1 – Överklagande:
Jag överklagar beslutet och yrkar att Migrationsdomstolen beviljar min ansökan. Skälen för min begäran är följande:
[ANGE DINA SKÄL, t.ex. "Jag har bott och arbetat lagligt i Sverige sedan X år. Min arbetsgivare bekräftar att min anställning kvarstår, vilket framgår av bilagt anställningsintyg."]

ALTERNATIV 2 – Komplettering:
Som svar på er begäran om komplettering daterad [DATUM] bifogar jag följande handlingar:
- [DOKUMENT 1]
- [DOKUMENT 2]

Jag hoppas att ni nu har tillräckligt underlag för att fatta ett positivt beslut i mitt ärende.

Med vänlig hälsning
[DITT FULLSTÄNDIGA NAMN]
[ADRESS I SVERIGE]
[TELEFON / E-POST]`,
    exempelNote:
      "Välj rätt alternativ (överklagande eller komplettering) och ta bort det andra. Bifoga alltid kopior av alla relevanta handlingar.",
    relatedLinks: [
      { href: "/hjalp-migrationsverket", label: "Hjälp med Migrationsverket – gratis mallar" },
      { href: "/mallar-interaktiva", label: "70 interaktiva brevmallar" },
      { href: "/blogg/migrationsverket-nya-regler-arbetstillstand-2026", label: "Migrationsverket nya regler 2026" },
    ],
  },
];

export const seoGuidePages = guides.map((g) => ({ slug: g.slug, title: g.title, metaDesc: g.metaDesc }));

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* fallback: select text */
    }
  };
  return (
    <button
      onClick={handle}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
        copied
          ? "bg-green-100 text-green-700 border border-green-200"
          : "bg-primary text-white hover:bg-primary/90"
      }`}
    >
      {copied ? (
        <>✓ Kopierat!</>
      ) : (
        <>📋 Kopiera texten</>
      )}
    </button>
  );
}

export default function SeoGuide({ slug }: { slug: string }) {
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return null;

  const {
    h1, intro, nar, vadGoraDu, stegForSteg, exempelText, exempelNote, relatedLinks,
  } = guide;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">

      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-primary transition-colors">svardirekt.site</Link>
        <span>/</span>
        <span className="text-slate-600">{h1.split(" – ")[0]}</span>
      </nav>

      {/* H1 */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-5 leading-tight">
        {h1}
      </h1>

      {/* Intro */}
      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        {intro}
      </p>

      <hr className="border-slate-100 mb-8" />

      {/* NÄR UPPSTÅR PROBLEMET */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-3">{nar.heading}</h2>
        <p className="text-slate-600 leading-relaxed mb-3">{nar.body}</p>
        {nar.bullets && (
          <ul className="space-y-2">
            {nar.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-600">
                <span className="mt-1 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 font-bold">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* VAD KAN DU GÖRA */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-3">{vadGoraDu.heading}</h2>
        <p className="text-slate-600 leading-relaxed">{vadGoraDu.body}</p>
      </section>

      {/* PRAKTISK LÖSNING STEG FÖR STEG */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Praktisk lösning steg för steg</h2>
        <ol className="space-y-3">
          {stegForSteg.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-slate-600 leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* EXEMPEL PÅ FÄRDIG TEXT */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Exempel på färdig text</h2>
        <p className="text-sm text-slate-500 mb-4">
          Nedan finns ett färdigt brev du kan kopiera och anpassa till din situation.{" "}
          <strong>Ersätt texten inom hakparentes [  ] med dina egna uppgifter.</strong>
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-3">
          <pre className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
            {exempelText}
          </pre>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <CopyButton text={exempelText} />
          <p className="text-xs text-slate-400">{exempelNote}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-7 text-white mb-10">
        <h2 className="text-xl font-bold mb-2">Vill du ha ett brev anpassat för din situation?</h2>
        <p className="text-blue-100 mb-5 leading-relaxed text-sm">
          Exemplet ovan är generellt. Med{" "}
          <Link href="/" className="text-yellow-300 font-semibold underline underline-offset-2 hover:text-yellow-200">
            Svar Direkt
          </Link>{" "}
          kan du använda vår AI-generator för att skapa ett brev helt anpassat efter din specifika situation – på sekunder.
          Inga krångliga juridiska termer, inget konto behövs.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://svardirekt.site"
            className="inline-flex items-center justify-center gap-2 bg-yellow-400 text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition-colors text-sm"
          >
            ✨ Gå till Svar Direkt – prova gratis
          </a>
          <Link
            href="/mallar-interaktiva"
            className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors text-sm"
          >
            📋 Se 70 gratis mallar
          </Link>
        </div>
      </section>

      {/* INTERNA LÄNKAR */}
      <section className="mb-8">
        <h3 className="text-base font-semibold text-slate-700 mb-3">Relaterade sidor</h3>
        <ul className="space-y-2">
          {relatedLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-primary hover:underline text-sm flex items-center gap-1.5"
              >
                <span>→</span>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/" className="text-primary hover:underline text-sm flex items-center gap-1.5">
              <span>→</span>
              Tillbaka till startsidan – svardirekt.site
            </Link>
          </li>
        </ul>
      </section>

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-100 pt-5">
        Informationen på denna sida är allmän och utgör inte juridisk rådgivning. Vid komplexa ärenden rekommenderar vi att du söker professionell juridisk hjälp.{" "}
        <Link href="/" className="text-primary hover:underline">Svar Direkt</Link>{" "}
        hjälper dig formulera meddelanden baserat på din situation.
      </p>
    </div>
  );
}
