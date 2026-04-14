export interface Template {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  tags: string[];
}

export const CATEGORIES = [
  "Alla",
  "Hyresrätt",
  "Underhåll",
  "Störningar",
  "Uppsägning",
  "Ekonomi",
  "Inspektion",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CV_CATEGORIES = [
  "Alla",
  "Grundläggande",
  "Bransch",
  "Specifik situation",
] as const;

export type CvCategory = (typeof CV_CATEGORIES)[number];

export const SKATTEVERKET_TEMPLATES: Template[] = [
  {
    id: "skat-001",
    title: "Felaktig skatt att betala",
    category: "Skatteverket",
    description: "Bestrid ett felaktigt skattekrav från Skatteverket",
    tags: ["felaktig skatt", "skattekrav", "bestrid"],
    content: `Hej,

Jag har mottagit ett krav på betalning av [BELOPP] kr avseende inkomstår [ÅR]. Jag anser att beloppet är felaktigt beräknat.

Mitt personnummer är [PERSONNUMMER]. Jag ber Skatteverket att se över och korrigera beräkningen snarast.

Bifogade handlingar styrker min ståndpunkt. Jag är tillgänglig för kontakt på [TELEFON/E-POST].

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "skat-002",
    title: "Ingen inkomst men skatt registrerad",
    category: "Skatteverket",
    description: "Anmäl att skatt registrerats trots noll inkomst",
    tags: ["ingen inkomst", "skatteregistrering", "fel"],
    content: `Hej,

Under inkomstår [ÅR] hade jag ingen beskattningsbar inkomst, men jag har fått besked om att skatt registrerats på mitt konto.

Mitt personnummer är [PERSONNUMMER]. Detta tycks bero på en felaktig registrering. Jag ber Skatteverket att utreda och rätta ärendet.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "skat-003",
    title: "Ansökan om anstånd",
    category: "Skatteverket",
    description: "Ansök om anstånd med skatteinbetalning",
    tags: ["anstånd", "betalning", "skattebetalning"],
    content: `Hej,

Jag ansöker om anstånd med betalning av skatt om [BELOPP] kr som förfaller [DATUM].

Skälet är [BESKRIV ORSAKEN, T.EX. TILLFÄLLIGA EKONOMISKA SVÅRIGHETER]. Mitt personnummer är [PERSONNUMMER].

Jag ber om bekräftelse och svar snarast möjligt.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "skat-004",
    title: "Avbetalningsplan",
    category: "Skatteverket",
    description: "Begär en avbetalningsplan för din skatteskuld",
    tags: ["avbetalning", "skuld", "plan"],
    content: `Hej,

Jag har en skatteskuld om [BELOPP] kr och önskar upprätta en avbetalningsplan.

Mitt personnummer är [PERSONNUMMER]. Jag kan betala [BELOPP/MÅNAD] kr per månad med start [STARTDATUM].

Jag ber om bekräftelse och eventuella villkor för avbetalningsplanen.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "skat-005",
    title: "Försenad deklaration",
    category: "Skatteverket",
    description: "Förklara och lämna in en försenad deklaration",
    tags: ["försenad", "deklaration", "förseningsavgift"],
    content: `Hej,

Jag kunde inte lämna in min deklaration i tid för inkomstår [ÅR] på grund av [ORSAK, T.EX. SJUKDOM, TEKNISKA PROBLEM].

Mitt personnummer är [PERSONNUMMER]. Deklarationen bifogas nu. Jag ber om att eventuell förseningsavgift tas bort med hänsyn till omständigheterna.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "skat-006",
    title: "Rättelse av deklaration",
    category: "Skatteverket",
    description: "Rätta uppgifter i en redan inlämnad deklaration",
    tags: ["rättelse", "deklaration", "korrigering"],
    content: `Hej,

Jag önskar rätta min inkomstdeklaration för inkomstår [ÅR].

Mitt personnummer är [PERSONNUMMER]. Det som ska rättas är: [BESKRIV VAD SOM ÄR FEL, T.EX. UTEGLÖMD INKOMST ELLER FEL AVDRAG]. Korrekta uppgifter bifogas.

Jag ber om bekräftelse när rättelsen är registrerad.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "skat-007",
    title: "Inkomst från utlandet",
    category: "Skatteverket",
    description: "Fråga om beskattning av utländsk inkomst",
    tags: ["utlandet", "utländsk inkomst", "dubbelbeskattning"],
    content: `Hej,

Under inkomstår [ÅR] hade jag inkomst från [LAND] om [BELOPP] kr. Jag vill säkerställa att dubbelbeskattningsavtalet mellan Sverige och [LAND] tillämpas korrekt.

Mitt personnummer är [PERSONNUMMER]. Bifogat finns inkomstintyg från utlandet.

Jag ber om besked om hur inkomsten ska redovisas och beskattas.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "skat-008",
    title: "Fel från arbetsgivare",
    category: "Skatteverket",
    description: "Rätta felaktiga löneuppgifter från arbetsgivare",
    tags: ["arbetsgivare", "lön", "fel uppgifter"],
    content: `Hej,

Min arbetsgivare [ARBETSGIVARE] har rapporterat felaktiga uppgifter om min lön för inkomstår [ÅR].

Mitt personnummer är [PERSONNUMMER]. Det korrekta beloppet är [KORREKT BELOPP] kr. Bifogat finns löneintyg som styrker detta.

Jag ber Skatteverket att korrigera uppgifterna i enlighet med intyget.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "skat-009",
    title: "Svar på begäran",
    category: "Skatteverket",
    description: "Svara formellt på Skatteverkets begäran om uppgifter",
    tags: ["svar", "begäran", "uppgifter"],
    content: `Hej,

Med anledning av er begäran daterad [DATUM] rörande [ÄRENDETS RUBRIK] lämnar jag härmed följande svar:

[BESKRIV DITT SVAR/FÖRKLARING]

Mitt personnummer är [PERSONNUMMER]. Bifogade handlingar styrker ovanstående.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "skat-010",
    title: "Kan inte betala skatt",
    category: "Skatteverket",
    description: "Meddela Skatteverket om betalningssvårigheter",
    tags: ["betalningssvårigheter", "skatt", "ekonomi"],
    content: `Hej,

Jag har mottagit ett betalningskrav på [BELOPP] kr med förfallodag [DATUM]. Jag befinner mig för tillfället i en svår ekonomisk situation och kan inte betala hela beloppet i tid.

Mitt personnummer är [PERSONNUMMER]. Jag ber om kontakt för att diskutera en lösning, exempelvis en avbetalningsplan eller tillfälligt anstånd.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "skat-011",
    title: "Ändring av uppgifter",
    category: "Skatteverket",
    description: "Begär ändring av personuppgifter i Skatteverkets register",
    tags: ["ändring", "uppgifter", "personuppgifter"],
    content: `Hej,

Jag önskar ändra följande uppgifter i Skatteverkets register:

[BESKRIV VAD SOM SKA ÄNDRAS, T.EX. ADRESS, KONTAKTUPPGIFTER, CIVILSTÅND]

Mitt personnummer är [PERSONNUMMER]. Ändringen gäller från [DATUM]. Bifogade handlingar styrker ändringen.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "skat-012",
    title: "Saknad återbäring",
    category: "Skatteverket",
    description: "Efterfråga en utebliven skatteåterbäring",
    tags: ["återbäring", "skatterestitution", "utbetalning"],
    content: `Hej,

Enligt min deklaration för inkomstår [ÅR] ska jag erhålla en återbäring om [BELOPP] kr. Trots att det gått [ANTAL] veckor har beloppet ännu inte betalats ut.

Mitt personnummer är [PERSONNUMMER]. Jag ber om besked om när utbetalningen sker och till vilket konto.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "skat-013",
    title: "Företag – fel skatt",
    category: "Skatteverket",
    description: "Bestrid ett felaktigt skattekrav för företag",
    tags: ["företag", "fel skatt", "organisationsnummer"],
    content: `Hej,

Mitt företag [FÖRETAGSNAMN], organisationsnummer [ORG.NR], har mottagit ett skattekrav som vi anser är felaktigt beräknat.

Kravet avser [BESKRIV KRAVET] om [BELOPP] kr för perioden [PERIOD]. Vi bestrider beloppet och ber om en genomgång av ärendet.

Bifogat finns vår bokföring och relevanta underlag.

Med vänliga hälsningar,
[DITT NAMN]
[BEFATTNING], [FÖRETAGSNAMN]
[DATUM]`,
  },
  {
    id: "skat-014",
    title: "Överklagande av beslut",
    category: "Skatteverket",
    description: "Överklaga ett beslut från Skatteverket formellt",
    tags: ["överklagande", "beslut", "omprövning"],
    content: `Hej,

Jag önskar överklaga Skatteverkets beslut daterat [DATUM] med diarienummer [DIARIENUMMER].

Mitt personnummer är [PERSONNUMMER]. Grunden för mitt överklagande är:

[BESKRIV VARFÖR DU ANSER ATT BESLUTET ÄR FEL]

Jag begär att ärendet omprövas. Bifogade handlingar styrker min ståndpunkt.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
];

export const FORSAKRINGSKASSAN_TEMPLATES: Template[] = [
  {
    id: "fk-001",
    title: "Felaktig utbetalning",
    category: "Försäkringskassan",
    description: "Bestrid en felaktigt beräknad utbetalning från Försäkringskassan",
    tags: ["felaktig utbetalning", "ersättning", "bestrid"],
    content: `Hej,

Jag har mottagit ett beslut om utbetalning av [ERSÄTTNINGSTYP] om [BELOPP] kr avseende perioden [PERIOD]. Jag anser att beloppet är felaktigt beräknat.

Mitt personnummer är [PERSONNUMMER]. Det korrekta beloppet borde vara [KORREKT BELOPP] kr, baserat på [FÖRKLARING].

Jag ber Försäkringskassan att se över beslutet och korrigera utbetalningen. Bifogade handlingar styrker min ståndpunkt.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "fk-002",
    title: "Svar på återkrav",
    category: "Försäkringskassan",
    description: "Bestrida eller ge svar på ett återkrav från Försäkringskassan",
    tags: ["återkrav", "skuld", "bestrid"],
    content: `Hej,

Jag har mottagit ett återkrav på [BELOPP] kr avseende [ERSÄTTNINGSTYP] för perioden [PERIOD].

Mitt personnummer är [PERSONNUMMER]. Jag bestrider detta återkrav av följande skäl: [BESKRIV VARFÖR ÅTERKRAVET ÄR FEL ELLER ORIMLIGT].

Jag ber om en fullständig förklaring av hur beloppet beräknats samt en möjlighet att yttra mig innan eventuellt beslut fattas.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "fk-003",
    title: "Sjukpenning – begäran om utredning",
    category: "Försäkringskassan",
    description: "Begäran om utredning vid uteblivet beslut om sjukpenning",
    tags: ["sjukpenning", "sjukskrivning", "utredning"],
    content: `Hej,

Jag är sjukskriven sedan [DATUM] och har lämnat in läkarintyg som styrker min nedsatta arbetsförmåga. Trots detta har jag ännu inte fått något beslut om sjukpenning.

Mitt personnummer är [PERSONNUMMER]. Handläggningsnummer (om känt): [ÄRENDENUMMER].

Jag ber om besked om ärendets status och när ett beslut kan förväntas. Om kompletterande uppgifter krävs kontaktar ni mig gärna på [TELEFON/E-POST].

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "fk-004",
    title: "Ansökan om VAB",
    category: "Försäkringskassan",
    description: "Komplettering av ansökan om vård av sjukt barn (VAB)",
    tags: ["vab", "barn", "vård av barn"],
    content: `Hej,

Jag ansöker om tillfällig föräldrapenning (VAB) för vård av mitt barn [BARNETS NAMN], personnummer [BARNETS PERSONNUMMER].

Vårddagarna avser: [STARTDATUM] till [SLUTDATUM].

Mitt personnummer är [PERSONNUMMER]. Barnet var sjukt och kunde inte vistas på förskola/skola under ovanstående period. Bifogat läkarintyg bifogas om tillämpligt.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "fk-005",
    title: "Bostadsbidrag – felaktig beräkning",
    category: "Försäkringskassan",
    description: "Bestrid felaktigt bostadsbidragsbeslut",
    tags: ["bostadsbidrag", "beräkning", "fel"],
    content: `Hej,

Jag har mottagit beslut om bostadsbidrag som jag anser är felaktigt beräknat.

Mitt personnummer är [PERSONNUMMER]. Beslutet daterat [DATUM] anger [BELOPP] kr per månad. Jag anser att rätt belopp är [KORREKT BELOPP] kr eftersom [FÖRKLARING, T.EX. INKOMSTEN BERÄKNATS FEL, HYRESKOSTNADEN ÄR FELAKTIG].

Jag ber om en förnyad prövning och ber er kontakta mig om ytterligare underlag behövs.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "fk-006",
    title: "Aktivitetsstöd – utebliven utbetalning",
    category: "Försäkringskassan",
    description: "Påminnelse om uteblivet aktivitetsstöd",
    tags: ["aktivitetsstöd", "utbetalning", "påminnelse"],
    content: `Hej,

Jag deltar i [PROGRAMNAMN] via Arbetsförmedlingen och har rätt till aktivitetsstöd. Utbetalningen för perioden [PERIOD] har ännu inte skett.

Mitt personnummer är [PERSONNUMMER]. Jag har uppfyllt alla krav på närvaro och deltagande. Jag ber om besked om orsaken till uteblivet stöd och när utbetalning kan förväntas.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "fk-007",
    title: "Överklagande av avslagsbeslut",
    category: "Försäkringskassan",
    description: "Överklaga ett avslag på din ansökan hos Försäkringskassan",
    tags: ["överklagande", "avslag", "omprövning"],
    content: `Hej,

Jag önskar överklaga Försäkringskassans beslut daterat [DATUM] med diarienummer [DIARIENUMMER], avseende avslag på min ansökan om [ERSÄTTNINGSTYP].

Mitt personnummer är [PERSONNUMMER]. Grunden för mitt överklagande är:

[BESKRIV VARFÖR DU ANSER ATT BESLUTET ÄR FEL]

Jag begär att ärendet omprövas med beaktande av bifogade handlingar.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "fk-008",
    title: "Föräldrapenning – komplettering",
    category: "Försäkringskassan",
    description: "Komplettera ansökan om föräldrapenning",
    tags: ["föräldrapenning", "komplettering", "ansökan"],
    content: `Hej,

Med anledning av er begäran om komplettering av min ansökan om föräldrapenning, diarienummer [DIARIENUMMER], lämnar jag härmed följande uppgifter:

Mitt personnummer: [PERSONNUMMER]
Barnets personnummer: [BARNETS PERSONNUMMER]
Period: [PERIOD]

Kompletterande underlag: [BESKRIV BIFOGADE HANDLINGAR]

Jag ber om bekräftelse när handlingarna mottagits.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "fk-009",
    title: "Begäran om avbetalningsplan – återkrav",
    category: "Försäkringskassan",
    description: "Ansök om avbetalningsplan för ett återkrav",
    tags: ["avbetalning", "återkrav", "plan"],
    content: `Hej,

Jag har mottagit ett återkrav om [BELOPP] kr. Jag godtar kravet men befinner mig i en svår ekonomisk situation och kan inte betala hela beloppet på en gång.

Mitt personnummer är [PERSONNUMMER]. Jag ansöker om en avbetalningsplan med [BELOPP/MÅN] kr per månad med start [STARTDATUM].

Jag ber om bekräftelse och eventuella villkor för planen.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "fk-010",
    title: "Handikappersättning – statusfråga",
    category: "Försäkringskassan",
    description: "Fråga om status på ansökan om handikappersättning",
    tags: ["handikappersättning", "status", "funktionsnedsättning"],
    content: `Hej,

Jag lämnade in en ansökan om handikappersättning/merkostnadsersättning den [DATUM]. Ärendenummer: [ÄRENDENUMMER].

Mitt personnummer är [PERSONNUMMER]. Det har nu gått [ANTAL] veckor utan beslut. Jag ber om information om ärendets nuvarande status och beräknad beslutstid.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "fk-011",
    title: "Rehabiliteringspenning – ansökan",
    category: "Försäkringskassan",
    description: "Ansök om rehabiliteringspenning under pågående rehabilitering",
    tags: ["rehabilitering", "rehabiliteringspenning", "ansökan"],
    content: `Hej,

Jag genomgår för närvarande rehabilitering i enlighet med min rehabiliteringsplan upprättad [DATUM] av [KOORDINATOR/LÄKARE].

Mitt personnummer är [PERSONNUMMER]. Rehabiliteringsperioden avser [STARTDATUM] till [SLUTDATUM]. Jag ansöker om rehabiliteringspenning för denna period.

Bifogat finns rehabiliteringsplan och läkarintyg.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "fk-012",
    title: "Vab – bestrida avslag",
    category: "Försäkringskassan",
    description: "Bestrida avslag på VAB-ansökan",
    tags: ["vab", "avslag", "bestrid"],
    content: `Hej,

Jag har fått avslag på min ansökan om tillfällig föräldrapenning (VAB) för perioden [PERIOD], avseende mitt barn [BARNETS NAMN], personnummer [BARNETS PERSONNUMMER].

Mitt personnummer är [PERSONNUMMER]. Avslaget motiverades med [SKÄL ENLIGT BESLUTET]. Jag bestrider detta eftersom [DIN FÖRKLARING].

Bifogat läkarintyg och övriga handlingar styrker barnets sjukdom under aktuell period.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "fk-013",
    title: "Sjukersättning – omprövning",
    category: "Försäkringskassan",
    description: "Begär omprövning av beslut om sjukersättning",
    tags: ["sjukersättning", "omprövning", "permanent"],
    content: `Hej,

Jag begär omprövning av Försäkringskassans beslut daterat [DATUM] rörande sjukersättning, diarienummer [DIARIENUMMER].

Mitt personnummer är [PERSONNUMMER]. Min arbetsförmåga är varaktigt nedsatt till följd av [DIAGNOS/TILLSTÅND]. Jag anser att beslutet inte speglar min faktiska situation av följande skäl:

[BESKRIV SKÄLEN]

Bifogade läkarintyg och utlåtanden styrker min begäran.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "fk-014",
    title: "Ändring av uppgifter",
    category: "Försäkringskassan",
    description: "Anmäl ändrade förhållanden till Försäkringskassan",
    tags: ["ändring", "uppgifter", "anmälan"],
    content: `Hej,

Jag vill anmäla ändrade förhållanden som kan påverka mina ersättningar hos Försäkringskassan.

Mitt personnummer är [PERSONNUMMER]. Förändringen avser: [BESKRIV ÄNDRINGEN, T.EX. INKOMSTÄNDRING, NYTT ARBETE, ÄNDRAT BOENDE, ÄNDRAD FAMILJESITUATION].

Ändringen gäller från och med [DATUM]. Bifogat finns relevanta intyg och handlingar.

Jag ber om bekräftelse på att uppgifterna uppdaterats.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
];

export const MIGRATIONSVERKET_TEMPLATES: Template[] = [
  {
    id: "mig-001",
    title: "Förlängning av uppehållstillstånd",
    category: "Migrationsverket",
    description: "Ansök om förlängning av uppehållstillstånd",
    tags: ["uppehållstillstånd", "förlängning", "ansökan"],
    content: `Hej,

Jag ansöker om förlängning av mitt uppehållstillstånd som löper ut [UTGÅNGSDATUM].

Mitt personnummer/dossienummer är [PERSONNUMMER/DOSSIENUMMER]. Grunden för ansökan är [T.EX. ARBETE, FAMILJ, STUDIER]. Jag har vistats i Sverige sedan [DATUM] och uppfyller kraven för förlängning.

Bifogade handlingar: [LISTA BIFOGADE DOKUMENT, T.EX. ANSTÄLLNINGSAVTAL, INTYG].

Jag ber om bekräftelse på att ansökan mottagits och ärendenummer.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "mig-002",
    title: "Fråga om väntetid",
    category: "Migrationsverket",
    description: "Fråga om handläggningstid och status på ärende",
    tags: ["väntetid", "handläggningstid", "status"],
    content: `Hej,

Jag vill höra om status på mitt pågående ärende hos Migrationsverket.

Mitt dossienummer är [DOSSIENUMMER]. Ansökan lämnades in den [DATUM] avseende [ÄRENDETYP]. Det har nu gått [ANTAL MÅNADER] sedan ansökan och jag har ännu inte fått något beslut.

Jag ber om information om beräknad handläggningstid och ärendets nuvarande status.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "mig-003",
    title: "Komplettering av ärende",
    category: "Migrationsverket",
    description: "Skicka kompletterande handlingar till ett pågående ärende",
    tags: ["komplettering", "handlingar", "ärende"],
    content: `Hej,

Med anledning av er begäran om komplettering av ärende [DOSSIENUMMER], daterad [DATUM], sänder jag härmed följande handlingar:

1. [DOKUMENT 1]
2. [DOKUMENT 2]
3. [DOKUMENT 3]

Mitt personnummer/dossienummer är [PERSONNUMMER/DOSSIENUMMER]. Jag ber om bekräftelse på att handlingarna mottagits och registrerats i ärendet.

Om ytterligare uppgifter behövs kontaktar ni mig gärna på [TELEFON/E-POST].

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "mig-004",
    title: "Begäran om omprövning efter avslag",
    category: "Migrationsverket",
    description: "Begär omprövning efter avslag på ansökan",
    tags: ["avslag", "omprövning", "överklagande"],
    content: `Hej,

Jag har mottagit beslut om avslag på min ansökan, dossienummer [DOSSIENUMMER], daterat [DATUM].

Jag begär omprövning av detta beslut. Skälet är att beslutet inte tar hänsyn till följande omständigheter:

[BESKRIV OMSTÄNDIGHETERNA, T.EX. NYA BEVIS, FELAKTIG BEDÖMNING, ÄNDRAD SITUATION]

Bifogade handlingar styrker min begäran. Jag ber om svar snarast möjligt.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "mig-005",
    title: "Status på medborgarskapsansökan",
    category: "Migrationsverket",
    description: "Fråga om status på ansökan om svenskt medborgarskap",
    tags: ["medborgarskap", "status", "ansökan"],
    content: `Hej,

Jag ansökte om svenskt medborgarskap den [DATUM], dossienummer [DOSSIENUMMER].

Det har nu gått [ANTAL MÅNADER] och jag har ännu inte fått beslut. Jag uppfyller alla krav: jag har bott i Sverige i [ANTAL] år, haft uppehållstillstånd sedan [DATUM] och skött mig väl.

Jag ber om information om ärendets status och beräknat beslutsdatum.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "mig-006",
    title: "Ansökan om arbetstillstånd",
    category: "Migrationsverket",
    description: "Frågor och komplettering kring ansökan om arbetstillstånd",
    tags: ["arbetstillstånd", "arbete", "ansökan"],
    content: `Hej,

Jag har ansökt om arbetstillstånd för tjänsten [TJÄNST] hos arbetsgivaren [ARBETSGIVARE], dossienummer [DOSSIENUMMER].

Mitt personnummer/passernummer är [PERSONNUMMER]. Anställningen avser [PERIOD] med en månadslön om [LÖNBELOPP] kr, vilket uppfyller gällande lönekrav.

Bifogade handlingar: anställningsavtal, arbetsgivarens intyg och försäkringsbevis.

Jag ber om bekräftelse och besked om handläggningstid.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "mig-007",
    title: "Familjeåterförening – ansökan",
    category: "Migrationsverket",
    description: "Ansökan om uppehållstillstånd för familjeåterförening",
    tags: ["familjeåterförening", "familj", "uppehållstillstånd"],
    content: `Hej,

Jag ansöker om uppehållstillstånd för min [MAKE/MAKA/BARN/FÖRÄLDER], [NAMN], född [FÖDELSEDATUM], för att förena oss i Sverige.

Min egen status: uppehållstillstånd/medborgarskap [DITT TILLSTÅND], personnummer [DITT PERSONNUMMER].

Vi är [MAKE OCH MAKA/FÖRÄLDER OCH BARN] och vår relation styrks av bifogade dokument: vigselbevis, personbevis, foton och kommunikationshistorik.

Jag ber om bekräftelse och information om handläggningstid.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "mig-008",
    title: "Överklagande till migrationsdomstolen",
    category: "Migrationsverket",
    description: "Överklaga Migrationsverkets beslut till migrationsdomstolen",
    tags: ["överklagande", "domstol", "beslut"],
    content: `Hej,

Jag överklagar Migrationsverkets beslut daterat [DATUM], dossienummer [DOSSIENUMMER], till migrationsdomstolen.

Mitt personnummer är [PERSONNUMMER]. Grunden för överklagandet är:

[BESKRIV DETALJERAT VARFÖR BESLUTET ÄR FELAKTIGT]

Jag åberopar följande bevisning: [LISTA BEVIS OCH BIFOGADE HANDLINGAR].

Jag begär inhibition av beslutet medan överklagandet handläggs.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "mig-009",
    title: "Asylansökan – komplettering",
    category: "Migrationsverket",
    description: "Komplettera en asylansökan med ytterligare bevis",
    tags: ["asyl", "komplettering", "skyddsskäl"],
    content: `Hej,

Jag kompleterar min asylansökan, dossienummer [DOSSIENUMMER], med ytterligare underlag som styrker mina skyddsskäl.

Mitt personnummer/dossienummer är [PERSONNUMMER/DOSSIENUMMER]. De nya handlingarna visar: [BESKRIV KORTFATTAT VAD HANDLINGARNA VISAR].

Bifogat: [LISTA BIFOGADE DOKUMENT].

Jag ber om bekräftelse på att handlingarna registrerats i mitt ärende.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "mig-010",
    title: "Begäran om nytt PUT",
    category: "Migrationsverket",
    description: "Ansök om permanent uppehållstillstånd",
    tags: ["PUT", "permanent", "uppehållstillstånd"],
    content: `Hej,

Jag ansöker om permanent uppehållstillstånd (PUT). Jag har haft tidsbegränsat uppehållstillstånd sedan [DATUM] och uppfyller kraven för permanent tillstånd.

Mitt personnummer/dossienummer är [PERSONNUMMER/DOSSIENUMMER]. Jag har bott och arbetat/studerat i Sverige under [ANTAL] år, med en sammanhängande legal vistelse utan avbrott.

Bifogade handlingar styrker min anknytning till Sverige och uppfyllda krav.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "mig-011",
    title: "Adressändring och kontaktuppgifter",
    category: "Migrationsverket",
    description: "Anmäl ny adress och uppdaterade kontaktuppgifter",
    tags: ["adress", "kontaktuppgifter", "ändring"],
    content: `Hej,

Jag vill anmäla ändrade kontaktuppgifter kopplade till mitt ärende hos Migrationsverket.

Dossienummer: [DOSSIENUMMER]
Personnummer: [PERSONNUMMER]

Ny adress: [NY ADRESS]
Nytt telefonnummer: [NYTT TELEFONNUMMER]
Ny e-post: [NY E-POST]

Ändringen gäller från och med [DATUM]. Jag ber om bekräftelse på att uppgifterna uppdaterats.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "mig-012",
    title: "Begäran om tolkhjälp",
    category: "Migrationsverket",
    description: "Begär tillgång till tolk vid kommande möte eller samtal",
    tags: ["tolk", "samtal", "möte"],
    content: `Hej,

Jag har blivit kallad till möte/samtal hos Migrationsverket den [DATUM].

Dossienummer: [DOSSIENUMMER]. Jag behöver tolkhjälp på [SPRÅK] för att kunna kommunicera korrekt och förstå all information under mötet.

Jag ber er bekräfta att en kompetent tolk på [SPRÅK] kommer att finnas tillgänglig vid tillfället.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "mig-013",
    title: "Visumansökan – följebrev",
    category: "Migrationsverket",
    description: "Följebrev till ansökan om besöksvisum",
    tags: ["visum", "besöksvisum", "följebrev"],
    content: `Hej,

Jag ansöker om besöksvisum för [NAMN PÅ GÄST], medborgare i [LAND], för ett besök i Sverige under perioden [STARTDATUM]–[SLUTDATUM].

Jag är [DIN RELATION, T.EX. MAKE, FÖRÄLDER, VÄN] och bjuder in [NAMN] till min adress [DIN ADRESS], personnummer [DITT PERSONNUMMER].

Jag garanterar att [NAMN] kommer att lämna Sverige innan vistelsens utgång och att alla kostnader för uppehället täcks.

Bifogade handlingar: inbjudningsbrev, personbevis, bankutdrag och bostadsintyg.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "mig-014",
    title: "Begäran om skyndsam handläggning",
    category: "Migrationsverket",
    description: "Begär prioriterad och skyndsam handläggning av ditt ärende",
    tags: ["skyndsam", "prioritering", "handläggning"],
    content: `Hej,

Jag begär skyndsam handläggning av mitt ärende, dossienummer [DOSSIENUMMER].

Mitt personnummer är [PERSONNUMMER]. Skälet till att ärendet är brådskande är: [BESKRIV SKÄLET, T.EX. ANSTÄLLNING SOM VÄNTAR, FAMILJESKÄL, MEDICINSK SITUATION, TILLSTÅNDET LÖPER UT SNART].

Utan ett snabbt beslut riskerar jag [BESKRIV KONSEKVENSER]. Jag ber om att ärendet prioriteras och att jag kontaktas snarast.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
];

export const BOVERKET_TEMPLATES: Template[] = [
  {
    id: "bov-001",
    title: "Begäran om reparation",
    category: "Underhåll",
    description: "Formell begäran om reparation av fel i lägenheten",
    tags: ["reparation", "fel", "underhåll"],
    content: `Hej,

Jag skriver angående ett fel i min lägenhet på [ADRESS], lägenhetsnummer [LÄGENHETSNR].

Felet uppstod [DATUM] och består av följande: [BESKRIV FELET NOGGRANT].

Jag önskar att ni åtgärdar detta snarast möjligt, gärna inom 14 dagar. Vänligen kontakta mig på [TELEFON/E-POST] för att boka in ett lämpligt besök.

Med vänliga hälsningar,
[DITT NAMN]
[ADRESS]
[DATUM]`,
  },
  {
    id: "bov-002",
    title: "Klagomål på grannar (störning)",
    category: "Störningar",
    description: "Anmälan om störande grannar till fastighetsägaren",
    tags: ["störning", "grannar", "buller", "klagomål"],
    content: `Hej,

Jag bor i lägenhet [LÄGENHETSNR] på [ADRESS] och vill anmäla störningar från grannlägenheten [GRANNENS LÄGENHETSNR].

Störningarna består av [BESKRIV STÖRNINGEN, T.EX. HÖGT LJUD, MUSIK] och äger rum [TIDPUNKT, T.EX. SENT PÅ KVÄLLEN/NATTEN].

Jag har [ANTAL] gånger bett grannen att minska störningarna utan resultat. Jag ber er nu att vidta nödvändiga åtgärder för att situationen ska upphöra.

Med vänliga hälsningar,
[DITT NAMN]
Lägenhet [LÄGENHETSNR]
[DATUM]`,
  },
  {
    id: "bov-003",
    title: "Uppsägning av hyreskontrakt",
    category: "Uppsägning",
    description: "Formell uppsägning av hyresavtalet med rätt uppsägningstid",
    tags: ["uppsägning", "kontrakt", "flytta"],
    content: `Hej,

Jag, [DITT NAMN], hyresgäst i lägenhet [LÄGENHETSNR] på [ADRESS], säger härmed upp mitt hyresavtal.

Uppsägningstiden är [ANTAL MÅNADER] månader enligt kontraktet, och jag önskar att hyresavtalet upphör [DATUM].

Sista hyresbetalning sker [DATUM]. Jag ber er bekräfta mottagandet av denna uppsägning skriftligen.

Med vänliga hälsningar,
[DITT NAMN]
[ADRESS], Lgh [LÄGENHETSNR]
[TELEFON]
[DATUM]`,
  },
  {
    id: "bov-004",
    title: "Begäran om hyressänkning",
    category: "Ekonomi",
    description: "Formell begäran om hyressänkning vid brister i lägenheten",
    tags: ["hyra", "sänkning", "ekonomi", "brister"],
    content: `Hej,

Jag hyr lägenhet [LÄGENHETSNR] på [ADRESS] och önskar diskutera en hyressänkning på grund av [BESKRIV BRISTER, T.EX. FUKTSKADA, DEFEKT UPPVÄRMNING].

Bristerna har funnits sedan [DATUM] och trots påpekande har de inte åtgärdats. Dessa brister innebär att jag inte kan nyttja bostaden fullt ut.

Jag begär en hyressänkning om [BELOPP/PROCENT] tills bristerna är åtgärdade. Svarar ni inte inom 14 dagar avser jag att ansöka om nedsättning hos Hyresnämnden.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "bov-005",
    title: "Tillstånd för andrahandsuthyrning",
    category: "Hyresrätt",
    description: "Ansökan om tillstånd att hyra ut lägenheten i andra hand",
    tags: ["andrahand", "uthyrning", "tillstånd"],
    content: `Hej,

Jag, [DITT NAMN], hyr lägenhet [LÄGENHETSNR] på [ADRESS] och ansöker härmed om tillstånd att hyra ut lägenheten i andra hand.

Period för andrahandsuthyrning: [FRÅN DATUM] till [TILL DATUM].

Skälet till ansökan är: [BESKRIV SKÄLET, T.EX. ARBETE PÅ ANNAN ORT, STUDIER UTOMLANDS, SJUKDOM].

Andrahandshyresgäst: [PERSONUPPGIFTER OM KÄND].

Jag förbinder mig att informera er om eventuella förändringar och att min hyra betalas i tid.

Med vänliga hälsningar,
[DITT NAMN]
[KONTAKTUPPGIFTER]
[DATUM]`,
  },
  {
    id: "bov-006",
    title: "Inbesiktning av lägenhet",
    category: "Inspektion",
    description: "Svar på kallelse om besiktning av lägenheten",
    tags: ["besiktning", "inspektion", "inflyttning"],
    content: `Hej,

Tack för er kallelse till besiktning av lägenhet [LÄGENHETSNR] på [ADRESS] den [DATUM].

Jag bekräftar att jag kan närvara vid besiktningen. Jag vill gärna att följande noteringar tas med i besiktningsprotokollet:

1. [FEL/BRIST 1]
2. [FEL/BRIST 2]
3. [FEL/BRIST 3]

Jag önskar en kopia av besiktningsprotokollet efter besiktningstillfället.

Med vänliga hälsningar,
[DITT NAMN]
[DATUM]`,
  },
  {
    id: "bov-007",
    title: "Klagomål på dålig städning",
    category: "Underhåll",
    description: "Klagomål om bristande städning av gemensamma utrymmen",
    tags: ["städning", "gemensamma utrymmen", "trappuppgång"],
    content: `Hej,

Jag är boende i [ADRESS] och vill påpeka att städningen av de gemensamma utrymmena (trappuppgång, tvättstuga, källare) inte uppfyller rimlig standard.

Senast städades [UTRYMME] den [DATUM] och sedan dess har [BESKRIV PROBLEMET, T.EX. SMUTS, SKRÄP, DÅLIG LUKT] förekommit.

Jag ber er att se till att städrutinerna åtgärdas och att utrymmena hålls i acceptabelt skick.

Med vänliga hälsningar,
[DITT NAMN]
Lgh [LÄGENHETSNR]
[DATUM]`,
  },
  {
    id: "bov-008",
    title: "Meddelande om inflyttning",
    category: "Hyresrätt",
    description: "Meddelande till hyresvärden inför inflyttning",
    tags: ["inflyttning", "nyckel", "kontrakt"],
    content: `Hej,

Jag, [DITT NAMN], har tecknat hyresavtal för lägenhet [LÄGENHETSNR] på [ADRESS] och meddelar att jag planerar att flytta in den [DATUM].

Jag önskar bekräftelse på:
- Tid och plats för nyckelöverlämnande
- Att el, värme och vatten är inkopplat
- Eventuella övriga rutiner inför inflyttning

Har ni frågor eller behöver mer information är ni välkommen att kontakta mig.

Med vänliga hälsningar,
[DITT NAMN]
[TELEFON]
[E-POST]`,
  },
  {
    id: "bov-009",
    title: "Påminnelse om reparation",
    category: "Underhåll",
    description: "Uppföljning och påminnelse på en tidigare inlämnad felanmälan",
    tags: ["påminnelse", "reparation", "uppföljning"],
    content: `Hej,

Den [DATUM] anmälde jag ett fel i min lägenhet [LÄGENHETSNR] på [ADRESS] gällande [BESKRIV FELET]. Jag har ännu inte fått någon återkoppling eller åtgärd.

Jag påminner härmed om ärendet och ber er snarast meddela när reparationen kan utföras. Om åtgärd inte sker inom 7 dagar ser jag mig tvungen att kontakta Hyresnämnden.

Tack för er uppmärksamhet.

Med vänliga hälsningar,
[DITT NAMN]
[KONTAKTUPPGIFTER]
[DATUM]`,
  },
  {
    id: "bov-010",
    title: "Krav på återbetalning av deposition",
    category: "Ekonomi",
    description: "Formellt krav på att få tillbaka sin hyresdeposition",
    tags: ["deposition", "återbetalning", "utflytt"],
    content: `Hej,

Jag, [DITT NAMN], lämnade lägenheten på [ADRESS] den [DATUM] och betalade tidigare en deposition om [BELOPP] kr.

Mer än [ANTAL] veckor har passerat sedan utflytt utan att depositionen återbetalats. Lagen kräver att depositionen återbetalas skyndsamt efter avflyttning, förutsatt att inga skador föreligger.

Jag kräver att [BELOPP] kr återbetalas till bankgiro/kontonummer [KONTONUMMER] senast [DATUM]. Sker inte återbetalning i tid ser jag mig tvungen att ta ärendet vidare.

Med vänliga hälsningar,
[DITT NAMN]
[KONTAKTUPPGIFTER]
[DATUM]`,
  },
];

export const CV_TEMPLATES: Template[] = [
  {
    id: "cv-001",
    title: "Allmänt CV – grundmall",
    category: "Grundläggande",
    description: "En komplett och professionell CV-mall för de flesta yrken",
    tags: ["cv", "ansökan", "allmänt"],
    content: `[DITT NAMN]
[ADRESS], [POSTNUMMER] [ORT]
[TELEFON] · [E-POST]
[LINKEDIN-URL eller WEBBPLATS]

──────────────────────────────
PROFIL
──────────────────────────────
[Skriv 2–3 meningar om dig själv, dina styrkor och vad du söker. Exempel: Engagerad och lösningsorienterad [YRKE] med [ANTAL] års erfarenhet inom [BRANSCH]. Jag trivs i miljöer där jag kan kombinera [STYRKA 1] och [STYRKA 2]. Söker nu en tjänst där jag kan bidra med min kompetens och fortsätta utvecklas.]

──────────────────────────────
ARBETSLIVSERFARENHET
──────────────────────────────
[JOBBTITEL] · [FÖRETAG], [ORT]
[STARTMÅNAD ÅR] – [SLUTMÅNAD ÅR / Nuvarande]
• [Beskriv ansvar och prestation, t.ex.: Ansvarade för kundservice och hantering av inkommande ärenden]
• [Beskriv ansvar och prestation]
• [Beskriv ansvar och prestation]

[JOBBTITEL] · [FÖRETAG], [ORT]
[STARTMÅNAD ÅR] – [SLUTMÅNAD ÅR]
• [Beskriv ansvar och prestation]
• [Beskriv ansvar och prestation]

──────────────────────────────
UTBILDNING
──────────────────────────────
[EXAMEN / PROGRAM] · [SKOLA/UNIVERSITET], [ORT]
[STARTÅR] – [SLUTÅR]
[Eventuellt: Inriktning, uppsats, utmärkelse]

[GYMNASIEPROGRAM] · [GYMNASIESKOLA], [ORT]
[STARTÅR] – [SLUTÅR]

──────────────────────────────
KOMPETENSER
──────────────────────────────
Språk: [T.ex. Svenska (modersmål), Engelska (flytande), Spanska (grundläggande)]
Program: [T.ex. Microsoft Office, Adobe Creative Suite, Salesforce]
Övrigt: [T.ex. B-körkort, truckkort, certifikat]

──────────────────────────────
REFERENSER
──────────────────────────────
Lämnas på begäran.`,
  },
  {
    id: "cv-002",
    title: "CV – första jobbet",
    category: "Specifik situation",
    description: "CV-mall för dig som söker ditt första jobb eller sommarjobb",
    tags: ["första jobbet", "student", "sommarjobb", "nyexaminerad"],
    content: `[DITT NAMN]
[ADRESS], [POSTNUMMER] [ORT]
[TELEFON] · [E-POST]
Född: [ÅR]

──────────────────────────────
PROFIL
──────────────────────────────
Motiverad och snabblärd person med starkt intresse för [BRANSCH/YRKE]. Jag är van att arbeta både självständigt och i team, tar ansvar och lär mig snabbt nya arbetsuppgifter. Söker nu mitt första jobb för att omsätta mina kunskaper i praktiken.

──────────────────────────────
UTBILDNING
──────────────────────────────
[GYMNASIEPROGRAM / UNIVERSITETSUTBILDNING] · [SKOLA], [ORT]
[STARTÅR] – [SLUTÅR / Pågående]
Relevanta kurser: [T.ex. Ekonomi, Kommunikation, Programmering]

──────────────────────────────
ERFARENHET
──────────────────────────────
[VOLONTÄRARBETE / PRAKTIK / EXTRAJOBB] · [ORGANISATION/FÖRETAG], [ORT]
[PERIOD]
• [Vad du gjorde och lärde dig]
• [Ansvarsområden]

Skolprojekt / Eget initiativ
• [Beskriv ett relevant projekt du genomfört på skolan eller på eget initiativ]

──────────────────────────────
ÖVRIGA MERITER
──────────────────────────────
• [Föreningsengagemang, ledaruppdrag, idrottsträning, etc.]
• [Eventuella kurser eller certifikat, t.ex. Säker Trafik, First Aid, etc.]

──────────────────────────────
KOMPETENSER
──────────────────────────────
Språk: [Svenska, Engelska, etc.]
Dator: [Word, Excel, sociala medier, etc.]
Körkort: [Ja/Nej, klass]

──────────────────────────────
REFERENSER
──────────────────────────────
[Lärare: NAMN, TELEFON] eller Lämnas på begäran.`,
  },
  {
    id: "cv-003",
    title: "CV – karriärbyte",
    category: "Specifik situation",
    description: "CV-mall anpassad för dig som byter bransch eller yrke",
    tags: ["karriärbyte", "ny bransch", "omställning"],
    content: `[DITT NAMN]
[ADRESS], [POSTNUMMER] [ORT]
[TELEFON] · [E-POST]

──────────────────────────────
PROFIL – VARFÖR JAG BYTER RIKTNING
──────────────────────────────
Erfaren [NUVARANDE YRKE] som nu söker sig mot [NY BRANSCH/YRKE]. Mina [ANTAL] år inom [NUVARANDE BRANSCH] har gett mig starka kunskaper i [ÖVERFÖRBAR KOMPETENS 1], [ÖVERFÖRBAR KOMPETENS 2] och [ÖVERFÖRBAR KOMPETENS 3] — färdigheter som jag ser stor nytta av i den nya rollen. Motiverad av [ORSAK TILL KARRIÄRBYTET, T.EX. INTRESSE, VÄRDERINGAR, LIVSSTILSVAL].

──────────────────────────────
ÖVERFÖRBARA KOMPETENSER
──────────────────────────────
• [Kompetens 1 från tidigare jobb som är relevant för det nya yrket]
• [Kompetens 2]
• [Kompetens 3]
• [Kompetens 4]

──────────────────────────────
ARBETSLIVSERFARENHET
──────────────────────────────
[JOBBTITEL] · [FÖRETAG], [ORT]
[PERIOD]
• [Fokusera på uppgifter som är relevanta för det nya yrket]
• [Lyft fram ledarskap, kommunikation, analys eller andra transferabla förmågor]

──────────────────────────────
UTBILDNING & KOMPETENSUTVECKLING
──────────────────────────────
[RELEVANT KURS / UTBILDNING] · [SKOLA/PLATTFORM], [ÅR]
[Examen/Certifikat]

[GRUNDUTBILDNING] · [SKOLA], [ÅR]

──────────────────────────────
ÖVRIGT
──────────────────────────────
• [Volontärarbete, sidoprojekt eller eget initiativ inom den nya branschen]
• [Nätverkande, branschorganisationer, etc.]

──────────────────────────────
REFERENSER
──────────────────────────────
Lämnas på begäran.`,
  },
  {
    id: "cv-004",
    title: "CV – teknisk roll",
    category: "Bransch",
    description: "CV-mall för IT, teknik och ingenjörsyrken",
    tags: ["it", "teknik", "ingenjör", "programmering"],
    content: `[DITT NAMN]
[ADRESS], [POSTNUMMER] [ORT]
[TELEFON] · [E-POST] · [GITHUB/PORTFOLIO-URL]

──────────────────────────────
PROFIL
──────────────────────────────
[JOBBTITEL, t.ex. Fullstackutvecklare] med [ANTAL] års erfarenhet av [TEKNIKER/PLATTFORMAR]. Jag brinner för att bygga robusta och användarvänliga lösningar. Trivs i agila miljöer och är van vid att arbeta nära produktteam och slutanvändare.

──────────────────────────────
TEKNISK KOMPETENS
──────────────────────────────
Programmeringsspråk: [T.ex. Python, JavaScript, Java, C#]
Ramverk & bibliotek: [T.ex. React, Node.js, Spring Boot, Django]
Databaser: [T.ex. PostgreSQL, MySQL, MongoDB]
Verktyg & plattformar: [T.ex. Git, Docker, AWS, Azure, Jira]
Metodik: [T.ex. Scrum, Kanban, CI/CD, TDD]

──────────────────────────────
ARBETSLIVSERFARENHET
──────────────────────────────
[JOBBTITEL] · [FÖRETAG], [ORT]
[PERIOD]
• [Beskriv projekt och teknisk lösning, t.ex.: Utvecklade REST API i Node.js som minskade svarstiden med 40 %]
• [Beskriv ansvar]
• [Mätbara resultat om möjligt]

[JOBBTITEL] · [FÖRETAG], [ORT]
[PERIOD]
• [Beskriv ansvar och prestation]

──────────────────────────────
PROJEKT (URVAL)
──────────────────────────────
[PROJEKTNAMN] · [TEKNIKER ANVÄNDA]
[Kort beskrivning – vad projektet löste och din roll. Länk om möjligt.]

──────────────────────────────
UTBILDNING
──────────────────────────────
[EXAMEN] · [SKOLA], [ORT]
[PERIOD]

──────────────────────────────
CERTIFIKAT
──────────────────────────────
• [T.ex. AWS Certified Developer, Google Cloud Professional, etc.]

──────────────────────────────
REFERENSER
──────────────────────────────
Lämnas på begäran.`,
  },
  {
    id: "cv-005",
    title: "CV – vård och omsorg",
    category: "Bransch",
    description: "CV-mall för sjukvård, äldreomsorg och socialt arbete",
    tags: ["vård", "omsorg", "sjuksköterska", "undersköterska", "socialt arbete"],
    content: `[DITT NAMN]
[ADRESS], [POSTNUMMER] [ORT]
[TELEFON] · [E-POST]

──────────────────────────────
PROFIL
──────────────────────────────
Omtänksam och ansvarstagande [YRKE, t.ex. undersköterska] med [ANTAL] års erfarenhet inom [VERKSAMHETSTYP, t.ex. hemtjänst, äldreboende, akutvård]. Jag arbetar med stort engagemang för patientens/brukarens välmående och är van vid att hantera krävande situationer med lugn och empati.

──────────────────────────────
ARBETSLIVSERFARENHET
──────────────────────────────
[YRKETITEL] · [ARBETSGIVARE], [ORT]
[PERIOD]
• [Beskriv arbetsuppgifter, t.ex.: Personlig omvårdnad, medicindelning, dokumentation i journalsystem]
• [Beskriv ansvarsområden]
• [Eventuella specialuppgifter eller ledaransvar]

[YRKETITEL] · [ARBETSGIVARE], [ORT]
[PERIOD]
• [Beskriv arbetsuppgifter]

──────────────────────────────
UTBILDNING
──────────────────────────────
[EXAMEN / PROGRAM, t.ex. Omvårdnadsprogrammet] · [SKOLA], [ORT]
[PERIOD]

──────────────────────────────
LEGITIMATION & CERTIFIKAT
──────────────────────────────
• [T.ex. Legitimerad sjuksköterska, Socialstyrelsen, ÅR]
• [T.ex. Hjärt-lungräddning (HLR), ÅR]
• [T.ex. Demensutbildning, ÅR]

──────────────────────────────
KOMPETENSER
──────────────────────────────
Journalsystem: [T.ex. TakeCare, Lifecare, Procapita]
Språk: [T.ex. Svenska (modersmål), Engelska, Arabiska]
Övrigt: [T.ex. B-körkort, förarbevis for truck]

──────────────────────────────
REFERENSER
──────────────────────────────
Lämnas på begäran.`,
  },
  {
    id: "cv-006",
    title: "CV – handel och service",
    category: "Bransch",
    description: "CV-mall för butik, kundservice och restaurang",
    tags: ["handel", "butik", "kundservice", "restaurang", "service"],
    content: `[DITT NAMN]
[ADRESS], [POSTNUMMER] [ORT]
[TELEFON] · [E-POST]

──────────────────────────────
PROFIL
──────────────────────────────
Serviceinriktad och energisk person med god vana av kundkontakt och kassaarbete. Jag trivs i ett högt tempo, samarbetar väl med kollegor och sätter alltid kunden i fokus. Har erfarenhet av [BUTIK/RESTAURANG/HOTELL] och är van vid att arbeta kvällar och helger.

──────────────────────────────
ARBETSLIVSERFARENHET
──────────────────────────────
[TJÄNST, t.ex. Butikssäljare] · [ARBETSGIVARE], [ORT]
[PERIOD]
• Kundmottagning, kassahantering och rådgivning
• [Beskriv övriga arbetsuppgifter, t.ex.: Varupåfyllning, lagerhantering, prismärkning]
• [Eventuella extrauppgifter, t.ex.: Tränat nyanställda, skötsel av skyltfönster]

[TJÄNST] · [ARBETSGIVARE], [ORT]
[PERIOD]
• [Beskriv arbetsuppgifter]

──────────────────────────────
UTBILDNING
──────────────────────────────
[GYMNASIEPROGRAM, t.ex. Handelsprogrammet] · [SKOLA], [ORT]
[PERIOD]

──────────────────────────────
KOMPETENSER
──────────────────────────────
Kassasystem: [T.ex. Sitoo, Pyramid, Trivec]
Språk: [T.ex. Svenska, Engelska, Somaliska]
Övrigt: [T.ex. B-körkort, truckkörkort, kassaansvar]

──────────────────────────────
ÖVRIGA MERITER
──────────────────────────────
• [Föreningsengagemang, idrottsträning, volontärarbete]

──────────────────────────────
REFERENSER
──────────────────────────────
Lämnas på begäran.`,
  },
  {
    id: "cv-007",
    title: "CV – offentlig sektor",
    category: "Bransch",
    description: "CV-mall för statliga myndigheter, kommuner och regioner",
    tags: ["offentlig sektor", "myndighet", "kommun", "region", "handläggare"],
    content: `[DITT NAMN]
[ADRESS], [POSTNUMMER] [ORT]
[TELEFON] · [E-POST]

──────────────────────────────
PROFIL
──────────────────────────────
Strukturerad och noggrann [YRKE, t.ex. handläggare/utredare/koordinator] med [ANTAL] års erfarenhet inom [SEKTOR, t.ex. kommunal förvaltning]. Jag har god kunskap om relevant lagstiftning, är van att skriva formella beslut och rapporter samt arbetar självständigt med komplexa ärenden.

──────────────────────────────
ARBETSLIVSERFARENHET
──────────────────────────────
[JOBBTITEL] · [MYNDIGHET/FÖRVALTNING], [ORT]
[PERIOD]
• [Beskriv arbetsuppgifter, t.ex.: Handläggning av ärenden enligt [LAG], skriftlig ärendekommunikation med medborgare]
• [Dokumentation, diarieföring, samordning]
• [Beskriv eventuella specialuppdrag eller projektansvar]

[JOBBTITEL] · [ARBETSGIVARE], [ORT]
[PERIOD]
• [Beskriv arbetsuppgifter]

──────────────────────────────
UTBILDNING
──────────────────────────────
[EXAMEN, t.ex. Kandidatexamen i statsvetenskap/juridik/socionom] · [SKOLA], [ORT]
[PERIOD]

──────────────────────────────
LAGSTIFTNING & SYSTEM
──────────────────────────────
Lagar: [T.ex. Förvaltningslagen, Socialtjänstlagen, Offentlighetsprincipen]
Ärendesystem: [T.ex. W3D3, Platina, Treserva, Pulsen Combine]

──────────────────────────────
KOMPETENSER
──────────────────────────────
• Utmärkt skriftlig förmåga på svenska
• Vana vid formell myndighetskommunikation
• [Övriga relevanta kompetenser]

──────────────────────────────
REFERENSER
──────────────────────────────
Lämnas på begäran.`,
  },
  {
    id: "cv-008",
    title: "CV – återgång till arbete",
    category: "Specifik situation",
    description: "CV-mall efter föräldraledighet, sjukskrivning eller studieuppehåll",
    tags: ["föräldraledighet", "sjukskrivning", "uppehåll", "återgång"],
    content: `[DITT NAMN]
[ADRESS], [POSTNUMMER] [ORT]
[TELEFON] · [E-POST]

──────────────────────────────
PROFIL
──────────────────────────────
Erfaren [YRKE] som nu återvänder till arbetslivet efter [FÖRÄLDRALEDIGHET/STUDIER/SJUKSKRIVNING]. Jag har under den här perioden [BESKRIV VAD DU GJORT, t.ex. friskat upp mina kunskaper genom kurser, engagerat mig i volontärarbete, fokuserat på rehabilitering]. Jag är redo att ta nya kliv och ser fram emot att bidra med min kompetens och erfarenhet.

──────────────────────────────
ARBETSLIVSERFARENHET
──────────────────────────────
[UPPEHÅLLSPERIOD] · [ORSAK, t.ex. Föräldraledighet, Sjukskrivning, Studier]
[PERIOD]
[Valfritt: nämn kort vad du gjort under uppehållet — kurs, volontärarbete, etc.]

[JOBBTITEL] · [FÖRETAG], [ORT]
[PERIOD]
• [Beskriv dina mest relevanta arbetsuppgifter och prestationer]
• [Beskriv ansvar]

[JOBBTITEL] · [FÖRETAG], [ORT]
[PERIOD]
• [Beskriv arbetsuppgifter]

──────────────────────────────
UTBILDNING
──────────────────────────────
[EXAMEN] · [SKOLA], [ORT]
[PERIOD]

[KURS VID ÅTERKOMST, om tillämpligt] · [SKOLA/PLATTFORM]
[ÅR]

──────────────────────────────
KOMPETENSER
──────────────────────────────
Språk: [T.ex. Svenska, Engelska]
Program: [Relevanta verktyg]
Övrigt: [Körkort, certifikat etc.]

──────────────────────────────
REFERENSER
──────────────────────────────
Lämnas på begäran.`,
  },
  {
    id: "cv-009",
    title: "CV – byggnad och hantverk",
    category: "Bransch",
    description: "CV-mall för bygg, el, VVS och hantverksyrken",
    tags: ["bygg", "hantverkare", "el", "vvs", "snickare", "målare"],
    content: `[DITT NAMN]
[ADRESS], [POSTNUMMER] [ORT]
[TELEFON] · [E-POST]

──────────────────────────────
PROFIL
──────────────────────────────
Erfaren [YRKE, t.ex. snickare/elektriker/rörmokare] med [ANTAL] års arbete inom [BYGGBRANSCHEN/VVS/EL]. Jag har gedigen erfarenhet av [SPECIFICERA, t.ex. nybyggnation, renovering, installationer], arbetar noggrant och levererar alltid i tid. Trivs lika bra med självständigt arbete som i team på bygget.

──────────────────────────────
ARBETSLIVSERFARENHET
──────────────────────────────
[JOBBTITEL] · [FÖRETAG], [ORT]
[PERIOD]
• [Beskriv arbetsuppgifter, t.ex.: Nybyggnation av villor och flerbostadshus]
• [T.ex. Renovering av kök och badrum, golvläggning, fönsterbyte]
• [Eventuella ledaruppdrag, t.ex. arbetsledare, lagbas]

[JOBBTITEL] · [FÖRETAG], [ORT]
[PERIOD]
• [Beskriv arbetsuppgifter]

──────────────────────────────
UTBILDNING
──────────────────────────────
[GYMNASIEPROGRAM, t.ex. Bygg- och anläggningsprogrammet] · [SKOLA], [ORT]
[PERIOD]

[GESÄLLBREV / MÄSTARBREV / CERTIFIKAT] · [UTFÄRDARE]
[ÅR]

──────────────────────────────
KOMPETENSER & BEHÖRIGHETER
──────────────────────────────
• B-körkort [och eventuellt C/CE, truckkort, skyliftbehörighet]
• [T.ex. Elinstallationsbehörighet, Gasinstallationsbehörighet]
• [T.ex. Svetsning MIG/MAG, Certifikat tätskikt]
• Verktyg: [Relevanta maskiner och verktyg]

──────────────────────────────
REFERENSER
──────────────────────────────
Lämnas på begäran.`,
  },
  {
    id: "cv-010",
    title: "CV – ledarskap och chef",
    category: "Grundläggande",
    description: "CV-mall för chefer, teamledare och projektledare",
    tags: ["chef", "ledare", "teamledare", "projektledare", "manager"],
    content: `[DITT NAMN]
[ADRESS], [POSTNUMMER] [ORT]
[TELEFON] · [E-POST] · [LINKEDIN]

──────────────────────────────
PROFIL
──────────────────────────────
Resultatdriven [LEDARROLL, t.ex. avdelningschef / projektledare] med [ANTAL] års erfarenhet av att leda team inom [BRANSCH]. Jag driver förändring med tydlig kommunikation, skapar engagemang och levererar affärsresultat. Skicklig på att kombinera strategiskt tänkande med operativt ansvar.

──────────────────────────────
NYCKELKOMPETENSER
──────────────────────────────
• Personalansvar för [ANTAL] medarbetare
• Budget- och resultatansvar (ca [BUDGET] MSEK)
• [Ledarskapsmetod, t.ex. Coachande ledarskap, OKR, Agile]
• [Förändringsledning / Rekrytering / Medarbetarutveckling]

──────────────────────────────
ARBETSLIVSERFARENHET
──────────────────────────────
[CHEFSROLL / LEDARTITEL] · [FÖRETAG], [ORT]
[PERIOD]
• Led ett team av [ANTAL] medarbetare inom [FUNKTION]
• [Mätbart resultat, t.ex.: Ökade omsättningen med 25 % under [ÅR]]
• [Beskriv strategiska initiativ, organisationsförändringar, etc.]
• [Rekrytering, onboarding, medarbetarsamtal, kompetensutveckling]

[TIDIGARE LEDARROLL] · [FÖRETAG], [ORT]
[PERIOD]
• [Beskriv ansvar och prestationer]

──────────────────────────────
UTBILDNING
──────────────────────────────
[EXAMEN, t.ex. Civilekonom / MBA / Kandidat i ledarskap] · [SKOLA], [ORT]
[PERIOD]

[LEDARUTVECKLINGSPROGRAM / KURS] · [ARRANGÖR]
[ÅR]

──────────────────────────────
KOMPETENSER
──────────────────────────────
Språk: [T.ex. Svenska, Engelska, Tyska]
System: [T.ex. SAP, Workday, Salesforce, Microsoft 365]
Metodik: [T.ex. Lean, Six Sigma, Prince2, PMP]

──────────────────────────────
REFERENSER
──────────────────────────────
Lämnas på begäran.`,
  },
];
