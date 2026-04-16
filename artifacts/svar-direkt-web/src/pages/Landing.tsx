import { Link } from "wouter";
import logoSrc from "../assets/logo.png";

const PAYHIP_URL = "https://payhip.com/b/WxtV3";

const testimonials = [
  {
    quote: "Jag visste inte ens hur jag skulle börja skriva till Försäkringskassan. Med Svar Direkt kopierade jag en mall, anpassade den på 5 minuter och skickade. Fick svar inom en vecka.",
    author: "Användare i Stockholm",
  },
  {
    quote: "Kronofogden skickade ett krav och jag fick panik. Appen hade exakt den mallen jag behövde för en invändning. AI hjälpte mig formulera det perfekt. Värd varenda krona.",
    author: "Användare i Göteborg",
  },
  {
    quote: "Appen sparade mig troligtvis hundratals kronor i juridisk rådgivning. AI-generatorn skrev mitt brev till Skatteverket på under en minut.",
    author: "Användare i Malmö",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Minimal header — logo + CTA only */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src={logoSrc} alt="Svar Direkt" className="h-9 w-9 rounded-lg object-cover" />
            <span className="font-bold text-slate-900 text-sm">Svar Direkt</span>
          </Link>
          <a
            href={PAYHIP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Skaffa appen – 99 kr
          </a>
        </div>
      </header>

      <main className="flex-1">

        {/* 1. HERO */}
        <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              52+ mallar + AI-generator — tillgänglig för Android
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-5">
              AI skriver ditt myndighetsbrev.<br />
              <span className="text-primary">Du skickar det direkt.</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-xl mx-auto">
              Beskriv din situation på tre rader — AI formulerar ett komplett, formellt brev till Skatteverket, Försäkringskassan, Kronofogden och mer. Ingen juridisk kunskap krävs.
            </p>
            <a
              href={PAYHIP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-primary text-white rounded-xl font-bold text-base hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              Skaffa appen – 99 kr
            </a>
            <p className="text-xs text-slate-400 mt-3">
              🔒 Säker betalning via Payhip · Engångsbetalning · Ingen prenumeration
            </p>
          </div>
        </section>

        {/* 2. AI-SEKTION — MAGNET */}
        <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
                ✨ AI-teknik
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Du fyller i tre fält.<br />AI skriver brevet.
              </h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                Inte en tom mall du måste fylla i — ett komplett, formellt brev klart att skicka. På under 10 sekunder.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-5 mb-10">
              {[
                {
                  step: "1",
                  icon: "✍️",
                  title: "Beskriv situationen",
                  desc: "Skriv kort vad som hänt och vad du vill. Inga juridiska termer behövs.",
                },
                {
                  step: "2",
                  icon: "✨",
                  title: "AI formulerar brevet",
                  desc: "Gemini AI skriver ett formellt, korrekt brev anpassat för exakt din myndighet.",
                },
                {
                  step: "3",
                  icon: "📤",
                  title: "Kopiera och skicka",
                  desc: "Brevet är klart. Kopiera med ett tryck och skicka till myndigheten.",
                },
              ].map((item) => (
                <div key={item.step} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-slate-900 mb-1 text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: "🏛️", text: "Stödjer 9 svenska myndigheter — Kronofogden, Skatteverket, Försäkringskassan och fler" },
                  { icon: "⚡", text: "Brev genereras på under 10 sekunder — snabbare än att hitta rätt blankett" },
                  { icon: "🔄", text: "10 AI-genererade brev ingår varje dag, utan extra kostnad" },
                  { icon: "🧠", text: "Ingen AI-kunskap krävs — du behöver inte veta hur man promptar" },
                ].map((item) => (
                  <div key={item.icon} className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <p className="text-sm text-slate-700 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. PROBLEM */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Känner du igen dig?</h2>
            <p className="text-slate-500 text-sm">Det är inte bara du. De flesta vet inte hur man skriver till myndigheter.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: "📬", text: "Du fick ett brev från myndigheten och vet inte hur du ska svara" },
              { icon: "⏰", text: "Svarstiden närmar sig och du sitter med ett tomt papper" },
              { icon: "😓", text: "Du är rädd att skriva fel och att ärendet drar ut på tiden" },
            ].map((item) => (
              <div key={item.icon} className="bg-red-50 border border-red-100 rounded-2xl p-5 flex gap-3">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <p className="text-sm text-slate-700 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. LÖSNING */}
        <section className="bg-slate-50 border-y border-slate-100 py-16 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
                Lösningen
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">52+ mallar + AI för varje myndighet</h2>
              <p className="text-slate-500 text-sm">Välj färdig mall → eller låt AI skriva → kopiera → skicka.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="text-left px-5 py-3.5 font-semibold">Myndighet</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-primary">Mallar + AI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {[
                    { name: "Försäkringskassan", count: "14 mallar + AI-generator" },
                    { name: "Skatteverket", count: "14 mallar + AI-generator" },
                    { name: "Migrationsverket", count: "14 mallar + AI-generator" },
                    { name: "Boverket", count: "10 mallar + AI-generator" },
                    { name: "Kronofogden", count: "AI-generator" },
                    { name: "Arbetsförmedlingen", count: "AI-generator" },
                    { name: "Inkasso", count: "AI-generator" },
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
                Kom igång nu – 99 kr
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
              <p className="text-xs text-slate-400 mt-2">🔒 Säker betalning via Payhip · Engångsbetalning</p>
            </div>
          </div>
        </section>

        {/* 5. JÄMFÖRELSE */}
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
                    <th className="text-left px-5 py-4 font-semibold w-[30%]">Alternativ</th>
                    <th className="text-left px-4 py-4 font-semibold text-slate-300">Problemet</th>
                    <th className="text-center px-4 py-4 font-semibold text-primary bg-primary/10">Svar Direkt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {[
                    {
                      alt: "🔍 Google",
                      problem: "Generiska texter, på engelska, osäkra källor — tar timmar.",
                      sd: "Färdiga svenska texter + AI för exakt din situation.",
                    },
                    {
                      alt: "🤖 ChatGPT",
                      problem: "Kräver att du vet vad du frågar. Inte tränat för svenska myndigheter.",
                      sd: "AI redan anpassad för svenska myndigheter. Inga prompts behövs.",
                    },
                    {
                      alt: "⚖️ Jurist",
                      problem: "1 000–3 000 kr per timme. Orimligt för ett enkelt svar.",
                      sd: "99 kr en gång. AI + 52 mallar direkt i mobilen.",
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

        {/* 6. OMDÖMEN */}
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

        {/* 7. HUR DET FUNGERAR */}
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
                  desc: "Betala 99 kr en gång via Payhip. Du får nedladdningslänken direkt.",
                },
                {
                  num: "2",
                  title: "Välj mall eller AI",
                  desc: "52+ mallar sorterade per myndighet — eller låt AI skriva ett personligt brev på 10 sekunder.",
                },
                {
                  num: "3",
                  title: "Kopiera och skicka",
                  desc: "Ett tryck kopierar hela brevet. Klistra in och skicka till myndigheten.",
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

        {/* 8. FINAL CTA */}
        <section className="bg-gradient-to-b from-slate-50 to-white border-t border-slate-100 py-20 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-semibold mb-4">
              ✨ AI ingår i priset
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Myndigheter väntar inte.<br />AI-hjälpen heller.
            </h2>
            <p className="text-slate-500 text-sm mb-8 max-w-md mx-auto">
              99 kr en gång. AI-generator + 52 mallar + allt på svenska. Inga prenumerationer, inga dolda kostnader.
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
                Ladda ner nu – 99 kr
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

      </main>

      {/* Minimal footer */}
      <footer className="border-t border-slate-100 py-6 px-4 text-center">
        <p className="text-xs text-slate-400">
          © 2026 Svar Direkt · <a href="/integritetspolicy.html" className="hover:text-slate-600 transition-colors">Integritetspolicy</a> · <a href="mailto:info@svardirekt.site" className="hover:text-slate-600 transition-colors">info@svardirekt.site</a>
        </p>
      </footer>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-slate-200 shadow-lg px-4 py-3">
        <a
          href={PAYHIP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm"
        >
          ✨ Skaffa appen – 99 kr
        </a>
      </div>
    </div>
  );
}
