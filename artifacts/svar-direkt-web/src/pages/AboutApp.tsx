import { Link } from "wouter";

export default function AboutApp() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Rubrik */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          Om appen
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
          Svar Direkt – din guide<br />genom det svenska systemet
        </h1>
        <p className="text-slate-500 text-base leading-relaxed max-w-2xl">
          Svar Direkt är en mobilapp som ger dig färdiga mallar, snabba svar och{" "}
          <Link href="/pdf-guider" className="text-primary underline hover:no-underline">PDF-guider</Link>{" "}
          för verkliga situationer i Sverige. Oavsett om du ska skriva till en myndighet, svara på en jobbannons eller hantera en konflikt med en hyresvärd – appen har svaret.
          Läs mer om{" "}
          <Link href="/funktioner" className="text-primary underline hover:no-underline">alla funktioner</Link>{" "}
          eller se{" "}
          <Link href="/paket" className="text-primary underline hover:no-underline">tillgängliga paket</Link>.
        </p>
      </div>

      {/* Vad är Svar Direkt? */}
      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 sm:p-8 mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Vad är Svar Direkt?</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              Svar Direkt är en app för dig som bor och lever i Sverige och ibland behöver kommunicera med myndigheter, arbetsgivare eller i andra officiella situationer – men inte alltid vet hur man formulerar sig på svenska.
              Läs mer om <Link href="/blogg/varfor-ar-det-svart-att-skriva-till-myndigheter" className="text-primary underline hover:no-underline">varför det är svårt att skriva till myndigheter</Link> i vår blogg.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Appen innehåller hundratals förberedda mallar och fraser som du enkelt kopierar, anpassar och skickar. Ingen blank sida. Inget gissande. Bara tydliga svar.
              Se <Link href="/funktioner" className="text-primary underline hover:no-underline">alla funktioner i appen</Link>.
            </p>
          </div>
          <div>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              Vi har samlat mallar för de fyra stora myndigheterna – Skatteverket, Försäkringskassan, Migrationsverket och Boverket – samt <Link href="/paket" className="text-primary underline hover:no-underline">snabba svar för arbete, relationer och vardagliga situationer</Link>.
              Har du fått brev från Försäkringskassan? Läs <Link href="/blogg/forsakringskassan-skriver-till-dig" className="text-primary underline hover:no-underline">vår guide om hur du svarar</Link>.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Appen är offline-redo och kräver ingen inloggning. Ladda ner och börja direkt.
              Behöver du jobbsöka? Se våra <Link href="/mallar" className="text-primary underline hover:no-underline">gratis jobbansökningsmallar</Link>.
            </p>
          </div>
        </div>
      </div>

      {/* För vem */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-5">För vem är appen?</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              title: "Dig som bor i Sverige",
              desc: "Oavsett om du är nyflytten eller har bott här hela livet – appen hjälper dig att navigera svenska byråkratin.",
            },
            {
              title: "Dig som behöver skriva till myndigheter",
              desc: "Skatteverket, Försäkringskassan, Migrationsverket, Boverket – alla de vanligaste myndigheterna finns med.",
            },
            {
              title: "Dig som vill ha snabba svar",
              desc: "Färdiga fraser och mallar för jobb, relationer och vardagliga kommunikationssituationer.",
            },
            {
              title: "Dig som vill ha ordning på papperna",
              desc: "PDF-guider med praktisk information om t.ex. Kronofogden och hur man hanterar skulder.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900 text-sm mb-1">{item.title}</div>
                  <div className="text-slate-500 text-xs leading-relaxed">{item.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Innehåll */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-5">Vad innehåller appen?</h2>
        <div className="space-y-3">
          {[
            { label: "52+ myndighetmallar", detail: "Skatteverket, Försäkringskassan, Migrationsverket, Boverket" },
            { label: "Snabba svar", detail: "Färdiga fraser för jobb och vardagliga situationer" },
            { label: "PDF-guider", detail: "Praktiska guider för ekonomi och rättsliga frågor" },
            { label: "Historik", detail: "Alla dina använda mallar sparas automatiskt" },
            { label: "Favoriter", detail: "Spara och kom åt dina favoritmallar snabbt" },
            { label: "Egna mallar", detail: "Skapa och spara dina egna anpassade mallar" },
            { label: "Anteckningsblock", detail: "Inbyggt block för anteckningar och utkast" },
            { label: "Sök", detail: "Sök bland alla mallar och fraser" },
            { label: "Lägg till moduler", detail: "Importera fler paket och kategorier" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 py-3 border-b border-slate-100">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary flex-shrink-0">
                <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm font-medium text-slate-900">{item.label}</span>
              <span className="text-xs text-slate-400 ml-auto text-right">{item.detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl bg-primary text-white p-6 sm:p-8 text-center">
        <h3 className="text-xl font-bold mb-2">Redo att prova?</h3>
        <p className="text-white/80 text-sm mb-5">
          Köp appen för 49 kr och kom igång direkt.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <div className="flex flex-col items-center gap-1">
            <span className="px-5 py-2.5 bg-white/20 text-white/60 rounded-xl text-sm font-medium cursor-not-allowed border border-white/30 select-none inline-flex items-center gap-2">
              🔜 Appen snart tillbaka
            </span>
            <p className="text-xs text-white/50">Vi jobbar med en liten förbättring</p>
          </div>
          <Link
            href="/funktioner"
            className="px-5 py-2.5 bg-white/10 text-white border border-white/20 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors"
          >
            Se funktioner
          </Link>
        </div>
      </div>

      {/* Related pages */}
      <div className="mt-10 pt-8 border-t border-slate-100">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Utforska mer</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { href: "/funktioner", label: "Appens funktioner", desc: "Allt som ingår i Svar Direkt" },
            { href: "/paket", label: "Paket och tillägg", desc: "Utöka med fler mallar och fraser" },
            { href: "/pdf-guider", label: "PDF-guider", desc: "Guider om inkasso, Kronofogden och mer" },
            { href: "/mallar", label: "Jobbansökningsmallar", desc: "Gratis mallar för jobbsökare" },
            { href: "/blogg", label: "Blogg", desc: "Artiklar om myndigheter och kommunikation" },
            { href: "/kontakt", label: "Kontakt", desc: "Frågor eller feedback? Hör av dig" },
          ].map(item => (
            <Link key={item.href} href={item.href} className="flex flex-col gap-0.5 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-primary/30 hover:bg-white transition-colors group">
              <span className="text-sm font-medium text-slate-800 group-hover:text-primary transition-colors">{item.label}</span>
              <span className="text-xs text-slate-400">{item.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
