import { useState, useRef } from "react";
import { Link } from "wouter";

const templates = [
  {
    id: 1,
    title: "Lager – ansökan utan erfarenhet",
    text: `Hej,

Jag heter [Namn] och söker tjänsten som [Tjänst] hos [Företag].

Även om jag inte har tidigare erfarenhet av lagerarbete är jag van att arbeta fysiskt och trivs med tydliga rutiner. Jag är pålitlig, punktlig och lär mig snabbt.

Jag är van att ta ansvar och är inte rädd för att rycka in där det behövs. Jag söker ett långsiktigt jobb där jag kan utvecklas.

Ni är välkommen att kontakta mig på [Kontakt].

Med vänliga hälsningar,
[Namn]`,
  },
  {
    id: 2,
    title: "Restaurang – kök och disk",
    text: `Hej,

Mitt namn är [Namn] och jag söker jobbet som [Tjänst] på [Företag].

Jag har [Erfarenhet] inom restaurangbranschen och trivs i ett högt tempo. Jag är noggrann med hygien, snabb och van att samarbeta i team.

Mina starka sidor är [Styrkor]. Jag är flexibel med arbetstider och ställer gärna upp på helger och kvällar.

Kontakta mig gärna på [Kontakt].

Med vänliga hälsningar,
[Namn]`,
  },
  {
    id: 3,
    title: "Butik – serviceinriktad",
    text: `Hej,

Jag ansöker härmed om tjänsten som [Tjänst] på [Företag].

Jag är en serviceinriktad person som trivs i mötet med kunder. Mina starka sidor är [Styrkor] och jag har [Erfarenhet] av butiks- och serviceyrken.

Jag är strukturerad, hjälpsam och tar gärna egna initiativ. Jag vill bidra till en trevlig kundupplevelse varje dag.

Jag ser fram emot att höra från er. Ni når mig på [Kontakt].

Med vänliga hälsningar,
[Namn]`,
  },
  {
    id: 4,
    title: "Kontor – administrativ roll",
    text: `Hej,

Jag heter [Namn] och ansöker om tjänsten som [Tjänst] hos [Företag].

Jag har [Erfarenhet] av administrativt arbete och är van att hantera mejl, dokument och schemaläggning. Jag arbetar strukturerat och självständigt.

Mina styrkor är [Styrkor]. Jag trivs i en roll där noggrannhet och ordning är viktigt.

Jag ser gärna en intervju och finns tillgänglig på [Kontakt].

Med vänliga hälsningar,
[Namn]`,
  },
  {
    id: 5,
    title: "Första jobbet – ung sökande",
    text: `Hej,

Jag heter [Namn] och söker mitt första jobb som [Tjänst] på [Företag].

Jag är motiverad, nyfiken och läraktig. Även om jag saknar arbetslivserfarenhet tar jag ansvar och gör alltid mitt bästa. Jag vill bevisa vad jag kan.

Mina styrkor är [Styrkor] och jag trivs i strukturerade miljöer med tydliga uppgifter.

Kontakta mig gärna på [Kontakt] — jag är tillgänglig omgående.

Med vänliga hälsningar,
[Namn]`,
  },
  {
    id: 6,
    title: "Städare – noggrant och pålitligt",
    text: `Hej,

Jag ansöker om tjänsten som [Tjänst] på [Företag].

Jag heter [Namn] och har [Erfarenhet] av städning i både privata och kommersiella miljöer. Jag arbetar noggrant, effektivt och med hög känsla för detaljer.

Jag är pålitlig och trivs med självständigt arbete. Tidiga mornar och flexibla tider fungerar bra för mig.

Ni är välkommen att kontakta mig på [Kontakt].

Med vänliga hälsningar,
[Namn]`,
  },
  {
    id: 7,
    title: "Barnvakt / Au pair",
    text: `Hej,

Mitt namn är [Namn] och jag söker tjänsten som [Tjänst] hos [Företag] eller direkt hos familjen.

Jag har [Erfarenhet] av barnpassning och trivs verkligen med barn. Jag är ansvarsfull, lugn och skapar trygghet. Mina styrkor inkluderar [Styrkor].

Jag är flexibel med tider och kan arbeta kvällar och helger vid behov.

Kontakta mig gärna på [Kontakt] för mer information.

Med vänliga hälsningar,
[Namn]`,
  },
  {
    id: 8,
    title: "IT / Teknik – junior roll",
    text: `Hej,

Jag heter [Namn] och söker tjänsten som [Tjänst] hos [Företag].

Jag har [Erfarenhet] inom IT och teknik, med fokus på [Styrkor]. Jag är analytisk, lösningsorienterad och lär mig nya system snabbt.

Jag trivs i miljöer där man tar ansvar för sina uppgifter och där det finns utrymme att växa. Jag är motiverad att bidra i ett kompetent team.

Ni är välkommen att nå mig på [Kontakt].

Med vänliga hälsningar,
[Namn]`,
  },
  {
    id: 9,
    title: "Vård och omsorg",
    text: `Hej,

Jag söker tjänsten som [Tjänst] hos [Företag].

Jag heter [Namn] och har [Erfarenhet] av arbete inom vård och omsorg. Jag är empatisk, tålmodig och sätter alltid omsorgstagaren i centrum. Mina styrkor är [Styrkor].

Jag trivs i ett arbete med mänsklig kontakt och är van att arbeta i team liksom självständigt.

Kontakta mig på [Kontakt].

Med vänliga hälsningar,
[Namn]`,
  },
  {
    id: 10,
    title: "Chaufför / Budtjänst",
    text: `Hej,

Mitt namn är [Namn] och jag ansöker om tjänsten som [Tjänst] hos [Företag].

Jag har [Erfarenhet] av körning i yrkesmässig miljö och är van att leverera i tid. Jag kör säkert, är ansvarsfull och trivs med självständigt arbete.

Mina styrkor är [Styrkor]. Jag har B-körkort och god lokalkännedom.

Ni når mig på [Kontakt].

Med vänliga hälsningar,
[Namn]`,
  },
  {
    id: 11,
    title: "Säkerhetsvakt",
    text: `Hej,

Jag heter [Namn] och söker tjänsten som [Tjänst] på [Företag].

Jag har [Erfarenhet] av bevaknings- och säkerhetsarbete. Jag är lugn under press, uppmärksam och van att följa regler och rutiner noggrant.

Mina styrkor inkluderar [Styrkor]. Jag trivs med nattskift och varierade arbetstider.

Ni är välkommen att kontakta mig på [Kontakt].

Med vänliga hälsningar,
[Namn]`,
  },
  {
    id: 12,
    title: "Skola / Förskola – barnskötare",
    text: `Hej,

Jag ansöker om tjänsten som [Tjänst] på [Företag].

Jag heter [Namn] och har [Erfarenhet] av arbete med barn i förskole- och skolmiljö. Jag är tålmodig, kreativ och skapar en trygg och stimulerande miljö för barnen.

Mina styrkor är [Styrkor]. Jag samarbetar bra med kollegor och föräldrar.

Kontakta mig gärna på [Kontakt].

Med vänliga hälsningar,
[Namn]`,
  },
  {
    id: 13,
    title: "Bygg och anläggning",
    text: `Hej,

Jag heter [Namn] och söker tjänsten som [Tjänst] hos [Företag].

Jag har [Erfarenhet] av byggnads- och anläggningsarbete och är van att arbeta fysiskt krävande uppgifter. Jag är noggrann med säkerhetsregler och trivs i team.

Mina styrkor inkluderar [Styrkor]. Jag är tillgänglig omgående och kan börja snabbt.

Ni kan nå mig på [Kontakt].

Med vänliga hälsningar,
[Namn]`,
  },
  {
    id: 14,
    title: "Marknadsföring / Sociala medier",
    text: `Hej,

Jag heter [Namn] och söker tjänsten som [Tjänst] på [Företag].

Jag har [Erfarenhet] av digital marknadsföring och hantering av sociala medier. Jag är kreativ, strukturerad och resultatorienterad. Mina styrkor är [Styrkor].

Jag följer trender noga och vet hur man skapar innehåll som engagerar rätt målgrupp.

Kontakta mig gärna på [Kontakt] — jag berättar gärna mer.

Med vänliga hälsningar,
[Namn]`,
  },
  {
    id: 15,
    title: "Allmän ansökan – ingen specifik bransch",
    text: `Hej,

Jag heter [Namn] och är intresserad av att arbeta på [Företag]. Jag söker en tjänst som [Tjänst] eller liknande roll.

Jag har [Erfarenhet] och mina styrkor är [Styrkor]. Jag är engagerad, flexibel och van att anpassa mig till nya miljöer.

Jag tar gärna ett samtal och berättar mer om mig själv. Ni når mig på [Kontakt].

Med vänliga hälsningar,
[Namn]`,
  },
];

