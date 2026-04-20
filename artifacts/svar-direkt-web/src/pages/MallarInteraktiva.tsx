import { useState, useMemo } from "react";

interface Template {
  id: number;
  authority: string;
  title: string;
  desc: string;
  body: string;
}

const AUTHORITIES = [
  "Alla",
  "Migrationsverket",
  "Skatteverket",
  "Kronofogden",
  "Bolagsverket",
  "Boverket / Hyresnämnden",
  "Försäkringskassan",
  "Hälso- och sjukvård",
];

const AUTH_COLORS: Record<string, string> = {
  "Migrationsverket":         "bg-purple-100 text-purple-800 border-purple-200",
  "Skatteverket":             "bg-blue-100 text-blue-800 border-blue-200",
  "Kronofogden":              "bg-red-100 text-red-800 border-red-200",
  "Bolagsverket":             "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Boverket / Hyresnämnden":  "bg-orange-100 text-orange-800 border-orange-200",
  "Försäkringskassan":        "bg-teal-100 text-teal-800 border-teal-200",
  "Hälso- och sjukvård":      "bg-rose-100 text-rose-800 border-rose-200",
};

const TEMPLATES: Template[] = [
  // ── MIGRATIONSVERKET ─────────────────────────────────────────────────────
  { id: 1, authority: "Migrationsverket", title: "Komplettering / Fråga om status i pågående ärende",
    desc: "Använd när du väntar på beslut och vill fråga om status eller lämna in nya dokument.",
    body: `Till: Migrationsverket

Ämne: Komplettering / Fråga om status – Ärende nr: [Ditt ärendenummer]

Till berörd handläggare,

Mitt namn är [Ditt för- och efternamn] med personnummer/samordningsnummer [Ditt nummer].
Jag skriver angående mitt pågående ärende med beteckning [Ditt ärendenummer].

Jag vill härmed [välj: fråga om aktuell status / skicka in kompletterande handlingar / informera om ändrade omständigheter].

Bifogat finner ni:
– [Dokument 1, t.ex. Kopia på anställningsavtal]
– [Dokument 2, t.ex. Kopia på pass]

Jag ser fram emot att höra från er. Vänligen bekräfta att ni har mottagit detta meddelande.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din adress]
[Ditt telefonnummer]
[Din e-postadress]` },

  { id: 2, authority: "Migrationsverket", title: "Anmälan om adressändring under pågående ärende",
    desc: "Meddela Migrationsverket att du har flyttat, så att de skickar post till rätt adress.",
    body: `Till: Migrationsverket

Ämne: Adressändring – Ärende nr: [Ditt ärendenummer]

Till Migrationsverket,

Jag, [Ditt för- och efternamn], med personnummer/dossiernummer [Ditt nummer], vill härmed meddela att jag har bytt adress.

Min nya adress från och med [Datum för flytt] är:
[Gatuadress]
[Postnummer och Ort]
[Eventuellt c/o eller lägenhetsnummer]

Vänligen uppdatera era register och skicka all framtida post till denna adress.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Ditt telefonnummer]` },

  { id: 3, authority: "Migrationsverket", title: "Begäran om att avgöra ärende (efter 6 månader)",
    desc: "Om Migrationsverket inte fattat beslut inom 6 månader kan du begära ett avgörande.",
    body: `Till: Migrationsverket

Ämne: Begäran om att avgöra ärende – Ärende nr: [Ditt ärendenummer]

Till Migrationsverket,

Jag, [Ditt för- och efternamn], med personnummer/dossiernummer [Ditt nummer], ansökte om [Typ av tillstånd, t.ex. arbetstillstånd/medborgarskap] den [Datum för ansökan].

Eftersom det nu har gått mer än sex månader sedan min ansökan lämnades in, begär jag härmed, med stöd av 12 § förvaltningslagen (2017:900), att Migrationsverket ska avgöra mitt ärende.

Jag emotser ert beslut inom fyra veckor från det att denna begäran inkommit till er.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din adress]` },

  { id: 4, authority: "Migrationsverket", title: "Överklagande av beslut",
    desc: "Fått avslag? Överklaga beslutet till Migrationsdomstolen via Migrationsverket.",
    body: `Till: Migrationsverket (för vidare befordran till Migrationsdomstolen)

Ämne: Överklagande av beslut daterat [Datum för beslut] – Ärende nr: [Ditt ärendenummer]

Till Migrationsverket,

Jag, [Ditt för- och efternamn], med personnummer/dossiernummer [Ditt nummer], överklagar härmed Migrationsverkets beslut daterat den [Datum för beslut].

Jag yrkar att beslutet ändras och att jag beviljas [Vad du ansökte om, t.ex. uppehållstillstånd].

Mina skäl för överklagandet är följande:
[Förklara varför beslutet är fel och varför du bör få tillstånd. Var tydlig och hänvisa till eventuella nya bevis.]

Som bevis åberopar jag följande bifogade handlingar:
– [Bevis 1, t.ex. Nytt anställningsavtal]
– [Bevis 2, t.ex. Läkarintyg]

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din adress]` },

  { id: 5, authority: "Migrationsverket", title: "Återkallelse av ansökan",
    desc: "Dra tillbaka en ansökan som du tidigare skickat in till Migrationsverket.",
    body: `Till: Migrationsverket

Ämne: Återkallelse av ansökan – Ärende nr: [Ditt ärendenummer]

Till Migrationsverket,

Jag, [Ditt för- och efternamn], med personnummer/dossiernummer [Ditt nummer], vill härmed återkalla min ansökan om [Typ av tillstånd] som lämnades in den [Datum för ansökan].

Anledningen till återkallelsen är att [Kort anledning, t.ex. jag har flyttat tillbaka till mitt hemland].

Vänligen bekräfta att ni har mottagit denna återkallelse och att ärendet har avskrivits.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din adress]` },

  // ── SKATTEVERKET ─────────────────────────────────────────────────────────
  { id: 6, authority: "Skatteverket", title: "Rättelse av folkbokföringsadress",
    desc: "Rätta till uppgifter om var du bor i folkbokföringen.",
    body: `Till: Skatteverket

Ämne: Rättelse av folkbokföringsadress – personnummer [Ditt personnummer]

Hej,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], vill härmed meddela att min nuvarande folkbokföringsadress är felaktig och behöver uppdateras.

Min korrekta och nuvarande adress är:
[Gatuadress]
[Postnummer och Ort]
[Eventuellt lägenhetsnummer, t.ex. Lgh 1201]

Jag flyttade till denna adress den [Datum för flytt, ÅÅÅÅ-MM-DD].

Vänligen uppdatera era register i enlighet med detta. Om ni behöver ytterligare dokumentation (t.ex. hyreskontrakt), vänligen kontakta mig.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Ditt telefonnummer]` },

  { id: 7, authority: "Skatteverket", title: "Begäran om omprövning av skattebeslut",
    desc: "Skatteverket fattat felaktigt beslut om din skatt? Begär omprövning.",
    body: `Till: Skatteverket

Ämne: Begäran om omprövning av skattebeslut – personnummer [Ditt personnummer]

Till Skatteverket,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], begär härmed omprövning av ert beslut daterat den [Datum på beslutet] gällande inkomstår [Årtal].

Jag yrkar att beslutet ändras så att jag medges avdrag för [Vad du vill ha avdrag för, t.ex. resor till och från arbetet] med [Belopp] kronor.

Mina skäl för begäran är:
[Förklara varför du har rätt till avdraget och varför Skatteverkets beslut är fel.]

Som stöd för min begäran bifogar jag följande underlag:
– [T.ex. Körjournal / Kvitton]

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din adress]` },

  { id: 8, authority: "Skatteverket", title: "Anmälan om spärr mot obehörig adressändring",
    desc: "Begär att Skatteverket spärrar din adress så att ingen annan kan ändra den utan e-legitimation.",
    body: `Till: Skatteverket

Ämne: Begäran om spärr mot obehörig adressändring – personnummer [Ditt personnummer]

Till Skatteverket,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], begär härmed att Skatteverket lägger in en spärr mot obehörig adressändring för min folkbokföring.

Jag vill att det i fortsättningen endast ska vara möjligt att ändra min folkbokföringsadress via Skatteverkets e-tjänst med hjälp av e-legitimation (BankID).

Syftet med denna begäran är att skydda mig mot identitetskapning och bedrägerier.

Vänligen bekräfta när spärren är aktiverad.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din adress]` },

  { id: 9, authority: "Skatteverket", title: "Begäran om anstånd med inkomstdeklaration",
    desc: "Behöver mer tid för att lämna in din deklaration? Ansök om anstånd.",
    body: `Till: Skatteverket

Ämne: Begäran om anstånd med inkomstdeklaration – personnummer [Ditt personnummer]

Till Skatteverket,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], ansöker härmed om anstånd med att lämna min inkomstdeklaration för inkomstår [Årtal].

Jag begär anstånd till och med den [Önskat datum, t.ex. 31 maj ÅÅÅÅ].

Anledningen till min begäran är:
[Förklara kort, t.ex. "Jag saknar nödvändiga kontrolluppgifter från min utländska arbetsgivare".]

Jag hoppas på er förståelse och att ni beviljar detta anstånd.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din adress]` },

  { id: 10, authority: "Skatteverket", title: "Beställning av personbevis",
    desc: "Beställ personbevis om du inte kan göra det via e-tjänsten.",
    body: `Till: Skatteverket

Ämne: Beställning av personbevis – personnummer [Ditt personnummer]

Till Skatteverket,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], beställer härmed ett personbevis.

Jag behöver personbeviset för ändamålet: [T.ex. Ansökan om pass / Vigsel / Utländsk myndighet].

Vänligen skicka personbeviset till min folkbokföringsadress:
[Din gatuadress]
[Postnummer och Ort]

Tack på förhand.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  // ── KRONOFOGDEN ──────────────────────────────────────────────────────────
  { id: 11, authority: "Kronofogden", title: "Bestridande av betalningsföreläggande",
    desc: "Fått krav på skuld som du anser är felaktig? Bestrida det.",
    body: `Till: Kronofogdemyndigheten

Ämne: Bestridande av betalningsföreläggande, målnummer: [Målnummer från Kronofogdens brev]

Till Kronofogdemyndigheten,

Jag har mottagit ett betalningsföreläggande med målnummer [Målnummer] gällande ett krav från sökanden [Företagets/Personens namn].

Jag vill härmed bestrida detta krav i sin helhet.

Anledningen till mitt bestridande är:
[Förklara kort varför kravet är fel, t.ex. "Jag har aldrig beställt denna vara" / "Fakturan är redan betald den [Datum]".]

Bifogat finns bevis som styrker min invändning:
– [T.ex. Kopia på betalningskvitto från banken]
– [T.ex. Kopia på uppsägning av avtal]

Jag ber er notera mitt bestridande och meddela sökanden.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Ditt personnummer]
[Din adress]` },

  { id: 12, authority: "Kronofogden", title: "Ansökan om betalningsföreläggande",
    desc: "Kräva in en skuld från en person eller ett företag som inte betalar.",
    body: `Till: Kronofogdemyndigheten

Ämne: Ansökan om betalningsföreläggande

SÖKANDE (Den som vill ha betalt):
Namn: [Ditt för- och efternamn]
Personnummer: [Ditt personnummer]
Adress: [Din adress]

SVARANDE (Den som ska betala):
Namn/Företag: [Motpartens namn]
Person-/Org.nr: [Motpartens nummer]
Adress: [Motpartens adress]

KRAV:
Jag yrkar att Kronofogdemyndigheten ålägger svaranden att betala [Belopp] SEK till mig.

GRUND FÖR KRAVET:
Skulden avser [Beskriv vad skulden gäller, t.ex. obetald faktura nr 123 för utfört arbete].
Förfallodatum för skulden var den [Datum].

Jag yrkar även ersättning för ansökningsavgiften hos Kronofogden (300 kr).

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 13, authority: "Kronofogden", title: "Begäran om ändring av förbehållsbelopp (löneutmätning)",
    desc: "Kronofogden drar pengar från din lön? Begär högre förbehållsbelopp.",
    body: `Till: Kronofogdemyndigheten

Ämne: Begäran om ändring av förbehållsbelopp – personnummer [Ditt personnummer]

Till Kronofogdemyndigheten,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], har för närvarande löneutmätning.

Jag begär härmed att mitt förbehållsbelopp (det belopp jag får behålla) höjs, eftersom mina levnadsomkostnader har ökat.

Anledningen till de ökade kostnaderna är:
[Förklara, t.ex. "Min hyra har höjts med [Belopp] kr från och med [Datum]".]

Som bevis för mina ökade kostnader bifogar jag:
– [T.ex. Nytt hyresavtal]
– [T.ex. Kvitton från apotek/sjukvård]

Jag ber er att snarast ompröva beslutet om löneutmätning.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din adress]` },

  { id: 14, authority: "Kronofogden", title: "Återkallelse av ansökan om betalningsföreläggande",
    desc: "Stoppa ett ärende hos Kronofogden när motparten betalat.",
    body: `Till: Kronofogdemyndigheten

Ämne: Återkallelse av ärende, målnummer: [Målnummer]

Till Kronofogdemyndigheten,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], är sökande i ärende med målnummer [Målnummer] mot svaranden [Motpartens namn].

Jag vill härmed återkalla min ansökan om betalningsföreläggande i sin helhet.

Anledningen är att svaranden nu har betalat hela skulden inklusive eventuella avgifter, och vi har nått en uppgörelse.

Vänligen avskriv ärendet.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Ditt telefonnummer]` },

  { id: 15, authority: "Kronofogden", title: "Begäran om registerutdrag (GDPR)",
    desc: "Begär ut all information som Kronofogden har sparad om dig.",
    body: `Till: Kronofogdemyndigheten, Dataskyddsombudet

Ämne: Begäran om registerutdrag enligt GDPR – personnummer [Ditt personnummer]

Till Dataskyddsombudet,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], begär härmed ett fullständigt registerutdrag enligt artikel 15 i dataskyddsförordningen (GDPR).

Jag önskar få information om vilka personuppgifter ni behandlar om mig, ändamålen med behandlingen, samt information om eventuella skulder, anmärkningar eller pågående ärenden.

Vänligen skicka utdraget skriftligen till min folkbokföringsadress:
[Din gatuadress]
[Postnummer och Ort]

Tack på förhand.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  // ── BOLAGSVERKET ─────────────────────────────────────────────────────────
  { id: 16, authority: "Bolagsverket", title: "Begäran om anstånd med inlämning av årsredovisning",
    desc: "Ditt företag behöver mer tid att skicka in årsredovisningen.",
    body: `Till: Bolagsverket

Ämne: Begäran om anstånd – årsredovisning för [Företagets namn], org.nr [Organisationsnummer]

Till Bolagsverket,

Som företrädare för [Företagets namn], organisationsnummer [Organisationsnummer], ansöker jag härmed om anstånd med att lämna in företagets årsredovisning för räkenskapsåret [ÅÅÅÅ-MM-DD] – [ÅÅÅÅ-MM-DD].

Anledningen till förseningen är:
[Förklara kort, t.ex. "Sjukdom hos nyckelperson/revisor" / "Byte av redovisningsbyrå".]

Vi beräknar att årsredovisningen kommer att kunna skickas in senast den [Datum ni planerar att skicka in den].

Vi hoppas på er förståelse och att ni beviljar detta anstånd.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din titel i företaget, t.ex. VD / Styrelseledamot]
[Företagets namn]` },

  { id: 17, authority: "Bolagsverket", title: "Anmälan om ändring av styrelse/adress",
    desc: "Meddela Bolagsverket om ändringar i företagets styrelse eller adress.",
    body: `Till: Bolagsverket

