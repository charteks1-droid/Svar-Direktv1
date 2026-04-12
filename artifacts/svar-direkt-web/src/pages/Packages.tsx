const smsPackages = [
  {
    id: "snabba-svar-arbete",
    name: "Snabba svar – Arbete",
    desc: "67 förberedda fraser och svar för arbetslivet. Perfekt för jobbsökare, anställda och frilansare.",
    includes: [
      "Svar på jobbannonser",
      "Avboka möten",
      "Tacka nej artigt",
      "Fråga om lön",
      "Sjukanmälan",
      "Kommunikation med chef",
    ],
    price: "19 kr",
    badge: "Populär",
    badgeColor: "#0a7ea4",
    downloadFile: "snabba-svar-arbete.json",
  },
  {
    id: "snabba-svar-relationer",
    name: "Snabba svar – Relationer",
    desc: "61 färdiga fraser för dejting, relationer, konflikter och gränssättning i privatlivet.",
    includes: [
      "Dating och romantiska situationer",
      "Kommunikation med partner",
      "Konflikter och missförstånd",
      "Avsluta kontakt",
      "Ursäkter",
      "Sätta gränser",
    ],
    price: "19 kr",
    badge: "Ny",
    badgeColor: "#00b894",
    downloadFile: "snabba-svar-relationer.json",
  },
];

function PriceTag({ price }: { price: string }) {
  return (
    <div className="text-3xl font-bold text-slate-900">
      {price}
      <span className="text-sm font-normal text-slate-400 ml-1">engångspris</span>
    </div>
  );
}

const DOWNLOAD_BASE = "/api/download/";

function PackageCard({
  pkg,
  highlight = false,
}: {
  pkg: (typeof smsPackages)[0];
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl border p-6 flex flex-col ${
        highlight
          ? "border-primary bg-primary/5 shadow-md"
          : "border-slate-100 bg-white shadow-sm"
      }`}
    >
      {pkg.badge && (
        <div
          className="absolute -top-3 left-5 text-white text-xs font-semibold px-3 py-1 rounded-full"
          style={{ backgroundColor: pkg.badgeColor }}
        >
          {pkg.badge}
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 mb-1">{pkg.name}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{pkg.desc}</p>
      </div>

      <div className="mb-5">
        <PriceTag price={pkg.price} />
      </div>

      <ul className="space-y-2 mb-6 flex-1">
        {pkg.includes.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-primary flex-shrink-0">
              <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {item}
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <a
          href={`${DOWNLOAD_BASE}${pkg.downloadFile}`}
          download={pkg.downloadFile}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium text-center transition-colors flex items-center justify-center gap-1.5 ${
            highlight
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v7M4.5 7l2.5 2.5L9.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Ladda ner
        </a>
      </div>
    </div>
  );
}

export default function Packages() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          Paket
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
          Utöka appen med smarta paket
        </h1>
        <p className="text-slate-500 text-base max-w-xl leading-relaxed">
          Gratisappen innehåller redan mallar för fyra myndigheter. Med våra paket får du ännu fler färdiga svar och fraser – för arbete, relationer och mer.
        </p>
      </div>

      {/* Hur det fungerar */}
      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 mb-10 flex gap-4 items-start">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary mt-0.5">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M9 6v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <div className="font-semibold text-slate-900 text-sm mb-1">Hur fungerar paket?</div>
          <p className="text-slate-500 text-xs leading-relaxed">
            Du köper ett paket som en JSON-modul och importerar det direkt i appen via "Lägg till modul". Paketet läggs till i appen och du har direkt tillgång till alla fraser och mallar. Engångspris – inga prenumerationer.
          </p>
        </div>
      </div>

      {/* Snabba svar-paket */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Snabba svar-paket</h2>
        <p className="text-slate-500 text-sm mb-6">
          Förberedda svar och fraser för vardagliga situationer. Importeras direkt i appen.
        </p>
        <div className="grid sm:grid-cols-2 gap-5">
          {smsPackages.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} highlight={i === 0} />
          ))}
        </div>
      </div>

      {/* Kommande paket */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Fler paket på väg</h2>
        <p className="text-slate-500 text-sm mb-6">
          Vi arbetar på fler kategorier och moduler.
        </p>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-center text-slate-400 min-h-[160px]">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-3 opacity-40">
              <rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M16 10v12M10 16h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div className="text-sm font-medium text-slate-400">Snabba svar – Myndigheter</div>
            <div className="text-xs text-slate-300 mt-1">Kommer snart</div>
          </div>
          <div className="rounded-2xl border border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-center text-slate-400 min-h-[160px]">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-3 opacity-40">
              <rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M16 10v12M10 16h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div className="text-sm font-medium text-slate-400">Snabba svar – Hälsa</div>
            <div className="text-xs text-slate-300 mt-1">Kommer snart</div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
        <h3 className="font-bold text-slate-900 mb-4">Vanliga frågor</h3>
        <div className="space-y-4">
          {[
            {
              q: "Behöver jag en prenumeration?",
              a: "Nej. Alla paket köps till ett engångspris och finns kvar i appen tills du väljer att ta bort dem.",
            },
            {
              q: "Hur installerar jag ett paket?",
              a: "Du köper paketet, laddar ner JSON-filen och importerar den direkt i appen via \"Lägg till modul\"-funktionen.",
            },
            {
              q: "Fungerar paketen offline?",
              a: "Ja. När paketet väl är installerat i appen fungerar det helt offline – ingen internetanslutning behövs.",
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