const authorityTemplates = [
  // --- FÖRSÄKRINGSKASSAN ---
  {
    id: "fk-1",
    authority: "Försäkringskassan",
    color: "blue",
    title: "Begäran om förlängning av sjukpenning",
    seo: "Mall för att begära förlängning av sjukpenning från Försäkringskassan.",
    text: `Till Försäkringskassan

Ärende: Begäran om förlängning av sjukpenning
Personnummer: [XXXXXXXXXX-XXXX]

Jag heter [Namn] och vill med detta brev begära förlängning av min sjukpenning. Jag är för närvarande sjukskriven sedan [datum] till och med [datum] med diagnos [diagnos].

Min läkare har bedömt att min arbetsförmåga fortfarande är nedsatt och att jag behöver ytterligare tid för rehabilitering. Läkarintyg bifogas/har skickats separat.

Jag är tillgänglig för frågor eller komplettering och kan nås på [telefon] eller [e-post].

Med vänliga hälsningar,
[Namn]
[Adress]
[Datum]`,
  },
  {
    id: "fk-2",
    authority: "Försäkringskassan",
    color: "blue",
    title: "Överklagande av beslut om nekad ersättning",
    seo: "Mall för överklagande av Försäkringskassans beslut om nekad sjukpenning eller ersättning.",
    text: `Till Försäkringskassan

Ärende: Överklagande av beslut [ärendenummer]
Personnummer: [XXXXXXXXXX-XXXX]

Jag heter [Namn] och överklagar härmed ert beslut daterat [datum] om nekad [ersättningstyp, t.ex. sjukpenning/aktivitetsersättning].

Jag anser att beslutet är felaktigt av följande skäl:

[Beskriv varför du anser att beslutet är fel, t.ex.: Min arbetsförmåga är fortfarande nedsatt enligt bifogat läkarintyg. / Jag uppfyller villkoren för ersättning eftersom...]

Jag bifogar följande handlingar till stöd för mitt överklagande:
- Läkarintyg daterat [datum]
- [Övriga bilagor]

Jag begär att Försäkringskassan omprövar beslutet snarast möjligt.

Med vänliga hälsningar,
[Namn]
[Adress]
[Telefon]
[Datum]`,
  },
  {
    id: "fk-3",
    authority: "Försäkringskassan",
    color: "blue",
    title: "Svar på begäran om komplettering",
    seo: "Mall för att svara på Försäkringskassans begäran om komplettering av ansökan.",
    text: `Till Försäkringskassan

Ärende: Komplettering av ansökan [ärendenummer]
Personnummer: [XXXXXXXXXX-XXXX]

Jag heter [Namn] och svarar härmed på er begäran om komplettering daterad [datum].

Ni efterfrågade följande uppgifter/handlingar:
[Beskriv vad Försäkringskassan begärde]

Nedan följer de uppgifter ni efterfrågade:
[Fyll i svaren på de frågor som ställdes]

Bifogade handlingar:
- [Dokument 1]
- [Dokument 2]

Om ni behöver ytterligare information är ni välkomna att kontakta mig på [telefon] eller [e-post].

Med vänliga hälsningar,
[Namn]
[Adress]
[Datum]`,
  },

  // --- KRONOFOGDEN ---
  {
    id: "kf-1",
    authority: "Kronofogden",
    color: "red",
    title: "Bestrida skuld – okänd eller felaktig fordran",
    seo: "Mall för att bestrida en skuld eller felaktig fordran hos Kronofogden.",
    text: `Till Kronofogdemyndigheten

Ärende: Bestridande av ansökan om betalningsföreläggande [målinummer]
Personnummer: [XXXXXXXXXX-XXXX]

Jag heter [Namn] och bestrider härmed den fordran som [fordringsägare] har framställt mot mig.

Jag bestrider kravet av följande skäl:
[Välj ett eller flera alternativ och anpassa:]
- Jag känner inte igen skulden och bestrider att jag är skyldig detta belopp.
- Jag har redan betalat detta belopp den [datum]. Kvitto/bevis bifogas.
- Beloppet är felaktigt beräknat. Det korrekta beloppet är [belopp].
- Fordran är preskriberad.

Jag begär att ärendet hänskjuts till tingsrätten för prövning.

Bifogade handlingar:
- [Bevis/kvitton/korrespondens]

Med vänliga hälsningar,
[Namn]
[Adress]
[Telefon]
[Datum]`,
  },
  {
    id: "kf-2",
    authority: "Kronofogden",
    color: "red",
    title: "Ansökan om avbetalningsplan",
    seo: "Mall för att ansöka om avbetalningsplan eller betalningsuppgörelse hos Kronofogden.",
    text: `Till Kronofogdemyndigheten

Ärende: Ansökan om avbetalningsplan
Personnummer: [XXXXXXXXXX-XXXX]
Målinummer: [Målinummer]

Jag heter [Namn] och kontaktar er angående skulden till [borgenär] om [belopp] kr.

Jag erkänner skulden men befinner mig för närvarande i en svår ekonomisk situation på grund av [orsak, t.ex. sjukdom, arbetslöshet, oförutsedda utgifter]. Jag kan inte betala hela beloppet på en gång, men jag är villig och i stånd att betala [belopp] kr per månad.

Mina nuvarande inkomster: [belopp] kr/månad
Mina fasta utgifter: [belopp] kr/månad

Jag hoppas att vi kan komma överens om en avbetalningsplan som gör det möjligt för mig att reglera skulden.

Med vänliga hälsningar,
[Namn]
[Adress]
[Telefon]
[Datum]`,
  },
  {
    id: "kf-3",
    authority: "Kronofogden",
    color: "red",
    title: "Begäran om skuldsanering",
    seo: "Mall för att ansöka om skuldsanering hos Kronofogden när man har ohanterbara skulder.",
    text: `Till Kronofogdemyndigheten

Ärende: Ansökan om skuldsanering
Personnummer: [XXXXXXXXXX-XXXX]

Jag heter [Namn] och ansöker härmed om skuldsanering.

Jag har skulder på totalt cirka [totalt belopp] kr till följande borgenärer:
- [Borgenär 1]: [belopp] kr
- [Borgenär 2]: [belopp] kr
- [Borgenär 3]: [belopp] kr

Jag har gjort allt jag kan för att betala mina skulder men min ekonomiska situation omöjliggör detta. Min inkomst är [belopp] kr/månad och mina nödvändiga levnadskostnader uppgår till [belopp] kr/månad.

Jag uppfyller villkoren för skuldsanering eftersom jag är varaktigt betalningsoförmögen och det är skäligt med hänsyn till mina personliga och ekonomiska förhållanden.

Jag bifogar fullständig förteckning över skulder, tillgångar och inkomster.

Med vänliga hälsningar,
[Namn]
[Adress]
[Telefon]
[Datum]`,
  },

  // --- SKATTEVERKET ---
  {
    id: "sk-1",
    authority: "Skatteverket",
    color: "green",
    title: "Ansökan om anstånd med skatteinbetalning",
    seo: "Mall för att ansöka om anstånd med betalning av skatt till Skatteverket.",
    text: `Till Skatteverket

Ärende: Ansökan om anstånd med betalning av skatt
Personnummer/Organisationsnummer: [XXXXXXXXXX-XXXX]

Jag heter [Namn] och ansöker härmed om anstånd med betalning av [skatteskuld/preliminärskatt] om [belopp] kr som förfaller [datum].

Anledningen till att jag ansöker om anstånd är:
[Beskriv skälen, t.ex.: Jag har drabbats av en oväntad ekonomisk svårighet på grund av... / Mitt kassaflöde är tillfälligt ansträngt på grund av...]

Jag bedömer att jag kan betala hela beloppet senast [datum] och hoppas att Skatteverket kan bevilja anstånd till dess.

Med vänliga hälsningar,
[Namn]
[Adress]
[Telefon]
[E-post]
[Datum]`,
  },
  {
    id: "sk-2",
    authority: "Skatteverket",
    color: "green",
    title: "Svar på förfrågan om skattekontroll",
    seo: "Mall för att svara på Skatteverkets förfrågan om skattekontroll eller granskning.",
    text: `Till Skatteverket

Ärende: Svar på förfrågan om kontroll [referensnummer]
Personnummer/Organisationsnummer: [XXXXXXXXXX-XXXX]

Jag heter [Namn] och svarar härmed på er förfrågan daterad [datum] angående [ämne, t.ex. min deklaration för inkomstår X].

Ni efterfrågade uppgifter om:
[Ange vad Skatteverket frågade om]

Svar:
[Ge utförliga och korrekta svar på frågorna. Var noggrann och bifoga bevis.]

Bifogade handlingar som styrker ovanstående:
- [Dokument 1, t.ex. kvitton, kontrakt, kontoutdrag]
- [Dokument 2]

Om ni behöver ytterligare information är ni välkomna att kontakta mig på [telefon] eller [e-post].

Med vänliga hälsningar,
[Namn]
[Adress]
[Datum]`,
  },
  {
    id: "sk-3",
    authority: "Skatteverket",
    color: "green",
    title: "Rättelse av uppgifter i deklaration",
    seo: "Mall för att rätta eller komplettera uppgifter i deklarationen hos Skatteverket.",
    text: `Till Skatteverket

Ärende: Begäran om rättelse av deklaration för inkomstår [år]
Personnummer: [XXXXXXXXXX-XXXX]

Jag heter [Namn] och vill rätta följande uppgift i min inkomstdeklaration för [år]:

Felaktig uppgift:
[Beskriv vad som är fel, t.ex.: Jag har av misstag angett fel belopp för avdraget för resor till arbetet. Det angivna beloppet var X kr, men det korrekta beloppet är Y kr.]

Korrekt uppgift:
[Ange den korrekta informationen]

Anledning till felet:
[Förklara varför felet uppstod]

Jag bifogar underlag som styrker den korrekta uppgiften:
- [Bilaga 1]

Med vänliga hälsningar,
[Namn]
[Adress]
[Telefon]
[Datum]`,
  },

  // --- MIGRATIONSVERKET ---
  {
    id: "mv-1",
    authority: "Migrationsverket",
    color: "purple",
    title: "Ansökan om förlängning av uppehållstillstånd",
    seo: "Mall för att ansöka om förlängning av uppehållstillstånd hos Migrationsverket.",
    text: `Till Migrationsverket

Ärende: Ansökan om förlängning av uppehållstillstånd
Personnummer/dossiernummer: [XXXXXXXXXX-XXXX]

Jag heter [Namn], född [datum], och ansöker härmed om förlängning av mitt uppehållstillstånd som löper ut [datum].

Jag är i Sverige på grund av [ange skäl, t.ex.: arbete / familjeanknytning / studier] och min situation är oförändrad sedan mitt senaste tillstånd beviljades.

Mina nuvarande omständigheter:
- Sysselsättning: [Anställd hos / Studerar vid / Annat]
- Adress i Sverige: [Adress]
- Familjesituation: [Beskriv]

Bifogade handlingar:
- Kopia av passet (sidan med personuppgifter och nuvarande tillstånd)
- [Anställningsintyg / Studieintyg / Annat relevant dokument]
- [Övriga bilagor]

Med vänliga hälsningar,
[Namn]
[Adress]
[Telefon]
[E-post]
[Datum]`,
  },
  {
    id: "mv-2",
    authority: "Migrationsverket",
    color: "purple",
    title: "Komplettering av ansökan",
    seo: "Mall för att komplettera en ansökan hos Migrationsverket med efterfrågade handlingar.",
    text: `Till Migrationsverket

Ärende: Komplettering av ansökan [dossiernummer]
Personnummer: [XXXXXXXXXX-XXXX]

Jag heter [Namn] och svarar härmed på er begäran om komplettering daterad [datum].

Ni begärde följande handlingar/uppgifter:
[Lista vad Migrationsverket efterfrågade]

Jag bifogar härmed de efterfrågade handlingarna:
- [Dokument 1, t.ex. pass, personbevis, intyg]
- [Dokument 2]
- [Dokument 3]

[Om något saknas, förklara varför:]
Angående [dokument X] vill jag informera er om att [förklaring, t.ex. dokumentet är beställt och kommer att skickas separat inom X dagar].

Kontakta mig gärna om ni behöver ytterligare information.

Med vänliga hälsningar,
[Namn]
[Adress]
[Telefon]
[E-post]
[Datum]`,
  },
  {
    id: "mv-3",
    authority: "Migrationsverket",
    color: "purple",
    title: "Överklagande av beslut om uppehållstillstånd",
    seo: "Mall för överklagande av Migrationsverkets beslut om nekat uppehållstillstånd.",
    text: `Till Migrationsöverdomstolen / Migrationsdomstolen
(Via Migrationsverket)

Ärende: Överklagande av beslut [dossiernummer]
Personnummer: [XXXXXXXXXX-XXXX]

Jag heter [Namn] och överklagar härmed Migrationsverkets beslut daterat [datum] om nekad [typ av tillstånd].

Yrkande:
Jag yrkar att domstolen upphäver Migrationsverkets beslut och beviljar mig [typ av tillstånd].

Grunder för överklagandet:
[Beskriv varför du anser att beslutet är felaktigt, t.ex.:]
- Jag uppfyller villkoren för uppehållstillstånd på grund av [skäl].
- Migrationsverket har inte beaktat [omständighet].
- Beslutet strider mot [relevant lag/praxis].

Bifogade handlingar:
- Kopia av Migrationsverkets beslut
- [Stöddokument 1]
- [Stöddokument 2]

Med vänliga hälsningar,
[Namn]
[Adress]
[Telefon]
[E-post]
[Datum]`,
  },
];