Ämne: Ändringsanmälan för [Företagets namn], org.nr [Organisationsnummer]

Till Bolagsverket,

Härmed anmäls följande ändringar för [Företagets namn], organisationsnummer [Organisationsnummer]:

NY FÖRETAGSADRESS:
[Ny gatuadress]
[Nytt postnummer och Ort]

ÄNDRING I STYRELSEN:
Följande person har avgått från styrelsen:
Namn: [Namn på avgående person]
Personnummer: [Personnummer]

Följande person har tillträtt i styrelsen som [T.ex. Styrelseledamot / Suppleant]:
Namn: [Namn på ny person]
Personnummer: [Personnummer ny person]
Adress: [Adress till ny person]

Bifogat finns protokoll från bolagsstämman som bekräftar dessa ändringar.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din titel, t.ex. VD]` },

  { id: 18, authority: "Bolagsverket", title: "Avregistrering av enskild firma",
    desc: "Avsluta och avregistrera din enskilda näringsverksamhet.",
    body: `Till: Bolagsverket

Ämne: Avregistrering av enskild näringsverksamhet – org.nr [Ditt personnummer]

Till Bolagsverket,

Jag, [Ditt för- och efternamn], med personnummer/organisationsnummer [Ditt personnummer], anmäler härmed att min enskilda näringsverksamhet med företagsnamnet [Företagets namn] ska avregistreras.

Verksamheten har upphört från och med den [Datum för avslut, ÅÅÅÅ-MM-DD].

Jag ber er att stryka företagsnamnet ur näringslivsregistret.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din adress]` },

  { id: 19, authority: "Bolagsverket", title: "Svar på föreläggande om likvidation",
    desc: "Bolagsverket hotar att tvångsavveckla ditt AB? Svara med bifogad årsredovisning.",
    body: `Till: Bolagsverket

Ämne: Svar på föreläggande om likvidation – [Företagets namn], org.nr [Organisationsnummer]

Till Bolagsverket,

Vi har mottagit ert föreläggande om likvidation daterat den [Datum på Bolagsverkets brev] gällande [Företagets namn], organisationsnummer [Organisationsnummer].

Anledningen till föreläggandet anges vara saknad årsredovisning.

Vi vill härmed meddela att årsredovisningen för räkenskapsåret [Årtal] nu är upprättad och bifogas detta brev i original/bestyrkt kopia.

Vi ber er därför att omedelbart avskriva ärendet om tvångslikvidation, då grunden för likvidation inte längre föreligger.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din titel, t.ex. VD / Styrelseordförande]` },

  { id: 20, authority: "Bolagsverket", title: "Överklagande av förseningsavgift",
    desc: "Fått förseningsavgift för årsredovisning men haft giltigt skäl? Överklaga.",
    body: `Till: Bolagsverket

Ämne: Överklagande av beslut om förseningsavgift – [Företagets namn], org.nr [Organisationsnummer]

Till Bolagsverket,

Jag överklagar härmed ert beslut daterat den [Datum på beslutet] om att påföra [Företagets namn] en förseningsavgift på [Belopp] kr för försenad årsredovisning.

Jag yrkar att förseningsavgiften undanröjs i sin helhet.

Skälet till förseningen var omständigheter utanför vår kontroll, nämligen:
[Förklara noga, t.ex. "Plötslig och allvarlig sjukdom hos företagets enda revisor, vilket styrks av bifogat läkarintyg".]

Enligt aktiebolagslagen kan förseningsavgift efterges om förseningen framstår som ursäktlig. Jag anser att dessa omständigheter gör förseningen ursäktlig.

Bifogat finns bevis som styrker min förklaring.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din titel]` },

  // ── BOVERKET / HYRESNÄMNDEN ──────────────────────────────────────────────
  { id: 21, authority: "Boverket / Hyresnämnden", title: "Klagomål på brister i boendemiljön",
    desc: "Hyresvärden åtgärdar inte allvarliga fel i din lägenhet.",
    body: `Till: [Hyresvärdens namn / Hyresnämnden]

Ämne: Felanmälan / Klagomål gällande brister i lägenhet på [Din adress]

Hej,

