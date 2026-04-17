import { Link, useParams } from "wouter";
import { useEffect } from "react";

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
    title: "Invändning Kronofogden mall – hur du skriver och bestrider",
    excerpt:
      "Behöver du en invändning Kronofogden mall? Här får du steg-för-steg-guide för hur du skriver till Kronofogden, bestrider krav och ansöker om avbetalningsplan — med färdiga exempel.",
    category: "Kronofogden",
    readTime: "6 min",
    date: "3 april 2026",
    content: (
      <>
        <p>
          Kronofogden är den myndighet som de flesta fruktar mest i sina brevlådor.
          Men det är viktigt att veta: ett brev från dem är inte slutet på världen.
          Du har rättigheter, och det finns alltid något du kan göra. Nyckeln är att
          veta <strong>hur man skriver till Kronofogden</strong> — sakligt, i rätt tid och
          med rätt information.
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
    title: "Mall: brev till Försäkringskassan – vad du ska skriva och hur",
    excerpt:
      "Behöver du ett mall brev till Försäkringskassan? Omprövning, återkrav, kompletteringsbegäran — Försäkringskassan skickar många typer av brev. Lär dig skillnaden och se exakt vad du ska svara.",
    category: "Försäkringskassan",
    readTime: "5 min",
    date: "28 mars 2026",
    content: (
      <>
        <p>
          Försäkringskassan hanterar sjukpenning, föräldrapenning, bostadsbidrag
          och många andra förmåner. Det innebär att de kommunicerar med en stor del
          av Sveriges befolkning — och inte alltid med glada nyheter. Oavsett om du
          behöver ett <strong>mall brev till Försäkringskassan</strong> för en omprövning,
          komplettering eller ett återkrav — rätt formulering gör hela skillnaden.
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
  {
    slug: "overvinna-radslan-for-myndigheter",
    title: "Hur vi kan övervinna rädslan för att skriva till myndigheter",
    excerpt:
      "Rädslan för att skriva till Skatteverket, Försäkringskassan eller Migrationsverket är vanlig. Men den går att övervinna – med rätt verktyg och tankesätt.",
    category: "Psykologi",
    readTime: "5 min",
    date: "8 mars 2026",
    content: (
      <>
        <p>
          Att skriva till en myndighet känns för många som att kliva in på okänd mark. Det är lätt att tveka, skjuta upp och i värsta fall låta saker rulla iväg tills situationen förvärras. Men rädslan är inte oundviklig — och den går att hantera.
        </p>
        <h2>Förstå varför rädslan uppstår</h2>
        <p>
          Rädslan är rationell i grunden. Myndigheter representerar makt och kan påverka ditt liv på konkreta sätt — ekonomiskt, juridiskt, socialt. När du skriver till dem är det naturligt att känna att du måste "prestera rätt". Det är inte ett tecken på svaghet utan på att din hjärna förstår vad som står på spel.
        </p>
        <h2>Börja litet – bara öppna brevet</h2>
        <p>
          Det viktigaste steget är att bryta den initiala inaktiviteten. Ge dig själv ett enda mål: öppna brevet och läs det. Inget mer. Ofta märker du att situationen är mer hanterbar än du befarat, och det är lättare att ta nästa steg när du väl vet vad du har att göra.
        </p>
        <h2>Skriv med stöd av en mall</h2>
        <p>
          En stor del av ångesten handlar om det tomma pappret — att inte veta hur man börjar. Med en färdig mall som grund försvinner det hindret. Du behöver inte hitta på rätt ord från noll, utan anpassa något som redan är korrekt formulerat. Det sänker tröskeln enormt.
        </p>
        <h2>Kom ihåg: du har rätt att kommunicera</h2>
        <p>
          Du har inte bara rätt att skriva till myndigheter — i många fall är du skyldig att göra det inom en viss tid. Att svara, ens kort och enkelt, är alltid bättre än tystnad. Myndigheter är inte dina fiender; de följer regler och processer. Och ett välformulerat, sakligt brev bemöts alltid med respekt.
        </p>
        <p>
          Svar Direkt är byggt för att göra det här konkret och enkelt. Välj situation, anpassa mallen och skicka.
        </p>
      </>
    ),
  },
  {
    slug: "ekonomi-under-press-vad-gor-du",
    title: "Ekonomi under press – vad gör du när pengarna inte räcker?",
    excerpt:
      "Inflation, höjda räntor och ökade levnadskostnader pressar svenska hushåll. Vad har du rätt till – och hur kommunicerar du med banker och myndigheter när ekonomin är tight?",
    category: "Ekonomi",
    readTime: "6 min",
    date: "9 april 2026",
    content: (
      <>
        <p>
          De senaste åren har satt ekonomin på prov för många svenska hushåll. Inflationen slog hårt mot matpriser och drivmedel, räntorna höjdes snabbt och levnadskostnaderna ökade på bred front. Många som aldrig tidigare haft ekonomiska problem befinner sig nu i ett pressat läge. Det viktiga är att veta vad du har rätt till – och att kommunicera i tid.
        </p>
        <h2>Vad har du rätt till när ekonomin är tight?</h2>
        <p>
          Svenska välfärdssystemet erbjuder flera skyddsnät som aktiveras just i svåra situationer. <strong>Bostadsbidrag</strong> kan sökas om din inkomst är låg i förhållande till din boendekostnad. <strong>Ekonomiskt bistånd</strong> (socialbidrag) från kommunen är en sista utväg men en reell rättighet. <strong>Skuldsanering</strong> är möjlig för den som har skulder utan realistisk möjlighet att betala dem på normalt sätt.
        </p>
        <h2>Kontakta banken innan det är krisläge</h2>
        <p>
          Banker föredrar proaktiv kommunikation framför tystnad. Om du ser att du inte kommer att klara nästa månads amortering — kontakta banken nu, inte i sista stund. Du kan begära amorteringsfrihet, omstrukturera lånet eller förhandla om räntan. Skriv ett kortfattat, sakligt brev med din situation och ett konkret förslag.
        </p>
        <h2>Skatteverket och betalningssvårigheter</h2>
        <p>
          Kan du inte betala din kvarskatt eller moms i tid? Skatteverket erbjuder möjlighet att ansöka om anstånd med betalning — men du måste begära det skriftligen och i tid. Dröjer du utan att höra av dig kan ränta och avgifter snabbt göra situationen värre.
        </p>
        <h2>Kronofogden – ta kontakt innan de tar kontakt med dig</h2>
        <p>
          Om en skuld riskerar att hamna hos Kronofogden är det bättre att du kontaktar dem eller borgenären proaktivt. En ansökan om avbetalningsplan, gjord i god tid, visar god vilja och kan förhindra betalningsanmärkning. Tystnad uppfattas alltid som sämre än att kommunicera.
        </p>
        <h2>Det viktigaste rådet</h2>
        <p>
          Skjut inte upp. Kontakta rätt instans, förklara din situation sakligt och be om hjälp. Sverige har system som är byggda för att hjälpa – men bara om du aktivt söker dem. Svar Direkt har mallar för just dessa situationer: ansökan om bostadsbidrag, kontakt med Kronofogden och avbetalningsplan.
        </p>
      </>
    ),
  },
  {
    slug: "radsla-fran-alla-hall-en-otrygg-tid",
    title: "Rädsla från alla håll – att klara sig i en orolig tid",
    excerpt:
      "Ekonomisk oro, höjda priser, otrygghet i samhället, myndighetsbrev i brevlådan. Vi lever i en tid där stressen kommer från alla håll. Vad kan du faktiskt göra?",
    category: "Samhälle",
    readTime: "5 min",
    date: "6 april 2026",
    content: (
      <>
        <p>
          Det är svårt att inte känna av trycket. Priserna stiger, nyheterna är dystra, brevlådan innehåller krav och formulär, och det verkar som att något nytt alltid kräver din uppmärksamhet och din energi. Många beskriver en känsla av att vara omringad av problem — som om det inte finns något säkert ställe att andas ut.
        </p>
        <h2>Rädslan från ekonomin</h2>
        <p>
          Inflationen har inte bara påverkat plånboken — den har påverkat hur vi tänker om framtiden. Frågan "har vi råd?" har blivit en konstant bakgrundsbrus för miljontals hushåll. Osäkra anställningar, höga räntor och ökade levnadskostnader skapar en kronisk lågintensiv stress som tär på välbefinnandet.
        </p>
        <h2>Rädslan från myndighetssystemet</h2>
        <p>
          Sverige har ett av världens mest omfattande välfärdssystem — men det är också ett av de mest komplexa att navigera. Regler ändras, digitaliseringen ökar tempot och kraven på att hålla koll på sina rättigheter och skyldigheter har aldrig varit större. Många faller mellan stolarna inte för att de inte har rätt till stöd, utan för att de inte vet hur de ska kommunicera.
        </p>
        <h2>Rädslan från informationsbruset</h2>
        <p>
          Sociala medier, nyhetsflöden och gruppchattar levererar en konstant ström av oroande information. Studier visar att överexponering mot negativa nyheter förstärker känslan av hjälplöshet och kontrollförlust — även om de flesta av problemen inte direkt berör ens eget liv.
        </p>
        <h2>Vad du faktiskt kan kontrollera</h2>
        <p>
          Det viktigaste motvapnet mot generell oro är att fokusera på det du faktiskt kan påverka. Betala den räkning som kan vänta. Svara på det brevet du skjutit upp. Ring det samtal du undvikit. Varje liten konkret handling minskar den diffusa oron och ersätter den med en känsla av kontroll.
        </p>
        <p>
          Svar Direkt kan inte lösa samhällsproblemen. Men vi kan hjälpa dig att ta hand om den del av stressen som handlar om att kommunicera med myndigheter och i vardagen — så att du kan frigöra energi till det som verkligen betyder något.
        </p>
      </>
    ),
  },
  {
    slug: "vad-hander-om-du-inte-svarar-myndigheter",
    title: "Vad händer om man inte svarar Kronofogden – och andra myndigheter?",
    excerpt:
      "Vad händer om man inte svarar Kronofogden, Skatteverket eller Försäkringskassan? Att lägga brevet på hög är frestande — men konsekvenserna är allvarligare än du tror. Läs vad som faktiskt sker.",
    category: "Tips",
    readTime: "4 min",
    date: "2 april 2026",
    content: (
      <>
        <p>
          Det är ett av de vanligaste misstagen: ett brev från en myndighet anländer, du mår inte för att ta tag i det, och det hamnar i en hög. Dagar blir veckor. Veckor blir månader. Och plötsligt är situationen mycket värre än den behövde vara. Här är vad som faktiskt händer när du inte svarar.
        </p>
        <h2>Hos Skatteverket</h2>
        <p>
          Om Skatteverket begär komplettering till din deklaration och du inte svarar i tid kan de göra en <strong>skönstaxering</strong> — en uppskattning av din inkomst baserad på tillgängliga uppgifter. Den landar ofta högre än verkligheten. Du kan även få böter och i värsta fall bli föremål för en revision. Svarar du däremot snabbt och sakligt är processen i regel smidig.
        </p>
        <h2>Hos Kronofogden</h2>
        <p>
          Det här är det allvarligaste scenariot. Om du får ett <strong>betalningsföreläggande</strong> och inte bestrider det inom tidsfristen — vanligtvis 10 dagar — går ärendet automatiskt vidare. Kronofogden kan då utfärda ett utslag och påbörja utmätning av lön, bankkonto eller tillgångar. En betalningsanmärkning kan följa och påverka ditt liv i upp till tre år.
        </p>
        <h2>Hos Försäkringskassan</h2>
        <p>
          Svarar du inte på en begäran om komplettering kan din ansökan om sjukpenning, föräldrapenning eller bostadsbidrag avslås automatiskt. Om du redan får ersättning och inte svarar på en utredning kan utbetalningarna stoppas — eller om de fortsätter, kan du senare krävas på återbetalning.
        </p>
        <h2>Principen är densamma för alla myndigheter</h2>
        <p>
          Tystnad tolkas antingen som samtycke eller som eskalation. Inget av dem är bra för dig. Myndigheter är skyldiga att följa sina processer, och de gör det — med eller utan ditt svar. Skillnaden är att om du inte deltar kan du inte påverka utgången.
        </p>
        <h2>Vad du ska göra</h2>
        <p>
          Svara alltid — ens ett kort brev som bekräftar att du fått meddelandet och behöver mer tid är bättre än ingenting. De flesta myndigheter är mer flexibla med tidsfrister om du kommunicerar proaktivt. Svar Direkt har färdiga mallar för precis dessa situationer.
        </p>
      </>
    ),
  },
  {
    slug: "skatteverket-6-vanliga-situationer",
    title: "Skatteverket och du – 6 situationer + mall för att överklaga beslut",
    excerpt:
      "Behöver du en mall för att överklaga beslut från Skatteverket? Deklaration, folkbokföring, F-skatt, återbetalning – här är de sex vanligaste situationerna och exakt vad du ska skriva.",
    category: "Skatteverket",
    readTime: "5 min",
    date: "15 mars 2026",
    content: (
      <>
        <p>
          Skatteverket är den myndighet de flesta möter fler gånger i livet än de egentligen vill. Deklaration varje år, folkbokföring vid flytt, F-skatt om du driver eget. Här är de sex vanligaste situationerna — inklusive hur du <strong>överklagar beslut från Skatteverket</strong> med rätt mall.
        </p>
        <h2>1. Komplettera deklarationen</h2>
        <p>
          Glömde du en inkomst, en kapitalvinst eller ett avdrag? Skatteverket accepterar kompletteringar och rättelser — men gör det snarast. Ange tydligt vad som ska ändras, varför, och bifoga relevant underlag. Var saklig och kortfattad.
        </p>
        <h2>2. Ändra folkbokföringsuppgifter</h2>
        <p>
          Har du flyttat? Du är skyldig att anmäla ny adress till Skatteverket inom en vecka. Glömmer du det kan det påverka allt från rösträtt till myndighetsbrev som hamnar på fel adress. Anmälan görs enklast digitalt, men kan också göras skriftligen.
        </p>
        <h2>3. Ansöka om F-skatt</h2>
        <p>
          Driver du eget företag eller frilansarbete? F-skattsedel är ett krav för att fakturera utan att kunden ska göra skatteavdrag. Ansökan sker skriftligen med motivering om din verksamhet. Var konkret och professionell.
        </p>
        <h2>4. Begära anstånd med betalning</h2>
        <p>
          Kan du inte betala kvarskatten i tid? Ansök om anstånd skriftligen innan förfallodatumet. Ange anledning, hur länge du behöver anstånd och din plan för betalning. Beviljat anstånd förhindrar ränteuppbyggnad.
        </p>
        <h2>5. Överklaga beslut från Skatteverket – med rätt mall</h2>
        <p>
          Anser du att Skatteverket gjort en felaktig bedömning? Du har rätt att <strong>överklaga beslut från Skatteverket</strong> genom att begära omprövning — inom fem år från beskattningsåret. Använd en <strong>mall</strong> för att strukturera brevet: vad du bestrider, varför, och vilket underlag du stödjer dig på. Appen Svar Direkt innehåller en färdig mall för precis den här situationen.
        </p>
        <h2>6. Fråga om kapitalvinst och försäljning</h2>
        <p>
          Sålde du en bostad, aktier eller kryptovaluta? Kapitalvinster ska deklareras och reglerna är komplexa. Om du är osäker — kontakta Skatteverket skriftligen med din fråga innan du deklarerar. Det är alltid bättre att fråga i förväg än att rättfärdiga i efterhand.
        </p>
      </>
    ),
  },
  {
    slug: "hyresgastens-rattigheter-i-sverige",
    title: "Dina rättigheter som hyresgäst – vad lagen faktiskt säger",
    excerpt:
      "Hyresvärden höjer hyran, vägrar reparera eller hotar med vräkning? Du har fler rättigheter än du tror. Här är vad lagen säger – och hur du kommunicerar det skriftligen.",
    category: "Rättigheter",
    readTime: "5 min",
    date: "25 mars 2026",
    content: (
      <>
        <p>
          Hyresrätten är ett av de starkast skyddade kontrakten i svensk rätt. Som hyresgäst har du rättigheter som din hyresvärd är skyldig att respektera — oavsett vad som står i ett enskilt kontrakt. Problemet är att de flesta inte vet om dem.
        </p>
        <h2>Hyreshöjningar – vad är rimligt?</h2>
        <p>
          Hyresvärden kan inte höja hyran hur som helst. Höjningen ska vara skälig i förhållande till jämförbara lägenheter i samma område och förhandlas normalt via Hyresgästföreningen. Får du ett höjningsbesked du inte är nöjd med — bestrida det skriftligen och kontakta din Hyresgästförening. Accepterar du tyst anses du ha godkänt höjningen.
        </p>
        <h2>Underhåll och reparationer</h2>
        <p>
          Det är hyresvärdens ansvar att hålla lägenheten i godtagbart skick. Det innebär att de ska åtgärda fel på värme, vatten, el och konstruktion. Om hyresvärden vägrar agera trots skriftlig begäran kan du anmäla till <strong>Hyresnämnden</strong>, som kan förelägga hyresvärden att utföra arbetet — ibland med vite.
        </p>
        <h2>Att bestrida en vräkning</h2>
        <p>
          En hyresvärd kan inte kasta ut dig utan att följa en strikt juridisk process. Om du fått en uppsägning eller ett besked om vräkning har du rätt att bestrida det i domstol. Kontakta omedelbart Hyresgästföreningen eller en jurist — tidsfrister är korta och avgörande.
        </p>
        <h2>Störningar i fastigheten</h2>
        <p>
          Har du grannproblem? Anmäl skriftligen till hyresvärden och be om åtgärd. Dokumentera störningarna med datum och tid. Om hyresvärden inte agerar kan du vända dig till Hyresnämnden. Som hyresgäst är du också skyldig att inte störa andra — tänk på att det gäller ömsesidigt.
        </p>
        <h2>Hur du kommunicerar med din hyresvärd</h2>
        <p>
          All kommunikation med hyresvärden bör ske skriftligen — mejl är tillräckligt men spara alltid kopior. Undvik muntliga överenskommelser. Ange datum, vad ärendet gäller och vad du begär. Ett kort, sakligt brev är alltid mer effektivt än ett långt, frustrerat. Svar Direkt har mallar för hyresgäst-situationer som hjälper dig formulera dig korrekt.
        </p>
      </>
    ),
  },
  {
    slug: "overklaga-forsakringskassan-mall",
    title: "Överklaga Försäkringskassan – mall och steg-för-steg guide",
    excerpt:
      "Fick du avslag från Försäkringskassan? Här är din kompletta guide för att överklaga Försäkringskassan – med mall du kan kopiera direkt och steg-för-steg-instruktioner för omprövning och förvaltningsrätten.",
    category: "Försäkringskassan",
    readTime: "7 min",
    date: "16 april 2026",
    content: (
      <>
        <p>
          Att få ett avslag från Försäkringskassan kan kännas som ett slag i magen — särskilt om du verkligen behöver ersättningen. Men ett avslag är inte slutet. Du har rätt att <strong>överklaga Försäkringskassan</strong>, och med rätt mall och rätt ord är chansen stor att du får ett annat beslut. Den här guiden visar dig exakt hur du gör.
        </p>
        <h2>Steg 1: Begär omprövning – inte direkt överklagande</h2>
        <p>
          Första steget är alltid att begära <strong>omprövning</strong> – inte att gå direkt till förvaltningsrätten. Omprövningen hanteras internt av Försäkringskassan och måste göras inom 2 månader från att du fick beslutet. Det är snabbare, gratis och den vanligaste vägen till ett ändrat beslut.
        </p>
        <h2>Steg 2: Läs beslutet noggrant</h2>
        <p>
          Innan du skriver ditt överklagande – förstå exakt varför Försäkringskassan nekade dig. Saknade de underlag? Tolkade de ett läkarintyg fel? Missade de att du uppfyller kraven? Svaret finns i beslutet och är nyckeln till ditt överklagande.
        </p>
        <h2>Mall: Begäran om omprövning till Försäkringskassan</h2>
        <p>
          Använd den här mallen som utgångspunkt — anpassa fet text till din situation:
        </p>
        <p>
          <em>Till Försäkringskassan,</em><br />
          <em>Jag, [Ditt namn], personnummer [XXXXXX-XXXX], begär omprövning av beslut daterat [datum], avseende [sjukpenning / föräldrapenning / annat].</em><br />
          <em>Jag anser att beslutet är felaktigt av följande skäl: [Beskriv kortfattat varför – t.ex. "Mitt läkarintyg från [läkare] styrker att jag uppfyller arbetsförmågekraven för rätt till sjukpenning eftersom..."].</em><br />
          <em>Som stöd för min begäran bifogar jag: [Lista bilagor – läkarintyg, journalanteckningar, intyg från arbetsgivare etc.].</em><br />
          <em>Jag begär att Försäkringskassan omprövar beslutet och beviljar mig [sjukpenning / föräldrapenning / bostadsbidrag].</em><br />
          <em>Med vänliga hälsningar,<br />[Ditt namn]<br />[Datum]<br />[Telefon / e-post]</em>
        </p>
        <h2>Steg 3: Om omprövningen avslås – överklaga till förvaltningsrätten</h2>
        <p>
          Får du avslag även på omprövningen har du 2 månader på dig att överklaga till förvaltningsrätten. Det kostar ingenting och domstolen granskar ärendet självständigt. Här är det extra viktigt att ha starka medicinska intyg och tydliga argument.
        </p>
        <h2>Vanliga misstag att undvika</h2>
        <p>
          Missa inte tidsfristen på 2 månader. Skicka alltid med bilagor. Var specifik – "beslutet är orättvist" räcker inte, du måste förklara exakt varför det är fel. Svar Direkt-appen har färdiga mallar för alla dessa situationer.
        </p>
      </>
    ),
  },
  {
    slug: "hur-skriver-man-till-forsakringskassan",
    title: "Hur skriver man till Försäkringskassan – exempel och mallar",
    excerpt:
      "Hur skriver man till Försäkringskassan på rätt sätt? Här är kompletta exempel och mallar för komplettering, omprövning, återkrav och andra vanliga ärenden – kopiera och skicka direkt.",
    category: "Försäkringskassan",
    readTime: "6 min",
    date: "16 april 2026",
    content: (
      <>
        <p>
          Många undrar hur man skriver till Försäkringskassan utan att råka ut för avslag eller missförstånd. Svaret är enkelt: kort, sakligt och med rätt information. Den här guiden ger dig <strong>konkreta exempel och mallar</strong> för de vanligaste situationerna.
        </p>
        <h2>Grundregler för brev till Försäkringskassan</h2>
        <p>
          Alltid med: fullständigt namn, personnummer, ärendenummer (finns i brevet du fått), vad du vill och varför. Håll det kort — en A4-sida räcker i de flesta fall. Bifoga alltid de underlag du nämner i brevet.
        </p>
        <h2>Exempel 1: Komplettera en ansökan</h2>
        <p>
          <em>Till Försäkringskassan,<br />
          Angående ärende nr [ärendenummer] – komplettering av ansökan om [sjukpenning/föräldrapenning].<br />
          Jag, [namn], personnummer [XXXXXX-XXXX], skickar härmed kompletterande underlag som efterfrågades i brevet daterat [datum].<br />
          Bilagor: [Lista dina bilagor – t.ex. "Läkarintyg från Dr. [Namn], daterat [datum]"].<br />
          Kontakta mig gärna på [telefon/e-post] om ni behöver ytterligare information.<br />
          Med vänliga hälsningar, [Namn], [Datum]</em>
        </p>
        <h2>Exempel 2: Besvara en återkravsbegäran</h2>
        <p>
          <em>Till Försäkringskassan,<br />
          Angående återkrav, ärende nr [ärendenummer].<br />
          Jag har mottagit ert brev daterat [datum] angående återkrav om [belopp] kr.<br />
          [Välj ett alternativ:]<br />
          A) Jag bestrider återkravet eftersom [förklara varför – t.ex. "Jag anmälde ändrade inkomster den [datum], vilket framgår av bifogad bekräftelse"].<br />
          B) Jag accepterar återkravet men ansöker om avbetalningsplan med [X] kr/månad med hänsyn till min ekonomiska situation.<br />
          Med vänliga hälsningar, [Namn], [Personnummer], [Datum]</em>
        </p>
        <h2>Exempel 3: Begära förlängning av tid</h2>
        <p>
          <em>Till Försäkringskassan,<br />
          Jag, [namn], personnummer [XXXXXX-XXXX], begär anstånd med att svara på ert brev daterat [datum], ärende nr [ärendenummer].<br />
          Anledningen är att jag behöver inhämta ytterligare läkarintyg / väntar på svar från [instans].<br />
          Jag räknar med att kunna återkomma senast [datum].<br />
          Med vänliga hälsningar, [Namn], [Datum]</em>
        </p>
        <h2>Viktigt: skicka alltid skriftligt</h2>
        <p>
          Telefonsamtal räknas inte — skicka alltid skriftligt via Försäkringskassans Mina sidor, e-post eller rekommenderat brev om det gäller viktiga ärenden. Spar alltid en kopia. Svar Direkt-appen har dessa och fler mallar färdiga att kopiera direkt.
        </p>
      </>
    ),
  },
  {
    slug: "mall-brev-kronofogden",
    title: "Mall brev Kronofogden – kopiera och skicka direkt",
    excerpt:
      "Behöver du ett mall brev till Kronofogden? Här får du färdiga mallar för bestridande, avbetalningsplan och andra vanliga ärenden — skrivet i korrekt formell svenska redo att skicka.",
    category: "Kronofogden",
    readTime: "5 min",
    date: "16 april 2026",
    content: (
      <>
        <p>
          Ett <strong>mall brev till Kronofogden</strong> kan vara skillnaden mellan att situationen eskalerar eller löses smidigt. Kronofogden hanterar tusentals ärenden varje dag — ett välformulerat, sakligt brev ger dig bättre förutsättningar än ett halvdant. Här är de mallar du behöver.
        </p>
        <h2>Mall 1: Bestrida ett betalningsföreläggande</h2>
        <p>
          <em>Till Kronofogdemyndigheten,<br />
          Jag, [Ditt fullständiga namn], personnummer [XXXXXX-XXXX], bestrider härmed betalningsföreläggande med ärendenummer [nr], avseende krav från [Borgenär] på [belopp] kr.<br />
          Skäl för bestridandet: [Välj/anpassa: "Skulden existerar inte." / "Skulden är redan betald, se bifogat kvitto." / "Skulden är preskriberad." / "Beloppet är felaktigt — korrekt belopp är [X] kr."]<br />
          Jag begär att ärendet avskrivs alternativt hänvisas till tingsrätten för prövning.<br />
          Bilagor: [Lista bilagor]<br />
          Med vänliga hälsningar,<br />[Namn], [Personnummer], [Adress], [Telefon], [Datum]</em>
        </p>
        <h2>Mall 2: Ansöka om avbetalningsplan</h2>
        <p>
          <em>Till Kronofogdemyndigheten,<br />
          Angående ärende nr [ärendenummer].<br />
          Jag, [Namn], personnummer [XXXXXX-XXXX], ansöker om avbetalningsplan för skuld om [belopp] kr till [Borgenär].<br />
          Min ekonomiska situation: månadsinkomst [X] kr, fasta utgifter [Y] kr. Jag kan betala [Z] kr per månad.<br />
          Jag är villig att starta betalningar från [datum] och ber om bekräftelse på att avbetalningsplanen godkänns.<br />
          Med vänliga hälsningar,<br />[Namn], [Personnummer], [Kontaktuppgifter], [Datum]</em>
        </p>
        <h2>Mall 3: Begära anstånd</h2>
        <p>
          <em>Till Kronofogdemyndigheten,<br />
          Angående ärende nr [ärendenummer] – begäran om anstånd.<br />
          Jag, [Namn], personnummer [XXXXXX-XXXX], begär anstånd med betalning/svar till [datum] på grund av [tillfällig sjukdom / ekonomisk kris / väntar på utbetalning från [instans]].<br />
          Jag avser att lösa ärendet senast [datum].<br />
          Med vänliga hälsningar, [Namn], [Datum]</em>
        </p>
        <h2>Viktigt om tidsfrister</h2>
        <p>
          Bestridande av betalningsföreläggande måste ske inom angiven tidsfrist — vanligtvis 10 dagar. Missar du den har Kronofogden rätt att fatta utslag och påbörja verkställighet. Skicka alltid med post eller via Kronofogdens e-tjänst och spara kvitto. Svar Direkt-appen har alla dessa mallar digitalt, redo att fylla i och kopiera.
        </p>
      </>
    ),
  },
  {
    slug: "bestrida-kronofogden",
    title: "Bestrida Kronofogden – mall och guide steg för steg",
    excerpt:
      "Hur bestrider man Kronofogden? Här är en komplett guide med mall för bestridande av betalningsföreläggande — vad du ska skriva, när du ska skicka och vad som händer sedan.",
    category: "Kronofogden",
    readTime: "6 min",
    date: "16 april 2026",
    content: (
      <>
        <p>
          Att <strong>bestrida Kronofogden</strong> låter komplicerat — men det är faktiskt en av de viktigaste saker du kan göra om du fått ett betalningsföreläggande som du anser är felaktigt. Den här guiden ger dig precis vad du behöver: en förklaring av processen och en mall du kan använda direkt.
        </p>
        <h2>Vad är ett bestridande?</h2>
        <p>
          Ett bestridande är ett skriftligt meddelande till Kronofogden där du meddelar att du <em>inte</em> accepterar det krav som ställts mot dig. Det behöver inte vara långt eller juridiskt avancerat — det räcker att du tydligt skriver att du bestrider kravet och anger ett skäl.
        </p>
        <h2>När ska du bestrida?</h2>
        <p>
          Du bör bestrida om: skulden inte existerar, är redan betald, är preskriberad (äldre än 3–10 år beroende på skuldtyp), eller om beloppet är felaktigt. Bestrida även om du är osäker — det stoppar processen och ger dig tid att utreda.
        </p>
        <h2>Tidsgräns – VIKTIGT</h2>
        <p>
          Du har en bestämd tidsfrist, vanligtvis <strong>10 dagar</strong> från att du fått brevet. Missar du den kan Kronofogden utfärda ett utslag utan rättegång — och då kan lön, konto eller tillgångar utmätas. Agera direkt.
        </p>
        <h2>Mall: bestridande av betalningsföreläggande</h2>
        <p>
          <em>Till Kronofogdemyndigheten,<br />
          Svarandes fullständiga namn: [Ditt namn]<br />
          Personnummer: [XXXXXX-XXXX]<br />
          Ärendenummer: [nr från brevet]<br />
          Sökande (borgenären): [Företagets namn]<br /><br />
          Jag bestrider ovanstående betalningsföreläggande.<br />
          Skäl: [Välj/anpassa: "Skulden existerar inte och jag har aldrig haft något avtal med sökanden." / "Skulden är preskriberad." / "Skulden är betald – se bifogat betalningsbevis." / "Beloppet är felaktigt."]<br /><br />
          Jag begär att ärendet avvisas alternativt hänskjuts till tingsrätten.<br /><br />
          Ort och datum: [Stad], [Datum]<br />
          Underskrift: ____________________<br />
          [Ditt namn], [Adress], [Telefon]</em>
        </p>
        <h2>Vad händer efter bestridandet?</h2>
        <p>
          Om du bestrider skickar Kronofogden ärendet vidare till tingsrätten — men bara om borgenären vill driva det vidare. Många mindre fordringsägare väljer att inte göra det eftersom rättegångskostnader tillkommer. Bestridandet är alltså ofta ett effektivt sätt att stoppa kravet helt.
        </p>
      </>
    ),
  },
  {
    slug: "aterkrav-forsakringskassan-vad-gor-jag",
    title: "Återkrav Försäkringskassan – vad gör jag?",
    excerpt:
      "Fick du ett återkrav från Försäkringskassan? Förstå varför det händer, hur du bestrider om det är fel, och hur du ansöker om avbetalningsplan om du accepterar kravet.",
    category: "Försäkringskassan",
    readTime: "5 min",
    date: "16 april 2026",
    content: (
      <>
        <p>
          Ett återkrav från Försäkringskassan innebär att de vill ha tillbaka pengar de redan betalat ut till dig. Det kan kännas chockerande — men det finns alltid saker du kan göra. Frågan <strong>"återkrav Försäkringskassan vad gör jag?"</strong> är en av de vanligaste vi ser, och svaret beror på om du anser att kravet är rätt eller fel.
        </p>
        <h2>Varför kan du få återkrav?</h2>
        <p>
          Vanliga orsaker: du har fått för mycket sjukpenning eller föräldrapenning (t.ex. för att inkomsten ändrades), du anmälde inte en ändring i tid, eller Försäkringskassan anser att du inte uppfyllde villkoren retroaktivt. Ibland är det deras eget misstag.
        </p>
        <h2>Om du anser att kravet är fel – bestrida</h2>
        <p>
          Du har rätt att begära omprövning av beslutet om återkrav. Gör det skriftligen inom 2 månader. Förklara varför du anser att kravet är felaktigt och bifoga bevis – t.ex. bekräftelse på att du anmälde ändrade inkomster, intyg eller korrespondens med kassan.
        </p>
        <h2>Om du accepterar kravet – ansök om avbetalning</h2>
        <p>
          Kan du inte betala hela beloppet på en gång? Kontakta Försäkringskassan och be om avbetalningsplan. Var ärlig om din ekonomiska situation. De kan ofta erbjuda flexibla lösningar, särskilt om du agerar proaktivt.
        </p>
        <h2>Mall: svar på återkrav från Försäkringskassan</h2>
        <p>
          <em>Till Försäkringskassan,<br />
          Angående återkrav, ärende nr [ärendenummer], daterat [datum].<br />
          Jag, [Namn], personnummer [XXXXXX-XXXX], har mottagit ert krav på återbetalning av [belopp] kr.<br />
          [Välj:] Jag bestrider kravet eftersom [förklara skäl och bifoga bevis].<br />
          ELLER: Jag accepterar kravet men ansöker om avbetalning med [X] kr/mån. Min månadsinkomst är [X] kr och mina fasta kostnader är [Y] kr.<br />
          Med vänliga hälsningar, [Namn], [Personnummer], [Kontakt], [Datum]</em>
        </p>
        <p>
          Svar Direkt-appen har fler mallar för Försäkringskassan-situationer redo att kopiera.
        </p>
      </>
    ),
  },
  {
    slug: "skuldsanering-ansoekan-mall",
    title: "Skuldsanering – ansökan, krav och mall för Kronofogden",
    excerpt:
      "Vad är skuldsanering och hur ansöker man? Här är en komplett guide om skuldsanering via Kronofogden – vem som kan ansöka, vad som krävs och hur ansökan ska skrivas.",
    category: "Kronofogden",
    readTime: "7 min",
    date: "16 april 2026",
    content: (
      <>
        <p>
          Skuldsanering är ett av de kraftfullaste verktygen för den som hamnat i en ekonomisk situation som är omöjlig att ta sig ur på egen hand. Men processen kan verka komplicerad. Den här guiden förklarar hur <strong>skuldsanering ansökan</strong> fungerar och ger dig en mall för att komma igång.
        </p>
        <h2>Vad är skuldsanering?</h2>
        <p>
          Skuldsanering innebär att Kronofogden fastställer en betalningsplan — vanligtvis 3 år — där du betalar vad du kan utifrån din ekonomi. Skulderna som du inte kan betala skrivs av. Det ger dig en ren start.
        </p>
        <h2>Vem kan ansöka om skuldsanering?</h2>
        <p>
          Du måste vara privatperson (inte företag), ha skulder som du inte kan betala inom överskådlig tid, och det måste vara "skäligt" att bevilja skuldsanering — hänsyn tas till hur skulderna uppstod, din ålder och hälsa. Du behöver inte vara skyldig till att ha hamnat i situationen.
        </p>
        <h2>Hur ansöker man?</h2>
        <p>
          Ansökan skickas till Kronofogden. Du behöver en fullständig förteckning över alla skulder, information om din inkomst och utgifter, och en förklaring av din situation. Kronofogden granskar sedan om du uppfyller kraven.
        </p>
        <h2>Mall: ansökan om skuldsanering</h2>
        <p>
          <em>Till Kronofogdemyndigheten,<br />
          Ansökan om skuldsanering<br /><br />
          Sökande: [Fullständigt namn], personnummer [XXXXXX-XXXX]<br />
          Adress: [Adress], [Postnummer] [Ort]<br />
          Telefon: [Telefon] | E-post: [E-post]<br /><br />
          Jag ansöker om skuldsanering enligt skuldsaneringslagen (2016:675).<br /><br />
          Min ekonomiska situation: Mina totala skulder uppgår till ca [X] kr fördelade på [antal] borgenärer. Min månadsinkomst är [X] kr netto. Mina nödvändiga levnadskostnader uppgår till ca [Y] kr/mån. Jag har ingen möjlighet att betala mina skulder inom överskådlig framtid.<br /><br />
          Skuldsituationen uppstod på grund av: [Beskriv kortfattat – t.ex. "Sjukdom som ledde till inkomstbortfall under [period]" / "Förlorade arbete" / "Skilsmässa"].<br /><br />
          Bilagor: Skuldförteckning, kontoutdrag, lönespecifikation, hyreskontrakt/kostnadsintyg.<br /><br />
          Med vänliga hälsningar,<br />[Namn], [Datum]</em>
        </p>
        <h2>Vad händer efter ansökan?</h2>
        <p>
          Kronofogden utreder din ansökan, kontaktar borgenärerna och fattar ett beslut. Om skuldsanering beviljas gäller betalningsplanen i 3 år, varefter resterande skulder skrivs av. Svar Direkt-appen har mallar för kommunikation med Kronofogden under hela processen.
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
  Ekonomi: "bg-emerald-50 text-emerald-700",
  Samhälle: "bg-slate-100 text-slate-700",
  Skatteverket: "bg-yellow-50 text-yellow-700",
  Rättigheter: "bg-indigo-50 text-indigo-700",
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

  useEffect(() => {
    if (!article) return;
    const url = `https://svardirekt.site/blogg/${article.slug}`;
    document.title = `${article.title} – Svar Direkt`;
    const desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (desc) desc.content = article.excerpt;
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) canonical.href = url;

    const injectJsonLd = (id: string, data: object) => {
      let script = document.getElementById(id) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = id;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(data);
    };

    injectJsonLd("article-jsonld", {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.excerpt,
      "url": url,
      "publisher": {
        "@type": "Organization",
        "name": "Svar Direkt",
        "url": "https://svardirekt.site"
      },
      "inLanguage": "sv",
      "mainEntityOfPage": { "@type": "WebPage", "@id": url }
    });

    injectJsonLd("breadcrumb-jsonld", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Svar Direkt", "item": "https://svardirekt.site/" },
        { "@type": "ListItem", "position": 2, "name": "Blogg", "item": "https://svardirekt.site/blogg" },
        { "@type": "ListItem", "position": 3, "name": article.title, "item": url }
      ]
    });

    return () => {
      ["article-jsonld", "breadcrumb-jsonld"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
    };
  }, [article]);

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

      {(() => {
        const related = articles
          .filter((a) => a.slug !== article.slug && a.category === article.category)
          .slice(0, 3);
        const fallback = articles
          .filter((a) => a.slug !== article.slug && !related.find((r) => r.slug === a.slug))
          .slice(0, 3 - related.length);
        const shown = [...related, ...fallback];
        if (shown.length === 0) return null;
        return (
          <div className="mt-12 pt-8 border-t border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Relaterade artiklar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {shown.map((rel) => (
                <Link key={rel.slug} href={`/blogg/${rel.slug}`}>
                  <div className="group p-4 rounded-xl border border-slate-100 hover:border-primary/25 hover:shadow-sm transition-all">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[rel.category] ?? "bg-slate-100 text-slate-600"}`}>
                      {rel.category}
                    </span>
                    <p className="mt-2 text-sm font-medium text-slate-800 leading-snug group-hover:text-primary transition-colors">
                      {rel.title}
                    </p>
                    <p className="mt-1 text-xs text-primary font-medium group-hover:underline">Läs mer →</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })()}

      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6 text-center">
          <p className="font-semibold text-slate-900 mb-1">Redo att spara tid?</p>
          <p className="text-sm text-slate-500 mb-4">
            Hämta Svar Direkt och få tillgång till färdiga mallar för alla situationer.
          </p>
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
            Försäkringskassan, Kronofogden och mer. 99 kr en gång — inga
            prenumerationer.
          </p>
        </div>
      </section>
    </div>
  );
}
