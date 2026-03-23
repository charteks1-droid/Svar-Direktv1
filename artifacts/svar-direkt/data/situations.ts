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
