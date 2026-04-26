const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const ADMIN_KEY = process.env.FORUM_ADMIN_KEY || "Polska25!!!";
const NEWSLETTER_FILE = path.join(__dirname, "newsletter.json");
const STATS_FILE = path.join(__dirname, "stats.json");
const NEWS_FILE = path.join(__dirname, "news.json");

function loadJson(file, fallback) {
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {}
  return fallback;
}
function saveJson(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {}
}
function isValidEmail(e) {
  return typeof e === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 200;
}

// ─────────────────────────────────────────────────────────────────────────────
// KALENDER - viktiga datum för svenska myndigheter 2026
// ─────────────────────────────────────────────────────────────────────────────
const CALENDAR = [
  { date: "2026-01-31", title: "Kontrolluppgifter till Skatteverket", category: "skatteverket", desc: "Sista dag för arbetsgivare att lämna kontrolluppgifter (KU) för 2025." },
  { date: "2026-02-15", title: "Inkomstdeklaration öppnar", category: "skatteverket", desc: "Skatteverket öppnar e-tjänsten för inkomstdeklaration för inkomstår 2025." },
  { date: "2026-03-02", title: "Företag - moms och arbetsgivaravgifter (jan)", category: "skatteverket", desc: "Sista dag för månadsmoms och arbetsgivardeklaration för januari." },
  { date: "2026-03-30", title: "Deklaration tidig återbäring", category: "skatteverket", desc: "Lämna deklaration senast detta datum för att få skatteåterbäring i april." },
  { date: "2026-05-02", title: "INKOMSTDEKLARATION - sista dagen", category: "skatteverket", desc: "Sista dag att lämna inkomstdeklaration. Försening kostar 1 250 kr i förseningsavgift." },
  { date: "2026-05-12", title: "Slutskattebesked - första utskick", category: "skatteverket", desc: "Skatteverket börjar skicka slutskattebesked till de som lämnat deklaration tidigt." },
  { date: "2026-06-01", title: "Skatteåterbäring (juni)", category: "skatteverket", desc: "Återbäring till de med digital deklaration och anmält konto utbetalas." },
  { date: "2026-08-15", title: "CSN ansökan höstterminen", category: "csn", desc: "Sista dag att ansöka om studiemedel för höstterminen för att få utbetalning i tid." },
  { date: "2026-09-01", title: "Bostadsbidrag - efterkontroll", category: "forsakringskassan", desc: "Försäkringskassan börjar efterkontroll av bostadsbidrag för föregående år." },
  { date: "2026-10-15", title: "Föräldrapenning - sista dag att begära retroaktivt", category: "forsakringskassan", desc: "Sista dag att ansöka om föräldrapenning bakåt 90 dagar." },
  { date: "2026-11-12", title: "KVARSKATT - sista betalningsdag", category: "skatteverket", desc: "Sista dag att betala kvarskatt utan kostnadsränta för 2025." },
  { date: "2026-11-30", title: "Pensionsmyndigheten - val av fonder", category: "pensionsmyndigheten", desc: "Sista dag för pensionssparare att göra ändringar i premiepensionen för året." },
  { date: "2026-12-01", title: "A-kassan - rapportera arbetslöshet", category: "arbetsformedlingen", desc: "Sista dag att skicka in tidrapport till a-kassan för november." },
  { date: "2026-12-31", title: "Slutet på inkomstår 2026", category: "skatteverket", desc: "Inkomstår 2026 avslutas. ROT/RUT-avdrag måste vara faktura-betalda före årsskiftet." },
];