const cvTemplates = [
  {
    id: 101,
    title: "Utan erfarenhet – första jobbet",
    text: `CURRICULUM VITAE

Namn:    [Namn]
Telefon: [Telefon]
E-post:  [E-post]
Ort:     [Ort]

─────────────────────────────
PROFIL
─────────────────────────────
Jag är en engagerad och läraktig person som söker mitt första jobb. Jag är pålitlig, punktlig och motiverad att lära mig från grunden. Jag tar ansvar och bidrar gärna till teamet.

─────────────────────────────
ERFARENHET
─────────────────────────────
Ingen tidigare arbetslivserfarenhet, men jag har erfarenhet från [exempelvis skola, volontärarbete, praktik].

─────────────────────────────
UTBILDNING
─────────────────────────────
[Utbildning], [Skola/Program], [År]

─────────────────────────────
FÄRDIGHETER
─────────────────────────────
[Färdigheter]
Språk: Svenska (modersmål), Engelska (god nivå)`,
  },
  {
    id: 102,
    title: "Lagerarbetare – erfarenhet",
    text: `CURRICULUM VITAE

Namn:    [Namn]
Telefon: [Telefon]
E-post:  [E-post]
Ort:     [Ort]

─────────────────────────────
PROFIL
─────────────────────────────
Erfaren lagerarbetare med god fysisk kapacitet och vana vid strukturerat arbete. Noggrann, ordningsam och van vid truckkörning och plocklister.

─────────────────────────────
ERFARENHET
─────────────────────────────
[Tjänstetitel], [Företag] – [Period]
[Beskrivning av arbetsuppgifter]

[Tjänstetitel], [Företag] – [Period]
[Beskrivning av arbetsuppgifter]

─────────────────────────────
UTBILDNING
─────────────────────────────
[Utbildning], [Skola], [År]

─────────────────────────────
FÄRDIGHETER
─────────────────────────────
Truckkort: [Ja/Nej]
[Övriga färdigheter]`,
  },
  {
    id: 103,
    title: "Butiksbiträde – serviceinriktad",
    text: `CURRICULUM VITAE

Namn:    [Namn]
Telefon: [Telefon]
E-post:  [E-post]
Ort:     [Ort]

─────────────────────────────
PROFIL
─────────────────────────────
Serviceinriktad och social person med erfarenhet av kundmöten. Jag trivs i en miljö med högt tempo och sätter alltid kunden i fokus. Glad, lyhörd och lösningsorienterad.

─────────────────────────────
ERFARENHET
─────────────────────────────
[Tjänstetitel], [Företag] – [Period]
[Beskrivning]

─────────────────────────────
UTBILDNING
─────────────────────────────
[Utbildning], [År]

─────────────────────────────
FÄRDIGHETER
─────────────────────────────
Kassahantering, kundservice, [Övriga färdigheter]
Språk: [Språk]`,
  },
  {
    id: 104,
    title: "Restaurang – servitör / kock",
    text: `CURRICULUM VITAE

Namn:    [Namn]
Telefon: [Telefon]
E-post:  [E-post]
Ort:     [Ort]

─────────────────────────────
PROFIL
─────────────────────────────
Van restaurangmedarbetare med erfarenhet av både sal och kök. Jobbar snabbt, hygienmedvetet och under press. Trivs med teamarbete och kvällstider.

─────────────────────────────
ERFARENHET
─────────────────────────────
[Tjänstetitel], [Restaurang] – [Period]
[Beskrivning]

─────────────────────────────
UTBILDNING
─────────────────────────────
[Utbildning / Gymnasie hotell & restaurang], [År]

─────────────────────────────
FÄRDIGHETER
─────────────────────────────
HACCP, livsmedelshantering, kassahantering
[Övriga färdigheter]`,
  },
  {
    id: 105,
    title: "Städare – noggrant och strukturerat",
    text: `CURRICULUM VITAE

Namn:    [Namn]
Telefon: [Telefon]
E-post:  [E-post]
Ort:     [Ort]

─────────────────────────────
PROFIL
─────────────────────────────
Noggrann och pålitlig städare med erfarenhet av både privat och kommersiell städning. Självgående, diskret och van att följa städscheman och hygienrutiner.

─────────────────────────────
ERFARENHET
─────────────────────────────
[Tjänstetitel], [Företag] – [Period]
[Beskrivning av arbetsuppgifter]

─────────────────────────────
UTBILDNING
─────────────────────────────
[Utbildning], [År]

─────────────────────────────
FÄRDIGHETER
─────────────────────────────
Städteknik, kemikaliehantering, tidplanering
[Övriga färdigheter]`,
  },
  {
    id: 106,
    title: "Student – deltidsjobb",
    text: `CURRICULUM VITAE

Namn:    [Namn]
Telefon: [Telefon]
E-post:  [E-post]
Ort:     [Ort]

─────────────────────────────
PROFIL
─────────────────────────────
Studerar [Program] och söker deltidsjobb vid sidan av studierna. Jag är engagerad, flexibel och trivs med att kombinera arbete och utbildning. Tillgänglig [antal timmar] timmar per vecka.

─────────────────────────────
ERFARENHET
─────────────────────────────
[Eventuell erfarenhet eller "Ingen tidigare arbetslivserfarenhet"]

─────────────────────────────
UTBILDNING
─────────────────────────────
[Pågående utbildning], [Skola], [Beräknat examensår]

─────────────────────────────
FÄRDIGHETER
─────────────────────────────
[Färdigheter]
Tillgänglighet: [Dagar/tider]`,
  },
  {
    id: 107,
    title: "Kontor – administratör",
    text: `CURRICULUM VITAE

Namn:    [Namn]
Telefon: [Telefon]
E-post:  [E-post]
Ort:     [Ort]

─────────────────────────────
PROFIL
─────────────────────────────
Strukturerad och noggrann administratör med erfarenhet av kontorsarbete, dokumenthantering och schemaläggning. Trygg i Officepaketet och van vid digitala system.

─────────────────────────────
ERFARENHET
─────────────────────────────
[Tjänstetitel], [Företag] – [Period]
[Beskrivning]

[Tjänstetitel], [Företag] – [Period]
[Beskrivning]

─────────────────────────────
UTBILDNING
─────────────────────────────
[Utbildning], [Skola], [År]

─────────────────────────────
FÄRDIGHETER
─────────────────────────────
Microsoft Office, [System], e-posthantering
[Övriga färdigheter]`,
  },
  {
    id: 108,
    title: "Vård och omsorg – undersköterska",
    text: `CURRICULUM VITAE

Namn:    [Namn]
Telefon: [Telefon]
E-post:  [E-post]
Ort:     [Ort]

─────────────────────────────
PROFIL
─────────────────────────────
Empatisk och erfaren vårdpersonal med utbildning inom omsorg. Van att arbeta med äldre och personer med funktionsnedsättning. Trygg, tålmodig och professionell.

─────────────────────────────
ERFARENHET
─────────────────────────────
[Tjänstetitel], [Arbetsplats] – [Period]
[Beskrivning]

─────────────────────────────
UTBILDNING
─────────────────────────────
Undersköterskeutbildning / [Annan utbildning], [Skola], [År]

─────────────────────────────
FÄRDIGHETER
─────────────────────────────
Personlig omvårdnad, dokumentation, [Övriga färdigheter]
Språk: [Språk]`,
  },
  {
    id: 109,
    title: "Chaufför / Transportarbetare",
    text: `CURRICULUM VITAE

Namn:    [Namn]
Telefon: [Telefon]
E-post:  [E-post]
Ort:     [Ort]

─────────────────────────────
PROFIL
─────────────────────────────
Erfaren och pålitlig chaufför med rent körkortsregister. Van att köra i stadsmiljö och på landsväg. Tidsprecis, ansvarsfull och van att representera arbetsgivaren professionellt.

─────────────────────────────
ERFARENHET
─────────────────────────────
[Tjänstetitel], [Företag] – [Period]
[Beskrivning]

─────────────────────────────
UTBILDNING
─────────────────────────────
[Utbildning], [År]

─────────────────────────────
FÄRDIGHETER
─────────────────────────────
Körkort: B [+ C/CE om tillämpligt]
God lokalkännedom, punktlighet, [Övriga färdigheter]`,
  },
  {
    id: 110,
    title: "IT / Teknisk roll – junior",
    text: `CURRICULUM VITAE

Namn:    [Namn]
Telefon: [Telefon]
E-post:  [E-post]
Ort:     [Ort]

─────────────────────────────
PROFIL
─────────────────────────────
Teknikintresserad person med grundläggande kunskaper inom [IT-område]. Analytisk, självlärd och motiverad att växa i en teknisk roll. Trivs med problemlösning och nya utmaningar.

─────────────────────────────
ERFARENHET
─────────────────────────────
[Tjänstetitel / Projekt], [Företag / Eget] – [Period]
[Beskrivning]

─────────────────────────────
UTBILDNING
─────────────────────────────
[Utbildning], [Skola], [År]

─────────────────────────────
FÄRDIGHETER
─────────────────────────────
[Programmeringsspråk / Verktyg]
[Övriga tekniska färdigheter]`,
  },
  {
    id: 111,
    title: "Bygg och anläggning",
    text: `CURRICULUM VITAE

Namn:    [Namn]
Telefon: [Telefon]
E-post:  [E-post]
Ort:     [Ort]

─────────────────────────────
PROFIL
─────────────────────────────
Praktisk och ansvarsfull byggnadsarbetare med erfarenhet av [specialisering]. Jobbar effektivt, noggrann med säkerhetsföreskrifter och trivs i fältmiljö.

─────────────────────────────
ERFARENHET
─────────────────────────────
[Tjänstetitel], [Företag] – [Period]
[Beskrivning]

─────────────────────────────
UTBILDNING
─────────────────────────────
[Byggprogrammet / Yrkesutbildning], [Skola], [År]

─────────────────────────────
FÄRDIGHETER
─────────────────────────────
[Certifieringar / Maskinkort]
[Övriga färdigheter]`,
  },
  {
    id: 112,
    title: "Säkerhetsvakt",
    text: `CURRICULUM VITAE

Namn:    [Namn]
Telefon: [Telefon]
E-post:  [E-post]
Ort:     [Ort]

─────────────────────────────
PROFIL
─────────────────────────────
Uppmärksam och lugn säkerhetsvakt med [Erfarenhet] av bevakningsarbete. Van att hantera stressade situationer professionellt och diskrekt. Trivs med nattskift och varierande arbetsplatser.

─────────────────────────────
ERFARENHET
─────────────────────────────
[Tjänstetitel], [Företag] – [Period]
[Beskrivning]

─────────────────────────────
UTBILDNING
─────────────────────────────
Väktarutbildning / [Utbildning], [Skola], [År]

─────────────────────────────
FÄRDIGHETER
─────────────────────────────
Bevakning, larmhantering, [Övriga färdigheter]
Språk: [Språk]`,
  },
  {
    id: 113,
    title: "Förskola / Skola – barnskötare",
    text: `CURRICULUM VITAE

Namn:    [Namn]
Telefon: [Telefon]
E-post:  [E-post]
Ort:     [Ort]

─────────────────────────────
PROFIL
─────────────────────────────
Omtänksam och engagerad barnskötare med passion för barns utveckling. Tålmodig, kreativ och bra på att skapa trygghet och rutiner. Samarbetar väl med föräldrar och kollegor.

─────────────────────────────
ERFARENHET
─────────────────────────────
[Tjänstetitel], [Förskola/Skola] – [Period]
[Beskrivning]

─────────────────────────────
UTBILDNING
─────────────────────────────
[Barnpedagogisk utbildning], [Skola], [År]

─────────────────────────────
FÄRDIGHETER
─────────────────────────────
Barnaktiviteter, konflikthantering, dokumentation
[Övriga färdigheter]`,
  },
  {
    id: 114,
    title: "Marknadsföring / Digital",
    text: `CURRICULUM VITAE

Namn:    [Namn]
Telefon: [Telefon]
E-post:  [E-post]
Ort:     [Ort]

─────────────────────────────
PROFIL
─────────────────────────────
Kreativ och analytisk marknadsförare med fokus på digital kommunikation. Van att skapa innehåll, driva kampanjer och följa upp resultat. Strukturerad och resultatdriven.

─────────────────────────────
ERFARENHET
─────────────────────────────
[Tjänstetitel], [Företag] – [Period]
[Beskrivning]

─────────────────────────────
UTBILDNING
─────────────────────────────
[Utbildning], [Skola], [År]

─────────────────────────────
FÄRDIGHETER
─────────────────────────────
[Sociala medier / Verktyg / SEO / Analys]
[Övriga färdigheter]`,
  },
  {
    id: 115,
    title: "Allmänt CV – flexibel sökande",
    text: `CURRICULUM VITAE

Namn:    [Namn]
Telefon: [Telefon]
E-post:  [E-post]
Ort:     [Ort]

─────────────────────────────
PROFIL
─────────────────────────────
[Kort beskrivning av dig själv, dina egenskaper och vad du söker.]

─────────────────────────────
ERFARENHET
─────────────────────────────
[Tjänstetitel], [Företag] – [Period]
[Beskrivning av vad du gjorde]

[Tjänstetitel], [Företag] – [Period]
[Beskrivning av vad du gjorde]

─────────────────────────────
UTBILDNING
─────────────────────────────
[Utbildning], [Skola/Ort], [År]

─────────────────────────────
FÄRDIGHETER
─────────────────────────────
[Lista dina viktigaste kompetenser]
Språk: [Dina språk och nivå]`,
  },
];