Jag hyr lägenheten på [Din adress, lägenhetsnummer] av er. Jag skriver för att formellt anmäla allvarliga brister i min boendemiljö som ännu inte har åtgärdats, trots tidigare kontakt den [Datum för tidigare kontakt].

Bristerna består av:
– [Beskriv felet, t.ex. "Vattenskada i badrummet som orsakar mögel"]
– [Beskriv felet, t.ex. "Trasigt värmesystem, temperaturen är under 18 grader"]

Enligt hyreslagen är ni som hyresvärd skyldiga att tillhandahålla lägenheten i fullt brukbar skick. Jag begär att dessa fel åtgärdas omedelbart, senast inom [Antal, t.ex. 14] dagar.

Om ingen åtgärd vidtas kommer jag att vända mig till Hyresnämnden för att ansöka om åtgärdsföreläggande samt kräva nedsättning av hyran.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Ditt telefonnummer]` },

  { id: 22, authority: "Boverket / Hyresnämnden", title: "Krav på återbetalning av överhyra (andrahand)",
    desc: "Hyrt i andra hand och betalat oskäligt hög hyra? Kräv tillbaka pengarna.",
    body: `Till: [Förstahandshyresgästens/Uthyrarens namn]

Ämne: Krav på återbetalning av överhyra för lägenhet på [Adress]

Hej [Uthyrarens namn],

Jag har hyrt din lägenhet på [Adress] i andra hand under perioden [Startdatum] till [Slutdatum].

Under denna period har jag betalat [Belopp] kr i månaden i hyra. Jag har nu fått kännedom om att din egen hyra (förstahandshyran) endast uppgår till [Förstahandshyrens belopp] kr i månaden.

Enligt hyreslagen har du inte rätt att ta ut en hyra som är oskäligt mycket högre än din egen hyra. Jag kräver därför återbetalning av den överhyra jag har betalat.

Överhyran uppgår till [Mellanskillnad per månad] kr x [Antal månader] månader = Totalt [Totalt belopp] kr.

Jag begär att detta belopp betalas in på mitt bankkonto [Clearing- och kontonummer] senast den [Datum].

Om betalning inte sker kommer jag att driva ärendet vidare till Hyresnämnden.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 23, authority: "Boverket / Hyresnämnden", title: "Uppsägning av hyresavtal",
    desc: "Säg upp din hyreslägenhet formellt och korrekt.",
    body: `Till: [Hyresvärdens namn / Företag]

Ämne: Uppsägning av hyresavtal för lägenhet på [Din adress]

Hej,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], säger härmed upp mitt hyresavtal för lägenheten på [Din adress, lägenhetsnummer].

Enligt vårt hyresavtal är uppsägningstiden [Antal, t.ex. 3] månader. Detta innebär att hyresavtalet upphör att gälla den [Datum då avtalet slutar gälla].

Jag kommer att flytta ut och återlämna nycklarna senast kl. 12.00 den [Utflyttningsdatum].

Vänligen kontakta mig för att boka en tid för slutbesiktning av lägenheten.

Vänligen bekräfta skriftligen att ni har mottagit denna uppsägning.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Ditt telefonnummer]
[Din e-postadress]` },

  { id: 24, authority: "Boverket / Hyresnämnden", title: "Ansökan om tillstånd för andrahandsuthyrning",
    desc: "Be hyresvärden om lov att hyra ut din lägenhet i andra hand.",
    body: `Till: [Hyresvärdens namn / Bostadsrättsföreningens styrelse]

Ämne: Ansökan om tillstånd för andrahandsuthyrning av lägenhet på [Din adress]

Hej,

Jag, [Ditt för- och efternamn], hyr/äger lägenheten på [Din adress, lägenhetsnummer]. Jag ansöker härmed om tillstånd att hyra ut min lägenhet i andra hand.

Önskad uthyrningsperiod: [Startdatum] till [Slutdatum].

Skälet till andrahandsuthyrningen är:
[Förklara skälet, t.ex. "Tillfälligt arbete på annan ort" eller "Studier utomlands".]

Den föreslagna andrahandshyresgästen är:
Namn: [Namn på personen som ska hyra]
Personnummer: [Personnummer]
Telefon: [Telefonnummer]

Under uthyrningsperioden kan jag nås på: [Din tillfälliga adress] / [Ditt telefonnummer]

Jag hoppas på ett positivt besked och bifogar relevanta intyg.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 25, authority: "Boverket / Hyresnämnden", title: "Bestridande av oskälig hyreshöjning",
    desc: "Hyresvärden vill höja hyran och du accepterar inte höjningen.",
    body: `Till: [Hyresvärdens namn]

Ämne: Bestridande av krav på hyreshöjning för lägenhet på [Din adress]

Hej,

Jag har mottagit ert meddelande daterat den [Datum] angående en föreslagen hyreshöjning för min lägenhet på [Din adress].

Jag vill härmed meddela att jag INTE accepterar den föreslagna hyreshöjningen.

Jag anser att den begärda hyran är oskälig med hänsyn till lägenhetens bruksvärde, standard och skick.

Eftersom vi inte är överens om hyran, måste ni som hyresvärd vända er till Hyresnämnden för att få hyran prövad, om ni vill gå vidare med kravet.

Tills Hyresnämnden har fattat ett beslut kommer jag att fortsätta betala min nuvarande hyra om [Nuvarande hyra] kr per månad.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  // ── FÖRSÄKRINGSKASSAN ─────────────────────────────────────────────────────
  { id: 26, authority: "Försäkringskassan", title: "Begäran om omprövning av beslut",
    desc: "Fått avslag? Begär att Försäkringskassan omprövar beslutet.",
    body: `Till: Försäkringskassan

Ämne: Begäran om omprövning av beslut daterat [Datum], personnummer [Ditt personnummer]

Till Försäkringskassan,

Jag har mottagit ert beslut daterat den [Datum på beslutet] gällande min ansökan om [Typ av ersättning, t.ex. sjukpenning / bostadsbidrag / aktivitetsersättning].

Jag anser att beslutet är felaktigt och begär härmed att ni omprövar det.

Mina skäl för omprövning är följande:
[Förklara varför beslutet är fel. T.ex. "I beslutet anges att jag kan arbeta, men min läkare har tydligt angett att jag saknar arbetsförmåga helt på grund av min diagnos."]

Som stöd för min begäran bifogar jag följande underlag:
– [T.ex. Nytt och mer utförligt läkarintyg]
– [T.ex. Lönespecifikationer]

Jag emotser ett nytt beslut i ärendet.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din adress]` },

  { id: 27, authority: "Försäkringskassan", title: "Anmälan om ändrad inkomst",
    desc: "Din inkomst har ändrats – meddela Försäkringskassan för att undvika återbetalningskrav.",
    body: `Till: Försäkringskassan

Ämne: Anmälan om ändrad inkomst – personnummer [Ditt personnummer]

Till Försäkringskassan,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], uppbär för närvarande [T.ex. bostadsbidrag / underhållsstöd].

Jag vill härmed meddela att min inkomst har ändrats från och med den [Datum för ändring].

Min nya beräknade årsinkomst för innevarande år är [Belopp] kr före skatt.

Anledningen till ändringen är:
[Förklara kort, t.ex. "Jag har fått en ny anställning" eller "Jag har blivit arbetslös".]

Vänligen justera min ersättning utifrån dessa nya uppgifter så att jag inte riskerar att bli återbetalningsskyldig.

Bifogat finns [T.ex. Kopia på nytt anställningsavtal / Lönespecifikation].

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 28, authority: "Försäkringskassan", title: "Begäran om avbetalningsplan för återkrav",
    desc: "Försäkringskassan kräver tillbaka pengar? Ansök om avbetalningsplan.",
    body: `Till: Försäkringskassan

Ämne: Begäran om avbetalningsplan för återkrav – personnummer [Ditt personnummer]

Till Försäkringskassan,

Jag har mottagit ert beslut om återkrav daterat den [Datum], där ni kräver att jag ska betala tillbaka [Belopp] kr gällande [Typ av ersättning, t.ex. bostadsbidrag].

Jag saknar ekonomisk möjlighet att betala hela beloppet på en gång. Jag ansöker därför härmed om en avbetalningsplan.

Jag föreslår att jag betalar [Belopp per månad, t.ex. 500] kr per månad tills skulden är till fullo betald.

Min nuvarande ekonomiska situation är ansträngd på grund av [Kort förklaring, t.ex. arbetslöshet / sjukdom / höga boendekostnader].

Jag hoppas att ni godkänner detta förslag och skickar inbetalningskort för avbetalningsplanen.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din adress]` },

  { id: 29, authority: "Försäkringskassan", title: "Överklagande till Förvaltningsrätten",
    desc: "Försäkringskassan omprövat ditt ärende men fortfarande avslag? Överklaga till domstolen.",
    body: `Till: Försäkringskassan (för vidare befordran till Förvaltningsrätten)

Ämne: Överklagande av omprövningsbeslut daterat [Datum] – personnummer [Ditt personnummer]

Till Förvaltningsrätten,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], överklagar härmed Försäkringskassans omprövningsbeslut daterat den [Datum för omprövningsbeslutet].

Jag yrkar att Förvaltningsrätten ändrar Försäkringskassans beslut och beviljar mig [Typ av ersättning, t.ex. sjukpenning] för perioden [Startdatum] till [Slutdatum].

Mina skäl för överklagandet är:
[Förklara utförligt varför Försäkringskassan har gjort en felaktig bedömning. Hänvisa till lag eller medicinska underlag.]

Som bevis åberopar jag följande handlingar (bifogas):
– [Bevis 1, t.ex. Medicinskt utlåtande från specialistläkare]

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din adress]` },

  { id: 30, authority: "Försäkringskassan", title: "Begäran om byte av handläggare",
    desc: "Upplever du att handläggaren är partisk eller inte sköter jobbet? Begär byte.",
    body: `Till: Enhetschefen, Försäkringskassan

Ämne: Begäran om byte av handläggare – personnummer [Ditt personnummer]

