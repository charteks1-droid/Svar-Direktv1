const API = "https://antiquewhite-lapwing-486017.hostingersite.com/api/forum";

const randToken = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const seed = [
  {
    category: "kronofogden",
    title: "Hur lång tid tar det innan en betalningsanmärkning försvinner?",
    body: "Hej! Jag fick en betalningsanmärkning för tre år sedan på grund av en obetald faktura. Skulden är nu betald sedan länge. När försvinner anmärkningen från mitt register? Påverkar den fortfarande mina chanser att få ett bostadslån?",
    replies: [
      "En betalningsanmärkning för privatpersoner ligger kvar i 3 år från registreringsdatumet, oavsett om skulden är betald eller inte. För företag är det 5 år. Att betala skulden tar alltså inte bort anmärkningen tidigare, men det syns i registret att den är reglerad vilket långivare ser positivt på.",
      "Jag var i exakt samma situation 2023. Bankerna sa nej till bolån trots att skulden var betald. Efter att de 3 åren gått ut försvann den automatiskt och jag fick lånet. Tips: be UC om en gratis kreditupplysning så ser du exakt vilket datum den försvinner.",
      "Viktigt att veta: även om anmärkningen försvinner från UC efter 3 år så kan vissa banker ha egna register som lever längre. Värt att fråga din bank direkt.",
    ],
  },
  {
    category: "kronofogden",
    title: "Utmätning av lön - hur mycket får jag behålla?",
    body: "Kronofogden har beslutat om utmätning på min lön från nästa månad. Jag har en inkomst på 28 000 kr brutto och bor ensam med ett barn. Hur räknar man ut förbehållsbeloppet? Hur mycket kommer jag faktiskt få ut?",
    replies: [
      "Förbehållsbeloppet 2026 för ensamstående är ca 5 720 kr/månad plus boendekostnad (faktisk hyra upp till skälig nivå). För barn tillkommer ca 3 000-4 500 kr beroende på ålder. Räkna med att du får behålla ca 15 000-17 000 kr efter skatt om hyran är runt 7 000 kr.",
      "Du kan ringa Kronofogden direkt på 0771-73 73 00 och be dem räkna ut ditt exakta förbehållsbelopp. De är faktiskt hjälpsamma. Glöm inte att meddela alla utgifter - barnomsorg, mediciner, resor till jobbet räknas också.",
    ],
  },
  {
    category: "skatteverket",
    title: "Deklaration 2026 - avdrag för hemarbete?",
    body: "Jag har jobbat hemifrån 3 dagar i veckan hela 2025. Kan jag göra avdrag för hemmakontor i deklarationen? Vilka kostnader räknas och hur stort avdrag kan man få?",
    replies: [
      "Ja, du kan göra avdrag men reglerna är strikta. Du behöver ett separat rum som används till minst 50% för arbete. Schablonavdraget är 2 000 kr/år om du saknar arbetsplats hos arbetsgivaren. Annars kan du dra av faktiska kostnader (el, värme, internet) proportionellt mot rummets yta.",
      "Tänk på att om din arbetsgivare har ett kontor du KAN gå till så får du oftast inte göra avdrag, även om du valt att jobba hemma. Skatteverket har stramat åt detta efter pandemin.",
      "Tack för svar! Jag har ett eget rum och min arbetsgivare har stängt kontoret helt sedan 2024. Då borde jag väl kunna göra avdrag för faktiska kostnader?",
    ],
  },
  {
    category: "skatteverket",
    title: "Folkbokföring efter flytt - hur snabbt måste man anmäla?",
    body: "Jag flyttade till en ny lägenhet för en månad sedan men har inte hunnit folkbokföra mig än. Är det för sent? Får man böter? Vad händer med posten?",
    replies: [
      "Du ska anmäla flytt inom 1 vecka enligt lagen, men i praktiken händer ingenting om du gör det lite senare. Inga böter brukar utdelas. Gör det direkt online på skatteverket.se/flyttanmälan - tar 2 minuter med BankID.",
      "Posten omdirigeras inte automatiskt - du behöver beställa eftersändning via Svensk Adressändring (kostar ca 280 kr/år). Annars riskerar du missa viktiga brev från myndigheter.",
    ],
  },
  {
    category: "forsakringskassan",
    title: "Sjukpenning avslagen - hur överklagar jag?",
    body: "Försäkringskassan har avslagit min ansökan om sjukpenning efter 180 dagar. Läkaren säger att jag inte kan jobba men FK menar att jag kan ta ett annat jobb. Hur överklagar jag och vad är chansen att vinna?",
    replies: [
      "Du har 2 månader på dig att överklaga från beslutsdatumet. Skicka överklagan skriftligt till FK (de skickar vidare till Förvaltningsrätten). Be din läkare skriva ett mer detaljerat utlåtande som specifikt motbevisar FK:s argument om andra jobb.",
      "Jag vann min överklagan 2024. Nyckeln var att få en specialist (inte bara husläkare) att skriva intyget. Kontakta också en facklig jurist om du är medlem - många fackförbund har gratis juridisk hjälp i sjukpenningärenden.",
      "Tips: under tiden du överklagar, ansök om sjukpenning i särskilda fall eller aktivitetsersättning så du inte står helt utan inkomst. Försörjningsstöd från kommunen är sista utvägen.",
    ],
  },
  {
    category: "forsakringskassan",
    title: "Föräldrapenning - kan båda föräldrarna ta ut samtidigt?",
    body: "Vi väntar barn i sommar. Kan jag och min partner båda vara hemma med föräldrapenning samtidigt de första veckorna, eller måste vi turas om?",
    replies: [
      "Ja! Sedan 2024 har båda föräldrarna rätt till 60 dagars dubbeldagar under barnets första år. Ni får alltså båda full föräldrapenning samtidigt i upp till 60 dagar. Perfekt för de första veckorna hemma med nyfödd.",
      "Plus de 10 så kallade pappadagarna (eller partnerdagarna) som tas ut i samband med födseln - de räknas separat och kan tas ut samtidigt som mamman har föräldrapenning.",
    ],
  },
  {
    category: "migrationsverket",
    title: "Permanent uppehållstillstånd - krav 2026?",
    body: "Jag har haft tillfälligt uppehållstillstånd i 4 år som arbetstagare. Vilka krav gäller nu för permanent uppehållstillstånd? Hörde att språkkravet och försörjningskravet skärpts.",
    replies: [
      "Kraven 2026: 1) Försörjningskrav - du ska kunna försörja dig genom arbete/näringsverksamhet (inte bidrag), 2) Språkkrav - godkänt prov i svenska A2 nivå, 3) Samhällskunskap - godkänt prov, 4) Vandelsprövning - inga grova brott. Plus 3 års laglig vistelse.",
      "Språkprovet och samhällskunskapsprovet skjuts upp till 2027 enligt senaste beskedet, så just nu räcker det med försörjning och vandel. Kolla migrationsverket.se för senaste uppdateringen.",
      "Handläggningstiden är just nu 8-15 månader. Ansök i god tid INNAN ditt nuvarande tillstånd går ut, annars kan du förlora arbetsrätten under väntetiden.",
    ],
  },
  {
    category: "migrationsverket",
    title: "Anhöriginvandring - försörjningskrav för fru från Polen?",
    body: "Jag är svensk medborgare och vill ta hit min fru från Polen. Hon är EU-medborgare. Gäller försörjningskrav även här eller är det enklare för EU-medborgare?",
    replies: [
      "Eftersom din fru är EU-medborgare gäller EU:s rörlighetsdirektiv, INTE svenska anhöriginvandringsregler. Hon har uppehållsrätt i Sverige automatiskt om hon arbetar, studerar eller har tillräckliga medel. Inget försörjningskrav för dig som svensk make.",
      "Hon behöver bara registrera sin uppehållsrätt hos Migrationsverket (gratis, görs online). Ingen ansökan, inga avgifter. Efter 5 år kan hon ansöka om permanent uppehållsrätt eller svenskt medborgarskap.",
    ],
  },
  {
    category: "arbetsformedlingen",
    title: "A-kassa efter uppsägning - hur snabbt får man pengar?",
    body: "Blev uppsagd förra veckan på grund av arbetsbrist. Hur snabbt kan jag få a-kassa? Måste jag vänta i karens? Vad är max-beloppet 2026?",
    replies: [
      "Du har 6 karensdagar (vardagar utan ersättning). Sedan får du 80% av din tidigare lön upp till tak på 1 200 kr/dag de första 100 dagarna, sedan 760 kr/dag. Max månadsbelopp ca 26 400 kr brutto. Ansök hos din a-kassa OMEDELBART och skriv in dig på Arbetsförmedlingen samma dag.",
      "Viktigt: du måste vara medlem i a-kassan i minst 12 månader för att få inkomstbaserad ersättning. Annars får du grundbeloppet (510 kr/dag). Om du inte är medlem - gå med IDAG, varje månad räknas.",
      "Glöm inte att ansöka om omställningsstöd via TRR eller Trygghetsstiftelsen om du omfattas av kollektivavtal. De kan ge dig ytterligare ersättning OVANPÅ a-kassan plus karriärcoaching.",
    ],
  },
  {
    category: "arbetsformedlingen",
    title: "Aktivitetsstöd vid praktik - hur mycket får man?",
    body: "Arbetsförmedlingen vill att jag går på praktik i 6 månader. Får jag någon ersättning under tiden? Räcker det att leva på?",
    replies: [
      "Ja, du får aktivitetsstöd under praktiken. Beloppet är samma som din a-kassa skulle vara, eller 223 kr/dag om du inte har rätt till a-kassa. Om du har försörjningsstöd från kommunen kan du få utvecklingsersättning på 152 kr/dag istället.",
      "Aktivitetsstödet är skattepliktigt och pensionsgrundande, vilket är bra. Men 223 kr/dag är ungefär 4 900 kr/månad efter skatt - det är svårt att leva på utan kompletterande försörjningsstöd från kommunen.",
    ],
  },
];

async function post(path, body) {
  const r = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`${path} -> ${r.status}: ${t}`);
  }
  return r.json();
}

let createdThreads = 0;
let createdReplies = 0;

for (const item of seed) {
  const thread = await post("/threads", {
    category: item.category,
    title: item.title,
    body: item.body,
    author_token: randToken(),
  });
  createdThreads++;
  console.log(`[${item.category}] #${thread.id} ${item.title.slice(0, 60)}`);

  for (const replyBody of item.replies) {
    const r = await post(`/threads/${thread.id}/replies`, {
      body: replyBody,
      author_token: randToken(),
    });
    createdReplies++;
    await new Promise((res) => setTimeout(res, 150));
  }
}

console.log(`\nDone: ${createdThreads} threads, ${createdReplies} replies.`);
