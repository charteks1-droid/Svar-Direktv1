import { Link, useParams } from "wouter";

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  content: React.ReactNode;
}

const articles: Article[] = [
  {
    slug: "varfor-ar-det-svart-att-skriva-till-myndigheter",
    title: "Varför är det så svårt att skriva till myndigheter?",
    excerpt:
      "Många känner en klump i magen när ett brev från Skatteverket eller Försäkringskassan dyker upp. Men varför är egentligen myndighetskommunikation så stressande?",
    category: "Kommunikation",
    readTime: "5 min",
    date: "12 april 2026",
    content: (
      <>
        <p>
          Du öppnar brevlådan och ser ett kuvert med Skatteverkets logotyp. Direkt
          sänker sig en tyngd över dig — även om du inte gjort något fel. Det är en
          känsla som de flesta svenskar känner igen, och du är långt ifrån ensam.
        </p>
        <h2>Det handlar om makt och konsekvenser</h2>
        <p>
          Myndigheter har verklig makt över ditt liv — de kan neka bidrag, kräva
          återbetalning, utfärda böter eller i värsta fall driva in skulder via
          Kronofogden. Den maktobalansen är inbyggd i kommunikationen och skapar
          automatiskt en känsla av att du måste "prestera rätt" i ditt svar.
        </p>
        <h2>Byråkratiskt språk skapar osäkerhet</h2>
        <p>
          Myndighetsbrev är skrivna i ett formellt, juridiskt-byråkratiskt språk
          som är svårt att tolka. Meningar som <em>"med stöd av 27 kap. 2 § SFB"</em>{" "}
          eller <em>"du är skyldig att inkomma med underlag"</em> är vardagssvenska
          för en handläggare — men fullständigt främmande för de flesta vanliga
          människor.
        </p>
        <p>
          Osäkerheten om vad som faktiskt menas gör att vi skjuter upp att svara.
          Och ju längre vi skjuter upp, desto mer ångest byggs upp.
        </p>
        <h2>Rädsla för att säga fel sak</h2>
        <p>
          En stor anledning till att folk undviker att svara är rädslan för att
          formulera sig fel och av misstag erkänna något, be om för lite eller
          provocera myndigheten. Den rädslan är ofta större än den faktiska risken —
          men den är ändå verklig och hämmande.
        </p>
        <h2>Digitalisering har inte gjort det enklare</h2>
        <p>
          Visserligen kan vi nu kommunicera med myndigheter via e-post och
          digitala portaler, men det innebär inte att kommunikationen blivit
          enklare. Tvärtom — många digitala formulär är komplexa och felmeddelanden
          är kryptiska. Och förväntningarna på snabba svar har ökat.
        </p>
        <h2>Vad kan du göra?</h2>
        <p>
          Det viktigaste är att du inte skjuter upp. Svar på myndighetsbrev har
          ofta tidsfrister, och utebliven respons kan tolkas negativt. Använd gärna
          en mall som startpunkt — det sänker tröskeln dramatiskt och hjälper dig
          att formulera dig korrekt utan att behöva uppfinna hjulet från noll varje
          gång.
        </p>
        <p>
          Det är precis det Svar Direkt är till för.
        </p>
      </>
    ),
  },
  {
    slug: "ratt-ton-i-myndighetsbrev",
    title: "Rätt ton i myndighetsbrev – 5 vanliga misstag",
    excerpt:
      "Att skriva för aggressivt, för underdånigt eller för informellt — det är misstag som kan kosta dig tid och pengar. Här är de fem vanligaste felen och hur du undviker dem.",
    category: "Tips",
    readTime: "4 min",
    date: "8 april 2026",
    content: (
      <>
        <p>
          Tonen i ett myndighetsbrev spelar stor roll. För aggressiv och du
          riskerar att sätta dig i dålig dager. För underdånig och du kan verka
          osäker på din rätt. Här är de fem vanligaste misstagen — och hur du
          undviker dem.
        </p>
        <h2>1. Att be om ursäkt för att du överhuvudtaget skriver</h2>
        <p>
          Inledningar som <em>"Förlåt att jag stör, men..."</em> eller{" "}
          <em>"Jag vet att ni är sibba, men..."</em> sänker direkt din trovärdighet.
          Du har rätt att kommunicera med myndigheter — det är en grundläggande del
          av medborgarskapet. Gå rakt på sak.
        </p>
        <h2>2. Att använda ett alltför informellt språk</h2>
        <p>
          Förkortningar, talspråk och emoji hör inte hemma i ett myndighetsbrev.
          Det signalerar att du inte tar ärendet på allvar. Håll dig till ett
          sakligt, artigt och formellt språk.
        </p>
        <h2>3. Att skriva alldeles för långt</h2>
        <p>
          Handläggare hanterar hundratals ärenden. En roman om din bakgrund och
          känslor hjälper inte — det försvårar. Håll brevet kort, tydligt och
          strukturerat. En mening per poäng.
        </p>
        <h2>4. Att utelämna viktig information</h2>
        <p>
          Alltid ange ditt personnummer, ärendets referensnummer (om det finns) och
          vad du konkret begär eller svarar på. Utan dessa uppgifter kan handläggaren
          inte koppla brevet till rätt ärende.
        </p>
        <h2>5. Att bli arg eller hotfull</h2>
        <p>
          Även om du är frustrerad — och det är du kanske helt berättigat att vara —
          ska ett myndighetsbrev aldrig innehålla hot, anklagelser eller kränkningar.
          Det ger bara myndigheten anledning att avvisa ditt ärende. Spara frustrationen
          till samtalet med en vän, och håll brevet sakligt.
        </p>
        <p>
          Med en färdig mall som grund slipper du tänka på allt detta från scratch.
          Mallen håller automatiskt rätt ton, rätt struktur och rätt längd.
        </p>
      </>
    ),
  },
  {
    slug: "svara-pa-krav-fran-kronofogden",
    title: "Att svara på krav från Kronofogden – steg för steg",
    excerpt:
      "Ett brev från Kronofogden kan kännas skrämmande. Men du har rättigheter och möjligheter att bestrida, förhandla eller ordna avbetalning. Här är vad du ska göra.",
    category: "Kronofogden",
    readTime: "6 min",
    date: "3 april 2026",
    content: (
      <>
        <p>
          Kronofogden är den myndighet som de flesta fruktar mest i sina brevlådor.
          Men det är viktigt att veta: ett brev från dem är inte slutet på världen.
          Du har rättigheter, och det finns alltid något du kan göra.
        </p>
        <h2>Steg 1: Läs brevet noggrant</h2>
        <p>
          Innan du gör något annat — läs brevet. Vad exakt begär Kronofogden? Är
          det ett inkassokrav, ett betalningsföreläggande eller ett verkställighetsärende?
          Det avgör vilka alternativ du har.
        </p>
        <h2>Steg 2: Kontrollera om skulden är korrekt</h2>
        <p>
          Stämmer beloppet? Är skulden preskriberad? Har du redan betalat? Det
          händer att Kronofogden hanterar krav baserade på felaktig information från
          borgenären. Du har rätt att bestrida kravet om det är fel.
        </p>
        <h2>Steg 3: Bestrida i tid</h2>
        <p>
          Om du fått ett betalningsföreläggande och vill bestrida det, måste du
          göra det inom den angivna tidsfristen — vanligtvis 10 dagar. Missar du
          den går ärendet vidare automatiskt. Bestridandet behöver inte vara
          komplicerat, men det måste skickas in.
        </p>
        <h2>Steg 4: Ansök om avbetalningsplan</h2>
        <p>
          Kan du inte betala hela beloppet direkt? Kronofogden och många
          borgenärer är mer flexibla än folk tror. Du kan ansöka om en
          avbetalningsplan — se till att vara realistisk om vad du kan betala
          per månad.
        </p>
        <h2>Steg 5: Håll kommunikationen öppen</h2>
        <p>
          Tystnad är det sämsta du kan göra. Kronofogden är en myndighet som följer
          lagar och regler — kommunicerar du sakligt och visar att du har intentionen
          att lösa situationen, går processen ofta smidigare.
        </p>
        <p>
          I appen Svar Direkt finns färdiga mallar för just Kronofogden-situationer —
          från bestridanden till ansökningar om avbetalning.
        </p>
      </>
    ),
  },
  {
    slug: "forsakringskassan-skriver-till-dig",
    title: "Försäkringskassan skriver till dig – vad gör du nu?",
    excerpt:
      "Omprövning, återkrav, kompletteringsbegäran — Försäkringskassan skickar många olika typer av brev. Lär dig skillnaden och vad varje brev kräver av dig.",
    category: "Försäkringskassan",
    readTime: "5 min",
    date: "28 mars 2026",
    content: (
      <>
        <p>
          Försäkringskassan hanterar sjukpenning, föräldrapenning, bostadsbidrag
          och många andra förmåner. Det innebär att de kommunicerar med en stor del
          av Sveriges befolkning — och inte alltid med glada nyheter.
        </p>
        <h2>De vanligaste brevtyperna</h2>
        <p>
          <strong>Begäran om komplettering</strong> — de saknar ett intyg, ett
          underlag eller information. Svara så snabbt som möjligt och bifoga det
          de ber om. Dröjer det för länge kan din ansökan avslås.
        </p>
        <p>
          <strong>Beslut om avslag</strong> — du har fått ett nej. Du har rätt att
          begära omprövning inom 2 månader från beslutet. Motivera varför du anser
          att beslutet är felaktigt och bifoga ny dokumentation om möjligt.
        </p>
        <p>
          <strong>Återkrav</strong> — Försäkringskassan anser att de betalat ut för
          mycket och vill ha pengar tillbaka. Det kan bero på en inkomstförändring
          du inte anmälde, en felräkning eller ett administrativt misstag. Kontrollera
          alltid om kravet är korrekt.
        </p>
        <p>
          <strong>Utredning</strong> — de undersöker om du fortfarande uppfyller
          villkoren för en förmån. Samarbeta och svara ärligt och fullständigt.
        </p>
        <h2>Vad du alltid ska göra</h2>
        <ul>
          <li>Notera datum och referensnummer på brevet</li>
          <li>Svara inom angiven tidsfrist</li>
          <li>Spara kopior på allt du skickar in</li>
          <li>Begär alltid bekräftelse om du skickar in något viktigt</li>
        </ul>
        <p>
          Att navigera Försäkringskassan kan vara utmattande. Svar Direkt har
          mallar specifikt anpassade för de vanligaste situationerna — från
          kompletteringssvar till omprövningsbegäranden.
        </p>
      </>
    ),
  },
  {
    slug: "konsten-att-svara-professionellt",
    title: "Konsten att svara professionellt – på jobbet och i privatlivet",
    excerpt:
      "Att svara för sent, för aggressivt eller för undvikande kan skada relationer och karriär. Här är principerna bakom ett professionellt svar — oavsett situation.",
    category: "Kommunikation",
    readTime: "4 min",
    date: "20 mars 2026",
    content: (
      <>
        <p>
          Vi kommunicerar mer än någonsin — mejl, SMS, chatt, kommentarsfält. Ändå
          har de flesta aldrig fått lära sig hur man faktiskt svarar professionellt.
          Det är en färdighet som kan förbättra både arbetsrelationer och personliga
          relationer dramatiskt.
        </p>
        <h2>Snabbhet signalerar respekt</h2>
        <p>
          Att svara snabbt — inte nödvändigtvis omedelbart, men inom rimlig tid —
          visar att du tar personen och ärendet på allvar. I arbetssammanhang
          räknas ofta 24 timmar som standard. Dröjer det längre bör du skicka ett
          kort erkännande: <em>"Jag har fått ditt mejl och återkommer inom två dagar."</em>
        </p>
        <h2>Klart, konkret och strukturerat</h2>
        <p>
          Ett bra professionellt svar svarar på det som faktiskt frågades — inte
          mer, inte mindre. Identifiera frågan, besvara den direkt, och avsluta
          med ett tydligt nästa steg om det behövs. Undvik onödiga utsvävningar.
        </p>
        <h2>Håll känslotemperaturen nere</h2>
        <p>
          Om du fått ett jobbigt meddelande — vänta innan du svarar. Det gamla
          rådet att "sova på det" gäller fortfarande. Ett svar skrivet i affekt
          kan ta lång tid att reparera. Skriv svaret, spara det som utkast, och
          läs igen nästa dag.
        </p>
        <h2>Anpassa tonen till mottagaren</h2>
        <p>
          Samma ämne kan kräva helt olika ton beroende på vem du skriver till.
          Till en chef är tonen mer formell än till en kollega du känner väl. Till
          en myndighet är tonen alltid saklig och respektfull, oavsett hur du
          känner inombords.
        </p>
        <h2>Mallar är inte fusk — de är verktyg</h2>
        <p>
          Att använda en mall som startpunkt är inte oäkta. Tvärtom — det är precis
          vad erfarna kommunikatörer gör. Mallar hjälper dig att säkerställa att du
          inte missar viktig information, håller rätt ton och svarar i tid. Det är
          sedan ditt jobb att anpassa och personalisera.
        </p>
      </>
    ),
  },
  {
    slug: "stress-och-radsla-infor-myndighetskontakt",
    title: "Stress och rädsla inför myndighetskontakt – du är inte ensam",
    excerpt:
      "En av tre svenskar uppger att de känner stark ångest vid kontakt med myndigheter. Vi undersöker varför — och vad du kan göra för att hantera känslan.",
    category: "Psykologi",
    readTime: "5 min",
    date: "14 mars 2026",
    content: (
      <>
        <p>
          Det är ingen skam att känna sig stressad inför ett brev från en myndighet.
          Det är tvärtom en helt normal mänsklig reaktion på en situation med
          osäkerhet, maktskillnad och potentiella konsekvenser.
        </p>
        <h2>Varför reagerar vi så starkt?</h2>
        <p>
          Hjärnan tolkar potentiellt hot — ekonomiska, rättsliga, sociala — som
          verkliga faror. Den skillnaden är liten för nervsystemet. Brevet från
          Kronofogden aktiverar samma stresspåslag som en fysisk fara, och det
          leder till att vi flyr, fryser eller kämpar — tre strategier som alla är
          dåliga för att hantera ett myndighetskrav.
        </p>
        <h2>Undvikande förvärrar situationen</h2>
        <p>
          Det vanligaste beteendet är undvikande — man lägger brevet på hög, öppnar
          inte mejlet, svarar inte i tid. Det ger en kortvarig lättnad, men gör
          situationen värre. Tidsfrister löper ut, ärendet eskalerar och ångesten ökar.
        </p>
        <h2>Det hjälper att veta vad du ska skriva</h2>
        <p>
          En stor del av ångesten handlar om att inte veta hur man formulerar sig.
          Om du har en mall — ett färdigt svar att utgå från — sänks tröskeln
          dramatiskt. Det är inte längre ett överväldigande blankt papper, utan
          ett konkret dokument du kan anpassa och skicka.
        </p>
        <h2>Praktiska strategier</h2>
        <ul>
          <li>Sätt en konkret tid i kalendern: "I dag kl. 18 skriver jag svaret"</li>
          <li>Be en vän att sitta med dig när du skriver — sällskap hjälper</li>
          <li>Börja med att bara öppna och läsa brevet — inget mer</li>
          <li>Använd en mall så att du slipper hitta på allt från noll</li>
          <li>Kom ihåg: myndigheter är inte dina fiender, de följer regler</li>
        </ul>
        <p>
          Svar Direkt finns till för att göra det steget — att faktiskt skriva —
          lite lättare. Oavsett om det är ett myndighetskrav eller ett jobbigt
          mejl från chefen.
        </p>
      </>
    ),
  },
];