Till ansvarig enhetschef,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], begär härmed att få byta handläggare i mitt pågående ärende gällande [Typ av ärende, t.ex. sjukpenning].

Min nuvarande handläggare är [Handläggarens namn].

Anledningen till min begäran är att jag upplever att samarbetet inte fungerar och att förtroendet är förbrukat.
[Förklara kort, t.ex. "Handläggaren har uppträtt oprofessionellt i telefon".]

För att mitt ärende ska kunna handläggas på ett rättssäkert och objektivt sätt ber jag er att omedelbart tilldela mig en ny handläggare.

Jag emotser er bekräftelse på att bytet har genomförts.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Ditt telefonnummer]` },

  // ── HÄLSO- OCH SJUKVÅRD ──────────────────────────────────────────────────
  { id: 31, authority: "Hälso- och sjukvård", title: "Klagomål på vård / Begäran om journalkopia",
    desc: "Missnöjd med vården eller vill ha ut dina medicinska journaler.",
    body: `Till: [Namn på sjukhuset / Vårdcentralen / Patientnämnden]

Ämne: Begäran om journalkopia / Klagomål på vård – personnummer [Ditt personnummer]

Till verksamhetschefen,

Mitt namn är [Ditt för- och efternamn], personnummer [Ditt personnummer].

ALTERNATIV 1 – Begäran om journal:
Jag begär härmed att få en fullständig kopia av min patientjournal för perioden [ÅÅÅÅ-MM-DD] till [ÅÅÅÅ-MM-DD] gällande min behandling på er klinik. Vänligen skicka kopiorna till min folkbokföringsadress.

ALTERNATIV 2 – Klagomål på vård:
Jag vill framföra ett formellt klagomål gällande den vård jag erhöll hos er den [Datum för besöket].
[Beskriv kort vad som hände, t.ex. "Jag upplevde att läkaren inte lyssnade på mina symptom och jag fick en felaktig diagnos".]

Jag önskar en skriftlig förklaring till det inträffade och information om vilka åtgärder ni vidtar.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din adress]
[Ditt telefonnummer]` },

  { id: 32, authority: "Hälso- och sjukvård", title: "Begäran om second opinion (ny medicinsk bedömning)",
    desc: "Allvarlig sjukdom? Du har rätt att få en ny medicinsk bedömning av en annan läkare.",
    body: `Till: [Namn på din nuvarande läkare / Verksamhetschefen]

Ämne: Begäran om ny medicinsk bedömning (second opinion) – personnummer [Ditt personnummer]

Hej,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], behandlas för närvarande hos er för [Din diagnos/sjukdom].

Enligt patientlagen (2014:821) har en patient med livshotande eller särskilt allvarlig sjukdom rätt att få en ny medicinsk bedömning av en annan läkare.

Eftersom jag står inför svåra medicinska beslut gällande min behandling, begär jag härmed att få en second opinion från en annan specialist, gärna vid en annan klinik eller region.

Jag ber er att hjälpa mig med en remiss och att skicka över mina journalhandlingar till den nya läkaren.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Ditt telefonnummer]` },

  { id: 33, authority: "Hälso- och sjukvård", title: "Begäran om rättelse av felaktig journaluppgift",
    desc: "Hittade fel uppgifter i din patientjournal? Begär rättelse.",
    body: `Till: Verksamhetschefen, [Namn på sjukhuset/vårdcentralen]

Ämne: Begäran om rättelse/anteckning i patientjournal – personnummer [Ditt personnummer]

Till verksamhetschefen,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], har tagit del av min patientjournal från mitt besök den [Datum för besöket].

Jag har upptäckt att journalen innehåller felaktiga uppgifter. I journalanteckningen skriven av läkare [Läkarens namn] står det:
"[Citera den felaktiga texten från journalen]"

Detta är felaktigt. Det korrekta är i stället:
[Förklara vad som är rätt, t.ex. "Jag uppgav aldrig att jag röker, jag har varit rökfri i 10 år".]

Enligt patientdatalagen begär jag härmed att journalen rättas, eller om det inte är möjligt, att en tydlig rättelseanteckning förs in i journalen som visar min inställning.

Vänligen bekräfta när detta är åtgärdat.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 34, authority: "Hälso- och sjukvård", title: "Anmälan till Patientnämnden",
    desc: "Klagat till vården utan bra svar? Anmäl till Patientnämnden.",
    body: `Till: Patientnämnden i [Din Region, t.ex. Region Stockholm]

Ämne: Anmälan om brister i vården – personnummer [Ditt personnummer]

Till Patientnämnden,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], vill härmed anmäla [Namn på sjukhuset/vårdcentralen] för brister i den vård jag erhöll den [Datum].

HÄNDELSEFÖRLOPP:
[Beskriv tydligt och kronologiskt vad som hände.]

VARFÖR JAG ÄR MISSNÖJD:
[Förklara vad vården gjorde fel, t.ex. feldiagnos, dåligt bemötande, bristande information.]

TIDIGARE KONTAKT:
Jag har redan kontaktat verksamhetschefen på kliniken den [Datum], men jag är inte nöjd med deras svar (bifogas).

Jag önskar att Patientnämnden hjälper mig att få en ordentlig förklaring från vårdgivaren och att åtgärder vidtas.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din adress]` },

  { id: 35, authority: "Hälso- och sjukvård", title: "Anmälan om vårdskada till LÖF (Patientförsäkringen)",
    desc: "Drabbat av vårdskada? Anmäl till LÖF för ekonomisk ersättning.",
    body: `Till: LÖF (Löf regionernas ömsesidiga försäkringsbolag)

Ämne: Anmälan om vårdskada – personnummer [Ditt personnummer]

Till LÖF,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], vill härmed anmäla en vårdskada som jag drabbades av i samband med vård hos [Namn på sjukhuset/kliniken] den [Datum för skadan/operationen].

BESKRIVNING AV SKADAN:
[Beskriv vad som gick fel och vilken skada du fick.]

KONSEKVENSER:
Skadan har medfört följande konsekvenser för mig:
– [T.ex. Sjukskrivning i 6 månader med inkomstförlust]
– [T.ex. Kvarstående smärta och behov av rehabilitering]
– [T.ex. Kostnader för medicin och resor]

Jag begär härmed att LÖF utreder ärendet och prövar min rätt till ekonomisk ersättning.

Vänligen skicka mig de blanketter som krävs för att komplettera denna anmälan.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din adress]` },

  // ── DEL 2: MALLAR 36–70 ──────────────────────────────────────────────────
  { id: 36, authority: "Migrationsverket", title: "Anmälan om förlorat/stulet uppehållstillståndskort",
    desc: "Förlorat ditt UT-kort? Anmäl till Migrationsverket och begär nytt.",
    body: `Till: Migrationsverket

Ämne: Anmälan om förlorat/stulet uppehållstillståndskort – personnummer [Ditt personnummer]

Till Migrationsverket,

Jag, [Ditt för- och efternamn], med personnummer/dossiernummer [Ditt nummer], vill härmed anmäla att mitt uppehållstillståndskort (UT-kort) har blivit [förlorat / stulet].

Händelsen inträffade den [Datum för händelsen].

Jag har polisanmält händelsen och bifogar en kopia av polisanmälan (diarienummer: [Polisens diarienummer]).

Jag begär härmed att få boka en tid för att lämna fingeravtryck och foto för att få ett nytt UT-kort utfärdat.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Ditt telefonnummer]` },

  { id: 37, authority: "Migrationsverket", title: "Begäran om förtur i ärende (Medicinska/Särskilda skäl)",
    desc: "Har du starka skäl för att ditt ärende ska handläggas snabbare? Begär förtur.",
    body: `Till: Migrationsverket

Ämne: Begäran om förtur – Ärende nr: [Ditt ärendenummer]

Till Migrationsverket,

Jag, [Ditt för- och efternamn], med personnummer/dossiernummer [Ditt nummer], ansökte om [Typ av tillstånd] den [Datum för ansökan].

Jag begär härmed att mitt ärende ges förtur och handläggs skyndsamt på grund av synnerliga skäl.

Skälen till min begäran är:
[Förklara noga, t.ex. "Min make/maka i hemlandet har drabbats av en livshotande sjukdom och behöver min omedelbara närvaro".]

Som bevis för dessa omständigheter bifogar jag:
– [Bevis 1, t.ex. Läkarintyg / Arbetsgivarintyg]

Jag hoppas på er förståelse och att ni beviljar min begäran om förtur.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 38, authority: "Migrationsverket", title: "Anmälan om ändrat civilstånd (Skilsmässa/Separation)",
    desc: "Uppehållstillstånd via anknytning och relationen tagit slut? Meddela Migrationsverket.",
    body: `Till: Migrationsverket

Ämne: Anmälan om ändrat civilstånd/separation – personnummer [Ditt personnummer]

Till Migrationsverket,

Jag, [Ditt för- och efternamn], med personnummer/dossiernummer [Ditt nummer], beviljades uppehållstillstånd på grund av anknytning till [Partnerns namn].

Jag vill härmed meddela att vårt förhållande har upphört och att vi har separerat från och med den [Datum för separation].

Jag bor nu på följande adress:
[Din nya adress]

Jag är medveten om att detta kan påverka mitt uppehållstillstånd och jag önskar information om hur jag ska gå tillväga för att ansöka om fortsatt uppehållstillstånd på andra grunder.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Ditt telefonnummer]` },

  { id: 39, authority: "Migrationsverket", title: "Begäran om registerutdrag (GDPR)",
    desc: "Begär ut alla handlingar och anteckningar Migrationsverket har om dig.",
    body: `Till: Migrationsverket, Dataskyddsombudet

Ämne: Begäran om registerutdrag enligt GDPR – personnummer [Ditt personnummer]

Till Dataskyddsombudet,

Jag, [Ditt för- och efternamn], med personnummer/dossiernummer [Ditt nummer], begär härmed ett fullständigt registerutdrag enligt artikel 15 i dataskyddsförordningen (GDPR).

