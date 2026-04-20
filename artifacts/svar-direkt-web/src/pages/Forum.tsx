import { useState } from "react";
import { Link } from "wouter";

const CATEGORIES = [
  {
    id: "kronofogden",
    name: "Kronofogden",
    icon: "⚖️",
    color: "#dc2626",
    bg: "bg-red-50",
    border: "border-red-200",
    desc: "Skulder, utmätning, betalningsanmärkningar",
    questions: [
      { q: "Vad händer om jag inte betalar en skuld hos Kronofogden?", a: "Om du inte betalar kan Kronofogden utmäta din lön, bankkonto eller egendom. Du riskerar även en betalningsanmärkning som syns i 3 år och kan påverka hyreskontrakt, lån och mobilabonnemang." },
      { q: "Hur bestrider jag ett krav hos Kronofogden?", a: "Du har 10 dagar på dig att bestrida ett betalningsföreläggande. Skriv till Kronofogden och förklara varför kravet är felaktigt. Svar Direkt kan hjälpa dig skriva rätt bestridande." },
      { q: "Kan jag ansöka om skuldsanering?", a: "Ja, om du är privatperson och inte kan betala dina skulder inom överskådlig tid kan du ansöka om skuldsanering hos Kronofogden. Processen tar ca 5 år men ger dig en ren start." },
    ],
  },
  {
    id: "skatteverket",
    name: "Skatteverket",
    icon: "📋",
    color: "#0a7ea4",
    bg: "bg-blue-50",
    border: "border-blue-200",
    desc: "Deklaration, folkbokföring, personnummer",
    questions: [
      { q: "Hur ändrar jag min folkbokföringsadress?", a: "Du anmäler adressändring via Skatteverkets e-tjänst eller blankett SKV 7402. Du måste ha bott på den nya adressen, och ändringen gäller normalt från anmälningsdatumet." },
      { q: "Jag har fått ett felaktigt skattebesked – vad gör jag?", a: "Du kan begära omprövning inom 6 år från det år beslutet gäller. Skriv till Skatteverket och förklara felet med underlag. Svar Direkt hjälper dig formulera rätt argumentation." },
      { q: "Hur ansöker jag om anstånd med deklarationen?", a: "Du kan begära anstånd via Mina sidor på skatteverket.se senast den 2 maj. Ange orsak – t.ex. sjukdom eller tekniska problem. Anstånd beviljas normalt till 15 maj eller 31 maj." },
    ],
  },
  {
    id: "forsakringskassan",
    name: "Försäkringskassan",
    icon: "🏥",
    color: "#059669",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    desc: "Sjukpenning, föräldrapenning, bidrag",
    questions: [
      { q: "Försäkringskassan har nekat min sjukpenning – hur överklagar jag?", a: "Du har rätt att begära omprövning inom 2 månader. Samla läkarintyg och annan dokumentation. Svar Direkt kan hjälpa dig skriva ett tydligt överklagande som lyfter fram rätt medicinska fakta." },
      { q: "Hur länge kan jag vara föräldraledig?", a: "Du kan ta ut föräldrapenning i upp till 480 dagar per barn (240 dagar per förälder). Dagar kan sparas tills barnet fyller 12 år. Ersättningsnivån är 80% av SGI de första 390 dagarna." },
      { q: "Vad är SGI och hur beräknas den?", a: "SGI (Sjukpenninggrundande inkomst) är din beräknade årsinkomst. Försäkringskassan baserar den på din förväntade inkomst. Du måste anmäla förändringar i inkomst – annars kan du få fel ersättning." },
    ],
  },
  {
    id: "migrationsverket",
    name: "Migrationsverket",
    icon: "🌐",
    color: "#7c3aed",
    bg: "bg-purple-50",
    border: "border-purple-200",
    desc: "Uppehållstillstånd, medborgarskap, asyl",
    questions: [
      { q: "Min ansökan om uppehållstillstånd dröjer – vad kan jag göra?", a: "Du kan skicka en skrivelse till Migrationsverket och begära besked om handläggningstid. Om väntan är oskälig kan du vända dig till JO (Justitieombudsmannen). Svar Direkt hjälper dig formulera rätt brev." },
      { q: "Hur ansöker jag om svenskt medborgarskap?", a: "Du kan ansöka om medborgarskap när du bott i Sverige i 5 år (3 år som gift med svensk medborgare), har permanent uppehållstillstånd och ett skötsamt leverne. Ansökan görs via Migrationsverkets webbplats." },
      { q: "Kan jag överklaga ett avvisningsbeslut?", a: "Ja, du kan överklaga till Migrationsdomstolen inom 3 veckor från beslutet. Det är viktigt att överklagandet är välformulerat och innehåller nya omständigheter. Svar Direkt kan hjälpa dig skriva överklagandet." },
    ],
  },
  {
    id: "arbetsformedlingen",
    name: "Arbetsförmedlingen",
    icon: "💼",
    color: "#d97706",
    bg: "bg-amber-50",
    border: "border-amber-200",
    desc: "A-kassa, aktivitetsrapport, åtgärder",
    questions: [
      { q: "Jag har nekats a-kassa – hur överklagar jag?", a: "Du kan begära omprövning hos din a-kassa inom 2 månader. Om det inte hjälper kan du överklaga till Förvaltningsrätten. Viktigt att du anger alla relevanta omständigheter i överklagandet." },
      { q: "Vad händer om jag missar att lämna aktivitetsrapport?", a: "Om du inte lämnar aktivitetsrapport i tid kan du få varning eller mista rätten till a-kassa i 1–45 dagar. Kontakta Arbetsförmedlingen direkt och förklara varför du missade – ibland godkänns förseningar." },
      { q: "Har jag rätt till a-kassa om jag sagt upp mig själv?", a: "Normalt nej – du får 45 dagars karens. Men om du hade giltiga skäl (t.ex. mobbning, hälsoskäl, omöjlig pendling) kan du ändå ha rätt. Dokumentera skälen och kontakta din a-kassa." },
    ],
  },
];