const categoryColors: Record<string, string> = {
  Kommunikation: "bg-blue-50 text-blue-700",
  Tips: "bg-green-50 text-green-700",
  Kronofogden: "bg-red-50 text-red-700",
  Försäkringskassan: "bg-orange-50 text-orange-700",
  Psykologi: "bg-purple-50 text-purple-700",
};

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/blogg/${article.slug}`}>
      <article className="group bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${categoryColors[article.category] ?? "bg-slate-100 text-slate-600"}`}>
            {article.category}
          </span>
          <span className="text-xs text-slate-400">{article.readTime} läsning</span>
        </div>
        <h2 className="font-semibold text-slate-900 text-lg leading-snug mb-3 group-hover:text-primary transition-colors">
          {article.title}
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed flex-1">{article.excerpt}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-400">{article.date}</span>
          <span className="text-sm font-medium text-primary group-hover:underline">
            Läs mer →
          </span>
        </div>
      </article>
    </Link>
  );
}

function ArticlePage({ slug }: { slug: string }) {
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500 text-lg">Artikeln hittades inte.</p>
        <Link href="/blogg" className="mt-4 inline-block text-primary hover:underline">
          ← Tillbaka till bloggen
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/blogg" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary mb-8 transition-colors">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Tillbaka till bloggen
      </Link>

      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${categoryColors[article.category] ?? "bg-slate-100 text-slate-600"}`}>
          {article.category}
        </span>
        <span className="text-xs text-slate-400">{article.readTime} läsning</span>
        <span className="text-xs text-slate-400">·</span>
        <span className="text-xs text-slate-400">{article.date}</span>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-8">
        {article.title}
      </h1>

      <div className="prose prose-slate prose-p:leading-relaxed prose-h2:font-semibold prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-p:mb-4 prose-ul:space-y-1 prose-li:text-slate-600 max-w-none text-slate-600 text-[15px]">
        {article.content}
      </div>

      <div className="mt-12 pt-8 border-t border-slate-100">
        <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6 text-center">
          <p className="font-semibold text-slate-900 mb-1">Redo att spara tid?</p>
          <p className="text-sm text-slate-500 mb-4">
            Hämta Svar Direkt och få tillgång till färdiga mallar för alla situationer.
          </p>
          <a
            href="https://payhip.com/b/WxtV3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Ladda ner appen – 49 kr
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Blog() {
  const params = useParams<{ slug?: string }>();

  if (params.slug) {
    return <ArticlePage slug={params.slug} />;
  }

  return (
    <div>
      <section className="bg-gradient-to-b from-slate-50 to-white py-16 px-4 sm:px-6 border-b border-slate-100">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            Blogg & Guider
          </span>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Allt om att kommunicera med myndigheter
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Praktiska råd, djupgående guider och psykologin bakom varför vi
            skjuter upp att svara. Skrivet för vanliga människor i Sverige.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <section className="bg-primary py-14 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Sluta skjuta upp. Börja svara direkt.
          </h2>
          <p className="text-white/75 mb-7 text-sm leading-relaxed">
            Med Svar Direkt får du färdiga mallar för Skatteverket,
            Försäkringskassan, Kronofogden och mer. 49 kr en gång — inga
            prenumerationer.
          </p>
          <a
            href="https://payhip.com/b/WxtV3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-white text-primary text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            Ladda ner appen
          </a>
        </div>
      </section>
    </div>
  );
}