Jag önskar få kopior på alla handlingar, journalanteckningar och beslut som finns registrerade på mig i era system, inklusive min fysiska och digitala akt.

Vänligen skicka utdraget till min folkbokföringsadress:
[Din gatuadress]
[Postnummer och Ort]

Tack på förhand.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 40, authority: "Migrationsverket", title: "Fullmakt för ombud i migrationsärende",
    desc: "Ge en annan person rätt att företräda dig hos Migrationsverket.",
    body: `Till: Migrationsverket

Ämne: Fullmakt för ombud – Ärende nr: [Ditt ärendenummer]

FULLMAKT

Härmed ger jag, [Ditt för- och efternamn], personnummer/dossiernummer [Ditt nummer], följande person fullmakt att företräda mig i mitt ärende hos Migrationsverket:

Ombudets namn: [Ombudets för- och efternamn]
Ombudets personnummer: [Ombudets personnummer]
Ombudets adress: [Ombudets adress]
Ombudets telefon: [Ombudets telefonnummer]

Fullmakten ger ombudet rätt att:
– Ta del av alla handlingar och beslut i mitt ärende.
– Lämna in ansökningar, kompletteringar och yttranden för min räkning.
– Ta emot delgivning av beslut.

Denna fullmakt gäller tills vidare, dock längst till dess att ärendet är slutligt avgjort eller fullmakten skriftligen återkallas.

Ort och datum: [Ort, ÅÅÅÅ-MM-DD]

[Ditt för- och efternamn]` },

  { id: 41, authority: "Skatteverket", title: "Anmälan om flytt utomlands",
    desc: "Ska du flytta från Sverige i mer än ett år? Avregistrera dig från folkbokföringen.",
    body: `Till: Skatteverket

Ämne: Anmälan om flytt till utlandet – personnummer [Ditt personnummer]

Till Skatteverket,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], anmäler härmed att jag flyttar från Sverige.

Utflyttningsdatum: [ÅÅÅÅ-MM-DD]
Nytt bosättningsland: [Landets namn]

Min nya adress i utlandet är:
[Gatuadress]
[Postnummer och Ort]
[Land]

Jag planerar att bo utomlands i [Antal år/månader, eller "tills vidare"].

Vänligen uppdatera folkbokföringen och registrera min utlandsadress för framtida postutskick.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 42, authority: "Skatteverket", title: "Begäran om jämkning (Ändrad skatteberäkning)",
    desc: "Vill du betala mindre skatt varje månad på grund av höga ränteutgifter eller resor?",
    body: `Till: Skatteverket

Ämne: Ansökan om jämkning för inkomstår [Årtal] – personnummer [Ditt personnummer]

Till Skatteverket,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], ansöker härmed om jämkning (ändrad beräkning av A-skatt) för inkomståret [Årtal].

Anledningen till min ansökan är att jag förväntar mig betydande avdrag under året som kommer att minska min slutliga skatt.

Mina beräknade avdrag för året är:
– Ränteutgifter för bolån: [Belopp] kr
– Resor till och från arbetet: [Belopp] kr
– Övriga avdrag: [Belopp] kr

Min beräknade bruttoinkomst för året är [Belopp] kr.

Jag begär att Skatteverket fattar ett beslut om jämkning så att min arbetsgivare kan dra rätt skatt.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 43, authority: "Skatteverket", title: "Anmälan om nytt bankkonto för skatteåterbäring",
    desc: "Meddela Skatteverket vilket konto du vill ha din skatteåterbäring utbetald till.",
    body: `Till: Skatteverket

Ämne: Anmälan av mottagarkonto för skatteåterbäring – personnummer [Ditt personnummer]

Till Skatteverket,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], anmäler härmed ett nytt bankkonto för utbetalning av skatteåterbäring och andra utbetalningar från skattekontot.

Mina kontouppgifter är:
Bankens namn: [Bankens namn, t.ex. Swedbank]
Clearingnummer: [Clearingnummer]
Kontonummer: [Kontonummer]

Jag intygar att jag är ensam kontohavare till detta konto.

Vänligen registrera detta konto så snart som möjligt.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 44, authority: "Skatteverket", title: "Svar på förfrågan från Skatteverket (Föreläggande)",
    desc: "Skatteverket ställt frågor om din deklaration? Svara korrekt och tydligt.",
    body: `Till: Skatteverket

Ämne: Svar på förfrågan daterad [Datum] – personnummer/org.nr [Ditt nummer]

Till handläggare [Handläggarens namn, om angivet],

Jag har mottagit er förfrågan/föreläggande daterat den [Datum på Skatteverkets brev] gällande [Vad frågan gällde, t.ex. mina reseavdrag i deklarationen].

Som svar på era frågor vill jag anföra följande:
[Besvara Skatteverkets frågor tydligt och punktvis.]

Som stöd för mina uppgifter bifogar jag följande underlag:
– [Bilaga 1, t.ex. Arbetsgivarintyg]
– [Bilaga 2, t.ex. Körjournal]

Jag hoppas att detta besvarar era frågor. Kontakta mig gärna om ni behöver ytterligare information.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Ditt telefonnummer]` },

  { id: 45, authority: "Skatteverket", title: "Begäran om befrielse från förseningsavgift",
    desc: "Fått förseningsavgift för deklarationen men hade giltigt skäl? Begär befrielse.",
    body: `Till: Skatteverket

Ämne: Begäran om befrielse från förseningsavgift – personnummer [Ditt personnummer]

Till Skatteverket,

Jag har mottagit ert beslut om förseningsavgift på [Belopp] kr på grund av försenad inkomstdeklaration.

Jag begär härmed att helt befrias från denna avgift, då förseningen berodde på omständigheter som jag inte kunde råda över.

Skälet till förseningen var:
[Förklara noga, t.ex. "Jag var inlagd på sjukhus under perioden [Datum] till [Datum] och saknade möjlighet att deklarera, vilket styrks av bifogat läkarintyg."]

Enligt skatteförfarandelagen kan befrielse medges om förseningen framstår som ursäktlig. Jag anser att mina skäl uppfyller detta krav.

Bifogat finns bevis som styrker min förklaring.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 46, authority: "Kronofogden", title: "Ansökan om handräckning (Avhysning/Vräkning)",
    desc: "Hyresvärd som behöver Kronofogdens hjälp att vräka en hyresgäst som inte flyttar.",
    body: `Till: Kronofogdemyndigheten

Ämne: Ansökan om vanlig handräckning (Avhysning)

SÖKANDE (Hyresvärd):
Namn/Företag: [Ditt namn/Företag]
Person-/Org.nr: [Ditt nummer]
Adress: [Din adress]

SVARANDE (Hyresgäst):
Namn: [Hyresgästens namn]
Personnummer: [Hyresgästens personnummer]
Adress: [Lägenhetens adress]

YRKANDE:
Jag yrkar att Kronofogdemyndigheten ålägger svaranden att omedelbart flytta från lägenheten på ovanstående adress (avhysning).

GRUND FÖR YRKANDET:
Hyresavtalet har sagts upp den [Datum] på grund av [Orsak, t.ex. obetalda hyror / störningar].
Uppsägningstiden löpte ut den [Datum], men svaranden har inte flyttat ut.

Bifogat finns kopia på hyresavtalet och uppsägningshandlingen.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 47, authority: "Kronofogden", title: "Begäran om kvitto/saldointyg på betald skuld",
    desc: "Betalat din skuld? Begär ett officiellt intyg från Kronofogden.",
    body: `Till: Kronofogdemyndigheten

Ämne: Begäran om saldointyg/kvitto – personnummer [Ditt personnummer]

Till Kronofogdemyndigheten,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], har nyligen slutbetalat min skuld i mål nummer [Målnummer].

Jag begär härmed ett skriftligt intyg (saldointyg) som bekräftar att skulden är till fullo betald och att ärendet är avslutat hos er.

Jag behöver detta intyg för att kunna visa upp för [T.ex. min bank / hyresvärd].

Vänligen skicka intyget till min folkbokföringsadress:
[Din gatuadress]
[Postnummer och Ort]

