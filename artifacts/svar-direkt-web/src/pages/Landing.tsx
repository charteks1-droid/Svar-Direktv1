import { Link } from "wouter";

const PAYHIP_URL = "https://payhip.com/b/WxtV3";

const testimonials = [
  {
    quote: "Jag visste inte ens hur jag skulle börja skriva till Försäkringskassan. Med Svar Direkt kopierade jag en mall, anpassade den på 5 minuter och skickade. Fick svar inom en vecka.",
    author: "Användare i Stockholm",
  },
  {
    quote: "Kronofogden skickade ett krav och jag fick panik. Appen hade exakt den mallen jag behövde för en invändning. Tydlig, professionell text — värd varenda krona.",
    author: "Användare i Göteborg",
  },
  {
    quote: "Appen sparade mig troligtvis hundratals kronor i juridisk rådgivning. Jag löste mitt Skatteverket-ärende helt själv med hjälp av mallarna.",
    author: "Användare i Malmö",
  },
];

export default function Landing() {
  return (
    <div className="bg-white">

      {/* 1. HERO */}
      <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
            52+ färdiga mallar — tillgänglig för Android
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-5">
            Fick du ett brev från myndigheten?<br />
            <span className="text-primary">Svara på 30 sekunder.</span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-xl mx-auto">
            Färdiga mallar för Skatteverket, Försäkringskassan, Migrationsverket och Boverket.
            Köp en gång — ha alltid tillgång.
          </p>
          <a
            href={PAYHIP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-primary text-white rounded-xl font-bold text-base hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            Få svar direkt – 49 kr
          </a>
          <p className="text-xs text-slate-400 mt-3">
            🔒 Säker betalning via Payhip. Du får nedladdningslänken direkt efter köp.
          </p>
        </div>
      </section>

      {/* 2. PROBLEM */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Känner du igen dig?</h2>
          <p className="text-slate-500 text-sm">Det är inte bara du. De flesta vet inte hur man skriver till myndigheter.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: "📬",
              text: "Du fick ett brev från myndigheten och vet inte hur du ska svara",
            },
            {
              icon: "⏰",
              text: "Svarstiden närmar sig och du sitter med ett tomt papper",
            },
            {
              icon: "😓",
              text: "Du är rädd att skriva fel och att ärendet drar ut på tiden",
            },
          ].map((item) => (
            <div
              key={item.icon}
              className="bg-red-50 border border-red-100 rounded-2xl p-5 flex gap-3"
            >
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <p className="text-sm text-slate-700 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. LÖSNING */}
      <section className="bg-slate-50 border-y border-slate-100 py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
              Lösningen
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Vad du får direkt i appen</h2>
            <p className="text-slate-500 text-sm">Välj mall → anpassa → skicka. Klart.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-5 py-3.5 font-semibold">Myndighet</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-primary">Färdiga mallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {[
                  { name: "Försäkringskassan", count: "14 färdiga svar" },
                  { name: "Skatteverket", count: "14 färdiga svar" },
                  { name: "Migrationsverket", count: "14 färdiga svar" },
                  { name: "Boverket", count: "10 färdiga svar" },
                ].map((row) => (
                  <tr key={row.name} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-slate-800">{row.name}</td>
                    <td className="px-5 py-4 text-primary font-semibold">✓ {row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center">
            <a
              href={PAYHIP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Kom igång nu – 49 kr
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <p className="text-xs text-slate-400 mt-2">🔒 Säker betalning via Payhip. Du får nedladdningslänken direkt efter köp.</p>
          </div>
        </div>
      </section>

      {/* 4. JÄMFÖRELSE */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Varför inte bara googla?</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Du har säkert tänkt på alternativen. Här är varför de inte räcker.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-5 py-4 font-semibold w-[35%]">Alternativ</th>
                  <th className="text-left px-4 py-4 font-semibold text-slate-300">Problemet</th>
                  <th className="text-center px-4 py-4 font-semibold text-primary bg-primary/10">Svar Direkt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {[
                  {
                    alt: "🔍 Google",
                    problem: "Generiska texter, på engelska, osäkra källor — tar timmar.",
                    sd: "Färdiga svenska texter för exakt din situation.",
                  },
                  {
                    alt: "🤖 ChatGPT",
                    problem: "Kräver att du vet vad du frågar. Inte anpassat för svenska myndigheter.",
                    sd: "Redan formulerat och testat. Ingen prompt behövs.",
                  },
                  {
                    alt: "⚖️ Jurist",
                    problem: "1 000–3 000 kr per timme. Orimligt för ett enkelt svar.",
                    sd: "49 kr en gång. Tillgång till alla mallar direkt.",
                  },
                ].map((row) => (
                  <tr key={row.alt} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-slate-800 align-top">{row.alt}</td>
                    <td className="px-4 py-4 text-slate-500 align-top leading-relaxed">{row.problem}</td>
                    <td className="px-4 py-4 text-primary font-medium align-top text-center bg-primary/5 leading-relaxed">✓ {row.sd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. OMDÖMEN */}
      <section className="bg-slate-50 border-y border-slate-100 py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Vad säger användarna?</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.author} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#f59e0b"><path d="M7 1l1.5 3 3.3.5-2.4 2.3.6 3.2L7 8.5l-3 1.5.6-3.2-2.4-2.3 3.3-.5L7 1z"/></svg>
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic flex-1">"{t.quote}"</p>
                <p className="text-xs font-semibold text-slate-400">{t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HUR DET FUNGERAR */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Hur det fungerar</h2>
            <p className="text-slate-500 text-sm">Tre steg. Ingen inlärningskurva.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                num: "1",
                title: "Köp appen",
                desc: "Betala 49 kr en gång via Payhip. Du får nedladdningslänken direkt.",
              },
              {
                num: "2",
                title: "Välj en mall",
                desc: "52+ mallar sorterade efter myndighet och situation. Hitta rätt på sekunder.",
              },
              {
                num: "3",
                title: "Kopiera och skicka",
                desc: "Anpassa med ditt namn och ditt ärende. Skicka. Klart.",
              },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="bg-gradient-to-b from-slate-50 to-white border-t border-slate-100 py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Skjut inte upp.<br />Myndigheter väntar inte.
          </h2>
          <p className="text-slate-500 text-sm mb-8 max-w-md mx-auto">
            Engångsbetalning. Ingen prenumeration. Tillgång till alla mallar direkt.
          </p>

          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 mb-6">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 8l2 2 4-4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="8" r="6.5" stroke="#16a34a" strokeWidth="1.2"/></svg>
            <span className="text-xs font-medium text-green-800">Inte nöjd? Kontakta oss inom 14 dagar — <strong>info@svardirekt.site</strong></span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a
              href={PAYHIP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-base hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 w-full sm:w-auto text-center"
            >
              Ladda ner nu – 49 kr
            </a>
            <Link
              href="/kontakt"
              className="px-6 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors text-sm w-full sm:w-auto text-center"
            >
              Frågor? Kontakta oss
            </Link>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            🔒 Säker betalning via Payhip. Du får nedladdningslänken direkt efter köp.
          </p>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-slate-200 shadow-lg px-4 py-3">
        <a
          href={PAYHIP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm"
        >
          Få svar direkt – 49 kr
        </a>
      </div>
    </div>
  );
}
