import { useState } from "react";
import { Link } from "wouter";

const DISCLAIMER =
  "Denna tjänst är inte juridisk rådgivning. Vi hjälper till att formulera meddelanden baserat på din situation. Användaren ansvarar själv för hur svaret används.";

const AUTHORITIES = [
  "Kronofogden",
  "Skatteverket",
  "Försäkringskassan",
  "Migrationsverket",
  "Arbetsförmedlingen",
  "Kommun",
  "Inkasso",
  "Annat",
];

export default function Tjanst() {
  const [form, setForm] = useState({
    fornamn: "",
    efternamn: "",
    epost: "",
    myndighet: "",
    beskrivning: "",
  });
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.epost || !form.beskrivning) return;

    const subject = encodeURIComponent(
      `Nytt ärende: ${form.myndighet || "Myndighet ej vald"} – ${form.fornamn} ${form.efternamn}`.trim()
    );
    const body = encodeURIComponent(
      `Förnamn:    ${form.fornamn || "–"}\n` +
      `Efternamn:  ${form.efternamn || "–"}\n` +
      `E-post:     ${form.epost}\n` +
      `Myndighet:  ${form.myndighet || "–"}\n\n` +
      `Beskrivning:\n${form.beskrivning}\n\n` +
      `---\nFörsta svaret är gratis. Fortsättning: 99 kr/svar.`
    );

    window.location.href = `mailto:info@svardirekt.se?subject=${subject}&body=${body}`;
    setStatus("success");
  };

  return (
    <>
      <head>
        <title>Personligt myndighetssvar – 99 kr | Svar Direkt</title>
        <meta
          name="description"
          content="Beskriv din situation och få hjälp med att formulera ett tydligt och korrekt svar till svensk myndighet. Första svaret är gratis."
        />
        <meta
          name="keywords"
          content="hjälp svar myndighet, formulera brev Kronofogden, svar Försäkringskassan, personlig hjälp myndighet Sverige, skriv brev myndighet hjälp"
        />
      </head>

      {/* Hero */}
      <section className="bg-gradient-to-b from-sky-50 to-white border-b border-slate-100 py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            Personlig hjälp
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
            Färdigt svar till myndighet – personlig hjälp
          </h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
            Beskriv din situation och få hjälp med att formulera ett tydligt och korrekt svar till
            svensk myndighet.
          </p>
          <div className="mt-4 inline-block bg-green-50 border border-green-200 rounded-xl px-5 py-2.5 text-sm text-green-800 font-semibold">
            ✅ Första svaret är gratis &nbsp;·&nbsp; Därefter 99 kr per svar
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-slate-900 mb-5 text-center">Så fungerar det</h2>
          <ol className="space-y-4">
            {[
              { n: "1", t: "Beskriv ditt problem", d: "Fyll i formuläret nedan med din situation och vilken myndighet det gäller." },
              { n: "2", t: "Vi går igenom informationen", d: "Inom 24 timmar läser vi igenom ditt ärende och formulerar ett svar." },
              { n: "3", t: "Du får ett färdigt svar", d: "Du får ett klart meddelande på din e-post som du kan skicka direkt." },
            ].map((s) => (
              <li key={s.n} className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center">
                  {s.n}
                </span>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{s.t}</p>
                  <p className="text-slate-500 text-sm">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-sm text-slate-600 font-medium mb-2">Tjänsten passar för:</p>
            <div className="flex flex-wrap gap-2">
              {["Kronofogden", "Skatteverket", "Försäkringskassan", "Inkasso", "Migrationsverket", "Arbetsförmedlingen", "Andra myndigheter"].map((a) => (
                <span key={a} className="bg-white border border-slate-200 text-slate-700 text-xs px-3 py-1 rounded-full">{a}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing note */}
      <div className="bg-amber-50 border-y border-amber-100 py-3 px-4">
        <p className="text-center text-sm text-amber-800 font-medium">
          💡 <strong>Första svaret är gratis.</strong> Därefter kostar varje nytt svar 99 kr per meddelande.
        </p>
      </div>

      {/* Form */}
      <section className="py-10 px-4 bg-white" id="formular">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Beskriv din situation</h2>

          {status === "success" ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M5 14l6 6L23 8" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-green-800 mb-2">Tack! Ditt meddelande har skickats.</h3>
              <p className="text-green-700 text-sm">Du får svar inom 24 timmar på din e-post.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Förnamn</label>
                  <input
                    type="text"
                    name="fornamn"
                    value={form.fornamn}
                    onChange={handleChange}
                    placeholder="Anna"
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Efternamn</label>
                  <input
                    type="text"
                    name="efternamn"
                    value={form.efternamn}
                    onChange={handleChange}
                    placeholder="Lindgren"
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  E-post <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="epost"
                  value={form.epost}
                  onChange={handleChange}
                  required
                  placeholder="din@email.se"
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Myndighet</label>
                <select
                  name="myndighet"
                  value={form.myndighet}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
                >
                  <option value="">Välj myndighet…</option>
                  {AUTHORITIES.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Beskriv din situation <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="beskrivning"
                  value={form.beskrivning}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Beskriv vad som hänt, vilket brev du fått, och vad du behöver hjälp med…"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-base hover:bg-primary/90 transition-colors shadow-md"
              >
                Skicka
              </button>

              <p className="text-xs text-slate-400 text-center">
                Dina uppgifter skickas säkert och delas inte med tredje part.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Price details */}
      <section className="bg-slate-50 border-t border-slate-200 py-10 px-4">
        <div className="max-w-xl mx-auto">
          <h2 className="text-lg font-bold text-slate-900 mb-4 text-center">Pris och leverans</h2>
          <div className="space-y-3">
            {[
              { label: "Första svaret", value: "Gratis", color: "text-green-700 font-bold" },
              { label: "Ytterligare svar", value: "99 kr per meddelande", color: "text-slate-700" },
              { label: "Svarstid", value: "Inom 24 timmar", color: "text-slate-700" },
              { label: "Leverans", value: "Via e-post", color: "text-slate-700" },
            ].map((r) => (
              <div key={r.label} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
                <span className="text-sm text-slate-600">{r.label}</span>
                <span className={`text-sm ${r.color}`}>{r.value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">
            Efter ditt första svar inkluderar vi en betalningslänk (Payhip) i e-posten för eventuella fortsatta svar.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-white border-t border-slate-100 py-5 px-4">
        <p className="max-w-xl mx-auto text-xs text-slate-400 text-center leading-relaxed">
          ⚠️ {DISCLAIMER}
        </p>
      </div>

      {/* Back link */}
      <div className="py-6 px-4 text-center">
        <Link href="/" className="text-sm text-primary underline hover:no-underline">
          ← Tillbaka till startsidan
        </Link>
      </div>
    </>
  );
}