Tack på förhand.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 48, authority: "Kronofogden", title: "Invändning mot utmätning av egendom (Tredje mans rätt)",
    desc: "Kronofogden utmätt en sak som tillhör dig för att betala någon annans skuld?",
    body: `Till: Kronofogdemyndigheten

Ämne: Invändning mot utmätning (Tredje mans rätt) – Målnummer [Målnummer]

Till Kronofogdemyndigheten,

Jag har fått kännedom om att ni den [Datum för utmätning] har utmätt egendom hos [Namn på personen med skulden].

Den utmätta egendomen, specifikt [Beskriv egendomen, t.ex. en bil av märke Volvo med reg.nr ABC 123], tillhör inte gäldenären utan är min enskilda egendom.

Jag yrkar härmed att utmätningen av denna egendom omedelbart hävs.

Som bevis för min äganderätt bifogar jag:
– [Bevis 1, t.ex. Kvitto i mitt namn]
– [Bevis 2, t.ex. Registreringsbevis]

Vänligen bekräfta att utmätningen hävs och att egendomen återlämnas.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Ditt personnummer]
[Din adress]` },

  { id: 49, authority: "Kronofogden", title: "Ansökan om skuldsanering",
    desc: "Ansök om skuldsanering när du inte kan betala tillbaka dina skulder.",
    body: `Till: Kronofogdemyndigheten, Skuldsaneringsteamet

Ämne: Ansökan om skuldsanering – personnummer [Ditt personnummer]

Till Kronofogdemyndigheten,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], ansöker härmed om skuldsanering.

Bifogat finner ni den ifyllda blanketten "Ansökan om skuldsanering" samt alla nödvändiga bilagor gällande mina inkomster, utgifter och skulder.

Mina skulder uppgår till totalt ca [Totalt skuldbelopp] kr. Jag har hamnat i denna situation på grund av [Kort förklaring, t.ex. långvarig sjukdom / en konkurs / skilsmässa] och jag saknar helt förmåga att betala tillbaka skulderna inom överskådlig tid.

Jag har gjort allt jag kan för att öka mina inkomster och minska mina utgifter, och jag är mycket motiverad att genomföra en skuldsanering.

Vänligen kontakta mig om ni behöver kompletterande uppgifter.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Ditt telefonnummer]` },

  { id: 50, authority: "Kronofogden", title: "Klagomål på Kronofogdens handläggning/bemötande",
    desc: "Kronofogden agerat felaktigt eller otrevligt? Anmäl till Kundombudsmannen.",
    body: `Till: Kronofogdemyndigheten, Kundombudsmannen

Ämne: Klagomål på handläggning/bemötande – Ärende nr [Målnummer]

Till Kundombudsmannen,

Jag vill härmed framföra ett formellt klagomål gällande handläggningen av mitt ärende med målnummer [Målnummer].

Klagomålet avser händelser den [Datum] i kontakt med handläggare [Handläggarens namn, om känt].

HÄNDELSEFÖRLOPP:
[Beskriv vad som hände.]

Jag anser att detta agerande strider mot myndighetens serviceskyldighet och krav på saklighet.

Jag begär att händelsen utreds och att jag får en skriftlig förklaring till det inträffade.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din adress]` },

  { id: 51, authority: "Bolagsverket", title: "Anmälan om ändring av företagsnamn",
    desc: "Ansök om att byta namn på ditt aktiebolag eller din enskilda firma.",
    body: `Till: Bolagsverket

Ämne: Ändring av företagsnamn för org.nr [Organisationsnummer]

Till Bolagsverket,

Härmed anmäls ändring av företagsnamn för [Nuvarande företagsnamn], organisationsnummer [Organisationsnummer].

Vi ansöker om att byta namn till något av följande alternativ (i prioriteringsordning):
1. [Förstahandsval, t.ex. Nya Företaget AB]
2. [Andrahandsval, t.ex. Nya Företaget Sverige AB]
3. [Tredjehandsval, t.ex. NF Konsult AB]

Bifogat finns protokoll från extra bolagsstämma där beslutet om namnbyte och ändring av bolagsordningen fattades.

Vänligen skicka faktura för registreringsavgiften till företagets adress.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din titel, t.ex. VD]` },

  { id: 52, authority: "Bolagsverket", title: "Anmälan om verklig huvudman",
    desc: "Registrera vem som egentligen äger eller kontrollerar företaget (lagkrav).",
    body: `Till: Bolagsverket

Ämne: Registrering av verklig huvudman för [Företagets namn], org.nr [Organisationsnummer]

Till Bolagsverket,

Härmed anmäls verklig huvudman för [Företagets namn], organisationsnummer [Organisationsnummer], i enlighet med lagen (2017:631) om registrering av verkliga huvudmän.

Följande person är verklig huvudman:
Namn: [Huvudmannens för- och efternamn]
Personnummer: [Personnummer]
Medborgarskap: [T.ex. Svenskt]
Bosättningsland: [T.ex. Sverige]

Omfattning av kontrollen:
Personen kontrollerar företaget genom att äga [Procent, t.ex. 100] % av aktierna/rösterna.

Jag intygar på heder och samvete att uppgifterna är korrekta.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din titel]` },

  { id: 53, authority: "Bolagsverket", title: "Beställning av registreringsbevis på engelska",
    desc: "Beställ officiellt registreringsbevis på engelska (Certificate of Registration).",
    body: `Till: Bolagsverket

Ämne: Beställning av registreringsbevis på engelska – org.nr [Organisationsnummer]

Till Bolagsverket,

Jag beställer härmed ett (1) registreringsbevis på engelska (Certificate of Registration) för [Företagets namn], organisationsnummer [Organisationsnummer].

Vänligen skicka registreringsbeviset med post till företagets registrerade adress:
[Företagets adress]
[Postnummer och Ort]

Faktura för avgiften kan skickas till samma adress.

Tack på förhand.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din titel]` },

  { id: 54, authority: "Bolagsverket", title: "Anmälan om minskning av aktiekapital",
    desc: "Företaget beslutat minska aktiekapitalet? Registrera ändringen hos Bolagsverket.",
    body: `Till: Bolagsverket

Ämne: Anmälan om minskning av aktiekapital – [Företagets namn], org.nr [Organisationsnummer]

Till Bolagsverket,

Härmed anmäls beslut om minskning av aktiekapitalet i [Företagets namn], organisationsnummer [Organisationsnummer].

Bolagsstämman beslutade den [Datum för stämman] att minska aktiekapitalet med [Belopp] kr.

Aktiekapitalet uppgår efter minskningen till [Nytt belopp, t.ex. 25 000] kr.

Ändamålet med minskningen är: [T.ex. Täckande av förlust / Återbetalning till aktieägarna].

Bifogat finns:
– Protokoll från bolagsstämman
– Ny bolagsordning
– [Eventuellt revisorsyttrande]

Med vänlig hälsning,

[Ditt för- och efternamn]
[Din titel]` },

  { id: 55, authority: "Bolagsverket", title: "Svar på föreläggande om bristande företagsnamn",
    desc: "Bolagsverket nekat ditt föreslagna företagsnamn? Kom med nya alternativ.",
    body: `Till: Bolagsverket

Ämne: Svar på föreläggande gällande företagsnamn – Ärende nr [Ärendenummer]

Till Bolagsverket,

Vi har mottagit ert föreläggande daterat den [Datum] där ni meddelar att vårt föreslagna företagsnamn [Föreslaget namn] inte kan godkännas på grund av förväxlingsrisk med [Det andra företagets namn].

Vi vill härmed lämna in nya namnförslag för prövning (i prioriteringsordning):
1. [Nytt namnförslag 1]
2. [Nytt namnförslag 2]
3. [Nytt namnförslag 3]

Vi anser att dessa nya förslag har tillräcklig särskiljningsförmåga och inte inkräktar på befintliga varumärken eller företagsnamn i vår bransch.

Vänligen pröva dessa nya förslag i det pågående ärendet.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 56, authority: "Boverket / Hyresnämnden", title: "Krav på åtgärdande av skadedjur",
    desc: "Skadedjur (t.ex. vägglöss) i lägenheten? Kräv att hyresvärden sanerar omgående.",
    body: `Till: [Hyresvärdens namn / Fastighetsägaren]

Ämne: Akut felanmälan – Förekomst av skadedjur i lägenhet på [Din adress]

Hej,

Jag hyr lägenheten på [Din adress, lägenhetsnummer]. Jag vill härmed anmäla att jag har upptäckt skadedjur ([Ange typ, t.ex. vägglöss / råttor / kackerlackor]) i lägenheten.

Enligt 12 kap. 17 § jordabalken (hyreslagen) är ni som hyresvärd skyldiga att omedelbart vidta åtgärder för att utrota ohyra och skadedjur i fastigheten.

Jag begär att ni omgående, senast inom 48 timmar, kontaktar ett saneringsföretag (t.ex. Anticimex eller Nomor) och påbörjar saneringen.

Jag förbehåller mig rätten att kräva nedsättning av hyran för den tid som lägenheten är i bristfälligt skick, samt ersättning för eventuella förstörda möbler eller kläder.

Vänligen bekräfta mottagandet av detta meddelande och meddela när sanering kommer att ske.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Ditt telefonnummer]` },

  { id: 57, authority: "Boverket / Hyresnämnden", title: "Ansökan om lägenhetsbyte (Byte av hyresrätt)",
    desc: "Be hyresvärden om tillstånd att byta din hyresrätt mot en annan bostad.",
    body: `Till: [Hyresvärdens namn]

Ämne: Ansökan om tillstånd för lägenhetsbyte – [Din adress]

Hej,

Jag, [Ditt för- och efternamn], hyr lägenheten på [Din adress]. Jag ansöker härmed om tillstånd att få byta min lägenhet med [Bytespartens namn].

Skälet till bytet är:
[Förklara skälet, t.ex. "Jag har fått tillökning i familjen och behöver en större lägenhet".]

Information om bytesparten (den som vill flytta in i min lägenhet):
Namn: [Bytespartens namn]
Personnummer: [Bytespartens personnummer]
Nuvarande adress: [Bytespartens adress]
Inkomst: [Bytespartens årsinkomst, bifoga arbetsgivarintyg]

Bifogat finns bytespartens anställningsavtal och referenser från nuvarande hyresvärd.

Jag hoppas på ett snabbt och positivt besked.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 58, authority: "Boverket / Hyresnämnden", title: "Bestridande av faktura för flyttstädning/skador",
    desc: "Hyresvärden skickat orimlig faktura för städning eller påhittade skador? Bestrida den.",
    body: `Till: [Hyresvärdens namn]

Ämne: Bestridande av faktura nr [Fakturanummer] gällande [Din gamla adress]

Hej,

Jag har mottagit er faktura nr [Fakturanummer] på [Belopp] kr avseende [t.ex. bristfällig flyttstädning / skador på golv] i lägenheten på [Din gamla adress].

Jag bestrider härmed fakturan i sin helhet.

Anledningen till bestridandet är:
[Förklara varför, t.ex. "Lägenheten var noggrant städad av en professionell städfirma (kvitto bifogas)" eller "De repor i golvet fanns redan när jag flyttade in, vilket framgår av inflyttningsbesiktningsprotokollet".]

Jag kommer inte att betala denna faktura. Om ni väljer att driva ärendet vidare till Inkasso eller Kronofogden kommer jag att bestrida kravet även där.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 59, authority: "Boverket / Hyresnämnden", title: "Klagomål på störande grannar",
    desc: "Anmäl till hyresvärden att en granne stör (t.ex. hög musik på nätterna).",
    body: `Till: [Hyresvärdens namn / Störningsjouren]

Ämne: Formellt klagomål gällande upprepade störningar från grannlägenhet

Hej,

