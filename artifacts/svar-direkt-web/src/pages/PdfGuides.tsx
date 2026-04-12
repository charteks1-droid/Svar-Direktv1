const guides = [
  {
    id: "kronofogden",
    title: "Guide: Kronofogden",
    subtitle: "Förstå och hantera skulder",
    desc: "En praktisk guide som förklarar vad Kronofogden är, vad som händer när du får ett inkassokrav, hur du bestrider ett krav och vilka rättigheter du har som gäldenär i Sverige.",
    topics: [
      "Vad är Kronofogden?",
      "Betalningsanmärkning – vad innebär det?",
      "Hur du bestrider ett krav",
      "Skuldsanering – vem kan ansöka?",
      "Dina rättigheter",
      "Viktiga tidsfrister",
    ],
    pages: "ca 15 sidor",
    format: "PDF",
    price: null,
    badge: "Praktisk guide",
    badgeColor: "#e17055",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="3" width="20" height="22" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M9 9h10M9 13h10M9 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "tjana-pengar-online",
    title: "Guide: Tjäna pengar online",
    subtitle: "Legala vägar till extrainkomst i Sverige",
    desc: "En guide för dig som vill förstå hur du kan tjäna extra pengar online på ett lagligt och skattemässigt korrekt sätt i Sverige – utan att råka ut för problem med Skatteverket.",
    topics: [
      "Deklarera inkomster korrekt",
      "F-skatt vs. A-skatt",
      "Plattformar som Blocket, CDON, Tradera",
      "Frilansarbete och fakturering",
      "Vad är skattefritt?",
      "Vanliga misstag att undvika",
    ],
    pages: "ca 12 sidor",
    format: "PDF",
    price: null,
    badge: "Ekonomiguide",
    badgeColor: "#0984e3",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 9v10M11 11.5c0-1.38 1.34-2.5 3-2.5s3 1.12 3 2.5S17 14 14 14s-3 1.12-3 2.5S12.34 19 14 19s3-1.12 3-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function PdfGuides() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          PDF-guider
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
          Praktiska guider för verkliga situationer
        </h1>
        <p className="text-slate-500 text-base max-w-xl leading-relaxed">
          Våra PDF-guider förklarar komplicerade ämnen på ett enkelt och tydligt sätt. Perfekt att ha sparad på telefonen.
        </p>
      </div>

      {/* Info */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-10 flex gap-4 items-start">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary mt-0.5">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M9 8v5M9 6h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <div className="font-semibold text-slate-900 text-sm mb-1">Om PDF-guiderna</div>
          <p className="text-slate-500 text-xs leading-relaxed">
            PDF-guiderna är fristående dokument som kan köpas separat och laddas ner direkt. De är utformade för att vara enkla att läsa och spara på telefonen för offline-användning.
          </p>
        </div>
      </div>

      {/* Guides */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {guides.map((guide) => (
          <div
            key={guide.id}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
          >
            <div className="p-6 flex-1">
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                  {guide.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-slate-900 text-base">{guide.title}</h3>
                  </div>
                  <div
                    className="text-xs font-medium px-2 py-0.5 rounded-full inline-block text-white"
                    style={{ backgroundColor: guide.badgeColor }}
                  >
                    {guide.badge}
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-500 leading-relaxed mb-4">{guide.desc}</p>

              {/* Topics */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Innehåll</div>
                <ul className="space-y-1.5">
                  {guide.topics.map((topic) => (
                    <li key={topic} className="flex items-center gap-2 text-xs text-slate-600">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-primary flex-shrink-0">
                        <path d="M2 6l2.5 2.5L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Meta */}
              <div className="flex gap-3">
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="1.5" y="1.5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1"/>
                    <path d="M3.5 4h5M3.5 6h5M3.5 8h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                  {guide.pages}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 2v6M4 6l2 2 2-2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 9h8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                  {guide.format}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 p-4 flex items-center justify-between bg-slate-50">
              <div>
                {guide.price ? (
                  <span className="text-xl font-bold text-slate-900">{guide.price}</span>
                ) : (
                  <span className="text-sm text-slate-400">Pris meddelas snart</span>
                )}
              </div>
              <div className="flex gap-2">
                <a
                  href="#"
                  className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Köp PDF
                </a>
                <a
                  href="#"
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-white transition-colors"
                >
                  Läs mer
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Placeholder */}
        <div className="rounded-2xl border border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-center text-slate-300 min-h-[250px]">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="mb-3 opacity-40">
            <path d="M18 4H10a4 4 0 00-4 4v20a4 4 0 004 4h16a4 4 0 004-4V14l-6-6H18z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M18 4v10h8" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M18 20v8M14 24h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div className="text-sm font-medium text-slate-400">Fler guider på väg</div>
          <div className="text-xs text-slate-300 mt-1">Vi arbetar med fler PDF-guider.</div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
        <h3 className="font-bold text-slate-900 mb-4">Vanliga frågor om PDF-guiderna</h3>
        <div className="space-y-4">
          {[
            {
              q: "Hur tar jag del av PDF-guiden?",
              a: "Du köper guiden och laddar ner den direkt. Du kan öppna den i din mobils PDF-läsare eller spara den på enheten.",
            },
            {
              q: "Är guiderna på svenska?",
              a: "Ja, samtliga guider är skrivna på svenska och anpassade för svenska förhållanden och lagstiftning.",
            },
            {
              q: "Kan jag läsa guiden offline?",
              a: "Ja. När du har laddat ner PDF-filen kan du läsa den utan internetanslutning.",
            },
          ].map((faq) => (
            <div key={faq.q} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="font-medium text-slate-900 text-sm mb-1">{faq.q}</div>
              <div className="text-slate-500 text-xs leading-relaxed">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
