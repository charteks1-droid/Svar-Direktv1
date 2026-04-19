import { Link, useRoute } from "wouter";

const DISCLAIMER =
  "Denna tjänst är inte juridisk rådgivning. Vi hjälper till att formulera meddelanden baserat på din situation.";

interface PageData {
  slug: string;
  lang: "sv" | "en" | "pl";
  title: string;
  metaDesc: string;
  h1: string;
  intro: string;
  h2s: { heading: string; body: string }[];
  cta: string;
  ctaNote?: string;
}

const pages: PageData[] = [
  // ===== SWEDISH =====
  {
    slug: "hjalp-kronofogden",
    lang: "sv",
    title: "Hjälp med Kronofogden – få ett färdigt svar",
    metaDesc: "Har du fått brev från Kronofogden? Vi hjälper dig formulera rätt svar. Bestrida skuld, begära avbetalningsplan eller skuldsanering – personlig hjälp på 24 timmar.",
    h1: "Hjälp med Kronofogden – få ett färdigt svar",
    intro: "Har du fått ett betalningsföreläggande, inkassokrav eller annat brev från Kronofogden och vet inte hur du ska svara? Vi formulerar svaret åt dig – korrekt, tydligt och klart att skicka.",
    h2s: [
      { heading: "Vad Kronofogden kan kräva av dig", body: "Kronofogden hanterar skulder, löneutmätning och betalningsförelägganden. Om du inte svarar i tid riskerar du att skulden godkänns automatiskt. Det är viktigt att agera snabbt." },
      { heading: "Vanliga situationer vi hjälper med", body: "Bestrida en okänd skuld. Ansöka om avbetalningsplan. Begära skuldsanering. Svara på ett föreläggande. Vi anpassar svaret efter din specifika situation." },
      { heading: "Så fungerar tjänsten", body: "Du beskriver situationen i formuläret. Inom 24 timmar får du ett färdigt brev på e-post. Första svaret är gratis – fortsättning kostar 99 kr per meddelande." },
    ],
    cta: "Beskriv ditt ärende – första svaret är gratis",
    ctaNote: "Svar inom 24 timmar. Inga förhandskrav.",
  },
  {
    slug: "hjalp-forsakringskassan",
    lang: "sv",
    title: "Hjälp med Försäkringskassan – personligt svar",
    metaDesc: "Nekad sjukpenning, begäran om komplettering eller överklagande? Vi hjälper dig skriva ett korrekt svar till Försäkringskassan. Första svaret gratis.",
    h1: "Hjälp med Försäkringskassan – skriv rätt svar",
    intro: "Brev från Försäkringskassan kan vara svåra att förstå och ännu svårare att svara på. Vi hjälper dig formulera ett professionellt svar – vare sig det gäller sjukpenning, överklagande eller komplettering.",
    h2s: [
      { heading: "Vanliga ärenden hos Försäkringskassan", body: "Begäran om förlängning av sjukpenning. Överklagande av nekad ersättning. Svar på begäran om komplettering. Aktivitetsersättning och rehabilitering." },
      { heading: "Varför svaret är viktigt", body: "Ett vagt eller felaktigt formulerat svar kan leda till att din ansökan avslås. Vi ser till att svaret är korrekt, tydligt och innehåller rätt information." },
      { heading: "Så får du hjälp", body: "Beskriv ditt ärende i formuläret nedan. Du får ett klart svar på e-post inom 24 timmar. Första svaret är alltid gratis." },
    ],
    cta: "Skicka in ditt ärende – gratis",
    ctaNote: "Svar inom 24 timmar.",
  },
  {
    slug: "hjalp-skatteverket",
    lang: "sv",
    title: "Hjälp med Skatteverket – formulera rätt svar",
    metaDesc: "Fråga från Skatteverket, anstånd med skatt eller rättelse av deklaration? Vi hjälper dig skriva ett korrekt och professionellt svar. Första svaret gratis.",
    h1: "Hjälp med Skatteverket – formulera rätt svar",
    intro: "Skatteverket kan ta kontakt om din deklaration, begära komplettering eller utfärda krav. Att svara fel kan bli kostsamt. Vi hjälper dig formulera ett korrekt svar.",
    h2s: [
      { heading: "Vanliga situationer", body: "Svar på förfrågan om skattekontroll. Ansökan om anstånd med betalning. Rättelse av uppgifter i deklaration. Svar på bokföringsgranskning." },
      { heading: "Vikten av korrekt kommunikation", body: "Skatteverket tar beslut baserat på den information du lämnar. Ett välformulerat svar kan göra stor skillnad för utgången av ditt ärende." },
      { heading: "Personlig hjälp – snabbt", body: "Beskriv din situation. Få ett färdigt svar inom 24 timmar. Första svaret är gratis." },
    ],
    cta: "Beskriv din situation – gratis första svar",
  },
  {
    slug: "hjalp-inkasso",
    lang: "sv",
    title: "Hjälp med inkassokrav – bestrida eller svara",
    metaDesc: "Fått ett inkassokrav du inte känner igen? Vi hjälper dig formulera ett korrekt svar eller bestridande. Snabb hjälp – första svaret gratis.",
    h1: "Hjälp med inkassokrav – bestrida eller svara",
    intro: "Inkassokrav kan komma oväntat och vara svåra att hantera. Oavsett om du vill bestrida kravet, begära en avbetalningsplan eller bara förstå brevet – vi hjälper dig.",
    h2s: [
      { heading: "Vad är ett inkassokrav?", body: "Ett inkassokrav är ett krav på betalning som skickas av ett inkassobolag på uppdrag av en borgenär. Du har rätt att bestrida kravet om du anser att det är felaktigt." },
      { heading: "Vad vi hjälper med", body: "Bestridande av okänd skuld. Begäran om betalningsplan. Svar på inkassobolag. Kommunikation med Kronofogden." },
      { heading: "Hur du går tillväga", body: "Fyll i formuläret med dina uppgifter och beskrivning. Få ett färdigt svar på e-post inom 24 timmar. Första svaret är gratis." },
    ],
    cta: "Skicka in ditt ärende nu – gratis",
    ctaNote: "Ingen registrering krävs.",
  },
  {
    slug: "hjalp-migrationsverket",
    lang: "sv",
    title: "Hjälp med Migrationsverket – personlig hjälp",
    metaDesc: "Komplettering av ansökan, förlängning av uppehållstillstånd eller överklagande? Vi hjälper dig formulera ett korrekt svar till Migrationsverket. Första svaret gratis.",
    h1: "Hjälp med Migrationsverket – skriv rätt svar",
    intro: "Kommunikation med Migrationsverket kräver precision och korrekt formalia. Vi hjälper dig formulera ett tydligt, korrekt meddelande – oavsett om det gäller tillstånd, komplettering eller överklagande.",
    h2s: [
      { heading: "Vanliga ärenden", body: "Förlängning av uppehållstillstånd. Komplettering av ansökan. Överklagande av beslut. Svar på förfrågan om ytterligare handlingar." },
      { heading: "Varför rätt formulering är viktigt", body: "Migrationsverket fattar beslut utifrån de uppgifter du lämnar. Ofullständiga eller otydliga svar kan förlänga handläggningstiden eller leda till avslag." },
      { heading: "Snabb personlig hjälp", body: "Beskriv ditt ärende. Få ett färdigt svar inom 24 timmar. Första svaret är gratis." },
    ],
    cta: "Beskriv ditt ärende – gratis",
  },
  {
    slug: "hjalp-arbetsformedlingen",
    lang: "sv",
    title: "Hjälp med Arbetsförmedlingen – formulera ditt svar",
    metaDesc: "Fått brev från Arbetsförmedlingen om a-kassa, aktivitetsrapport eller varning? Vi hjälper dig formulera ett korrekt svar. Första svaret gratis.",
    h1: "Hjälp med Arbetsförmedlingen – skriv rätt",
    intro: "Arbetsförmedlingen kan kräva komplettering, ifrågasätta aktiviteter eller skicka varningar. Vi hjälper dig svara på ett korrekt och professionellt sätt.",
    h2s: [
      { heading: "Vanliga situationer", body: "Svar på varning eller sanktionsbeslut. Komplettering av aktivitetsrapport. Förklaring av sökaktiviteter. Begäran om omprövning." },
      { heading: "Konsekvenser av felaktigt svar", body: "Om du svarar fel eller inte svarar alls riskerar du att förlora ersättning eller bli utförsäkrad. Vi ser till att ditt svar är korrekt formulerat." },
      { heading: "Hur vi hjälper", body: "Beskriv situationen i formuläret. Få ett klart svar inom 24 timmar. Gratis första gången." },
    ],
    cta: "Skicka in din fråga – gratis",
  },
  {
    slug: "skriv-brev-myndighet",
    lang: "sv",
    title: "Skriv brev till myndighet – personlig hjälp på svenska",
    metaDesc: "Hjälp med att skriva brev till svenska myndigheter. Korrekt, formell svenska. Kronofogden, Skatteverket, Försäkringskassan och mer. Första svaret gratis.",
    h1: "Hjälp att skriva brev till svenska myndigheter",
    intro: "Myndighetsbrev kräver ett visst språk och en viss struktur. Om du är osäker på hur du ska formulera dig – vi hjälper dig skriva ett tydligt, korrekt och professionellt brev.",
    h2s: [
      { heading: "Vilka myndigheter hjälper vi med?", body: "Kronofogden, Skatteverket, Försäkringskassan, Migrationsverket, Arbetsförmedlingen, Socialtjänsten, Kommunala myndigheter och inkassobolag." },
      { heading: "Vad ingår i hjälpen?", body: "Du beskriver din situation. Vi skriver ett brev anpassat till myndigheten. Korrekt ton, rätt struktur och juridiskt lagom formulerat – utan att vara juridisk rådgivning." },
      { heading: "Pris och tid", body: "Första svaret är gratis. Ytterligare svar kostar 99 kr per meddelande. Leverans inom 24 timmar via e-post." },
    ],
    cta: "Beskriv ditt ärende – gratis",
    ctaNote: "Svar inom 24 timmar.",
  },
  {
    slug: "svar-myndighet-svenska",
    lang: "sv",
    title: "Svar till myndighet på svenska – hjälp att formulera",
    metaDesc: "Behöver du formulera ett svar till en svensk myndighet? Vi hjälper dig med rätt ton och struktur. Första svaret är gratis. Svar inom 24 timmar.",
    h1: "Svar till myndighet på svenska – personlig hjälp",
    intro: "Att formulera ett svar till en myndighet kan kännas överväldigande. Med rätt ord och rätt struktur ökar dina chanser att bli bemött på rätt sätt. Vi skriver svaret åt dig.",
    h2s: [
      { heading: "Rätt ton mot myndigheter", body: "Svenska myndigheter förväntar sig ett formellt, sakligt och välstrukturerat svar. Varken för aggressivt eller för passivt. Vi vet hur det ska låta." },
      { heading: "Vad vi behöver från dig", body: "Beskriv situationen: vilket brev du fått, vad myndigheten vill ha, och vad du vill uppnå. Vi tar hand om resten." },
      { heading: "Snabbt och enkelt", body: "Fyll i formuläret. Få svaret inom 24 timmar. Inga förhandskostnader – första svaret är alltid gratis." },
    ],
    cta: "Skicka in din situation – gratis",
  },

  // ===== ENGLISH =====
  {
    slug: "help-swedish-authority",
    lang: "en",
    title: "Help responding to Swedish authorities – personal service",
    metaDesc: "Need help writing a letter to a Swedish authority? Kronofogden, Skatteverket, Försäkringskassan and more. First response free. Reply within 24 hours.",
    h1: "Help responding to Swedish authorities",
    intro: "Received a letter from a Swedish authority and unsure how to respond? We help you compose a clear, correct and professional reply – in Swedish. First response is free.",
    h2s: [
      { heading: "Which authorities do we help with?", body: "Kronofogden (debt enforcement), Skatteverket (tax agency), Försäkringskassan (social insurance), Migrationsverket (migration agency), Arbetsförmedlingen (employment agency) and debt collectors." },
      { heading: "How it works", body: "You describe your situation in the form. We review it and compose a proper reply in formal Swedish. You receive the finished letter by email within 24 hours." },
      { heading: "Pricing", body: "The first response is completely free. Any further replies cost 99 SEK each. No subscription, no login required." },
    ],
    cta: "Submit your case – first response free",
    ctaNote: "Reply within 24 hours. No registration required.",
  },
  {
    slug: "swedish-government-letter-help",
    lang: "en",
    title: "Swedish government letter writing help – personal assistance",
    metaDesc: "We write formal letters to Swedish government agencies for you. Dispute a debt, appeal a decision, respond to a tax query. First reply free.",
    h1: "Swedish government letter writing – personal help",
    intro: "Writing to Swedish government agencies requires specific language and structure. Whether you're disputing a debt, appealing a decision or answering a tax query – we write the letter for you.",
    h2s: [
      { heading: "Common situations we help with", body: "Disputing a debt at Kronofogden. Appealing a denied benefit from Försäkringskassan. Responding to a tax inquiry from Skatteverket. Replying to Migrationsverket about a permit." },
      { heading: "Why correct language matters", body: "Swedish authorities make decisions based on what you write. A poorly worded response can lead to rejection or delays. We ensure your letter has the right tone and content." },
      { heading: "Simple process", body: "Fill in the form with your situation. Receive a ready-to-send letter within 24 hours. First response is always free." },
    ],
    cta: "Get help now – first response free",
    ctaNote: "No registration, no subscription.",
  },

  // ===== POLISH =====
  {
    slug: "pomoc-urzad-szwecja",
    lang: "pl",
    title: "Pomoc z pismem do szwedzkiego urzędu – osobista obsługa",
    metaDesc: "Otrzymałeś pismo od szwedzkiego urzędu i nie wiesz jak odpowiedzieć? Pomagamy w sformułowaniu poprawnej odpowiedzi. Pierwsza odpowiedź gratis. Odpowiedź w 24 godziny.",
    h1: "Pomoc z pismem do szwedzkiego urzędu",
    intro: "Otrzymałeś pismo od Kronofogden, Skatteverket, Försäkringskassan lub innego szwedzkiego urzędu? Pomagamy sformułować poprawną i profesjonalną odpowiedź po szwedzku – szybko i bez konieczności rejestracji.",
    h2s: [
      { heading: "Z jakimi urzędami pomagamy?", body: "Kronofogden (komornik), Skatteverket (urząd skarbowy), Försäkringskassan (ubezpieczenia społeczne), Migrationsverket (urząd ds. migracji), Arbetsförmedlingen (urząd pracy) oraz firmy windykacyjne." },
      { heading: "Jak to działa?", body: "Opisujesz swoją sytuację w formularzu poniżej. W ciągu 24 godzin otrzymujesz gotowe pismo na swój adres e-mail. Pierwsze pismo jest bezpłatne." },
      { heading: "Cena", body: "Pierwsza odpowiedź jest całkowicie bezpłatna. Każde kolejne pismo kosztuje 99 SEK. Bez abonamentu, bez rejestracji." },
    ],
    cta: "Wyślij swoje pytanie – pierwsza odpowiedź gratis",
    ctaNote: "Odpowiedź w ciągu 24 godzin.",
  },
];

