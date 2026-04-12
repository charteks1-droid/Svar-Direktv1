import { Link } from "wouter";

const features = [
  {
    id: "skatteverket",
    title: "Skatteverket",
    color: "#00b894",
    count: "14 mallar",
    desc: "Mallar för deklaration, folkbokföring, personnummer, F-skatt och mycket mer.",
    examples: ["Begäran om anstånd", "Svar på kontroll", "Ändring av folkbokföring", "Ansökan F-skatt"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "forsakringskassan",
    title: "Försäkringskassan",
    color: "#0984e3",
    count: "14 mallar",
    desc: "Mallar för sjukpenning, föräldrapenning, aktivitetsstöd och bostadsbidrag.",
    examples: ["Ansökan sjukpenning", "Svar på utredning", "Begäran om omprövning", "Intyg läkarintyg"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "migrationsverket",
    title: "Migrationsverket",
    color: "#6c5ce7",
    count: "14 mallar",
    desc: "Mallar för uppehållstillstånd, asyl, medborgarskap och familjeåterförening.",
    examples: ["Ansökan uppehållstillstånd", "Svar på komplettering", "Asylansökan", "Medborgarskapsansökan"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 12h20M12 2c-2.5 3-4 6.5-4 10s1.5 7 4 10M12 2c2.5 3 4 6.5 4 10s-1.5 7-4 10" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: "boverket",
    title: "Boverket / Hyresrätt",
    color: "#0a7ea4",
    count: "10 mallar",
    desc: "Mallar för hyresrätt, reklamationer, uppsägning och kommunikation med hyresvärd.",
    examples: ["Reklamation till hyresvärd", "Begäran om reparation", "Svar på uppsägning", "Hyresnedsättning"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 12l9-9 9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 21h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "snabba-svar",
    title: "Snabba svar",
    color: "#e17055",
    count: "67+ fraser",
    desc: "Förberedda fraser för arbete, relationer och vardagliga kommunikationssituationer.",
    examples: ["Svar på jobbannons", "Avboka möte", "Tacka nej artigt", "Fråga om lön"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "pdf-guider",
    title: "PDF-guider",
    color: "#fd79a8",
    count: "2+ guider",
    desc: "Ladda ner praktiska guider som hjälper dig förstå komplexa ämnen i Sverige.",
    examples: ["Guide: Kronofogden", "Guide: Tjäna pengar online"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "historik",
    title: "Historik",
    color: "#636e72",
    count: "Automatisk",
    desc: "Alla mallar du har använt sparas automatiskt i historiken så du lätt hittar tillbaka.",
    examples: ["Senast använda mallar", "Sökbar historik", "Tidsstämplar", "Snabb återanvändning"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 8v4l3 3M3 12a9 9 0 1018 0A9 9 0 003 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "favoriter",
    title: "Favoriter",
    color: "#fdcb6e",
    count: "Obegränsat",
    desc: "Markera dina mest använda mallar som favoriter och kom åt dem direkt från startsidan.",
    examples: ["Stjärnmarkerade mallar", "Snabb åtkomst", "Egna samlingar"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "mina-mallar",
    title: "Mina mallar",
    color: "#74b9ff",
    count: "Anpassningsbara",
    desc: "Skapa egna mallar och anpassa befintliga för att passa dina specifika behov.",
    examples: ["Skapa egna mallar", "Redigera befintliga", "Spara utkast", "Dela via app"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          Appens funktioner
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
          Allt du behöver – samlat på ett ställe
        </h1>
        <p className="text-slate-500 text-base max-w-xl leading-relaxed">
          Svar Direkt innehåller 9 huvudfunktioner som täcker de vanligaste kommunikationsbehoven i Sverige.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f) => (
          <div
            key={f.id}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div
              className="h-1.5"
              style={{ backgroundColor: f.color }}
            />
            <div className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: f.color + "18", color: f.color }}
                >
                  {f.icon}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{f.title}</div>
                  <div
                    className="text-[11px] font-medium px-1.5 py-0.5 rounded mt-0.5 inline-block"
                    style={{ backgroundColor: f.color + "15", color: f.color }}
                  >
                    {f.count}
                  </div>
                </div>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed mb-3">{f.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {f.examples.slice(0, 3).map((ex) => (
                  <span
                    key={ex}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100"
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <p className="text-slate-500 text-sm mb-4">
          Alla funktioner ingår i gratisappen. Utöka med paket och guider vid behov.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <a
            href="https://payhip.com/b/WxtV3"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Ladda ner appen
          </a>
          <Link
            href="/paket"
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Se paket
          </Link>
        </div>
      </div>
    </div>
  );
}
