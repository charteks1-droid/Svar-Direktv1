import { Link } from "wouter";
import logoSrc from "../assets/logo.png";

const TJANST_URL = "/tjanst";

const testimonials = [
  {
    quote: "Jag visste inte var jag skulle börja med Försäkringskassan. Appen hade exakt rätt mall — färdig, formell och klar att skicka. Fick svar inom en vecka.",
    author: "Användare i Stockholm",
  },
  {
    quote: "Kronofogden skickade ett krav och jag fick panik. Appen hade exakt den mallen jag behövde — professionell svenska, rätt ton, klart att kopiera. Inga juridiska termer att lära sig.",
    author: "Användare i Göteborg",
  },
  {
    quote: "Appen sparade mig hundratals kronor i juridisk rådgivning. Jag hittade rätt mall, kopierade texten och skickade direkt. Snabbt, enkelt och korrekt.",
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
        </div>
      </header>

      <main className="flex-1">

        {/* 1. HERO */}
        <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              52+ färdiga mallar — tillgänglig för Android
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-5">
              Hitta rätt mall.<br />
              Kopiera texten.<br />
              <span className="text-primary">Du skickar det direkt.</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-xl mx-auto">
              Välj bland 52+ färdiga mallar för svenska myndigheter. Formella, korrekta texter för Skatteverket, Försäkringskassan, Migrationsverket och fler — redo att kopieras och skickas.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-4 mt-2">
              <a
                href="https://payhip.com/b/WxtV3"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-md"
              >
                Ladda ner gratis
              </a>
              <Link
                href={TJANST_URL}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Personlig mall – 99 kr
              </Link>
            </div>
            <p className="text-xs text-slate-400 mb-4">App: gratis · Personlig mall: 99 kr · App med AI: 79 kr/mc</p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {[
                { icon: "🔒", text: "SSL-säker betalning" },
                { icon: "🛡️", text: "30-dagars returrätt" },
                { icon: "✅", text: "Engångskostnad" },
                { icon: "📲", text: "Direkt nedladdning" },
              ].map((b) => (
                <span key={b.text} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>{b.icon}</span>{b.text}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 2. MALLAR-SEKTION */}
        <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
                📄 Färdiga mallar
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Sluta stirra på ett tomt papper.<br />Välj en mall — kopiera — skicka.
              </h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                52+ professionella mallar skrivna på korrekt, formell svenska. Sorterade per myndighet. Klara att använda direkt.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-5 mb-10">
              {[
                {
                  step: "1",
                  icon: "🏛️",
                  title: "Välj myndighet",
                  desc: "Öppna appen och välj vilken myndighet du vill skriva till — Skatteverket, Försäkringskassan, Kronofogden och fler.",
                },
                {
                  step: "2",
                  icon: "📄",
                  title: "Välj rätt mall",
                  desc: "52+ mallar sorterade per myndighet och ärendetyp. Färdiga, formella texter på korrekt svenska — klara att använda.",
                },
                {
                  step: "3",
                  icon: "📤",
                  title: "Kopiera och skicka",
                  desc: "Tryck för att kopiera hela texten. Klistra in och skicka till myndigheten — klart på under en minut.",
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
                  { icon: "🏛️", text: "52+ mallar för svenska myndigheter — Kronofogden, Skatteverket, Försäkringskassan, Migrationsverket och fler" },
                  { icon: "📝", text: "Professionell, formell svenska — du behöver inte kunna juridiska termer eller myndighetsspråk" },
                  { icon: "📱", text: "Fungerar offline — ingen internetanslutning behövs när du väl laddat ner appen" },
                  { icon: "🔖", text: "Spara favoriter och historik — dina använda mallar sparas automatiskt i appen" },
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
              <h2 className="text-2xl font-bold text-slate-900 mb-2">52+ färdiga mallar för varje myndighet</h2>
              <p className="text-slate-500 text-sm">Välj mall → kopiera texten → skicka till myndigheten.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="text-left px-5 py-3.5 font-semibold">Myndighet</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-primary">Antal mallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {[
                    { name: "Försäkringskassan", count: "14 mallar" },
                    { name: "Skatteverket", count: "14 mallar" },
                    { name: "Migrationsverket", count: "14 mallar" },
                    { name: "Boverket", count: "10 mallar" },
                    { name: "Kronofogden", count: "6 mallar" },
                    { name: "Arbetsförmedlingen", count: "6 mallar" },
                    { name: "Inkasso", count: "4 mallar" },
                  ].map((row) => (
                    <tr key={row.name} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-medium text-slate-800">{row.name}</td>
                      <td className="px-5 py-4 text-primary font-semibold">✓ {row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          <div className="text-center mt-6">
            <Link
              href={TJANST_URL}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-md"
            >
              Personlig hjälp – 99 kr
            </Link>
            <p className="text-xs text-slate-400 mt-2">Första svaret gratis · Svar inom 24 timmar</p>
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
                      sd: "Färdiga svenska texter för exakt din situation.",
                    },
                    {
                      alt: "🤖 ChatGPT",
                      problem: "Kräver att du vet vad du frågar. Inte tränat för svenska myndigheter.",
                      sd: "Mallar anpassade för svenska myndigheter. Inga juridiska termer behövs.",
                    },
                    {
                      alt: "⚖️ Jurist",
                      problem: "1 000–3 000 kr per timme. Orimligt för ett enkelt svar.",
                      sd: "Personlig hjälp från 99 kr. Första svaret gratis.",
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
                  title: "Beskriv ditt ärende",
                  desc: "Fyll i formuläret med din situation och vilken myndighet det gäller.",
                },
                {
                  num: "2",
                  title: "Välj rätt mall",
                  desc: "52+ mallar sorterade per myndighet och ärendetyp — välj den som passar din situation.",
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
              📄 52+ färdiga mallar
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Myndigheten väntar inte på ditt svar.<br />Men du behöver inte skriva det själv.
            </h2>
            <p className="text-slate-500 text-sm mb-8 max-w-md mx-auto">
              Välj mellan gratisappen (52+ mallar, offline) eller personlig hjälp — beskriv din situation och få ett färdigt svar inom 24 timmar.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
              {/* Tier 1 – Free app (Payhip) */}
              <div className="border-2 border-primary rounded-2xl p-5 text-center bg-primary/5">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Gratis app</p>
                <p className="text-3xl font-bold text-slate-900 mb-1">0 kr</p>
                <p className="text-xs text-slate-500 mb-4">52+ mallar · Offline · Inget konto</p>
                <a
                  href="https://payhip.com/b/WxtV3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-md"
                >
                  Ladda ner gratis
                </a>
              </div>
              {/* Tier 2 – Personal template */}
              <div className="border-2 border-slate-200 rounded-2xl p-5 text-center">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Personlig mall</p>
                <p className="text-3xl font-bold text-slate-900 mb-1">99 kr</p>
                <p className="text-xs text-slate-500 mb-4">Svar inom 24h · Första gratis</p>
                <Link
                  href={TJANST_URL}
                  className="block w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
                >
                  Beställ nu
                </Link>
              </div>
            </div>

            <div className="text-center mb-4">
              <Link href="/kontakt" className="text-sm text-slate-500 underline hover:text-slate-700">
                Frågor? Kontakta oss
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-5">
              {[
                { icon: "🔒", text: "SSL-säker betalning" },
                { icon: "✅", text: "Engångskostnad" },
                { icon: "📲", text: "Direkt nedladdning" },
              ].map((b) => (
                <span key={b.text} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>{b.icon}</span>{b.text}
                </span>
              ))}
            </div>

            {/* Guarantee block */}
            <div className="inline-flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-3.5 max-w-sm mx-auto">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
                🛡️
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-green-900">30 dagar pengarna tillbaka</p>
                <p className="text-xs text-green-700 mt-0.5">Är du inte nöjd — återbetalar vi 100%</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Minimal footer */}
      <footer className="border-t border-slate-100 py-6 px-4 text-center">
        <p className="text-xs text-slate-400">
          © 2026 Svar Direkt · <a href="/integritetspolicy.html" className="hover:text-slate-600 transition-colors">Integritetspolicy</a> · <a href="mailto:info@svardirekt.site" className="hover:text-slate-600 transition-colors">info@svardirekt.site</a>
        </p>
      </footer>


    </div>
  );
}