const authorityColors: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  blue:   { bg: "bg-blue-50",   border: "border-blue-200",   badge: "bg-blue-100 text-blue-800",   text: "text-blue-700" },
  red:    { bg: "bg-red-50",    border: "border-red-200",    badge: "bg-red-100 text-red-800",    text: "text-red-700" },
  green:  { bg: "bg-green-50",  border: "border-green-200",  badge: "bg-green-100 text-green-800",  text: "text-green-700" },
  purple: { bg: "bg-purple-50", border: "border-purple-200", badge: "bg-purple-100 text-purple-800", text: "text-purple-700" },
};

function AuthorityTemplateCard({ template }: { template: typeof authorityTemplates[0] }) {
  const [copied, setCopied] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const c = authorityColors[template.color] ?? authorityColors.blue;

  const handleCopy = () => {
    const val = textRef.current?.value ?? template.text;
    navigator.clipboard.writeText(val).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`bg-white border ${c.border} rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden`}>
      <div className={`${c.bg} border-b ${c.border} px-5 py-3 flex items-center justify-between gap-2`}>
        <div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge} mr-2`}>{template.authority}</span>
          <span className="font-semibold text-slate-800 text-sm">{template.title}</span>
        </div>
        <button
          onClick={handleCopy}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            copied ? "bg-green-100 text-green-700" : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          {copied ? (
            <><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>Kopierat!</>
          ) : (
            <><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M9 4V3a1 1 0 00-1-1H3a1 1 0 00-1 1v5a1 1 0 001 1h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>Kopiera text</>
          )}
        </button>
      </div>
      <div className="p-4">
        <textarea
          ref={textRef}
          defaultValue={template.text}
          rows={12}
          spellCheck={false}
          className="w-full text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 rounded-lg p-3 resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-mono"
        />
        <p className="text-xs text-slate-400 mt-2">Klicka i texten och ersätt [Namn], [datum], [belopp] osv. med dina uppgifter.</p>
      </div>
    </div>
  );
}

function TemplateCard({ template }: { template: typeof templates[0] }) {
  const [copied, setCopied] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    const val = textRef.current?.value ?? template.text;
    navigator.clipboard.writeText(val).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 text-sm">{template.title}</h3>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            copied
              ? "bg-green-100 text-green-700"
              : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          {copied ? (
            <>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Kopierat!
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M9 4V3a1 1 0 00-1-1H3a1 1 0 00-1 1v5a1 1 0 001 1h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Kopiera text
            </>
          )}
        </button>
      </div>
      <div className="p-4">
        <textarea
          ref={textRef}
          defaultValue={template.text}
          rows={11}
          spellCheck={false}
          className="w-full text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 rounded-lg p-3 resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-mono"
        />
        <p className="text-xs text-slate-400 mt-2">
          Klicka i texten för att redigera. Ersätt [Namn], [Tjänst], [Företag] osv.
        </p>
      </div>
    </div>
  );
}

function CvCard({ template }: { template: typeof cvTemplates[0] }) {
  const [copied, setCopied] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    const val = textRef.current?.value ?? template.text;
    navigator.clipboard.writeText(val).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 text-sm">{template.title}</h3>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            copied
              ? "bg-green-100 text-green-700"
              : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          {copied ? (
            <>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Kopierat!
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M9 4V3a1 1 0 00-1-1H3a1 1 0 00-1 1v5a1 1 0 001 1h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Kopiera CV
            </>
          )}
        </button>
      </div>
      <div className="p-4">
        <textarea
          ref={textRef}
          defaultValue={template.text}
          rows={14}
          spellCheck={false}
          className="w-full text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 rounded-lg p-3 resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-mono"
        />
        <p className="text-xs text-slate-400 mt-2">
          Klicka i texten och ersätt [Namn], [Telefon], [E-post] osv. med dina uppgifter.
        </p>
      </div>
    </div>
  );
}

export default function Mallar() {
  return (
    <>
      <head>
        <title>Gratis mallar – Jobbansökningar & Myndighetsbrev | Svar Direkt</title>
        <meta name="description" content="Gratis brevmallar för Försäkringskassan, Kronofogden, Skatteverket och Migrationsverket. Klicka, redigera och kopiera direkt. Även jobbansökningar och CV-mallar." />
        <meta name="keywords" content="gratis mallar myndigheter, Försäkringskassan mall, Kronofogden brev mall, Skatteverket svar mall, Migrationsverket mall, bestrida skuld mall, överklagande Försäkringskassan, sjukpenning förlängning mall, jobbansökan mall, gratis brevmall, kopiera och skicka, myndighetsbrev gratis" />
      </head>

      {/* Hero */}
      <section className="bg-gradient-to-b from-sky-50 to-white border-b border-slate-100 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            Gratis verktyg
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
            Färdiga mallar för jobbansökningar
          </h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
            15 redigerbara mallar för olika branscher. Klicka i texten, fyll i dina uppgifter och kopiera direkt.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6.5" fill="#dcfce7"/><path d="M4 7.5l2.5 2.5 4.5-4.5" stroke="#16a34a" strokeWidth="1.3" strokeLinecap="round"/></svg>
              Fullt redigerbara
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6.5" fill="#dcfce7"/><path d="M4 7.5l2.5 2.5 4.5-4.5" stroke="#16a34a" strokeWidth="1.3" strokeLinecap="round"/></svg>
              Inget konto krävs
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6.5" fill="#dcfce7"/><path d="M4 7.5l2.5 2.5 4.5-4.5" stroke="#16a34a" strokeWidth="1.3" strokeLinecap="round"/></svg>
              Kopiera med ett klick
            </span>
          </div>
        </div>
      </section>

      {/* Tip bar */}
      <div className="bg-amber-50 border-b border-amber-100 py-2.5 px-4">
        <p className="text-center text-xs text-amber-700 font-medium">
          💡 Tips: Klicka direkt i textrutorna och ersätt <span className="font-bold">[Namn]</span>, <span className="font-bold">[Tjänst]</span>, <span className="font-bold">[Företag]</span>, <span className="font-bold">[Erfarenhet]</span>, <span className="font-bold">[Styrkor]</span> och <span className="font-bold">[Kontakt]</span> med din information.
        </p>
      </div>

      {/* Templates grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {templates.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== GRATIS MYNDIGHETSBREV ===== */}
      <div className="bg-slate-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-primary/20 text-primary text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            🏛️ Gratis myndighetsbrev
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Färdiga brevmallar till svenska myndigheter
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto mb-4">
            12 gratis mallar för Försäkringskassan, Kronofogden, Skatteverket och Migrationsverket.
            Klicka i texten, fyll i dina uppgifter och kopiera direkt — klart att skicka.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-2 text-sm text-slate-400">
            <span className="flex items-center gap-1.5"><svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6.5" fill="rgba(10,126,164,0.3)"/><path d="M4 7.5l2.5 2.5 4.5-4.5" stroke="#0a7ea4" strokeWidth="1.3" strokeLinecap="round"/></svg>Formell, korrekt svenska</span>
            <span className="flex items-center gap-1.5"><svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6.5" fill="rgba(10,126,164,0.3)"/><path d="M4 7.5l2.5 2.5 4.5-4.5" stroke="#0a7ea4" strokeWidth="1.3" strokeLinecap="round"/></svg>Kopiera med ett klick</span>
            <span className="flex items-center gap-1.5"><svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6.5" fill="rgba(10,126,164,0.3)"/><path d="M4 7.5l2.5 2.5 4.5-4.5" stroke="#0a7ea4" strokeWidth="1.3" strokeLinecap="round"/></svg>Gratis att använda</span>
          </div>
        </div>
      </div>

      {/* Tip bar for authority templates */}
      <div className="bg-blue-50 border-b border-blue-100 py-2.5 px-4">
        <p className="text-center text-xs text-blue-700 font-medium">
          💡 Tips: Klicka i texten och ersätt <strong>[Namn]</strong>, <strong>[datum]</strong>, <strong>[ärendenummer]</strong>, <strong>[belopp]</strong> osv. med dina egna uppgifter.
        </p>
      </div>

      {/* Försäkringskassan mallar */}
      <section className="py-10 px-4 bg-blue-50/40">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-1">📋 Försäkringskassan – gratis mallar</h2>
            <p className="text-sm text-slate-500">
              Mallar för sjukpenning, överklagande och komplettering till Försäkringskassan.
              Används när du behöver förlänga sjukskrivning, bestrida ett beslut eller svara på en begäran.
              <strong> Gratis att kopiera och skicka.</strong>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {authorityTemplates.filter(t => t.authority === "Försäkringskassan").map(t => (
              <AuthorityTemplateCard key={t.id} template={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Kronofogden mallar */}
      <section className="py-10 px-4 bg-red-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-1">📋 Kronofogden – gratis mallar</h2>
            <p className="text-sm text-slate-500">
              Mallar för att bestrida skuld, ansöka om avbetalningsplan och begära skuldsanering hos Kronofogden.
              Om du fått ett inkassokrav eller betalningsföreläggande — börja här.
              <strong> Gratis att kopiera och skicka.</strong>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {authorityTemplates.filter(t => t.authority === "Kronofogden").map(t => (
              <AuthorityTemplateCard key={t.id} template={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Skatteverket mallar */}
      <section className="py-10 px-4 bg-green-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-1">📋 Skatteverket – gratis mallar</h2>
            <p className="text-sm text-slate-500">
              Mallar för anstånd med skatteinbetalning, svar på skattekontroll och rättelse av deklaration.
              Formellt skrivna för att passa Skatteverkets kommunikationsstil.
              <strong> Gratis att kopiera och skicka.</strong>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {authorityTemplates.filter(t => t.authority === "Skatteverket").map(t => (
              <AuthorityTemplateCard key={t.id} template={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Migrationsverket mallar */}
      <section className="py-10 px-4 bg-purple-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-1">📋 Migrationsverket – gratis mallar</h2>
            <p className="text-sm text-slate-500">
              Mallar för förlängning av uppehållstillstånd, komplettering av ansökan och överklagande hos Migrationsverket.
              Anpassade för korrekt, formell kommunikation.
              <strong> Gratis att kopiera och skicka.</strong>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {authorityTemplates.filter(t => t.authority === "Migrationsverket").map(t => (
              <AuthorityTemplateCard key={t.id} template={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Authority templates CTA */}
      <section className="bg-white border-t border-slate-200 py-10 px-4">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-slate-600 text-sm mb-4">
            <strong className="text-slate-900">Vill du ha 52+ mallar samlade i en app?</strong><br/>
            Svar Direkt-appen innehåller mallar för alla dessa myndigheter och fler — alltid i fickan, fungerar offline.
          </p>
          <a
            href="https://payhip.com/b/WxtV3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-md"
          >
            Ladda ner gratis
          </a>
          <p className="text-xs text-slate-400 mt-2">Gratis · Inget konto · Fungerar offline</p>
        </div>
      </section>

      {/* CV subsection divider */}
      <div className="bg-slate-900 py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-primary/20 text-primary text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            CV-mallar
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Färdiga CV-mallar
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            15 redigerbara CV-mallar för olika situationer. Klicka i texten, fyll i dina uppgifter och kopiera direkt.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-5 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6.5" fill="rgba(10,126,164,0.3)"/><path d="M4 7.5l2.5 2.5 4.5-4.5" stroke="#0a7ea4" strokeWidth="1.3" strokeLinecap="round"/></svg>
              Textbaserade – enkelt att kopiera
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6.5" fill="rgba(10,126,164,0.3)"/><path d="M4 7.5l2.5 2.5 4.5-4.5" stroke="#0a7ea4" strokeWidth="1.3" strokeLinecap="round"/></svg>
              Anpassade för olika branscher
            </span>
          </div>
        </div>
      </div>

      {/* CV tip bar */}
      <div className="bg-blue-50 border-b border-blue-100 py-2.5 px-4">
        <p className="text-center text-xs text-blue-700 font-medium">
          💡 Tips: Ersätt <span className="font-bold">[Namn]</span>, <span className="font-bold">[Telefon]</span>, <span className="font-bold">[E-post]</span>, <span className="font-bold">[Ort]</span>, <span className="font-bold">[Erfarenhet]</span> och <span className="font-bold">[Utbildning]</span> med din information.
        </p>
      </div>

      {/* CV grid */}
      <section className="py-12 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cvTemplates.map((t) => (
              <CvCard key={t.id} template={t} />
            ))}
          </div>
        </div>
      </section>

      {/* CV CTA */}
      <section className="bg-white border-t border-slate-200 py-14 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-3xl mb-4">📄</div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
            Vill du slippa skapa CV själv?
          </h2>
          <p className="text-slate-500 text-sm mb-7">
            Svar Direkt-appen innehåller färdiga mallar för CV, ansökningar och myndighetsbrev — redo att använda direkt i mobilen.
          </p>
          <p className="text-slate-400 text-xs mt-4">Engångsbetalning · Inga prenumerationer</p>
        </div>
      </section>

      {/* Related pages */}
      <section className="py-10 px-4 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Relaterade sidor</h2>
          <p className="text-xs text-slate-400 mb-5">Fler resurser som kan hjälpa dig</p>
          <div className="flex flex-wrap gap-3">
            {[
              { href: "/om-appen", label: "Om Svar Direkt-appen" },
              { href: "/funktioner", label: "Appens funktioner" },
              { href: "/paket", label: "Paket och tillägg" },
              { href: "/pdf-guider", label: "PDF-guider" },
              { href: "/blogg", label: "Blogg och artiklar" },
              { href: "/kontakt", label: "Kontakt" },
              { href: "/", label: "Startsidan" },
            ].map(item => (
              <Link key={item.href} href={item.href} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm hover:border-primary/40 hover:text-primary transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary to-[#065f7e] py-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="text-3xl mb-4">📱</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Vill du ha fler färdiga svar<br />utan att ändra själv?
          </h2>
          <p className="text-sky-100 text-base mb-8">
            Svar Direkt-appen innehåller hundratals färdiga mallar för myndigheter, arbete och vardag — redo att skicka direkt.
          </p>
          <p className="text-sky-200 text-xs mt-4">Engångsbetalning · Inga prenumerationer · Fungerar offline</p>
        </div>
      </section>
    </>
  );
}