Jag bor i lägenhet [Ditt lägenhetsnummer] på [Din adress]. Jag skriver för att anmäla allvarliga och upprepade störningar från lägenhet [Grannens lägenhetsnummer/namn].

Störningarna består av:
[Beskriv störningarna, t.ex. "Mycket hög musik och skrikande sent på nätterna, ofta mellan kl. 01.00 och 04.00 på vardagar."]

Detta har pågått under en längre tid. Specifika datum och tider för de senaste störningarna är:
– [Datum 1, Tid]
– [Datum 2, Tid]

Jag har försökt prata med grannen utan resultat. Störningarna påverkar min sömn och hälsa negativt.

Enligt hyreslagen är ni som hyresvärd skyldiga att se till att hyresgäster inte utsätts för störningar. Jag begär att ni omedelbart skickar en rättelseanmaning (varningsbrev) till den störande hyresgästen.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 60, authority: "Boverket / Hyresnämnden", title: "Ansökan till Hyresnämnden om åtgärdsföreläggande",
    desc: "Hyresvärden vägrar laga fel i lägenheten? Anmäl till Hyresnämnden.",
    body: `Till: Hyresnämnden i [Din stad, t.ex. Stockholm]

Ämne: Ansökan om åtgärdsföreläggande mot hyresvärd

SÖKANDE (Hyresgäst):
Namn: [Ditt för- och efternamn]
Personnummer: [Ditt personnummer]
Adress: [Din adress]

MOTPART (Hyresvärd):
Namn/Företag: [Hyresvärdens namn]
Adress: [Hyresvärdens adress]

YRKANDE:
Jag yrkar att Hyresnämnden förelägger hyresvärden att omedelbart åtgärda följande brister i min lägenhet:
1. [T.ex. Reparera den trasiga spisen]
2. [T.ex. Åtgärda fuktskadan i badrummet]

GRUND FÖR YRKANDET:
Bristerna har funnits sedan den [Datum]. Jag har felanmält detta till hyresvärden skriftligen den [Datum] och påmint den [Datum], men hyresvärden har inte vidtagit några åtgärder.

Bifogat finns kopior på mina felanmälningar samt fotografier som visar bristerna.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 61, authority: "Försäkringskassan", title: "Begäran om utbetalning av retroaktiv ersättning",
    desc: "Vunnit överklagande och väntar på retroaktiv utbetalning? Begär den.",
    body: `Till: Försäkringskassan

Ämne: Begäran om utbetalning av retroaktiv ersättning – personnummer [Ditt personnummer]

Till Försäkringskassan,

Enligt beslut från [Försäkringskassan / Förvaltningsrätten] daterat den [Datum för beslutet] har jag beviljats [Typ av ersättning, t.ex. sjukpenning] för perioden [Startdatum] till [Slutdatum].

Trots att beslutet har vunnit laga kraft har jag ännu inte erhållit den retroaktiva utbetalningen för denna period.

Jag begär härmed att den retroaktiva ersättningen omgående betalas ut till mitt registrerade bankkonto.

Jag begär även dröjsmålsränta på beloppet i enlighet med räntelagen, då utbetalningen har försenats avsevärt.

Vänligen bekräfta när utbetalningen kommer att ske.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 62, authority: "Försäkringskassan", title: "Ansökan om att behålla sjukpenning vid utlandsvistelse",
    desc: "Sjukskriven och planerar resa inom EU/EES? Ansök om att behålla sjukpenningen.",
    body: `Till: Försäkringskassan

Ämne: Ansökan om att behålla sjukpenning vid utlandsvistelse – personnummer [Ditt personnummer]

Till Försäkringskassan,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], är för närvarande sjukskriven och uppbär sjukpenning.

Jag planerar att resa till [Land, t.ex. Spanien] under perioden [Startdatum] till [Slutdatum].

Enligt EU-regler har jag rätt att behålla min sjukpenning vid vistelse i ett annat EU/EES-land, förutsatt att resan inte hindrar mitt tillfrisknande eller min rehabilitering.

Min behandlande läkare har bedömt att resan inte kommer att påverka min rehabilitering negativt (läkarintyg bifogas).

Jag ansöker härmed om medgivande att få behålla min sjukpenning under denna utlandsvistelse.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 63, authority: "Försäkringskassan", title: "Begäran om skriftligt beslut (Fått muntligt besked)",
    desc: "Fått nej i telefon men behöver skriftligt beslut för att kunna överklaga.",
    body: `Till: Försäkringskassan

Ämne: Begäran om skriftligt beslut – personnummer [Ditt personnummer]

Till Försäkringskassan,

Vid ett telefonsamtal den [Datum] med handläggare [Handläggarens namn] fick jag muntligt besked om att min ansökan om [Typ av ersättning] kommer att avslås / har avslagits.

Enligt förvaltningslagen har jag rätt att få ett skriftligt beslut med en tydlig motivering till varför min ansökan har avslagits.

Jag begär härmed att ni omgående skickar ett formellt, skriftligt beslut i mitt ärende, inklusive information om hur jag kan överklaga beslutet (besvärshänvisning).

Vänligen skicka beslutet till min folkbokföringsadress.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 64, authority: "Försäkringskassan", title: "Komplettering till anmälan om arbetsskada",
    desc: "Skadat dig på jobbet? Komplettera anmälan med din egen redogörelse.",
    body: `Till: Försäkringskassan

Ämne: Komplettering till anmälan om arbetsskada – personnummer [Ditt personnummer]

Till Försäkringskassan,

Jag har den [Datum] råkat ut för en arbetsskada/olycka på min arbetsplats [Arbetsgivarens namn].

Händelsen är anmäld till Arbetsmiljöverket och Försäkringskassan av min arbetsgivare, men jag vill härmed komplettera anmälan med min egen redogörelse och yrkanden.

HÄNDELSEFÖRLOPP:
[Beskriv exakt vad som hände, t.ex. "Jag halkade på ett blött golv i lagret och bröt handleden."]

YRKANDE:
Jag ansöker härmed om arbetsskadeersättning för:
– Inkomstförlust (skillnaden mellan min vanliga lön och sjukpenningen)
– Kostnader för sjukvård och medicin (kvitton bifogas)

Bifogat finns även läkarintyg från akutmottagningen.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 65, authority: "Försäkringskassan", title: "Klagomål på oskäligt lång handläggningstid",
    desc: "Väntat orimligt länge på pengar eller beslut från Försäkringskassan?",
    body: `Till: Försäkringskassan, Kundcenter / Enhetschef

Ämne: Klagomål på oskäligt lång handläggningstid – personnummer [Ditt personnummer]

Till ansvarig chef,

Jag skickade in min ansökan om [Typ av ersättning, t.ex. sjukpenning] den [Datum för ansökan].

Det har nu gått [Antal] veckor/månader, och jag har fortfarande inte fått något beslut eller någon utbetalning. Den utlovade handläggningstiden på er hemsida är [Antal] dagar.

Denna försening orsakar mig allvarliga ekonomiska problem. Jag har svårt att betala min hyra och mina räkningar på grund av att Försäkringskassan inte sköter sitt uppdrag i tid.

Jag begär att mitt ärende omedelbart prioriteras och avgörs. Om beslut inte fattas inom en vecka kommer jag att anmäla dröjsmålet till Justitieombudsmannen (JO).

Jag emotser ett snabbt svar.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Ditt telefonnummer]` },

  { id: 66, authority: "Hälso- och sjukvård", title: "Åberopande av vårdgarantin (Krav på vård inom 90 dagar)",
    desc: "Väntat mer än 90 dagar på operation eller specialistvård? Åberopa vårdgarantin.",
    body: `Till: Vårdgarantikansliet i [Din Region] / Verksamhetschefen

Ämne: Åberopande av vårdgarantin – personnummer [Ditt personnummer]

Hej,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], fick en remiss till [Namn på specialistmottagning/operation] den [Datum för remissen].

Det har nu gått mer än 90 dagar sedan remissen utfärdades/beslut om behandling togs, och jag har ännu inte erbjudits en tid för vård.

Jag åberopar härmed den lagstadgade vårdgarantin. Eftersom ni inte kan erbjuda mig vård inom tidsgränsen, begär jag att ni omedelbart hjälper mig att få vård hos en annan vårdgivare, antingen i vår egen region eller i en annan region, utan extra kostnad för mig.

Vänligen kontakta mig snarast för att ordna detta.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Ditt telefonnummer]` },

  { id: 67, authority: "Hälso- och sjukvård", title: "Begäran om byte av läkare/vårdcentral",
    desc: "Inte nöjd med din nuvarande läkare? Du har rätt att byta.",
    body: `Till: Verksamhetschefen, [Namn på vårdcentralen/kliniken]

Ämne: Begäran om byte av läkare – personnummer [Ditt personnummer]

Till verksamhetschefen,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], är listad som patient hos er och har hittills haft [Läkarens namn] som min behandlande läkare.

Jag begär härmed att få byta till en annan läkare på er mottagning.

Anledningen till min begäran är att jag upplever brister i kommunikationen och att förtroendet för min nuvarande läkare är förbrukat.
[Valfritt: "Jag känner inte att mina symptom tas på allvar."]

Enligt patientlagen har jag rätt att välja och byta fast läkarkontakt. Jag önskar bli tilldelad en ny läkare inför mitt nästa besök.

