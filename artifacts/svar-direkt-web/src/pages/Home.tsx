import { Link } from "wouter";
import { useState } from "react";
import logoSrc from "../assets/logo.png";

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[200px] sm:w-[240px]">
      <div className="relative w-full aspect-[9/19] bg-slate-900 rounded-[2.5rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden">
        <div className="absolute top-0 inset-x-0 flex justify-center pt-2 z-10">
          <div className="w-20 h-4 bg-slate-800 rounded-full" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 pt-8 px-3 pb-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-md bg-primary/40" />
            <div className="h-2 w-24 bg-slate-600 rounded-full" />
          </div>
          {[
            { color: "#0a7ea4", label: "Boverket" },
            { color: "#00b894", label: "Skatteverket" },
            { color: "#0984e3", label: "Försäkringskassan" },
            { color: "#6c5ce7", label: "Migrationsverket" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl px-3 py-2.5 flex items-center gap-2"
              style={{ backgroundColor: item.color + "22", borderLeft: `3px solid ${item.color}` }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <div className="text-[10px] text-white font-medium">{item.label}</div>
            </div>
          ))}
          <div className="mt-1 rounded-xl bg-slate-700/50 px-3 py-2.5">
            <div className="h-1.5 w-3/4 bg-slate-500 rounded-full mb-2" />
            <div className="h-1.5 w-1/2 bg-slate-500/60 rounded-full" />
          </div>
          <div className="mt-auto rounded-xl bg-primary/20 border border-primary/30 px-3 py-2 flex items-center justify-between">
            <div className="text-[10px] text-primary font-semibold">Snabba svar</div>
            <div className="w-4 h-4 rounded-full bg-primary/30 flex items-center justify-center">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M2 4h4M4 2l2 2-2 2" stroke="#0a7ea4" strokeWidth="1" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex gap-4 hover:shadow-md transition-shadow">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
        {icon}
      </div>
      <div>
        <div className="font-semibold text-slate-900 text-sm mb-1">{title}</div>
        <div className="text-slate-500 text-xs leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

function HelpForm() {
  const [submitted, setSubmitted] = useState(false);
  const [kategori, setKategori] = useState("");
  const [amne, setAmne] = useState("");
  const [meddelande, setMeddelande] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setKategori("");
    setAmne("");
    setMeddelande("");
  }

  return (
    <section className="bg-white border-t border-slate-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="text-2xl font-bold text-slate-900 mb-3 text-center">Behöver du hjälp?</h2>
        <p className="text-slate-500 text-sm text-center mb-8 max-w-lg mx-auto">
          Hittar du inte rätt mall eller kategori? Skicka ett meddelande så guidar vi dig till rätt mall eller formulering i Svar Direkt.
        </p>

        {submitted ? (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-8 flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Tack! Vi har tagit emot ditt meddelande.</h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Vi återkommer så snart vi kan. Under tiden kan du redan nu använda våra färdiga mallar direkt i appen.
            </p>
            <a
              href="https://payhip.com/b/WxtV3"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Ladda ner appen – 49 kr
            </a>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-slate-50 rounded-2xl border border-slate-100 p-6 sm:p-8 flex flex-col gap-5"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategori</label>
              <select
                value={kategori}
                onChange={e => setKategori(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">Välj kategori…</option>
                <option>Skatteverket</option>
                <option>Försäkringskassan</option>
                <option>Boverket</option>
                <option>Migrationsverket</option>
                <option>Annat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Vad gäller det?</label>
              <input
                type="text"
                value={amne}
                onChange={e => setAmne(e.target.value)}
                placeholder="Beskriv kortfattat vad ärendet handlar om"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Meddelande</label>
              <textarea
                value={meddelande}
                onChange={e => setMeddelande(e.target.value)}
                rows={4}
                placeholder="Berätta mer om vad du söker hjälp med…"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Skicka
            </button>
          </form>
        )}

        <p className="mt-5 text-xs text-slate-400 text-center leading-relaxed">
          Observera: Svar Direkt erbjuder inte juridisk rådgivning och gör ingen individuell bedömning. Vi hjälper endast till att guida dig till rätt mallar och innehåll.
        </p>
        <p className="mt-2 text-xs text-slate-400 text-center">
          Vill du kontakta oss direkt?{" "}
          <a href="mailto:info@svardirekt.site" className="text-primary hover:underline">info@svardirekt.site</a>
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6">
                <img src={logoSrc} alt="Svar Direkt" className="h-20 w-20 rounded-2xl object-cover shadow-lg" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                Tillgänglig för Android
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-5">
                Skriv rätt.<br />Få svar.<br />
                <span className="text-primary">Sluta stressa.</span>
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-md">
                Färdiga mallar, snabba svar och PDF-guider för verkliga situationer i Sverige. Direkt i mobilen.
              </p>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2">
                  <a
                    href="https://payhip.com/b/WxtV3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors text-sm"
                  >
                    Ladda ner appen
                  </a>
                  <span className="text-sm font-semibold text-slate-700">49 kr</span>
                </div>
                <Link
                  href="/paket"
                  className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors text-sm"
                >
                  Se paket
                </Link>
                <Link
                  href="/pdf-guider"
                  className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors text-sm"
                >
                  Se PDF-guider
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Snabbknappar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Vad erbjuder Svar Direkt?</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Allt du behöver för att kommunicera tydligt med myndigheter och i vardagen.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SectionCard
            icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 7h6M7 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
            title="Färdiga mallar"
            desc="Mallar för Skatteverket, Försäkringskassan, Migrationsverket och Boverket."
          />
          <SectionCard
            icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            title="Snabba svar"
            desc="Förberedda svar för arbete, relationer och vardagliga situationer."
          />
          <SectionCard
            icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 2h8l4 4v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5"/><path d="M14 2v5h4" stroke="currentColor" strokeWidth="1.5"/></svg>}
            title="PDF-guider"
            desc="Ladda ner praktiska guider för Kronofogden, tjäna pengar online och mer."
          />
          <SectionCard
            icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
            title="Historik"
            desc="Alla dina använda mallar sparas automatiskt i historiken."
          />
          <SectionCard
            icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3l1.8 3.6L16 7.6l-3 2.9.7 4.1L10 12.5l-3.7 2.1.7-4.1-3-2.9 4.2-.7L10 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>}
            title="Favoriter"
            desc="Spara dina mest använda mallar och kom åt dem direkt."
          />
          <SectionCard
            icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M14 11v6M11 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
            title="Lägg till moduler"
            desc="Utöka appen med fler paket och kategorier efter ditt behov."
          />
        </div>
      </section>

      {/* Myndigheter */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Mallar för svenska myndigheter</h2>
            <p className="text-slate-500 text-sm">Förberedda svar och brev för de vanligaste myndigheterna.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "Boverket", color: "#0a7ea4", count: "10 mallar", desc: "Hyresrätt & boende" },
              { name: "Skatteverket", color: "#00b894", count: "14 mallar", desc: "Skatt & deklaration" },
              { name: "Försäkringskassan", color: "#0984e3", count: "14 mallar", desc: "Bidrag & ersättning" },
              { name: "Migrationsverket", color: "#6c5ce7", count: "14 mallar", desc: "Tillstånd & asyl" },
            ].map((m) => (
              <div
                key={m.name}
                className="rounded-2xl bg-white border border-slate-100 p-5 flex flex-col items-center text-center shadow-sm"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-white font-bold text-lg"
                  style={{ backgroundColor: m.color }}
                >
                  {m.name[0]}
                </div>
                <div className="font-semibold text-slate-900 text-sm mb-0.5">{m.name}</div>
                <div className="text-xs text-slate-400 mb-2">{m.desc}</div>
                <div
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: m.color + "18", color: m.color }}
                >
                  {m.count}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/funktioner"
              className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
            >
              Se alla funktioner
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Hur det fungerar */}
      <section id="hur-det-fungerar" className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Hur det fungerar</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">Tre enkla steg till ett tydligt svar.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              step: "1",
              title: "Ladda ner appen",
              desc: "Köp appen för 49 kr och ladda ner den till Android.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12 15v-7M9 12l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
            },
            {
              step: "2",
              title: "Välj mall eller paket",
              desc: "Välj bland färdiga mallar eller lägg till ett paket med snabba svar.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M17 13v8M13 17h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ),
            },
            {
              step: "3",
              title: "Kopiera och skicka",
              desc: "Kopiera texten och skicka den direkt – via e-post, brev eller meddelande.",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
            },
          ].map((item) => (
            <div key={item.step} className="relative bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="absolute -top-3 left-5 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow">
                {item.step}
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 mt-2">
                {item.icon}
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Paket preview */}
      <section className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-3">Utöka med smarta paket</h2>
              <p className="text-primary-100 text-sm leading-relaxed mb-6 text-white/80">
                Lägg till paket med snabba svar för arbete, relationer och mer. Perfekt för dig som vill ha ännu fler färdiga texter direkt i appen.
              </p>
              <Link
                href="/paket"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Se alla paket
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
            <div className="grid gap-3">
              {[
                { name: "Snabba svar – Arbete", desc: "67 färdiga svar för jobbsituationer", badge: "Populär" },
                { name: "Snabba svar – Relationer", desc: "61 färdiga fraser för dejting, relationer och gränssättning", badge: "Ny" },
              ].map((p) => (
                <div key={p.name} className="bg-white/10 backdrop-blur rounded-xl p-4 flex items-center justify-between border border-white/20">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm text-white">{p.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white">{p.badge}</span>
                    </div>
                    <span className="text-xs text-white/70">{p.desc}</span>
                  </div>
                  <Link href="/paket" className="ml-3 text-xs font-medium px-3 py-1.5 rounded-lg bg-white text-primary hover:bg-slate-50 transition-colors flex-shrink-0">
                    Se mer
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fördelar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Varför Svar Direkt?</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Byggt för alla som vill kommunicera tydligt – utan stress och utan hjälp.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Sparar tid", desc: "Inga tomma sidor. Välj en mall, anpassa och skicka." },
            { title: "Minskar stress", desc: "Sluta oroa dig för om du skriver rätt. Mallarna är redan klara." },
            { title: "Tydliga texter", desc: "Professionellt formulerade svar på svenska." },
            { title: "Direkt i mobilen", desc: "Allt finns i appen – inga krångliga hemsidor." },
            { title: "Verkliga situationer", desc: "Byggt för situationer som faktiskt händer i Sverige." },
            { title: "Utbyggbart", desc: "Lägg till fler paket och PDF-guider när du behöver." },
          ].map((b) => (
            <div key={b.title} className="flex gap-3 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5L8 3" stroke="#0a7ea4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-sm mb-0.5">{b.title}</div>
                <div className="text-slate-500 text-xs leading-relaxed">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Jämförelse med konkurrenter */}
      <section className="bg-slate-50 border-t border-slate-100 py-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
              Varför Svar Direkt?
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Vad skiljer oss från alternativen?
            </h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">
              Det finns många sätt att hantera myndighetsbrev — men de flesta tar tid, kostar pengar eller kräver att du vet vad du gör.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-5 py-4 font-semibold w-[36%]">Alternativ</th>
                  <th className="text-left px-4 py-4 font-semibold text-slate-300">Problem</th>
                  <th className="text-center px-4 py-4 font-semibold text-primary bg-primary/10 rounded-t-none">Svar Direkt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  {
                    alt: "🔍 Googla efter mallar",
                    problem: "Generiska texter, på engelska, osäkra källor — tar timmar och ger inga garantier.",
                    sd: "Färdiga svenska texter för exakt din situation — direkt i appen.",
                  },
                  {
                    alt: "🤖 Skriva med ChatGPT",
                    problem: "Kräver att du vet vad du ska fråga, ger inte alltid korrekt juridisk ton, kopplas inte till din specifika myndighet.",
                    sd: "Redan formulerat, testat och anpassat för svenska myndigheter. Ingen prompt behövs.",
                  },
                  {
                    alt: "⚖️ Juridisk rådgivning",
                    problem: "Kostar 1 000–3 000 kr per timme. Inte rimligt för ett enkelt svar till Försäkringskassan.",
                    sd: "49 kr en gång. Tillgång till alla mallar direkt.",
                  },
                  {
                    alt: "📋 Andras bloggar & forum",
                    problem: "Utdaterade råd, okänd författare, kräver att du sätter ihop texten själv.",
                    sd: "Uppdaterade mallar, klara att kopiera — utan att behöva skriva något från noll.",
                  },
                  {
                    alt: "😰 Skjuta upp och hoppas",
                    problem: "Tidsfrister löper ut. Ärenden eskalerar. Ångesten ökar.",
                    sd: "Sänker tröskeln så du faktiskt svarar — snabbt och rätt.",
                  },
                ].map((row) => (
                  <tr key={row.alt} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-slate-800 align-top">{row.alt}</td>
                    <td className="px-4 py-4 text-slate-500 align-top leading-relaxed">{row.problem}</td>
                    <td className="px-4 py-4 text-primary font-medium align-top text-center leading-relaxed bg-primary/5">✓ {row.sd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center text-xs text-slate-400 mt-4">
            Svar Direkt är inte juridisk rådgivning — det är ett praktiskt verktyg för vardagskommunikation.
          </p>
        </div>
      </section>

      {/* SEO-rich text block */}
      <section className="bg-white border-t border-slate-100 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-4 text-center">
            Hur skriver man till svenska myndigheter?
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 text-sm text-slate-500 leading-relaxed">
            <div>
              <p className="mb-3">
                Att skriva ett korrekt <strong className="text-slate-700">mall brev till Försäkringskassan</strong> eller förstå hur man formulerar ett överklagande kan vara svårt. Svar Direkt ger dig färdiga texter som passar exakt den situationen.
              </p>
              <p>
                Undrar du <strong className="text-slate-700">hur skriver man till Kronofogden</strong> utan att göra fel? I appen hittar du mallar för ansökningar, invändningar och betalningsuppgörelser — klara att kopiera direkt.
              </p>
            </div>
            <div>
              <p className="mb-3">
                Behöver du ett <strong className="text-slate-700">mall brev till Skatteverket</strong> om deklaration, skatteåterbäring eller folkbokföring? Svar Direkt har mallar för de vanligaste situationerna.
              </p>
              <p>
                Appen fungerar offline och kräver inget konto. Du köper en gång för 49 kr och har tillgång till alla mallar direkt — på korrekt, formell svenska.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 border-t border-slate-100 py-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              Vad användarna säger
            </span>
            <h2 className="text-2xl font-bold text-slate-900">Riktiga resultat, riktiga situationer</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                stars: 5,
                quote: "Jag visste inte ens hur jag skulle börja skriva till Försäkringskassan. Med Svar Direkt kopierade jag en mall, anpassade den på 5 minuter och skickade. Fick svar inom en vecka.",
                author: "Användare i Stockholm",
              },
              {
                stars: 5,
                quote: "Kronofogden skickade ett krav och jag fick panik. Appen hade exakt den mallen jag behövde för en invändning. Tydlig, professionell text — värd varenda krona.",
                author: "Användare i Göteborg",
              },
              {
                stars: 5,
                quote: "Appen sparade mig troligtvis hundratals kronor i juridisk rådgivning. Jag löste mitt Skatteverket-ärende helt själv med hjälp av mallarna.",
                author: "Användare i Malmö",
              },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <svg key={si} width="16" height="16" viewBox="0 0 16 16" fill="#f59e0b">
                      <path d="M8 1l1.8 3.6L14 5.6l-3 2.9.7 4.1L8 10.5l-3.7 2.1.7-4.1L2 5.6l4.2-.7L8 1z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic flex-1">"{t.quote}"</p>
                <p className="text-xs text-slate-400 font-medium">{t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Behöver du hjälp? */}
      <HelpForm />

      {/* CTA */}
      <section className="bg-gradient-to-b from-slate-50 to-white border-t border-slate-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Redo att börja?</h2>
          <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
            Ladda ner appen en gång. Ha färdiga svar för Skatteverket, Kronofogden, Försäkringskassan och mer — alltid i fickan.
          </p>

          {/* Guarantee badge */}
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 mb-6">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5l1.5 3 3.3.5-2.4 2.3.6 3.2L8 9l-3 1.5.6-3.2-2.4-2.3 3.3-.5L8 1.5z" fill="#16a34a" opacity="0.2"/><path d="M8 2l1.4 2.8 3.1.5-2.2 2.2.5 3L8 9l-2.8 1.5.5-3L3.5 5.3l3.1-.5L8 2z" stroke="#16a34a" strokeWidth="1.2" strokeLinejoin="round"/><path d="M5 8l2 2 4-4" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round"/></svg>
            <span className="text-xs font-medium text-green-800">Inte nöjd? Kontakta oss inom 14 dagar — <strong>info@svardirekt.site</strong></span>
          </div>

          <div className="flex justify-center gap-3 flex-wrap items-center mb-5">
            <a
              href="https://payhip.com/b/WxtV3"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors text-sm shadow-lg shadow-primary/25"
            >
              Ladda ner appen – 49 kr
            </a>
            <Link
              href="/kontakt"
              className="px-6 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors text-sm"
            >
              Kontakta oss
            </Link>
          </div>

          {/* Payhip explanation */}
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="#94a3b8" strokeWidth="1"/><path d="M4 6l1.5 1.5L8.5 4" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round"/></svg>
              Betalning via Payhip (säker kortbetalning)
            </span>
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="#94a3b8" strokeWidth="1"/><path d="M4 6l1.5 1.5L8.5 4" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round"/></svg>
              Du laddar ner filen direkt efter köpet
            </span>
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="#94a3b8" strokeWidth="1"/><path d="M4 6l1.5 1.5L8.5 4" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round"/></svg>
              Engångskostnad — inga prenumerationer
            </span>
          </div>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-slate-200 shadow-lg px-4 py-3">
        <a
          href="https://payhip.com/b/WxtV3"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm"
        >
          Ladda ner appen – 49 kr
        </a>
      </div>
    </div>
  );
}
