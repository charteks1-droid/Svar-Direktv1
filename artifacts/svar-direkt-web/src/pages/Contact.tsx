export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          Kontakt
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
          Hör av dig
        </h1>
        <p className="text-slate-500 text-base leading-relaxed max-w-xl">
          Har du frågor om appen, paketen eller PDF-guiderna? Vi svarar så snart vi kan.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Kontaktinformation */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M2 7l7 4 7-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="font-semibold text-slate-900 text-sm mb-1">E-post</div>
            <a href="mailto:info@svardirekt.site" className="text-primary text-sm hover:underline">
              info@svardirekt.site
            </a>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M9 6v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="font-semibold text-slate-900 text-sm mb-1">Svarstid</div>
            <div className="text-slate-500 text-sm">
              Vi svarar normalt inom 1–2 arbetsdagar.
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6 9h6M9 6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="font-semibold text-slate-900 text-sm mb-1">Om appen</div>
            <div className="text-slate-500 text-sm">
              Support, felrapporter och feedback välkomnas.
            </div>
          </div>
        </div>

        {/* Kontaktformulär */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-900 text-lg mb-5">Skicka ett meddelande</h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Namn
                  </label>
                  <input
                    type="text"
                    placeholder="Ditt namn"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    E-post
                  </label>
                  <input
                    type="email"
                    placeholder="din@email.se"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Ämne
                </label>
                <select className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors bg-white">
                  <option value="">Välj ämne...</option>
                  <option value="app">Fråga om appen</option>
                  <option value="paket">Fråga om paket</option>
                  <option value="pdf">Fråga om PDF-guider</option>
                  <option value="teknisk">Teknisk support</option>
                  <option value="ovrig">Övrig fråga</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Meddelande
                </label>
                <textarea
                  rows={5}
                  placeholder="Beskriv din fråga eller ditt ärende..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors resize-none"
                />
              </div>

              <div className="flex items-center gap-3 justify-between">
                <p className="text-xs text-slate-400">
                  Formuläret är ett placeholder – e-post kopplas till i nästa steg.
                </p>
                <button
                  type="button"
                  className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors flex-shrink-0"
                >
                  Skicka
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Länkblock */}
      <div className="mt-10 grid sm:grid-cols-3 gap-4">
        {[
          { label: "Integritetspolicy", href: "#", desc: "Hur vi hanterar dina uppgifter" },
          { label: "Användarvillkor", href: "#", desc: "Regler för användning av appen" },
          { label: "Cookies", href: "#", desc: "Information om cookies på sidan" },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="rounded-2xl border border-slate-100 bg-white p-4 hover:shadow-sm transition-shadow group"
          >
            <div className="font-medium text-slate-900 text-sm group-hover:text-primary transition-colors mb-0.5">
              {item.label}
            </div>
            <div className="text-xs text-slate-400">{item.desc}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
