const API = "https://antiquewhite-lapwing-486017.hostingersite.com/api/forum";
const randToken = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const seed = [
  {
    category: "kronofogden",
    title: "Skuld från 2018 - kan de driva in den fortfarande??",
    body: "Fick brev från ett inkassobolag om en gammal skuld från 2018 som jag glömt bort. Är inte det preskriberat? Måste jag betala?",
    replies: [
      "Konsumentfordringar preskriberas efter 3 år OM borgenären inte avbrutit preskriptionen. Skickade de påminnelser? Då kan den fortfarande gälla.",
      "Ignorera inte brevet! Svara skriftligt och åberopa preskription. Annars riskerar de få betalningsföreläggande mot dig.",
      "+1 på ovan. Jag gjorde misstaget att inte svara och fick utmätning på en skuld jag aldrig var skyldig.",
      "Hur vet man om preskriptionen avbrutits? Jag har också en gammal skuld från 2019 som plötsligt dykt upp.",
      "@ovan: ring inkassobolaget och be om kopia på alla påminnelser och datum. De MÅSTE kunna bevisa preskriptionsavbrott.",
    ],
  },
  {
    category: "kronofogden",
    title: "Hjälp! Kronofogden tog mina pengar från kontot",
    body: "Vaknade till -3000 på kontot. Hade ingen aning om utmätning. Är detta lagligt utan förvarning?",
    replies: [
      "Ja tyvärr lagligt. De måste skicka beslut men det räknas som delgivet om det skickats till din folkbokföringsadress, även om du inte läst det.",
      "Kolla din digitala brevlåda (Kivra/Min myndighetspost). Säkert ligger beslutet där.",
    ],
  },
  {
    category: "kronofogden",
    title: "Frivillig avbetalningsplan istället för utmätning?",
    body: "Går det att förhandla med Kronofogden om en avbetalningsplan istället för att de tar lön direkt?",
    replies: [],
  },
  {
    category: "skatteverket",
    title: "ROT-avdrag - vilka jobb räknas 2026?",
    body: "Ska renovera badrum, kostar 80 000. Hur mycket ROT kan jag få tillbaka? Och gäller det även el-arbete?",
    replies: [
      "ROT 2026 är 30% av arbetskostnaden, max 50 000/person/år. Material räknas INTE. El- och VVS-arbete ingår.",
      "Tänk på att firman måste vara F-skattregistrerad och du måste äga bostaden. Bostadsrätt räknas också.",
      "Jag fick avslag förra året för att firman bara fakturerat klumpsumma utan att specificera arbete vs material. Be om DETALJERAD faktura!",
    ],
  },
  {
    category: "skatteverket",
    title: "Måste jag deklarera Swish-betalningar från vänner?",
    body: "Min vän swishade mig 8000 för en resa vi delade. Skatteverket frågar nu om det. Behöver jag bevisa något?",
    replies: [
      "Nej, gåvor/återbetalningar mellan privatpersoner är inte skattepliktiga. Men spara kvitton från resan så kan du visa att det var kostnadsdelning.",
      "Det här är jätteviktigt nu - SKV granskar Swish hårt 2026. Jag fick också fråga och löste det med screenshots från bokningar.",
      "Lite OT men jag fick aldrig någon fråga trots stora belopp. Random kontroller verkar det som.",
    ],
  },
  {
    category: "skatteverket",
    title: "Kan man få anstånd med skattskulden?",
    body: "Har en restskatt på 24000 som ska betalas i november. Pengar finns inte. Vad gör jag?",
    replies: [],
  },
  {
    category: "forsakringskassan",
    title: "VAB - hur många dagar per år?",
    body: "Hur många VAB-dagar har man rätt till per barn och år? Kan båda föräldrar VABba samma dag för olika barn?",
    replies: [
      "120 dagar/barn/år upp till 12 års ålder. Och ja, ni kan VABa samma dag för olika barn - räknas separat.",
      "Tips: anmäl ALLTID till FK samma dag, inte i efterhand. Annars riskerar man avslag.",
    ],
  },
  {
    category: "forsakringskassan",
    title: "Aktivitetsersättning - vad är skillnaden mot sjukersättning?",
    body: "Min son är 22 och har autism. Läkaren nämnde aktivitetsersättning. Vad är det och hur ansöker man?",
    replies: [
      "Aktivitetsersättning är för 19-29 år med nedsatt arbetsförmåga. Ges i 1-3 års perioder. Kan också ges för förlängd skolgång.",
      "Vid 30 år omvandlas det till sjukersättning automatiskt om arbetsförmågan fortfarande är nedsatt.",
      "Ansök via FK:s hemsida. Behöver läkarintyg + utlåtande från arbetsterapeut/psykolog. Handläggning tar 4-8 månader. Sök i god tid!",
      "Vi gjorde detta för min dotter. Tips: kontakta en habiliteringskonsulent, de hjälper kostnadsfritt med ansökan och vet exakt vad FK vill se.",
      "Stort tack för alla svar, hjälper enormt 🙏",
    ],
  },
  {
    category: "forsakringskassan",
    title: "Bostadsbidrag som student - vilka gränser?",
    body: "Hyra 6500, CSN-lån + jobbar 30%. Har jag rätt till bostadsbidrag?",
    replies: [
      "Som ensamstående utan barn under 29 år: ja, om inkomsten är under ca 86 000/år (2026). CSN-lån räknas INTE som inkomst.",
      "Studiebidraget (CSN-bidragsdelen) räknas dock som inkomst. Räkna noga.",
    ],
  },
  {
    category: "migrationsverket",
    title: "Hur länge tar arbetstillstånd nu 2026?",
    body: "Min arbetsgivare vill anställa mig från Indien. Hur lång väntetid är det realistiskt?",
    replies: [
      "Certifierad arbetsgivare: 10-30 dagar. Vanlig: 4-8 månader för IT-jobb, längre för andra branscher.",
      "Min ansökan tog 11 månader förra året. Är arbetsgivaren INTE certifierad så glöm snabbhandläggning.",
      "Be arbetsgivaren ansöka om certifiering om de anställer ofta från utlandet - det löser problemet långsiktigt.",
    ],
  },
  {
    category: "migrationsverket",
    title: "Medborgarskap - hur räknas hemvisttid?",
    body: "Bott i Sverige 6 år men varit utomlands 4 månader varje år för att jobba. Räknas det?",
    replies: [
      "Korta utlandsvistelser (under 6 veckor) räknas inte alls. Längre kan dras av från hemvisttiden. 4 månader/år kan bli problem.",
      "Hade samma problem. Migrationsverket räknade bort 8 månader totalt och jag fick vänta extra.",
      "Bästa är att ringa MV och fråga direkt med dina exakta datum. Olika handläggare bedömer olika tyvärr.",
      "Olika handläggare = sant. Min syster fick godkänt med liknande resor, jag fick avslag. Fullständig lotteri.",
    ],
  },
  {
    category: "migrationsverket",
    title: "Studentvisum - får man jobba vid sidan av?",
    body: "Hej, kommer från Ukraina, ska börja masterprogram i Stockholm i augusti. Får jag jobba extra?",
    replies: [
      "Ja, inga timbegränsningar för studenter med uppehållstillstånd för studier. Du får jobba så mycket du vill.",
      "Lycka till med studierna! Stockholm är dyrt så ja, du kommer behöva jobba extra. Studentlönerna i kassan/restaurang ligger runt 140-160 kr/h.",
    ],
  },
  {
    category: "arbetsformedlingen",
    title: "Praktik på företag jag vill jobba på - bra idé?",
    body: "Har möjlighet till praktik via AF på ett företag jag drömt om. Brukar det leda till fast jobb?",
    replies: [
      "Statistiken säger ca 30% får jobb efter praktik. Men det beror helt på dig - visa engagemang, ta initiativ.",
      "Gjorde själv detta 2023 - fick fast anställning efter 3 månaders praktik. Behandla det som riktigt jobb från dag 1.",
      "Akta dig för företag som bara vill ha gratis arbetskraft via AF. Fråga rakt ut om det finns budget för anställning EFTER praktiken.",
    ],
  },
  {
    category: "arbetsformedlingen",
    title: "Måste man söka exakt 5 jobb per månad?",
    body: "AF kräver att jag rapporterar 5 sökta jobb varje månad. Vad händer om jag bara söker 3?",
    replies: [
      "Risk för varning, sedan avstängning från a-kassa 5 dagar, sedan 10, sedan 45 dagar. Tappar aktivitetsstöd också.",
      "Det är inte exakt 5 - det är 'lämpligt antal' enligt din handlingsplan. Om du har specifik nisch kan färre vara OK om du motiverar.",
      "Min handläggare sa att kvalitet > kvantitet. Bättre 3 riktade ansökningar än 5 random.",
      "Lite annorlunda erfarenhet: min handläggare räknade EXAKT och varnade direkt vid 4. Beror nog på handläggaren.",
      "Tips: spara länkar/screenshots från alla sökta jobb. AF kan begära bevis när som helst.",
    ],
  },
  {
    category: "arbetsformedlingen",
    title: "Etableringsersättning - när slutar den?",
    body: "Hur länge får man etableringsersättning som nyanländ? Min slutar snart, vad händer sen?",
    replies: [],
  },
];

async function post(path, body) {
  const r = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${path} -> ${r.status}: ${await r.text()}`);
  return r.json();
}

let t = 0, rp = 0;
for (const item of seed) {
  const thread = await post("/threads", {
    category: item.category,
    title: item.title,
    body: item.body,
    author_token: randToken(),
  });
  t++;
  console.log(`[${item.category}] #${thread.id} (${item.replies.length} replies)`);
  for (const replyBody of item.replies) {
    await post(`/threads/${thread.id}/replies`, { body: replyBody, author_token: randToken() });
    rp++;
    await new Promise((r) => setTimeout(r, 120));
  }
}
console.log(`\nDone: ${t} threads, ${rp} replies.`);
