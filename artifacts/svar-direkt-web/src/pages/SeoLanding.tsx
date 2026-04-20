import { Link } from "wouter";

const DISCLAIMER =
  "Denna tjänst är inte juridisk rådgivning. Vi hjälper till att formulera meddelanden baserat på din situation.";

interface Faq { q: string; a: string }

interface PageData {
  slug: string;
  lang: "sv" | "en" | "pl";
  title: string;
  metaDesc: string;
  h1: string;
  intro: string;
  h2s: { heading: string; body: string }[];
  faq: Faq[];
  cta: string;
  ctaNote?: string;
  relatedLinks?: { href: string; label: string }[];
}

const pages: PageData[] = [
  // ===== SWEDISH =====
  {
    slug: "hjalp-kronofogden",
    lang: "sv",
    title: "Hjälp med Kronofogden – bestrida skuld, avbetalningsplan | Svar Direkt",
    metaDesc: "Fått brev från Kronofogden? Vi formulerar rätt svar åt dig. Bestrida skuld, avbetalningsplan eller skuldsanering – personlig hjälp. Första svaret gratis.",
    h1: "Hjälp med Kronofogden – vi formulerar svaret åt dig",
    intro: "Har du fått ett betalningsföreläggande, inkassokrav eller annat brev från Kronofogden och vet inte hur du ska svara? Att ignorera brevet är det värsta du kan göra – skulden godkänns automatiskt om du inte agerar inom fristen. Vi hjälper dig formulera rätt svar: korrekt, tydligt och klart att skicka.",
    h2s: [
      {
        heading: "Vad Kronofogden kan kräva av dig",
        body: "Kronofogden hanterar skulder, löneutmätning, betalningsförelägganden och utmätning av tillgångar. Om du inte svarar på ett betalningsföreläggande inom fristen – vanligtvis två till tre veckor – godkänns skulden automatiskt och Kronofogden kan börja med utmätning. Det är därför viktigt att agera snabbt och korrekt redan från första kontakten."
      },
      {
        heading: "Vanliga situationer vi hjälper med",
        body: "Vi hjälper med bestridande av okänd eller felaktig skuld, ansökan om avbetalningsplan, begäran om skuldsanering, svar på föreläggande om löneutmätning och kommunikation kring utmätning av bostad eller fordon. Oavsett om du vill bestrida hela skulden eller bara behöver mer tid att betala – vi anpassar svaret exakt efter din situation."
      },
      {
        heading: "Varför rätt formulering är avgörande",
        body: "Kronofogden är en myndighet som fattar formella beslut baserat på vad du skriver. Ett otydligt, aggressivt eller inkomplett svar kan försvaga din position. Vi vet vilken ton och vilka argument som fungerar – och formulerar svaret på ett sätt som ger dig bästa möjliga utgång."
      },
      {
        heading: "Så fungerar tjänsten",
        body: "Du fyller i formuläret nedan och beskriver din situation – vilket brev du fått, vad Kronofogden kräver och vad du vill uppnå. Inom 24 timmar får du ett färdigt brev på e-post som du kan kopiera och skicka direkt. Första svaret är alltid gratis. Ytterligare hjälp kostar 99 kr per meddelande."
      },
    ],
    faq: [
      { q: "Vad gör jag om jag fått ett betalningsföreläggande från Kronofogden?", a: "Du måste bestrida kravet inom den tid som anges i brevet – vanligtvis 10–14 dagar. Om du inte svarar godkänns skulden automatiskt. Fyll i formuläret så hjälper vi dig formulera ett korrekt bestridande direkt." },
      { q: "Kan jag begära avbetalningsplan hos Kronofogden?", a: "Ja. Kronofogden kan bevilja avbetalningsplaner, men du behöver visa att du inte kan betala hela beloppet på en gång. Vi hjälper dig skriva ansökan med rätt formulering och realistiska belopp." },
      { q: "Hur snabbt svarar ni?", a: "Inom 24 timmar via e-post. Du behöver inte skapa ett konto. Fyll i formuläret och vänta på ditt färdiga brev." },
      { q: "Vad kostar tjänsten?", a: "Första svaret är helt gratis. Ytterligare svar kostar 99 kr per meddelande, fakturerat via Payhip. Inget abonnemang, inga dolda avgifter." },
    ],
    cta: "Beskriv ditt ärende – första svaret är gratis",
    ctaNote: "Svar inom 24 timmar. Inget konto krävs.",
    relatedLinks: [
      { href: "/blogg/svara-pa-krav-fran-kronofogden", label: "Läs: Hur svarar man på krav från Kronofogden?" },
      { href: "/blogg/bestrida-kronofogden", label: "Läs: Bestrida Kronofogden – steg för steg" },
      { href: "/mallar", label: "Se gratis brevmallar till Kronofogden" },
    ],
  },
  {
    slug: "hjalp-forsakringskassan",
    lang: "sv",
    title: "Hjälp med Försäkringskassan – överklagande och komplettering | Svar Direkt",
    metaDesc: "Nekad sjukpenning, överklagande eller begäran om komplettering? Vi skriver rätt svar till Försäkringskassan. Personlig hjälp – första svaret gratis.",
    h1: "Hjälp med Försäkringskassan – skriv rätt svar",
    intro: "Brev från Försäkringskassan kan vara svåra att förstå och ännu svårare att svara på rätt. Oavsett om du fått ett avslag, en begäran om komplettering eller ett återkrav – ett välformulerat svar kan göra stor skillnad för hur ditt ärende avgörs. Vi hjälper dig formulera ett professionellt svar inom 24 timmar.",
    h2s: [
      {
        heading: "Vanliga ärenden hos Försäkringskassan",
        body: "Försäkringskassan hanterar sjukpenning, föräldrapenning, aktivitetsersättning, bostadsbidrag och många andra förmåner. Vanliga situationer som kräver ett välformulerat svar inkluderar: begäran om förlängning av sjukpenning, överklagande av nekad ersättning, svar på begäran om komplettering, och svar på återkrav av felaktigt utbetalt stöd."
      },
      {
        heading: "Varför svaret är viktigt",
        body: "Försäkringskassan fattar sina beslut utifrån den information du lämnar. Ett vagt eller felaktigt formulerat svar kan leda till att din ansökan avslås, att ett återkrav godkänns utan prövning, eller att handläggningstiden förlängs i onödan. Vi ser till att svaret är komplett, korrekt och innehåller de argument och uppgifter som ökar dina chanser."
      },
      {
        heading: "Överklagande och omprövning",
        body: "Om du fått ett beslut du inte är nöjd med har du rätt att begära omprövning inom tre veckor. Omprövningen görs av en annan handläggare på Försäkringskassan. Om du fortfarande inte är nöjd kan du överklaga till förvaltningsrätten. Vi hjälper dig formulera omprövningsbegäran eller överklagandet med rätt ton och relevanta argument."
      },
      {
        heading: "Så får du hjälp",
        body: "Beskriv ditt ärende i formuläret – vilket beslut du fått, vilken förmån det gäller, och vad du vill uppnå. Du får ett klart och färdigt svar på e-post inom 24 timmar. Första svaret är alltid gratis."
      },
    ],
    faq: [
      { q: "Hur överklagar jag ett beslut från Försäkringskassan?", a: "Du begär omprövning skriftligt inom tre veckor från beslutet. Ange ärendenummer och förklara tydligt varför du anser att beslutet är felaktigt. Vi hjälper dig formulera en stark omprövningsbegäran." },
      { q: "Försäkringskassan begär komplettering – vad ska jag skriva?", a: "Svara exakt på det de efterfrågar och bifoga alla relevanta handlingar. Ett ofullständigt svar kan leda till avslag. Vi hjälper dig formulera ett komplett och korrekt svar." },
      { q: "Hur lång tid tar det att få hjälp?", a: "Du får ditt färdiga svar inom 24 timmar via e-post. Inget konto krävs – fyll i formuläret och du är klar." },
      { q: "Gäller hjälpen också aktivitetsersättning och föräldrapenning?", a: "Ja, vi hjälper med alla typer av ärenden hos Försäkringskassan – sjukpenning, aktivitetsersättning, föräldrapenning, återkrav och mer." },
    ],
    cta: "Skicka in ditt ärende – gratis",
    ctaNote: "Svar inom 24 timmar.",
    relatedLinks: [
      { href: "/blogg/overklaga-forsakringskassan-mall", label: "Läs: Överklaga Försäkringskassan – gratis mall" },
      { href: "/blogg/aterkrav-forsakringskassan-vad-gor-jag", label: "Läs: Återkrav från Försäkringskassan" },
      { href: "/mallar", label: "Se gratis brevmallar till Försäkringskassan" },
    ],
  },
  {
    slug: "hjalp-skatteverket",
    lang: "sv",
    title: "Hjälp med Skatteverket – rättelse, anstånd och svar | Svar Direkt",
    metaDesc: "Fråga om deklaration, skattekontroll eller begäran om komplettering från Skatteverket? Vi formulerar ett korrekt svar. Första svaret gratis.",
    h1: "Hjälp med Skatteverket – formulera rätt svar",
    intro: "Skatteverket kan ta kontakt om din deklaration, begära komplettering, utfärda skattetillägg eller inleda en granskning. Att svara fel – eller inte svara alls – kan leda till onödiga kostnader och skattetillägg. Vi hjälper dig formulera ett korrekt och välstrukturerat svar.",
    h2s: [
      {
        heading: "Vanliga situationer med Skatteverket",
        body: "Svar på förfrågan om skattekontroll eller granskning. Ansökan om anstånd med betalning av skatt. Rättelse av uppgifter i deklaration. Svar på begäran om komplettering av momsredovisning. Begäran om omprövning av skattetillägg. Vi hjälper med alla dessa situationer."
      },
      {
        heading: "Vikten av korrekt kommunikation",
        body: "Skatteverket fattar sina beslut baserat exakt på den information du lämnar. En oklar formulering kan leda till att ett skattetillägg kvarstår, att en granskning utökas, eller att en återbetalning nekas. Vi vet hur myndigheten kommunicerar och formulerar svaret med rätt detaljer och rätt ton."
      },
      {
        heading: "Anstånd och betalningsproblem",
        body: "Om du inte kan betala din skatt i tid kan du ansöka om anstånd. Skatteverket beviljar anstånd om du kan visa att betalningsproblemen är temporära och ofrivilliga. Vi hjälper dig formulera en övertygande ansökan med rätt argument."
      },
      {
        heading: "Personlig hjälp – snabbt och enkelt",
        body: "Beskriv din situation i formuläret – vilket brev du fått, vad Skatteverket vill ha, och vad du vill uppnå. Få ett färdigt svar inom 24 timmar. Första svaret är gratis."
      },
    ],
    faq: [
      { q: "Skatteverket granskar min deklaration – vad gör jag?", a: "Svara sakligt och bifoga de handlingar de efterfrågar. Undvik att ge mer information än vad som efterfrågas. Vi hjälper dig formulera ett tydligt svar." },
      { q: "Hur ansöker jag om anstånd med skatt?", a: "Skicka en skriftlig begäran till Skatteverket där du förklarar varför du behöver mer tid och hur du planerar att betala. Vi hjälper dig skriva ansökan korrekt." },
      { q: "Kan jag rätta ett fel i deklarationen?", a: "Ja, du kan begära omprövning av ett beslut inom fem år. Vi hjälper dig formulera rättelsen och ansökan om omprövning." },
      { q: "Hur snabbt får jag hjälp?", a: "Inom 24 timmar via e-post. Första svaret är alltid gratis." },
    ],
    cta: "Beskriv din situation – gratis första svar",
    relatedLinks: [
      { href: "/blogg/skatteverket-6-vanliga-situationer", label: "Läs: 6 vanliga situationer med Skatteverket" },
      { href: "/mallar", label: "Se gratis brevmallar till Skatteverket" },
    ],
  },
  {
    slug: "hjalp-inkasso",
    lang: "sv",
    title: "Hjälp med inkassokrav – bestrida eller avbetalning | Svar Direkt",
    metaDesc: "Fått ett inkassokrav du inte känner igen? Vi hjälper dig formulera ett korrekt bestridande eller begäran om avbetalning. Första svaret gratis.",
    h1: "Hjälp med inkassokrav – bestrida eller svara",
    intro: "Inkassokrav kan komma oväntat och vara svåra att hantera. Oavsett om du vill bestrida kravet för att du inte känner igen skulden, begära en avbetalningsplan för att du inte kan betala allt på en gång, eller bara förstå vad brevet egentligen kräver av dig – vi hjälper dig formulera rätt svar.",
    h2s: [
      {
        heading: "Vad är ett inkassokrav?",
        body: "Ett inkassokrav är ett krav på betalning som skickas av ett inkassobolag på uppdrag av en borgenär – exempelvis ett telekombolag, en bank eller en webbutik. Du har alltid rätt att bestrida kravet om du anser att det är felaktigt, okänt eller preskriberat. Inkassobolaget är skyldigt att kunna styrka fordran med dokumentation."
      },
      {
        heading: "Vad vi hjälper med",
        body: "Bestridande av okänd eller felaktig skuld. Begäran om specificerat kontoutdrag och underlag. Förhandling om avbetalningsplan. Svar när inkassobolaget hotar med Kronofogden. Kommunikation vid skuld som riskerar att preskriberas. Vi anpassar svaret till din specifika situation."
      },
      {
        heading: "Vad händer om du inte svarar?",
        body: "Om du ignorerar ett inkassokrav kan inkassobolaget ansöka om betalningsföreläggande hos Kronofogden. Om du inte bestrider hos Kronofogden heller, godkänns skulden automatiskt och kan leda till löneutmätning eller utmätning av tillgångar. Det är viktigt att agera – även om du inte kan betala."
      },
      {
        heading: "Hur du går tillväga",
        body: "Fyll i formuläret med dina uppgifter och beskriv situationen – vilket inkassobolag, vilket belopp och vad du vill uppnå. Få ett färdigt svar på e-post inom 24 timmar. Första svaret är gratis."
      },
    ],
    faq: [
      { q: "Hur bestrider jag ett inkassokrav?", a: "Skicka ett skriftligt bestridande till inkassobolaget inom den angivna fristen och förklara varför du inte anser att skulden är korrekt. Vi hjälper dig formulera bestridandet korrekt." },
      { q: "Vad händer om jag inte svarar på inkassokravet?", a: "Inkassobolaget kan ansöka om betalningsföreläggande hos Kronofogden, vilket kan leda till utmätning. Det är viktigt att agera snabbt, även om du inte tänker betala." },
      { q: "Kan jag begära avbetalningsplan direkt med inkassobolaget?", a: "Ja, de flesta inkassobolag godtar avbetalningsplaner om du hör av dig i tid. Vi hjälper dig formulera en begäran med rimliga villkor." },
      { q: "Kostar det något att få hjälp?", a: "Första svaret är gratis. Ytterligare hjälp kostar 99 kr per meddelande." },
    ],
    cta: "Skicka in ditt ärende nu – gratis",
    ctaNote: "Ingen registrering krävs.",
    relatedLinks: [
      { href: "/hjalp-kronofogden", label: "Hjälp med Kronofogden" },
      { href: "/mallar", label: "Se gratis brevmallar" },
    ],
  },
  {
    slug: "hjalp-migrationsverket",
    lang: "sv",
    title: "Hjälp med Migrationsverket – uppehållstillstånd och överklagande | Svar Direkt",
    metaDesc: "Komplettering, förlängning av uppehållstillstånd eller överklagande? Vi formulerar rätt svar till Migrationsverket. Första svaret gratis.",
    h1: "Hjälp med Migrationsverket – skriv rätt svar",
    intro: "Kommunikation med Migrationsverket kräver precision, korrekt formalia och rätt ton. Fel formulering eller ofullständig information kan leda till försenad handläggning, onödig kompletteringsbegäran eller i värsta fall avslag. Vi hjälper dig formulera ett tydligt och korrekt meddelande – oavsett om det gäller tillstånd, komplettering eller överklagande.",
    h2s: [
      {
        heading: "Vanliga ärenden hos Migrationsverket",
        body: "Förlängning av uppehållstillstånd och arbetstillstånd. Komplettering av pågående ansökan. Överklagande av avslagsbeslut till Migrationsdomstolen. Svar på förfrågan om ytterligare handlingar. Ansökan om medborgarskap. Begäran om skyndsam handläggning."
      },
      {
        heading: "Varför rätt formulering är viktigt",
        body: "Migrationsverket fattar beslut utifrån de uppgifter du lämnar och de handlingar du bifogar. Ofullständiga eller otydliga svar kan förlänga handläggningstiden med månader. Vi ser till att ditt svar är komplett, tydligt och innehåller exakt det Migrationsverket behöver för att fatta ett snabbt och korrekt beslut."
      },
      {
        heading: "Överklagande av avslagsbeslut",
        body: "Om Migrationsverket avslår din ansökan har du rätt att överklaga till Migrationsdomstolen inom tre veckor från beslutet. Ett överklagande måste vara välformulerat och tydligt visa varför beslutet är felaktigt. Vi hjälper dig formulera en stark och strukturerad överklagandeskrift."
      },
      {
        heading: "Snabb personlig hjälp",
        body: "Beskriv ditt ärende i formuläret nedan – vilket beslut eller krav du fått och vad du vill uppnå. Få ett färdigt svar inom 24 timmar. Första svaret är gratis."
      },
    ],
    faq: [
      { q: "Migrationsverket begär komplettering – vad ska jag skicka?", a: "Svara exakt på det de efterfrågar och inkludera alla relevanta handlingar. Vi hjälper dig formulera ett komplett och tydligt kompletteringssvar." },
      { q: "Hur överklagar jag ett avslagsbeslut från Migrationsverket?", a: "Överklagandet skickas till Migrationsverket inom tre veckor – de vidarebefordrar det till Migrationsdomstolen. Vi hjälper dig formulera överklagandeskriften." },
      { q: "Kan ni hjälpa med ansökan om förlängning av uppehållstillstånd?", a: "Ja, vi hjälper dig skriva följebrev och kompletterande information till din förlängningsansökan." },
      { q: "Hur snabbt får jag svar?", a: "Inom 24 timmar via e-post. Första hjälpen är gratis." },
    ],
    cta: "Beskriv ditt ärende – gratis",
    relatedLinks: [
      { href: "/mallar", label: "Se gratis mallar till Migrationsverket" },
    ],
  },
  {
    slug: "hjalp-arbetsformedlingen",
    lang: "sv",
    title: "Hjälp med Arbetsförmedlingen – varning, a-kassa och aktivitetsrapport | Svar Direkt",
    metaDesc: "Fått varning eller sanktionsbeslut från Arbetsförmedlingen? Vi hjälper dig formulera rätt svar. Skydda din a-kassa. Första svaret gratis.",
    h1: "Hjälp med Arbetsförmedlingen – skriv rätt",
    intro: "Arbetsförmedlingen kan kräva komplettering, ifrågasätta dina aktiviteter, skicka varningar eller fatta sanktionsbeslut som påverkar din a-kassa. Att svara fel eller inte svara alls riskerar att du förlorar hela din ersättning. Vi hjälper dig svara på ett korrekt och professionellt sätt – och skydda din ekonomi.",
    h2s: [
      {
        heading: "Vanliga situationer med Arbetsförmedlingen",
        body: "Svar på varning om bristande sökaktiviteter. Begäran om omprövning av sanktionsbeslut. Förklaring och komplettering av aktivitetsrapport. Svar på utförsäkringsbeslut. Kommunikation kring etableringsplan eller jobb- och utvecklingsgarantin."
      },
      {
        heading: "Konsekvenser av felaktigt svar",
        body: "Om du svarar fel på en varning eller inte svarar alls riskerar du att bli avstängd från a-kassan under en period eller permanent utförsäkrad. Det är inte ovanligt att beslut tas på bristande underlag – och då är ett välformulerat svar din bästa chans att ändra utgången."
      },
      {
        heading: "Aktivitetsrapporten – vad ska du skriva?",
        body: "Arbetsförmedlingen kräver att du rapporterar dina jobbsökningsaktiviteter varje månad. Om aktiviteterna bedöms som otillräckliga kan du få en varning. Vi hjälper dig formulera aktivitetsrapporten på ett sätt som uppfyller kraven och undviker onödiga varningar."
      },
      {
        heading: "Hur vi hjälper",
        body: "Beskriv situationen i formuläret – vilket beslut eller krav du fått och vad du vill uppnå. Få ett klart svar inom 24 timmar. Gratis första gången."
      },
    ],
    faq: [
      { q: "Fick en varning från Arbetsförmedlingen – vad gör jag?", a: "Svara skriftligt och förklara din situation – varför aktiviteterna såg ut som de gjorde och vad du gör framöver. Vi hjälper dig formulera ett svar som minimerar risken för sanktion." },
      { q: "Kan jag överklaga ett sanktionsbeslut om a-kassan?", a: "Ja, du kan begära omprövning hos a-kassan inom tre månader. Om du fortfarande inte är nöjd kan du överklaga till allmän förvaltningsdomstol. Vi hjälper dig formulera begäran." },
      { q: "Vad skriver jag i aktivitetsrapporten?", a: "Beskriv konkreta aktiviteter: ansökningar, nätverkande, utbildningar. Vi hjälper dig formulera rapporten på ett sätt som uppfyller kraven." },
      { q: "Hur snabbt får jag hjälp?", a: "Inom 24 timmar. Första svaret är alltid gratis." },
    ],
    cta: "Skicka in din fråga – gratis",
    relatedLinks: [
      { href: "/mallar", label: "Se gratis mallar" },
    ],
  },
  {
    slug: "skriv-brev-myndighet",
    lang: "sv",
    title: "Skriv brev till myndighet på svenska – personlig hjälp | Svar Direkt",
    metaDesc: "Hjälp med att skriva formella brev till svenska myndigheter. Korrekt ton och struktur. Kronofogden, Skatteverket, Försäkringskassan m.fl. Första svaret gratis.",
    h1: "Hjälp att skriva brev till svenska myndigheter",
    intro: "Myndighetsbrev kräver ett visst språk, en viss struktur och rätt ton. För många – särskilt de som inte har svenska som modersmål eller som sällan skriver formella brev – kan det vara svårt att veta hur ett brev ska se ut. Vi hjälper dig skriva ett tydligt, korrekt och professionellt brev till vilken myndighet som helst.",
    h2s: [
      {
        heading: "Vilka myndigheter hjälper vi med?",
        body: "Kronofogden, Skatteverket, Försäkringskassan, Migrationsverket, Arbetsförmedlingen, Socialtjänsten, Boverket, kommunala myndigheter, hyresvärdar via Hyres­nämnden och inkassobolag. Om du är osäker – beskriv din situation så bedömer vi vilken myndighet det gäller."
      },
      {
        heading: "Vad ingår i hjälpen?",
        body: "Du beskriver din situation med egna ord – på svenska, engelska eller polska. Vi skriver ett formellt brev anpassat till myndigheten med korrekt ton, rätt struktur och de argument som ger dig bäst möjlighet. Brevet levereras klart att kopiera och skicka."
      },
      {
        heading: "Rätt ton – varken för mjuk eller för hård",
        body: "Svenska myndigheter förväntar sig ett sakligt, välstrukturerat och neutralt tonläge. Allt för emotionellt eller aggressivt bemöts sällan väl. För passivt och vagt svar ger inte de uppgifter myndigheten behöver. Vi skriver i rätt register – precist och professionellt."
      },
      {
        heading: "Pris och leveranstid",
        body: "Första svaret är alltid gratis. Ytterligare svar kostar 99 kr per meddelande. Leverans inom 24 timmar via e-post. Ingen registrering krävs."
      },
    ],
    faq: [
      { q: "Hur ska ett brev till en myndighet vara formulerat?", a: "Myndighetsbrev ska vara sakliga, tydliga och välstrukturerade. Ange alltid personnummer och ärendenummer om det finns. Undvik känsloladdade formuleringar – håll det faktabaserat." },
      { q: "Vilka myndigheter kan ni hjälpa med?", a: "Kronofogden, Skatteverket, Försäkringskassan, Migrationsverket, Arbetsförmedlingen, Socialtjänsten, kommunala myndigheter och inkassobolag." },
      { q: "Behöver jag skapa ett konto?", a: "Nej, du fyller bara i formuläret och anger din e-post. Ingen registrering krävs." },
      { q: "Hur lång tid tar det?", a: "Svar inom 24 timmar. Första brevet är gratis." },
    ],
    cta: "Beskriv ditt ärende – gratis",
    ctaNote: "Svar inom 24 timmar.",
    relatedLinks: [
      { href: "/mallar", label: "Se 12 gratis brevmallar" },
      { href: "/tjanst", label: "Personlig hjälp – tjänsten" },
    ],
  },
  {
    slug: "svar-myndighet-svenska",
    lang: "sv",
    title: "Svar till myndighet på svenska – hjälp att formulera rätt | Svar Direkt",
    metaDesc: "Behöver du formulera ett svar till en svensk myndighet? Vi skriver det åt dig med rätt ton och struktur. Personlig hjälp – första svaret gratis.",
    h1: "Svar till myndighet på svenska – personlig hjälp",
    intro: "Att formulera ett svar till en myndighet kan kännas överväldigande – vad ska man skriva, vad ska man inte skriva, och hur formellt ska det vara? Med rätt ord och rätt struktur ökar dina chanser att bli bemött på rätt sätt och att ditt ärende avgörs till din fördel. Vi skriver svaret åt dig.",
    h2s: [
      {
        heading: "Rätt ton mot myndigheter",
        body: "Svenska myndigheter förväntar sig ett formellt, sakligt och välstrukturerat svar. Varken för aggressivt eller för passivt. Tonläget ska visa att du tar ärendet på allvar och att du är samarbetsvillig – utan att du ger bort mer information än nödvändigt. Vi vet precis hur det ska låta."
      },
      {
        heading: "Vad vi behöver från dig",
        body: "Beskriv situationen med egna ord: vilket brev du fått, vad myndigheten vill ha, och vad du vill uppnå. Du behöver inte skriva perfekt – vi hanterar formuleringen. Ju mer detaljer du ger, desto mer träffsäkert blir svaret."
      },
      {
        heading: "Ärenden vi hanterar",
        body: "Överklaganden, omprövningar, kompletteringar, bestridanden, ansökningar om anstånd eller avbetalningsplan, svar på granskningar, och rent informativa förfrågningar. Oavsett typ av ärende och myndighet – vi hjälper dig."
      },
      {
        heading: "Snabbt och enkelt",
        body: "Fyll i formuläret. Beskriv situationen. Få ett färdigt svar på e-post inom 24 timmar. Inga förhandskostnader – första svaret är alltid gratis."
      },
    ],
    faq: [
      { q: "Varför är det viktigt att svara myndigheter korrekt?", a: "Myndigheter fattar beslut baserat på vad du skriver. En oklar eller felaktig formulering kan leda till avslag, förseningar eller att skulden godkänns automatiskt." },
      { q: "Vad behöver ni veta för att hjälpa mig?", a: "Beskriv vilket brev du fått, vad myndigheten vill ha, och vad du vill uppnå. Vi tar hand om formuleringen." },
      { q: "Är svaret juridiskt giltigt?", a: "Vi är inte jurister men hjälper dig formulera ett korrekt, välstrukturerat svar. Om du behöver juridisk rådgivning rekommenderar vi en advokat." },
      { q: "Vad kostar det?", a: "Första svaret är gratis. Ytterligare svar kostar 99 kr per meddelande via Payhip." },
    ],
    cta: "Skicka in din situation – gratis",
    relatedLinks: [
      { href: "/mallar", label: "Se gratis brevmallar" },
    ],
  },

  // ===== ENGLISH =====
  {
    slug: "help-swedish-authority",
    lang: "en",
    title: "Help responding to Swedish authorities – Kronofogden, Skatteverket | Svar Direkt",
    metaDesc: "Need help writing a letter to a Swedish authority? We compose the correct reply for you. Kronofogden, Försäkringskassan, Skatteverket and more. First response free.",
    h1: "Help responding to Swedish authorities",
    intro: "Received a letter from a Swedish authority and unsure how to respond? Swedish government agencies communicate in formal, precise language – and they expect the same in return. A poorly worded response can lead to rejected claims, automatic debt approvals or unnecessary delays. We help you compose a clear, correct and professional reply in Swedish. First response is free.",
    h2s: [
      {
        heading: "Which authorities do we help with?",
        body: "Kronofogden (Swedish Enforcement Agency – debt collection, payment orders), Skatteverket (Swedish Tax Agency), Försäkringskassan (Social Insurance Agency – sick pay, parental leave), Migrationsverket (Migration Agency – residence permits), Arbetsförmedlingen (Employment Agency – unemployment benefits) and debt collectors (inkassobolag)."
      },
      {
        heading: "How it works",
        body: "You describe your situation in the form below – in English, Swedish or Polish. We review your case and compose a proper reply in formal Swedish within 24 hours. The finished letter is sent to your email, ready to copy and send to the authority."
      },
      {
        heading: "Why correct language matters",
        body: "Swedish authorities make decisions based on exactly what you write. Vague, aggressive or incomplete responses can be used against you. We know the expected register and structure for each authority and make sure your letter has the right tone, the right content and the right level of detail."
      },
      {
        heading: "Pricing",
        body: "The first response is completely free. Any further replies cost 99 SEK each. No subscription, no login required."
      },
    ],
    faq: [
      { q: "Which Swedish authorities do you help with?", a: "Kronofogden (enforcement agency), Skatteverket (tax agency), Försäkringskassan (social insurance), Migrationsverket (migration agency), Arbetsförmedlingen (employment agency) and debt collectors." },
      { q: "Do I need to speak Swedish to use this service?", a: "No. You can describe your situation in English (or Polish), and we will write the formal reply in Swedish for you." },
      { q: "How quickly will I receive help?", a: "Within 24 hours by email. The first response is always free." },
      { q: "What does it cost?", a: "The first response is free. Additional replies cost 99 SEK each. No subscription required." },
    ],
    cta: "Submit your case – first response free",
    ctaNote: "Reply within 24 hours. No registration required.",
    relatedLinks: [
      { href: "/swedish-government-letter-help", label: "Swedish government letter writing help" },
    ],
  },
  {
    slug: "swedish-government-letter-help",
    lang: "en",
    title: "Swedish government letter writing help – dispute, appeal, respond | Svar Direkt",
    metaDesc: "We write formal letters to Swedish government agencies for you. Dispute a debt, appeal a decision or respond to a tax query. First reply free. Reply within 24 hours.",
    h1: "Swedish government letter writing – personal help",
    intro: "Writing to Swedish government agencies requires specific language, the right structure and an understanding of what each agency expects. Whether you're disputing a debt at Kronofogden, appealing a denied benefit from Försäkringskassan, or answering a tax inquiry from Skatteverket – we write the letter for you so you get the best possible outcome.",
    h2s: [
      {
        heading: "Common situations we help with",
        body: "Disputing a debt or payment order at Kronofogden. Appealing a denied sick pay or benefit from Försäkringskassan. Responding to a tax inquiry or audit from Skatteverket. Supplying supplementary documents to Migrationsverket. Contesting an employment sanction from Arbetsförmedlingen. Negotiating a payment plan with a debt collector."
      },
      {
        heading: "Why correct language matters",
        body: "Swedish authorities make decisions based on what you write. A poorly worded response – too emotional, too vague or missing key information – can lead to rejection, delays or automatic approval of debts. We ensure your letter uses the right register: factual, structured and professional."
      },
      {
        heading: "You don't need to speak Swedish",
        body: "You can describe your situation in English (or Polish). We will write the formal reply in Swedish on your behalf. The finished letter is ready to copy and paste into a form or send by email to the authority."
      },
      {
        heading: "Simple process",
        body: "Fill in the form with your situation. Receive a ready-to-send letter within 24 hours. First response is always free."
      },
    ],
    faq: [
      { q: "How do I dispute a debt at Kronofogden?", a: "You must submit a written contestation to Kronofogden within the deadline stated in the letter. We help you write a correct and clear contestation." },
      { q: "Can I appeal a denied benefit from Försäkringskassan in English?", a: "You must appeal in Swedish, but you can describe your case to us in English and we will write the formal appeal for you." },
      { q: "How long does the process take?", a: "You receive the finished letter within 24 hours by email. The first response is free." },
      { q: "Is this legal advice?", a: "No, this is not legal advice. We help you compose clear, well-structured letters. For legal representation, consult a lawyer." },
    ],
    cta: "Get help now – first response free",
    ctaNote: "No registration, no subscription.",
    relatedLinks: [
      { href: "/help-swedish-authority", label: "Help responding to Swedish authorities" },
    ],
  },

  // ===== POLISH =====
  {
    slug: "pomoc-urzad-szwecja",
    lang: "pl",
    title: "Pomoc z pismem do szwedzkiego urzędu – Kronofogden, Skatteverket | Svar Direkt",
    metaDesc: "Otrzymałeś pismo od Kronofogden, Skatteverket lub innego szwedzkiego urzędu? Pomagamy napisać poprawną odpowiedź. Pierwsza odpowiedź gratis. Odpowiedź w 24 godziny.",
    h1: "Pomoc z pismem do szwedzkiego urzędu",
    intro: "Otrzymałeś pismo od Kronofogden, Skatteverket, Försäkringskassan lub innego szwedzkiego urzędu i nie wiesz jak odpowiedzieć? Szwedzkie urzędy komunikują się formalnym językiem i oczekują tego samego w odpowiedzi. Błędna lub niepełna odpowiedź może prowadzić do odrzucenia wniosku, automatycznego uznania długu lub niepotrzebnych opóźnień. Pomagamy sformułować poprawną i profesjonalną odpowiedź po szwedzku – szybko i bez konieczności rejestracji.",
    h2s: [
      {
        heading: "Z jakimi urzędami pomagamy?",
        body: "Kronofogden (komornik – nakazy zapłaty, zajęcia wynagrodzenia). Skatteverket (urząd skarbowy – deklaracje, kontrole). Försäkringskassan (ZUS – zwolnienia lekarskie, zasiłki). Migrationsverket (urząd ds. migracji – zezwolenia na pobyt). Arbetsförmedlingen (urząd pracy – zasiłki dla bezrobotnych). Firmy windykacyjne (inkassobolag)."
      },
      {
        heading: "Jak to działa?",
        body: "Opisujesz swoją sytuację w formularzu poniżej – po polsku, angielsku lub szwedzku. Sprawdzamy sprawę i w ciągu 24 godzin piszemy formalne pismo po szwedzku. Gotowe pismo wysyłamy na Twój adres e-mail. Możesz je skopiować i wysłać bezpośrednio do urzędu."
      },
      {
        heading: "Nie musisz znać szwedzkiego",
        body: "Opisz swoją sytuację po polsku. My zajmiemy się resztą – napiszemy formalne pismo w odpowiednim szwedzkim rejestrze urzędowym, z właściwą strukturą i argumentacją, które dają Ci największe szanse na pozytywne rozpatrzenie sprawy."
      },
      {
        heading: "Cena",
        body: "Pierwsza odpowiedź jest całkowicie bezpłatna. Każde kolejne pismo kosztuje 99 SEK. Bez abonamentu, bez rejestracji. Odpowiedź w ciągu 24 godzin."
      },
    ],
    faq: [
      { q: "Z jakimi szwedzkimi urzędami pomagacie?", a: "Kronofogden (komornik), Skatteverket (urząd skarbowy), Försäkringskassan (ZUS), Migrationsverket (urząd ds. migracji), Arbetsförmedlingen (urząd pracy) oraz firmy windykacyjne." },
      { q: "Czy muszę znać szwedzki, żeby skorzystać z usługi?", a: "Nie. Możesz opisać swoją sytuację po polsku, a my napiszemy formalne pismo po szwedzku." },
      { q: "Jak szybko otrzymam pomoc?", a: "W ciągu 24 godzin na podany adres e-mail. Pierwsza odpowiedź jest zawsze bezpłatna." },
      { q: "Ile kosztuje usługa?", a: "Pierwsza odpowiedź jest bezpłatna. Kolejne pisma kosztują 99 SEK każde. Bez abonamentu." },
    ],
    cta: "Wyślij swoje pytanie – pierwsza odpowiedź gratis",
    ctaNote: "Odpowiedź w ciągu 24 godzin.",
  },

  // ===== NEW SEO PAGES =====
  {
    slug: "skriva-brev-till-myndighet",
    lang: "sv",
    title: "Skriva brev till myndighet – rätt ton, mall och hjälp | Svar Direkt",
    metaDesc: "Hur skriver man ett korrekt brev till en svensk myndighet? Vi förklarar rätt ton, struktur och formuleringar – eller skriver hela brevet åt dig. Första hjälpen gratis.",
    h1: "Skriva brev till myndighet – så gör du rätt",
    intro: "Att skriva brev till en svensk myndighet kräver rätt ton, tydlig struktur och korrekta formuleringar. Fel ord, fel ton eller ett ofullständigt brev kan försena ditt ärende, försvaga din position eller leda till ett avslag. Vi hjälper dig skriva ett korrekt, professionellt brev till vilken myndighet som helst – eller skriver det åt dig.",
    h2s: [
      {
        heading: "Varför myndighetsbrev kräver speciell formulering",
        body: "Svenska myndigheter hanterar tusentals ärenden dagligen. Ett välformulerat brev som direkt anger vad du vill och varför hanteras snabbare och mer positivt. Undvik känslosamma formuleringar – håll dig till fakta, datum, ärendenummer och en tydlig begäran. Använd alltid 'Jag yrkar att...' eller 'Jag begär att...' när du ber om ett beslut.",
      },
      {
        heading: "Rätt struktur för ett myndighetsbrev",
        body: "Ett korrekt brev till en myndighet innehåller: (1) Dina uppgifter (namn, personnummer, adress, telefon). (2) Mottagare (myndighetens namn och adress). (3) Ärendebenämning – en tydlig rubrik. (4) Inledning – vilket ärende gäller det och vilket beslut eller brev du svarar på. (5) Brödtext – din begäran med motivering och fakta. (6) Bilagor (om sådana finns). (7) Underskrift.",
      },
      {
        heading: "Rätt ton – formell men tydlig",
        body: "Undvik att vara aggressiv, emotionell eller oprecis. Myndigheter fattar beslut baserat på fakta och lagstöd – inte på hur arg eller desperat du låter. Skriv 'Jag bestrider kravet med hänvisning till...' snarare än 'Det är orättvist att...'. Var direkt, respektfull och konkret.",
      },
      {
        heading: "Vi skriver brevet åt dig",
        body: "Om du är osäker på hur du ska formulera dig, eller om ärendet är komplicerat, kan vi skriva hela brevet åt dig. Beskriv din situation i formuläret – vilket brev du fått, vad du vill uppnå och vilken myndighet det gäller. Vi returnerar ett färdigt brev inom 24 timmar som du kan kopiera och skicka direkt.",
      },
    ],
    faq: [
      { q: "Vilket språk ska jag använda i brev till svenska myndigheter?", a: "Svenska är det officiella språket. Om du inte behärskar svenska tillräckligt väl kan du be en tolk eller oss om hjälp. En del myndigheter accepterar engelska i enklare ärenden, men formella brev (överklaganden, bestridanden) bör alltid skrivas på svenska." },
      { q: "Behöver jag personnummer i brevet?", a: "Ja, alltid. Utan personnummer kan myndigheten inte matcha ditt brev mot ditt ärende. Ange alltid fullständigt personnummer (YYYYMMDD-XXXX)." },
      { q: "Hur lång ska svaret vara?", a: "Lagom. Skriv inte för kortfattat – du riskerar att missa viktig information. Skriv inte för långt – handläggaren orkar inte läsa. 1–3 stycken med tydlig struktur är oftast lagom." },
      { q: "Vad kostar er hjälp?", a: "Första svaret är helt gratis. Ytterligare brev kostar 99 kr per stycke." },
    ],
    cta: "Beskriv ditt ärende – vi skriver brevet åt dig",
    ctaNote: "Första hjälpen gratis. Svar inom 24 timmar.",
    relatedLinks: [
      { href: "/generator", label: "Prova vår AI-brevgenerator (gratis)" },
      { href: "/mallar", label: "Ladda ner gratis brevmallar" },
      { href: "/skriv-brev-myndighet", label: "Personlig hjälp att skriva brev" },
    ],
  },
  {
    slug: "formellt-brev-svenska",
    lang: "sv",
    title: "Formellt brev på svenska – mall, struktur och exempel | Svar Direkt",
    metaDesc: "Lär dig skriva ett formellt brev på svenska med rätt struktur och ton. Gratis mall och exempel. Perfekt för brev till myndigheter, hyresvärdar och arbetsgivare.",
    h1: "Formellt brev på svenska – rätt struktur och ton",
    intro: "Ett formellt brev på svenska följer en bestämd struktur och kräver ett specifikt språk. Oavsett om du skriver till en myndighet, en hyresvärd, en arbetsgivare eller ett inkassobolag – ett korrekt formulerat brev ger dig ett professionellt intryck och ökar chansen att du får det du vill.",
    h2s: [
      {
        heading: "Struktur för ett formellt brev på svenska",
        body: "Börja med avsändaruppgifter (namn, adress, telefon, e-post) längst upp till höger. Mottagarens uppgifter till vänster. Datum under mottagaruppgifterna. Ämnesrad/rubrik i fetstil. Inledning: 'Med anledning av...' eller 'Jag skriver till er angående...'. Brödtext med tydlig begäran. Avslutning: 'Med vänliga hälsningar,' + namn. Bilagor listas sist.",
      },
      {
        heading: "Rätt tilltalsform och artighetsfraser",
        body: "I formella brev på svenska används 'ni' (med liten bokstav) som artigt tilltal – inte 'du'. Inledningsfraser: 'Med anledning av ovan refererade beslut...', 'I enlighet med...', 'Härmed vill jag...'. Avslutningsfraser: 'Med vänliga hälsningar', 'Vänligen', 'Med hälsning'. Undvik 'Hej' och 'Mvh' i formella sammanhang.",
      },
      {
        heading: "Formella brev till myndigheter",
        body: "Brev till Kronofogden, Skatteverket, Försäkringskassan, Migrationsverket och Arbetsförmedlingen kräver extra precision. Ange alltid ärendenummer om sådant finns, ditt personnummer och ett tydligt yrkande. Använd phrases som 'Jag yrkar att myndigheten...', 'Jag begär omprövning av beslut daterat...' eller 'Jag bestrider kravet med följande motivering:'.",
      },
      {
        heading: "Gratis hjälp och mallar",
        body: "Vi erbjuder gratis brevmallar till de vanligaste myndigheterna samt en AI-assistent som genererar ett korrekt brev baserat på din situation. Om du behöver personlig hjälp med ett specifikt ärende – fyll i formuläret så svarar vi inom 24 timmar. Första svaret är gratis.",
      },
    ],
    faq: [
      { q: "Hur börjar man ett formellt brev på svenska?", a: "Börja med 'Med anledning av...' följt av vad brevet gäller, eller 'Jag skriver med anledning av [brev/beslut] daterat [datum] angående [ärende].' Undvik att börja med 'Hej' eller 'Jag heter...'." },
      { q: "Vad betyder 'Ni' i formella brev?", a: "'Ni' (med liten bokstav) är det formella tilltalsordet på svenska, motsvarar 'Sie' på tyska eller 'vous' på franska. Används alltid i brev till myndigheter och officiella brev." },
      { q: "Hur avslutar man ett formellt brev?", a: "Vanligast är 'Med vänliga hälsningar,' följt av namn och underskrift. Alternativ: 'Med hälsning,' eller 'Vänligen,'. Undvik 'Mvh' i formella sammanhang." },
      { q: "Behöver jag bifoga något?", a: "Bifoga alltid relevanta dokument som stödjer din begäran: kopior av det brev du svarar på, läkarintyg, kvitton, avtal. Lista bilagor i slutet av brevet: 'Bilagor: 1. Kopia av beslut 2. Läkarintyg daterat...'." },
    ],
    cta: "Skapa ditt formella brev nu – gratis",
    ctaNote: "AI-genererat på sekunder, eller personlig hjälp inom 24 timmar.",
    relatedLinks: [
      { href: "/generator", label: "AI-brevgenerator – generera brev automatiskt" },
      { href: "/mallar", label: "Gratis brevmallar att kopiera" },
      { href: "/skriva-brev-till-myndighet", label: "Guide: Skriva brev till myndighet" },
    ],
  },
  {
    slug: "overklaga-myndighetsbeslut",
    lang: "sv",
    title: "Överklaga myndighetsbeslut – guide, mall och hjälp | Svar Direkt",
    metaDesc: "Hur överklagar man ett myndighetsbeslut? Steg-för-steg guide med gratis mall. Hjälp med överklagande till Försäkringskassan, Kronofogden, Migrationsverket m.fl.",
    h1: "Överklaga myndighetsbeslut – steg för steg",
    intro: "Har du fått ett beslut från en myndighet som du tycker är fel? Du har alltid rätt att överklaga ett myndighetsbeslut inom en viss tid. Rätt formulerat överklagande är avgörande – vi hjälper dig formulera ett tydligt, argumenterat överklagande som ger dig bästa möjliga chans.",
    h2s: [
      {
        heading: "Hur lång tid har du på dig att överklaga?",
        body: "Överklagandetiden varierar: Försäkringskassan – 2 månader från beslutsdatum. Kronofogden – 10 dagar för betalningsföreläggande. Skatteverket – 6 år för omprövning. Migrationsverket – 3 veckor. Socialtjänsten – 3 veckor. Missa aldrig deadline – ett försenat överklagande avvisas nästan alltid. Kontrollera beslutsbrevet för exakt överklagandetid.",
      },
      {
        heading: "Vad ska ett överklagande innehålla?",
        body: "1. Vilket beslut du överklagar (ärendenummer och datum). 2. Varför du anser beslutet är fel (sakliga argument och lagstöd). 3. Vad du vill att myndigheten ska besluta istället (ditt yrkande). 4. Nya omständigheter eller bevis som inte funnits med tidigare. 5. Dina personuppgifter och underskrift. 6. Bilagor som stödjer dina argument.",
      },
      {
        heading: "Överklagande av olika myndigheters beslut",
        body: "Försäkringskassan: Begär omprövning hos Försäkringskassan först, sedan Förvaltningsdomstolen. Kronofogden: Bestrida hos Kronofogden, sedan Tingsrätten. Skatteverket: Begär omprövning hos Skatteverket, sedan Förvaltningsdomstolen. Migrationsverket: Överklaga till Migrationsdomstolen. Socialtjänsten: Överklaga till Förvaltningsdomstolen.",
      },
      {
        heading: "Öka dina chanser med rätt formulering",
        body: "Det viktigaste är att överklagandet är sakligt, tydligt och innehåller konkreta argument kopplade till lag eller rättspraxis. Undvik att vara emotionell – fokusera på fakta. Vi hjälper dig formulera ett professionellt överklagande anpassat till din specifika situation och myndighet.",
      },
    ],
    faq: [
      { q: "Kan jag överklaga alla myndighetsbeslut?", a: "De flesta myndighetsbeslut kan överklagas, men inte alla. Beslut av ren servicekaraktär (t.ex. bokningsbekräftelser) är inte överklagbara. Det ska alltid framgå av beslutsbrevet om beslutet kan överklagas och till vem." },
      { q: "Behöver jag ett juridiskt ombud?", a: "Nej, du behöver inte advokat för att överklaga en myndighet. Du kan göra det själv. Vi hjälper dig formulera överklagandet på ett professionellt sätt utan advokatpriser." },
      { q: "Vad händer om jag missar överklagandetiden?", a: "Beslutet vinner laga kraft och är normalt bindande. I undantagsfall kan du ansöka om återställande av försutten tid om du haft giltig anledning (t.ex. sjukhusvistelse)." },
      { q: "Hur snabbt får jag hjälp?", a: "Inom 24 timmar. Beskriv din situation och vilket beslut du vill överklaga – vi formulerar överklagandet åt dig. Första svaret gratis." },
    ],
    cta: "Beskriv ditt beslut – vi skriver överklagandet åt dig",
    ctaNote: "Agera snabbt – överklagandetiden löper.",
    relatedLinks: [
      { href: "/hjalp-forsakringskassan", label: "Hjälp: Överklaga Försäkringskassan" },
      { href: "/hjalp-kronofogden", label: "Hjälp: Bestrida Kronofogden" },
      { href: "/hjalp-migrationsverket", label: "Hjälp: Överklaga Migrationsverket" },
    ],
  },
  {
    slug: "brev-till-forsakringskassan",
    lang: "sv",
    title: "Brev till Försäkringskassan – rätt formulering och mallar | Svar Direkt",
    metaDesc: "Hur skriver man till Försäkringskassan? Guide med rätt ton, struktur och fraser. Gratis mallar och personlig hjälp. Sjukpenning, föräldrapenning, överklagande.",
    h1: "Brev till Försäkringskassan – så skriver du rätt",
    intro: "Att skriva till Försäkringskassan kräver precision och rätt ton. Brev som är vaga, saknar dokument eller har fel formulering kan leda till längre handläggningstid, begäran om komplettering eller avslag. Vi hjälper dig skriva ett korrekt, komplett brev till Försäkringskassan – oavsett om det gäller sjukpenning, föräldrapenning, överklagande eller återkrav.",
    h2s: [
      {
        heading: "Vanliga situationer som kräver brev till Försäkringskassan",
        body: "Förlängning av sjukpenning – behöver nytt läkarintyg och ev. komplettering. Överklagande av nekad ersättning – kräver sakliga argument och medicinsk dokumentation. Svar på återkrav – bestrida eller begär avbetalningsplan. Begäran om omprövning – ny prövning av ett beslut du är missnöjd med. Ansökan om aktivitetsersättning – kräver fullständig dokumentation av diagnos och funktionsnedsättning.",
      },
      {
        heading: "Rätt sätt att formulera sig till Försäkringskassan",
        body: "Inled alltid med ärendenumret om du har ett. Ange tydligt vad brevet gäller: 'Gäller: Sjukpenning, ärendenummer XXXXXXXX'. Använd formellt språk: 'Jag yrkar att Försäkringskassan...', 'Jag begär omprövning av beslut daterat...'. Bifoga alltid läkarintyg, journalanteckningar eller andra underlag som styrker din situation.",
      },
      {
        heading: "Komplettering eller överklagande – vad gäller?",
        body: "Om Försäkringskassan begär komplettering har du en deadline – vanligtvis 2–4 veckor. Svara alltid inom fristen och bifoga alla efterfrågade dokument. Om du är missnöjd med ett beslut har du 2 månader på dig att begära omprövning. Omprövningen görs av Försäkringskassan, och om du fortfarande är missnöjd kan du överklaga till Förvaltningsdomstolen.",
      },
      {
        heading: "Hjälp att skriva till Försäkringskassan",
        body: "Fyll i formuläret nedan och beskriv din situation – vilket brev du fått, vad Försäkringskassan kräver och vad du vill uppnå. Inom 24 timmar får du ett färdigt, korrekt formulerat brev som du kan kopiera och skicka. Första svaret är alltid gratis.",
      },
    ],
    faq: [
      { q: "Hur kontaktar man Försäkringskassan skriftligt?", a: "Du kan skicka brev via Mina sidor på forsakringskassan.se (rekommenderat – ger dig kvitto), via post eller via ombud. Vid överklaganden och omprövningar är skriftlig kommunikation obligatorisk." },
      { q: "Vad är skillnaden mellan omprövning och överklagande?", a: "Omprövning: du begär att Försäkringskassan prövar sitt eget beslut på nytt (görs hos Försäkringskassan). Överklagande: du tar beslutet till Förvaltningsdomstolen. Prova alltid omprövning först – det är gratis, snabbare och löser många fall." },
      { q: "Måste jag ha läkarintyg?", a: "Vid sjukpenning – ja, alltid. Läkarintyg ska bifogas från dag 8 och sedan regelbundet. Vid föräldrapenning – nej. Vid överklaganden – starkt rekommenderat om beslutet grundas på medicinsk bedömning." },
      { q: "Hur snabbt svarar ni?", a: "Inom 24 timmar. Beskriver du situationen i formuläret får du ett färdigt brev till Försäkringskassan via e-post. Första hjälpen är alltid gratis." },
    ],
    cta: "Beskriv situationen – vi skriver brevet till FK åt dig",
    ctaNote: "Svar inom 24 timmar. Första hjälpen gratis.",
    relatedLinks: [
      { href: "/hjalp-forsakringskassan", label: "Mer hjälp: Överklagande Försäkringskassan" },
      { href: "/blogg/hur-skriver-man-till-forsakringskassan", label: "Guide: Hur skriver man till Försäkringskassan?" },
      { href: "/mallar", label: "Gratis brevmallar till Försäkringskassan" },
    ],
  },
  {
    slug: "svara-brev-kronofogden",
    lang: "sv",
    title: "Svara på brev från Kronofogden – deadline och rätt formulering | Svar Direkt",
    metaDesc: "Fått brev från Kronofogden? Du måste svara inom deadline – annars godkänns skulden automatiskt. Rätt svar, rätt tid. Personlig hjälp – första svaret gratis.",
    h1: "Svara på brev från Kronofogden – agera snabbt",
    intro: "Brev från Kronofogden är alltid tidskänsliga. Svarar du inte inom angiven tid godkänns kravet automatiskt och Kronofogden kan börja med löneutmätning, kontoutmätning eller utmätning av tillgångar. Att svara snabbt och rätt är avgörande – vi hjälper dig formulera rätt svar inom 24 timmar.",
    h2s: [
      {
        heading: "Vilka brev skickar Kronofogden?",
        body: "Betalningsföreläggande – krav på betalning av en skuld. Svarstid: 10–14 dagar. Om du inte svarar godkänns skulden. Föreläggande om löneutmätning – Kronofogden avser ta pengar direkt från din lön. Kallelse till sammanträde – du kallas för att redogöra för din ekonomi. Meddelande om utmätning – Kronofogden har beslutat att utmäta egendom. Varje brev kräver ett specifikt svar – fel svar kan förvärra situationen.",
      },
      {
        heading: "Hur svarar du på ett betalningsföreläggande?",
        body: "Om du bestrider skulden: Skriv att du bestrider kravet och ange kortfattat varför (skulden är felaktig, preskriberad, redan betald, du är fel person etc.). Ange ärendenumret. Kronofogden vidarebefordrar sedan ärendet till Tingsrätten om borgenären väljer att driva det vidare. Om du accepterar skulden men inte kan betala: Begär avbetalningsplan eller skuldsanering istället.",
      },
      {
        heading: "Vanliga misstag att undvika",
        body: "Ignorera aldrig ett brev från Kronofogden – tystnad räknas som acceptans. Skriv inte för aggressivt eller emotionellt – det hjälper inte. Bifoga alltid bevis om du bestrider (avtal, kvitto, kommunikation). Missa inte deadline – överklaganden av Kronofogdens beslut har korta tidsfrister. Svara alltid skriftligt – muntliga samtal är svåra att bevisa.",
      },
      {
        heading: "Vi skriver svaret åt dig",
        body: "Berätta vilket brev du fått, vad Kronofogden kräver och vad du vill uppnå. Inom 24 timmar har du ett korrekt, formulerat svar klart att skicka till Kronofogden. Första svaret är alltid gratis.",
      },
    ],
    faq: [
      { q: "Vad händer om jag inte svarar på Kronofogdens brev?", a: "Vid ett betalningsföreläggande: skulden godkänns automatiskt och Kronofogden kan påbörja utmätning. Du kan även få betalningsanmärkning som syns i 3 år. Ignorera aldrig brev från Kronofogden." },
      { q: "Kan jag bestrida en skuld om jag inte minns den?", a: "Ja. Om du inte känner igen skulden eller anser att det är fel – bestrida. Skriv att du bestrider och anger 'Skulden är okänd för mig och jag begär specificering av fordran.' Det är borgenärens ansvar att bevisa att skulden är korrekt." },
      { q: "Hur lång tid har jag på mig att svara?", a: "Det beror på ärendetypen och anges alltid i brevet. Betalningsförelägganden har vanligtvis 10–14 dagars svarstid. Läs alltid brevet noggrant och agera innan deadline." },
      { q: "Kostar hjälpen något?", a: "Första svaret är helt gratis. Ytterligare hjälp kostar 99 kr per brev." },
    ],
    cta: "Beskriv vad Kronofogden kräver – vi svarar inom 24h",
    ctaNote: "Agera snabbt – tidsfristen löper.",
    relatedLinks: [
      { href: "/hjalp-kronofogden", label: "Mer hjälp med Kronofogden" },
      { href: "/blogg/svara-pa-krav-fran-kronofogden", label: "Guide: Svara på krav från Kronofogden" },
      { href: "/blogg/bestrida-kronofogden", label: "Guide: Bestrida Kronofogden" },
    ],
  },
];