export default function Forum() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openQ, setOpenQ] = useState<string | null>(null);

  const selected = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-sm text-slate-400 hover:text-primary mb-4 inline-block">← Tillbaka till startsidan</Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Vanliga frågor & svar</h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Välj en kategori och hitta svar på vanliga frågor om svenska myndigheter. Hittar du inget svar – skicka oss din fråga så svarar vi.
          </p>
        </div>

        {/* Category grid */}
        {!activeCategory && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-left p-5 rounded-2xl border-2 ${cat.bg} ${cat.border} hover:shadow-md transition-all group`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">{cat.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{cat.desc}</div>
                    <div className="text-xs mt-2 font-medium" style={{ color: cat.color }}>{cat.questions.length} frågor →</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Q&A for selected category */}
        {selected && (
          <div>
            <button
              onClick={() => { setActiveCategory(null); setOpenQ(null); }}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-5 transition-colors"
            >
              ← Alla kategorier
            </button>

            <div className={`flex items-center gap-3 p-4 rounded-2xl ${selected.bg} border ${selected.border} mb-6`}>
              <span className="text-2xl">{selected.icon}</span>
              <div>
                <h2 className="font-bold text-slate-900">{selected.name}</h2>
                <p className="text-xs text-slate-500">{selected.desc}</p>
              </div>
            </div>

            <div className="space-y-3">
              {selected.questions.map((item, i) => {
                const key = `${selected.id}-${i}`;
                const isOpen = openQ === key;
                return (
                  <div
                    key={key}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
                  >
                    <button
                      className="w-full text-left px-5 py-4 flex justify-between items-start gap-3"
                      onClick={() => setOpenQ(isOpen ? null : key)}
                    >
                      <span className="font-medium text-slate-900 text-sm leading-snug">{item.q}</span>
                      <span className="text-slate-400 text-lg flex-shrink-0">{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
          <p className="font-bold text-slate-900 mb-1">Hittar du inte svaret?</p>
          <p className="text-sm text-slate-500 mb-4">Skicka din fråga – första svaret är gratis.</p>
          <Link
            href="/tjanst"
            className="inline-block bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Ställ din fråga →
          </Link>
        </div>
      </div>
    </div>
  );
}