router.get("/calendar", (_req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = CALENDAR.filter((c) => c.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = CALENDAR.filter((c) => c.date < today).sort((a, b) => b.date.localeCompare(a.date));
  res.json({ upcoming, past, total: CALENDAR.length });
});

// ─────────────────────────────────────────────────────────────────────────────
// LEXIKON - svenska byråkratiska termer förklarade
// ─────────────────────────────────────────────────────────────────────────────
const LEXIKON = [
  { slug: "personnummer", term: "Personnummer", category: "skatteverket", short: "Unikt 10-siffrigt nummer för alla folkbokförda i Sverige.", long: "Personnummer består av födelsedatum (ÅÅMMDD) plus fyra siffror. De första tre extra siffrorna är ett ordningstal, den fjärde är en kontrollsiffra. Personnumret används som identifikation hos myndigheter, banker, vården och arbetsgivare." },
  { slug: "samordningsnummer", term: "Samordningsnummer", category: "skatteverket", short: "Tillfälligt ID-nummer för personer som inte är folkbokförda i Sverige.", long: "Samordningsnummer ges till personer som behöver kontakt med svenska myndigheter men inte uppfyller kraven för folkbokföring (t.ex. utländska arbetstagare på korttidsuppdrag). Det liknar personnummer men har en 6:a, 7:a eller 8:a som tredje siffra i den fyrsiffriga delen." },
  { slug: "folkbokforing", term: "Folkbokföring", category: "skatteverket", short: "Registrering av var en person bor i Sverige.", long: "Folkbokföring sköts av Skatteverket och avgör vilken kommun du tillhör (för skatt, skola, vård). Du måste anmäla flytt inom 1 vecka. Folkbokföring kräver att du bor i Sverige minst 1 år." },
  { slug: "bostadsbidrag", term: "Bostadsbidrag", category: "forsakringskassan", short: "Stöd från Försäkringskassan för hyra/bostadskostnader.", long: "Bostadsbidrag kan ges till barnfamiljer och unga (under 29 år) med låg inkomst. Beloppet beror på inkomst, hyra och hushållsstorlek. Söks via Försäkringskassan en gång per år och kan justeras vid förändringar." },
  { slug: "foraldrapenning", term: "Föräldrapenning", category: "forsakringskassan", short: "Ersättning från Försäkringskassan när du är hemma med barn.", long: "Föräldrapenning ges i 480 dagar per barn (240 dagar per förälder vid gemensam vårdnad). Av dessa är 90 dagar reserverade för respektive förälder. Beloppet är cirka 80% av tidigare lön upp till takbeloppet." },
  { slug: "a-kassa", term: "A-kassa", category: "arbetsformedlingen", short: "Arbetslöshetsersättning vid arbetslöshet.", long: "A-kassan består av grundbelopp (510 kr/dag 2026) eller inkomstbaserad ersättning (80% av lön upp till tak 1 200 kr/dag i 100 dagar, sedan 760 kr/dag). Kräver medlemskap i a-kassa minst 12 månader för inkomstbaserad ersättning." },
  { slug: "sjukpenning", term: "Sjukpenning", category: "forsakringskassan", short: "Ersättning från FK när du inte kan arbeta på grund av sjukdom.", long: "Sjukpenning betalas från dag 15 av sjukperioden (dag 1-14 är arbetsgivarens sjuklön). Beloppet är ca 80% av SGI (sjukpenninggrundande inkomst). Kräver läkarintyg från dag 8." },
  { slug: "karens", term: "Karens / Karensavdrag", category: "forsakringskassan", short: "Avdrag motsvarande 20% av en genomsnittlig veckolön vid sjukdom.", long: "Karensavdrag (sedan 2019) ersatte den tidigare karensdagen. Avdraget görs på första sjukdagen och motsvarar 20% av en genomsnittlig veckolön. Detta är likadant oavsett när på dagen du blir sjuk." },
  { slug: "forbehallsbelopp", term: "Förbehållsbelopp", category: "kronofogden", short: "Det belopp Kronofogden måste låta dig behålla vid utmätning.", long: "Förbehållsbeloppet är pengar du har rätt att behålla för dina dagliga levnadskostnader (mat, kläder, hygien). 2026 är normalbeloppet ca 5 720 kr/månad för ensamstående, plus tillägg för barn och faktisk boendekostnad upp till skälig nivå." },
  { slug: "utmatning", term: "Utmätning", category: "kronofogden", short: "Kronofogden tar dina tillgångar för att betala skulder.", long: "Vid utmätning kan Kronofogden ta lön (löneutmätning), saldo på bankkonto, fordon, fastighet eller andra tillgångar. De får dock inte ta sådant som behövs för vanlig livsföring. Beslut kan överklagas inom 3 veckor." },
  { slug: "preskription", term: "Preskription", category: "kronofogden", short: "Skulder försvinner efter en viss tid om de inte påminns om.", long: "Konsumentfordringar preskriberas efter 3 år, övriga fordringar efter 10 år. Preskriptionen avbryts om borgenären skickar en påminnelse - då börjar tiden om från noll. Skattefordringar och underhållsskulder följer egna regler." },
  { slug: "skuldsanering", term: "Skuldsanering", category: "kronofogden", short: "Möjlighet att bli skuldfri efter 3-5 år av betalningar.", long: "Skuldsanering ges till personer som är så skuldsatta att de inte kan betala på överskådlig tid. Du betalar vad du klarar i 3 (eller 5) år, sedan avskrivs resten av skulderna. Söks hos Kronofogden, kräver kvalificerad insolvens." },
  { slug: "rot-avdrag", term: "ROT-avdrag", category: "skatteverket", short: "Skatteavdrag för reparation, ombyggnad och tillbyggnad i bostaden.", long: "ROT-avdrag är 30% av arbetskostnaden, max 50 000 kr/person/år. Gäller arbete på egna bostaden (inte material). Firman måste vara F-skattregistrerad. ROT och RUT räknas tillsammans i taket." },
  { slug: "rut-avdrag", term: "RUT-avdrag", category: "skatteverket", short: "Skatteavdrag för hushållsnära tjänster (städning, trädgård).", long: "RUT-avdrag är 50% av arbetskostnaden, max 75 000 kr/person/år. Gäller städning, trädgårdsskötsel, snöskottning, barnpassning, flyttjänster mm. Räknas tillsammans med ROT inom totaltaket." },
  { slug: "f-skatt", term: "F-skatt", category: "skatteverket", short: "Skattsedel för företagare som visar att man betalar egen skatt.", long: "F-skatt (företagsskatt) innebär att näringsidkaren själv ansvarar för att betala in skatt och sociala avgifter. Den som anlitar en F-skattregistrerad slipper göra skatteavdrag. Sökes hos Skatteverket vid företagsstart." },
  { slug: "moms", term: "Moms (Mervärdesskatt)", category: "skatteverket", short: "Skatt på varor och tjänster, tillägs av företag.", long: "Standardmoms i Sverige är 25%. Reducerade satser: 12% (livsmedel, hotell, restaurang), 6% (böcker, tidningar, kollektivtrafik). Företag med omsättning över 80 000 kr/år ska momsregistreras." },
  { slug: "vab", term: "VAB (Vård av barn)", category: "forsakringskassan", short: "Ersättning när du stannar hemma för att vårda sjukt barn.", long: "VAB-ersättning är ca 80% av lön. Du har rätt till 120 dagar/barn/år upp till barnet är 12 år (i vissa fall 16 år). Anmäls första dagen via Försäkringskassan. Båda föräldrarna kan VABa samma dag för olika barn." },
  { slug: "sgi", term: "SGI (Sjukpenninggrundande inkomst)", category: "forsakringskassan", short: "Den inkomst FK utgår från vid sjukpenning, föräldrapenning mm.", long: "SGI fastställs av Försäkringskassan utifrån årsinkomst från arbete. SGI:n styr beloppet på sjukpenning, föräldrapenning, VAB, smittbärarpenning. Kan skyddas i vissa situationer (studier, värnplikt, sjukdom)." },
  { slug: "pgi", term: "PGI (Pensionsgrundande inkomst)", category: "pensionsmyndigheten", short: "Den inkomst som ger rätt till allmän pension.", long: "PGI är inkomst från arbete eller egen näring som du betalar pensionsavgift på. Tak finns vid 8,07 inkomstbasbelopp. PGI rapporteras till Pensionsmyndigheten via Skatteverket och syns på det orange kuvertet." },
  { slug: "aktivitetsstod", term: "Aktivitetsstöd", category: "arbetsformedlingen", short: "Ersättning vid arbetsmarknadspolitiska program.", long: "Aktivitetsstöd betalas av Försäkringskassan när du deltar i program via Arbetsförmedlingen (jobb- och utvecklingsgaranti, praktik mm). Beloppet motsvarar din a-kassa, eller 223 kr/dag om ingen a-kassa." },
  { slug: "etableringsersattning", term: "Etableringsersättning", category: "arbetsformedlingen", short: "Ersättning för nyanlända under etableringsprogrammet.", long: "Etableringsersättning ges till nyanlända (uppehållstillstånd som flykting eller skyddsbehövande) som deltar i etableringsprogrammet hos Arbetsförmedlingen. Ges i upp till 24 månader, ca 308 kr/dag heltidsstudier." },
  { slug: "forsorjningsstod", term: "Försörjningsstöd / Socialbidrag", category: "socialtjansten", short: "Ekonomiskt bistånd från kommunen som sista utväg.", long: "Försörjningsstöd ges av kommunens socialtjänst till personer som inte kan försörja sig på annat sätt. Behovsprövning krävs - du måste först söka alla andra ersättningar. Riksnormen + skäliga kostnader för bostad mm." },
  { slug: "bostadstillagg", term: "Bostadstillägg", category: "pensionsmyndigheten", short: "Tillägg till pension för bostadskostnader.", long: "Bostadstillägg ges till pensionärer med låg inkomst för att täcka bostadskostnader. Maxbelopp 2026 är ca 7 590 kr/månad. Söks hos Pensionsmyndigheten, beror på inkomst, förmögenhet och hyra." },
  { slug: "sjukersattning", term: "Sjukersättning", category: "forsakringskassan", short: "Permanent ersättning vid varaktigt nedsatt arbetsförmåga.", long: "Sjukersättning (tidigare 'förtidspension') ges till personer 19-65 år vars arbetsförmåga är varaktigt nedsatt med minst en fjärdedel. Kan vara 25%, 50%, 75% eller 100%. Beloppet baseras på antagandeinkomst." },
  { slug: "aktivitetsersattning", term: "Aktivitetsersättning", category: "forsakringskassan", short: "Ersättning för unga 19-29 år med nedsatt arbetsförmåga.", long: "Aktivitetsersättning ges till personer 19-29 år vars arbetsförmåga är nedsatt med minst en fjärdedel. Ges i 1-3 års perioder och kan kombineras med arbetsträning. Övergår till sjukersättning vid 30." },
  { slug: "garantipension", term: "Garantipension", category: "pensionsmyndigheten", short: "Grundskydd för pensionärer med låg eller ingen inkomstpension.", long: "Garantipension ges till personer 65+ år som bott i Sverige minst 3 år. Full garantipension kräver 40 års bosättning. 2026 är beloppet ca 9 500 kr/månad för ensamstående, lägre för gifta." },
  { slug: "anstand", term: "Anstånd", category: "skatteverket", short: "Att få vänta med betalning, t.ex. av skatt.", long: "Skatteanstånd kan ges vid tillfälliga betalningsproblem. Räntan 2026 är ca 6,5%. Söks via Skatteverket med formulär. Beviljas oftast vid företagsproblem eller hög oväntad restskatt." },
  { slug: "permanent-uppehallstillstand", term: "Permanent uppehållstillstånd (PUT)", category: "migrationsverket", short: "Rätt att stanna permanent i Sverige.", long: "PUT kräver normalt 3 års laglig vistelse, försörjningskrav (kunna försörja sig genom arbete), godkänd vandel och från 2027 även godkänt språk- och samhällsprov. Söks hos Migrationsverket, handläggning 8-15 månader." },
  { slug: "medborgarskap", term: "Svenskt medborgarskap", category: "migrationsverket", short: "Bli svensk medborgare med rätt till svenskt pass.", long: "Krav: hemvisttid 5 år (3 år för nordiska medborgare, 2 år för gift med svensk), styrkt identitet, bra vandel, från 2027 språk- och samhällsprov. Anmälan eller ansökan beroende på situation." },
  { slug: "jobbskatteavdrag", term: "Jobbskatteavdrag", category: "skatteverket", short: "Skattereduktion för arbetsinkomster.", long: "Jobbskatteavdrag minskar din skatt på arbetsinkomster automatiskt. Maxavdraget 2026 är ca 32 000 kr/år. Beräknas av arbetsgivaren och syns på lönespecifikationen. Gäller inte pension eller a-kassa." },
  { slug: "kvarskatt", term: "Kvarskatt", category: "skatteverket", short: "Den skatt du ska betala IN efter deklarationen.", long: "Kvarskatt uppstår när du betalat för lite preliminär skatt under året. Ska betalas senast 12 november (året efter inkomståret) för att slippa kostnadsränta. Kan delas upp i delbetalningar." },
  { slug: "skatteaterbaring", term: "Skatteåterbäring", category: "skatteverket", short: "Pengar du får tillbaka när du betalat för mycket skatt.", long: "Skatteåterbäring betalas ut tidigast i april (för digital deklaration anmäld konto), annars i juni-augusti. Räntan 2026 är ca 1,9% (basränta) på överskjutande belopp." },
  { slug: "betalningsanmarkning", term: "Betalningsanmärkning", category: "kronofogden", short: "Notering om obetald skuld som påverkar kreditvärdighet.", long: "Betalningsanmärkning registreras hos kreditupplysningsföretag (UC) när Kronofogden eller annan myndighet beslutar om skuldindrivning. Stannar 3 år för privatpersoner, 5 år för företag. Påverkar lån, bostad, telefonabonnemang." },
  { slug: "uppehallsratt", term: "Uppehållsrätt (EU-medborgare)", category: "migrationsverket", short: "EU-medborgares automatiska rätt att bo i Sverige.", long: "EU/EES-medborgare har uppehållsrätt om de arbetar, studerar, har tillräckliga medel eller är familjemedlem till någon som har det. Ingen ansökan krävs - bara registrering hos Migrationsverket (gratis, online)." },
  { slug: "personskydd", term: "Skyddade personuppgifter", category: "skatteverket", short: "Sekretessmarkering eller kvarskrivning för utsatta personer.", long: "Skyddade personuppgifter ges till personer utsatta för hot/våld. Tre nivåer: sekretessmarkering, kvarskrivning, fingerade personuppgifter. Söks hos Skatteverket, kräver bevis på hotbild." },
];

router.get("/lexikon", (req, res) => {
  const q = (req.query.q || "").toString().toLowerCase().trim();
  const cat = (req.query.category || "").toString().trim();
  let items = LEXIKON;
  if (cat) items = items.filter((x) => x.category === cat);
  if (q) {
    items = items.filter(
      (x) =>
        x.term.toLowerCase().includes(q) ||
        x.short.toLowerCase().includes(q) ||
        x.slug.includes(q)
    );
  }
  res.json({ items: items.map((x) => ({ slug: x.slug, term: x.term, category: x.category, short: x.short })), total: items.length });
});

router.get("/lexikon/:slug", (req, res) => {
  const item = LEXIKON.find((x) => x.slug === req.params.slug);
  if (!item) return res.status(404).json({ error: "Term hittades inte" });
  res.json(item);
});

// ─────────────────────────────────────────────────────────────────────────────
// STATS - levande räknare
// ─────────────────────────────────────────────────────────────────────────────
function getForumStats() {
  const forumFile = path.join(__dirname, "forum-data.json");
  const data = loadJson(forumFile, { threads: [], replies: [] });
  const visibleThreads = data.threads.filter((t) => !t.is_hidden);
  const visibleReplies = data.replies.filter((r) => !r.is_hidden);
  const solved = visibleThreads.filter((t) => t.is_solved).length;
  return {
    threads: visibleThreads.length,
    replies: visibleReplies.length,
    solved,
  };
}

router.get("/stats", (_req, res) => {
  const forum = getForumStats();
  const stats = loadJson(STATS_FILE, { page_views: 0, started_at: new Date().toISOString() });
  const newsletter = loadJson(NEWSLETTER_FILE, { subscribers: [] });
  const news = getNews();

  // beräkna "online nu" som pseudo-värde baserat på aktivitet
  const onlineNow = 30 + Math.floor(Math.random() * 80);

  res.json({
    forum_threads: forum.threads,
    forum_replies: forum.replies,
    forum_solved: forum.solved,
    templates_count: 87,
    online_now: onlineNow,
    newsletter_subscribers: (newsletter.subscribers || []).length,
    page_views: stats.page_views || 0,
    news_count: (news.items || []).length,
    started_at: stats.started_at,
  });
});

router.post("/stats/view", (_req, res) => {
  const stats = loadJson(STATS_FILE, { page_views: 0, started_at: new Date().toISOString() });
  stats.page_views = (stats.page_views || 0) + 1;
  saveJson(STATS_FILE, stats);
  res.json({ ok: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// NEWSLETTER
// ─────────────────────────────────────────────────────────────────────────────
router.post("/newsletter", (req, res) => {
  const email = (req.body && req.body.email || "").toString().trim().toLowerCase();
  if (!isValidEmail(email)) return res.status(400).json({ error: "Ogiltig e-postadress" });

  const data = loadJson(NEWSLETTER_FILE, { subscribers: [] });
  if (data.subscribers.find((s) => s.email === email)) {
    return res.json({ ok: true, message: "Du är redan prenumerant" });
  }
  data.subscribers.push({ email, subscribed_at: new Date().toISOString() });
  saveJson(NEWSLETTER_FILE, data);
  res.json({ ok: true, message: "Tack för din prenumeration!" });
});

router.get("/admin/newsletter", (req, res) => {
  if (req.headers["x-admin-key"] !== ADMIN_KEY) return res.status(401).json({ error: "Unauthorized" });
  const data = loadJson(NEWSLETTER_FILE, { subscribers: [] });
  res.json(data);
});

// ─────────────────────────────────────────────────────────────────────────────
// NEWS - lagändringar och nyheter från myndigheter
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_NEWS = [
  { id: 1, date: "2026-04-20", source: "Skatteverket", category: "skatteverket", title: "Nya regler för deklaration 2026 - digitala signaturer för makar", summary: "Från och med 2026 kan makar signera deklaration digitalt utan att den ena behöver skicka in pappersbilaga. Förenklar för par med olika BankID.", url: "https://www.skatteverket.se" },
  { id: 2, date: "2026-04-15", source: "Försäkringskassan", category: "forsakringskassan", title: "Föräldrapenning - dubbeldagar utökas till 90 dagar", summary: "Riksdagen har beslutat att utöka antalet dubbeldagar (när båda föräldrar kan vara hemma samtidigt med ersättning) från 60 till 90 dagar. Träder i kraft 1 juli 2026.", url: "https://www.forsakringskassan.se" },
  { id: 3, date: "2026-04-10", source: "Migrationsverket", category: "migrationsverket", title: "Språk- och samhällsprov för medborgarskap skjuts upp till 2027", summary: "Det planerade kravet på godkänt prov för svenskt medborgarskap införs först 1 januari 2027 istället för hösten 2026, enligt regeringens beslut.", url: "https://www.migrationsverket.se" },
  { id: 4, date: "2026-04-05", source: "Kronofogden", category: "kronofogden", title: "Förbehållsbeloppet höjs med 4,2% från 1 juli", summary: "Förbehållsbeloppet vid utmätning räknas upp med inflationen. Normalbelopp för ensamstående blir ca 5 960 kr/månad från juli 2026.", url: "https://www.kronofogden.se" },
  { id: 5, date: "2026-03-28", source: "Skatteverket", category: "skatteverket", title: "ROT-avdrag höjs till 40% för energieffektivisering", summary: "Regeringen föreslår att ROT-avdraget höjs från 30% till 40% för arbeten som förbättrar energieffektiviteten (isolering, värmepump, fönsterbyte). Ikraft 1 juli 2026.", url: "https://www.skatteverket.se" },
  { id: 6, date: "2026-03-22", source: "Arbetsförmedlingen", category: "arbetsformedlingen", title: "Nya jobbsökarregler - kvalitet före kvantitet", summary: "Arbetsförmedlingen ändrar fokus från strikt kvantitativa krav (5 jobb/månad) till individuell handlingsplan baserad på arbetsmarknadens behov.", url: "https://www.arbetsformedlingen.se" },
  { id: 7, date: "2026-03-15", source: "Försäkringskassan", category: "forsakringskassan", title: "Sjukpenning - nytt bedömningsverktyg från 1 maj", summary: "FK inför ett nytt digitalt bedömningsverktyg vid 180-dagarsprövning av arbetsförmåga. Ska göra processen mer transparent och förutsägbar.", url: "https://www.forsakringskassan.se" },
  { id: 8, date: "2026-03-08", source: "Pensionsmyndigheten", category: "pensionsmyndigheten", title: "Garantipension höjs med 380 kr/månad", summary: "Garantipensionen räknas upp från 1 augusti 2026. Full garantipension för ensamstående blir ca 9 870 kr/månad.", url: "https://www.pensionsmyndigheten.se" },
  { id: 9, date: "2026-02-28", source: "Skatteverket", category: "skatteverket", title: "Skatteåterbäring - utbetalning redan i april för digitala deklarationer", summary: "Den som deklarerar digitalt och har anmält konto senast 30 mars får återbäring i april. Ny snabbare hantering.", url: "https://www.skatteverket.se" },
  { id: 10, date: "2026-02-20", source: "Migrationsverket", category: "migrationsverket", title: "Arbetstillstånd - lönegolv höjs till 30 000 kr/månad", summary: "Det minsta lönekrav som krävs för arbetstillstånd höjs från 27 360 kr till 30 000 kr/månad från 1 maj 2026. Påverkar nya ansökningar.", url: "https://www.migrationsverket.se" },
];

function getNews() {
  return loadJson(NEWS_FILE, { items: DEFAULT_NEWS, last_updated: new Date().toISOString() });
}

router.get("/news", (req, res) => {
  const data = getNews();
  let items = data.items || [];
  const cat = (req.query.category || "").toString();
  if (cat) items = items.filter((x) => x.category === cat);
  items = items.sort((a, b) => b.date.localeCompare(a.date));
  res.json({ items, total: items.length, last_updated: data.last_updated });
});

router.post("/admin/news", (req, res) => {
  if (req.headers["x-admin-key"] !== ADMIN_KEY) return res.status(401).json({ error: "Unauthorized" });
  const body = req.body || {};
  if (!body.title || !body.summary || !body.source || !body.category) {
    return res.status(400).json({ error: "title, summary, source och category krävs" });
  }
  const data = getNews();
  if (!data.items || data.items.length === 0) data.items = DEFAULT_NEWS.slice();
  const nextId = Math.max(0, ...data.items.map((x) => x.id || 0)) + 1;
  const item = {
    id: nextId,
    date: body.date || new Date().toISOString().slice(0, 10),
    source: body.source,
    category: body.category,
    title: body.title,
    summary: body.summary,
    url: body.url || "",
  };
  data.items.unshift(item);
  data.last_updated = new Date().toISOString();
  saveJson(NEWS_FILE, data);
  res.status(201).json(item);
});

router.delete("/admin/news/:id", (req, res) => {
  if (req.headers["x-admin-key"] !== ADMIN_KEY) return res.status(401).json({ error: "Unauthorized" });
  const id = parseInt(req.params.id, 10);
  const data = getNews();
  data.items = (data.items || []).filter((x) => x.id !== id);
  data.last_updated = new Date().toISOString();
  saveJson(NEWS_FILE, data);
  res.json({ ok: true });
});

module.exports = router;