function FaqSection({ items, lang }: { items: Faq[]; lang: "sv" | "en" | "pl" }) {
  const heading = lang === "en" ? "Frequently asked questions" : lang === "pl" ? "Najczęstsze pytania" : "Vanliga frågor";
  return (
    <section className="py-12 px-4 bg-slate-50 border-t border-slate-100">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-6">{heading}</h2>
        <div className="space-y-5">
          {items.map((item) => (
            <div key={item.q} className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="font-semibold text-slate-800 mb-1.5 text-sm">{item.q}</p>
              <p className="text-slate-600 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SeoPage({ data }: { data: PageData }) {
  const isEn = data.lang === "en";
  const isPl = data.lang === "pl";

  return (
    <>
      <head>
        <title>{data.title}</title>
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

      {/* FAQ */}
      <FaqSection items={data.faq} lang={data.lang} />

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

      {/* Related links */}
      {data.relatedLinks && data.relatedLinks.length > 0 && (
        <section className="bg-white py-8 px-4 border-t border-slate-100">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              {isEn ? "Related" : isPl ? "Powiązane" : "Relaterat"}
            </p>
            <ul className="space-y-1">
              {data.relatedLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-primary underline hover:no-underline">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <div className="bg-white border-t border-slate-100 py-5 px-4">
        <p className="max-w-xl mx-auto text-xs text-slate-400 text-center leading-relaxed">
          ⚠️ {DISCLAIMER}
        </p>
      </div>

      <div className="py-4 px-4 text-center">
        <a href="/" className="text-sm text-primary underline hover:no-underline">
          ← {isEn ? "Back to home" : isPl ? "Powrót do strony głównej" : "Tillbaka till startsidan"}
        </a>
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