Vänligen bekräfta när bytet är genomfört.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 68, authority: "Hälso- och sjukvård", title: "Ansökan om ersättning för sjukresor",
    desc: "Skicka in kvitton för att få pengar tillbaka för resor till sjukhuset.",
    body: `Till: Sjukreseenheten i [Din Region]

Ämne: Ansökan om ersättning för sjukresor – personnummer [Ditt personnummer]

Till Sjukreseenheten,

Jag ansöker härmed om ersättning för sjukresor i samband med mina vårdbesök hos [Namn på sjukhus/klinik].

Bifogat finner ni:
– Ifylld blankett för sjukresor
– Kvitto/intyg på vårdbesöken
– Kvitton för mina resekostnader (t.ex. tågbiljetter, taxikvitton)

Eftersom min hälsa inte tillät mig att åka kollektivt vid dessa tillfällen, tvingades jag åka taxi/egen bil.
[Valfritt: "Intyg från läkare om behov av sjukresa med taxi bifogas."]

Vänligen betala ut ersättningen till mitt bankkonto:
Bank: [Bankens namn]
Clearingnr: [Clearingnummer]
Kontonr: [Kontonummer]

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 69, authority: "Hälso- och sjukvård", title: "Spärrning av patientjournal (Sammanhållen journalföring)",
    desc: "Vill spärra din journal så att andra vårdgivare inte kan läsa den.",
    body: `Till: [Namn på din Region / Vårdcentral]

Ämne: Begäran om spärrning av patientjournal – personnummer [Ditt personnummer]

Hej,

Jag, [Ditt för- och efternamn], personnummer [Ditt personnummer], begär härmed att mina journaluppgifter spärras för elektronisk åtkomst av andra vårdgivare (sammanhållen journalföring).

Jag vill att spärren ska gälla:
[Välj alternativ: "Hela min journal hos er." ELLER "Specifikt journalanteckningarna från [Klinik/Avdelning] under perioden [Datum] till [Datum]."]

Jag är medveten om att en spärr innebär att annan vårdpersonal inte kan se min sjukdomshistorik, vilket kan påverka min framtida vård, och att jag själv måste informera dem om viktiga medicinska uppgifter.

Vänligen bekräfta skriftligen när spärren är aktiverad.

Med vänlig hälsning,

[Ditt för- och efternamn]` },

  { id: 70, authority: "Hälso- och sjukvård", title: "Begäran om tolk vid vårdbesök",
    desc: "Talar inte flytande svenska? Kräv att sjukhuset bokar tolk till ditt besök.",
    body: `Till: [Namn på mottagningen/kliniken]

Ämne: Begäran om tolk inför vårdbesök den [Datum] – personnummer [Ditt personnummer]

Hej,

Jag har en inbokad tid hos er den [Datum] kl. [Tid] hos läkare/sjuksköterska [Namn, om känt].

Eftersom jag inte talar flytande svenska, begär jag härmed att ni bokar en professionell tolk till mitt besök.

Språk som tolken måste tala: [Ditt modersmål, t.ex. Arabiska / Somaliska / Polska].

Enligt förvaltningslagen och hälso- och sjukvårdslagen är det vårdgivarens ansvar att boka och betala för tolk när det behövs för att patienten ska förstå informationen.

Vänligen bekräfta att en tolk är bokad till mitt besök.

Med vänlig hälsning,

[Ditt för- och efternamn]
[Ditt telefonnummer]` },
];

// ── Utilities ────────────────────────────────────────────────────────────────

function extractPlaceholders(body: string): string[] {
  const seen = new Set<string>();
  const matches = body.match(/\[([^\]]+)\]/g) ?? [];
  return matches
    .map(m => m.slice(1, -1))
    .filter(key => { if (seen.has(key)) return false; seen.add(key); return true; });
}

function renderWithValues(body: string, values: Record<string, string>) {
  return body.replace(/\[([^\]]+)\]/g, (_, key) => values[key] || `[${key}]`);
}

// ── Sub-components ───────────────────────────────────────────────────────────

function TemplateCard({ t, onClick }: { t: Template; onClick: () => void }) {
  const colorClass = AUTH_COLORS[t.authority] ?? "bg-slate-100 text-slate-700 border-slate-200";
  return (
    <button
      onClick={onClick}
      className="text-left w-full bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md hover:border-primary/30 transition-all group"
    >
      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border mb-2 ${colorClass}`}>
        {t.authority}
      </span>
      <p className="font-semibold text-slate-900 text-sm leading-tight group-hover:text-primary transition-colors mb-1">
        Mall {t.id} – {t.title}
      </p>
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{t.desc}</p>
    </button>
  );
}

function TemplateEditor({ t, onBack }: { t: Template; onBack: () => void }) {
  const placeholders = extractPlaceholders(t.body);
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const setValue = (key: string, val: string) =>
    setValues(prev => ({ ...prev, [key]: val }));

  const filledText = renderWithValues(t.body, values);

  const handleCopy = () => {
    navigator.clipboard.writeText(filledText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([filledText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Mall_${t.id}_${t.authority.replace(/\s*\/\s*/g, "-").replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const allFilled = placeholders.every(p => (values[p] ?? "").trim().length > 0);
  const filledCount = placeholders.filter(p => (values[p] ?? "").trim().length > 0).length;

  return (
    <div>
      {/* Back button */}
      <div className="mb-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors">
          ← Tillbaka till mallar
        </button>
      </div>

      {/* Header */}
      <div className="mb-6">
        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border mb-2 ${AUTH_COLORS[t.authority] ?? "bg-slate-100"}`}>
          {t.authority}
        </span>
        <h2 className="text-xl font-bold text-slate-900">Mall {t.id} – {t.title}</h2>
        <p className="text-sm text-slate-500 mt-1">{t.desc}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: fill in form */}
        <div>
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
              Fyll i dina uppgifter ({filledCount}/{placeholders.length})
            </p>
            {placeholders.length === 0 ? (
              <p className="text-sm text-slate-400">Inga fält att fylla i.</p>
            ) : (
              <div className="space-y-3">
                {placeholders.map(key => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-slate-600 mb-1">{key}</label>
                    {key.length > 60 ? (
                      <textarea
                        rows={3}
                        value={values[key] ?? ""}
                        onChange={e => setValue(key, e.target.value)}
                        placeholder={key}
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={values[key] ?? ""}
                        onChange={e => setValue(key, e.target.value)}
                        placeholder={key}
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 flex gap-2 flex-wrap">
              <button
                onClick={handleCopy}
                disabled={!allFilled}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${allFilled ? "bg-primary text-white hover:bg-primary/90" : "bg-slate-200 text-slate-500 cursor-not-allowed"}`}
                title={!allFilled ? "Fyll i alla fält först" : ""}
              >
                {copied ? "✓ Kopierat!" : "📋 Kopiera text"}
              </button>
              <button
                onClick={handleDownload}
                disabled={!allFilled}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm border ${allFilled ? "bg-white border-slate-300 text-slate-700 hover:border-primary hover:text-primary" : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"}`}
                title={!allFilled ? "Fyll i alla fält först" : ""}
              >
                {downloaded ? "✓ Nedladdat!" : "💾 Spara som .txt"}
              </button>
              {!allFilled && (
                <p className="text-xs text-slate-400 self-center w-full mt-1">Fyll i alla {placeholders.length} fält för att kopiera eller spara.</p>
              )}
            </div>
            {copied && <p className="text-xs text-emerald-600 mt-2">✓ Texten är kopierad – klistra in i Word eller Anteckningar och skriv ut.</p>}
            {downloaded && !copied && <p className="text-xs text-emerald-600 mt-2">✓ Fil sparad – öppna i Word eller Anteckningar och skriv ut.</p>}
          </div>

          <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 text-xs text-amber-700">
            ⚠️ Dessa mallar är gratis att använda. Texten inom [hakparenteser] ersätts med dina uppgifter. Svar Direkt erbjuder inte juridisk rådgivning.
          </div>
        </div>

        {/* Right: live preview */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Förhandsgranskning</p>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 min-h-64 font-mono text-xs leading-relaxed text-slate-700 whitespace-pre-wrap overflow-auto max-h-[60vh]">
            {t.body.replace(/\[([^\]]+)\]/g, (_, key) => {
              const val = values[key];
              return val ? val : `[${key}]`;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function MallarInteraktiva() {
  const [activeAuth, setActiveAuth] = useState("Alla");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Template | null>(null);

  const filtered = useMemo(() => {
    return TEMPLATES.filter(t => {
      const matchAuth = activeAuth === "Alla" || t.authority === activeAuth;
      const q = search.toLowerCase();
      const matchSearch = !q || t.title.toLowerCase().includes(q) || t.authority.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
      return matchAuth && matchSearch;
    });
  }, [activeAuth, search]);

  if (selected) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <TemplateEditor t={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-sky-50 to-white border-b border-slate-100 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            70 mallar · Helt gratis
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 leading-tight">
            Interaktiva brevmallar till svenska myndigheter
          </h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto mb-2">
            Välj en mall, fyll i dina uppgifter direkt i formuläret och skriv ut eller spara som PDF. Allt helt gratis.
          </p>
          <p className="text-xs text-slate-400">Kronofogden · Försäkringskassan · Skatteverket · Migrationsverket · Bolagsverket · Hyresnämnden · Sjukvård</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-5">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Sök mall, t.ex. 'bestridande', 'omprövning', 'uppsägning'…"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {AUTHORITIES.map(auth => (
            <button
              key={auth}
              onClick={() => setActiveAuth(auth)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                activeAuth === auth
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-slate-600 border-slate-200 hover:border-primary/40 hover:text-primary"
              }`}
            >
              {auth}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-xs text-slate-400 mb-4">
          {filtered.length} {filtered.length === 1 ? "mall" : "mallar"} {activeAuth !== "Alla" ? `för ${activeAuth}` : "totalt"}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-4xl mb-2">🔍</p>
            <p className="font-medium">Inga mallar hittades</p>
            <p className="text-sm mt-1">Prova ett annat sökord</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(t => (
              <TemplateCard key={t.id} t={t} onClick={() => setSelected(t)} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-primary/5 border border-primary/10 rounded-2xl p-6 text-center">
          <p className="font-bold text-slate-800 mb-1">Behöver du personlig hjälp med ditt brev?</p>
          <p className="text-sm text-slate-500 mb-4">Vi formulerar ett skräddarsytt brev åt dig – anpassat exakt efter din situation. Första svaret gratis.</p>
          <a href="/tjanst#formular" className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-sm">
            Få personlig hjälp →
          </a>
        </div>
      </div>
    </>
  );
}
