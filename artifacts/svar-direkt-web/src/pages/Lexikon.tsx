import { useEffect, useState } from "react";

const API_BASE = import.meta.env.PROD
  ? "https://antiquewhite-lapwing-486017.hostingersite.com"
  : "";

type Item = {
  slug: string;
  term: string;
  category: string;
  short: string;
  long?: string;
};

const CAT_INFO: Record<string, { name: string; color: string; icon: string }> = {
  skatteverket: { name: "Skatteverket", color: "#0a7ea4", icon: "📋" },
  forsakringskassan: { name: "Försäkringskassan", color: "#0984e3", icon: "💙" },
  migrationsverket: { name: "Migrationsverket", color: "#6c5ce7", icon: "🛂" },
  kronofogden: { name: "Kronofogden", color: "#dc2626", icon: "⚖️" },
  arbetsformedlingen: { name: "Arbetsförmedlingen", color: "#d97706", icon: "💼" },
  pensionsmyndigheten: { name: "Pensionsmyndigheten", color: "#059669", icon: "👴" },
  socialtjansten: { name: "Socialtjänsten", color: "#0891b2", icon: "🏛️" },
};

export default function Lexikon() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<string>("");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, Item>>({});

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (filterCat) params.set("category", filterCat);
    setLoading(true);
    fetch(`${API_BASE}/api/tools/lexikon?${params.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then((data) => setItems(data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [search, filterCat]);

  async function toggleOpen(slug: string) {
    if (openSlug === slug) {
      setOpenSlug(null);
      return;
    }
    setOpenSlug(slug);
    if (!details[slug]) {
      const r = await fetch(`${API_BASE}/api/tools/lexikon/${slug}`);
      if (r.ok) {
        const data = await r.json();
        setDetails((p) => ({ ...p, [slug]: data }));
      }
    }
  }

  const cats = Array.from(new Set(items.map((x) => x.category)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="text-center mb-8">
          <div className="inline-block text-5xl mb-4">📖</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Myndighets-lexikon
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
            Förstå svenska byråkratiska termer på ett enkelt sätt. Personnummer, SGI, förbehållsbelopp,
            preskription — vad betyder det egentligen?
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Sök term... (t.ex. 'sjukpenning', 'utmätning')"
              className="w-full px-5 py-3.5 pl-12 rounded-2xl border border-slate-200 bg-white text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2"/>
              <path d="M14 14l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Category filter */}
        {!loading && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <button
              onClick={() => setFilterCat("")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !filterCat ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Alla kategorier
            </button>
            {Object.entries(CAT_INFO).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setFilterCat(filterCat === key ? "" : key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filterCat === key ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {info.icon} {info.name}
              </button>
            ))}
          </div>
        )}

        <div className="text-center text-sm text-slate-500 mb-6">
          {loading ? "Laddar..." : `${items.length} termer hittade`}
        </div>

        {/* Items list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item) => {
            const info = CAT_INFO[item.category] || { name: item.category, color: "#64748b", icon: "📌" };
            const isOpen = openSlug === item.slug;
            const detail = details[item.slug];
            return (
              <div key={item.slug} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                <button
                  onClick={() => toggleOpen(item.slug)}
                  className="w-full text-left p-5 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-slate-900 text-base">{item.term}</h3>
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap"
                      style={{ backgroundColor: info.color + "20", color: info.color }}
                    >
                      {info.icon} {info.name}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.short}</p>
                  {detail && isOpen && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-sm text-slate-700 leading-relaxed">{detail.long}</p>
                    </div>
                  )}
                  <div className="mt-3 text-xs font-medium text-primary">
                    {isOpen ? "↑ Dölj detaljer" : "↓ Läs mer"}
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {!loading && items.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-slate-500">Inga termer hittade. Pröva en annan sökning.</p>
          </div>
        )}
      </div>
    </div>
  );
}