function SeoPage({ data }: { data: PageData }) {
  const isEn = data.lang === "en";
  const isPl = data.lang === "pl";

  return (
    <>
      <head>
        <title>{data.title} | Svar Direkt</title>
        <meta name="description" content={data.metaDesc} />
        <meta name="robots" content="index, follow" />
      </head>

      {/* Hero */}
      <section className="bg-gradient-to-b from-sky-50 to-white border-b border-slate-100 py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            {isEn ? "Personal help" : isPl ? "Pomoc osobista" : "Personlig hjälp"}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
            {data.h1}
          </h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto mb-6">
            {data.intro}
          </p>
          <a
            href="/tjanst#formular"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white rounded-xl font-bold text-base hover:bg-primary/90 transition-colors shadow-md"
          >
            {data.cta}
          </a>
          {data.ctaNote && (
            <p className="text-xs text-slate-400 mt-2">{data.ctaNote}</p>
          )}
        </div>
      </section>

      {/* Content sections */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-2xl mx-auto space-y-8">
          {data.h2s.map((s) => (
            <div key={s.heading}>
              <h2 className="text-lg font-bold text-slate-900 mb-2">{s.heading}</h2>
              <p className="text-slate-600 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA block */}
      <section className="bg-primary/5 border-y border-primary/10 py-10 px-4">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-slate-700 font-semibold mb-2">
            {isEn ? "✅ First response free · 99 SEK per additional reply" :
             isPl ? "✅ Pierwsza odpowiedź gratis · 99 SEK za kolejne pismo" :
             "✅ Första svaret gratis · 99 kr per ytterligare svar"}
          </p>
          <p className="text-slate-500 text-sm mb-5">
            {isEn ? "Reply within 24 hours. No login required." :
             isPl ? "Odpowiedź w 24 godziny. Bez rejestracji." :
             "Svar inom 24 timmar. Inget konto krävs."}
          </p>
          <a
            href="/tjanst#formular"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-md"
          >
            {data.cta} →
          </a>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-white border-t border-slate-100 py-5 px-4">
        <p className="max-w-xl mx-auto text-xs text-slate-400 text-center leading-relaxed">
          ⚠️ {DISCLAIMER}
        </p>
      </div>

      <div className="py-4 px-4 text-center">
        <Link href="/" className="text-sm text-primary underline hover:no-underline">
          ← {isEn ? "Back to home" : isPl ? "Powrót do strony głównej" : "Tillbaka till startsidan"}
        </Link>
      </div>
    </>
  );
}

export default function SeoLanding({ slug }: { slug?: string }) {
  const data = pages.find((p) => p.slug === slug);
  if (!data) return <div className="p-10 text-center text-slate-400">Sidan hittades inte.</div>;
  return <SeoPage data={data} />;
}

export { pages as seoPages };
