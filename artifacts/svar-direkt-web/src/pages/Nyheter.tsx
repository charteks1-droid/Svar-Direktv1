import { useEffect, useState } from "react";

const API_BASE = import.meta.env.PROD
  ? "https://antiquewhite-lapwing-486017.hostingersite.com"
  : "";

type NewsItem = {
  id: number;
  date: string;
  source: string;
  category: string;
  title: string;
  summary: string;
  url: string;
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

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const months = ["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function timeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days === 0) return "Idag";
  if (days === 1) return "Igår";
  if (days < 7) return `${days} dagar sedan`;
  if (days < 30) return `${Math.floor(days / 7)} veckor sedan`;
  if (days < 365) return `${Math.floor(days / 30)} månader sedan`;
  return `${Math.floor(days / 365)} år sedan`;
}

export default function Nyheter() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    const params = filterCat ? `?category=${filterCat}` : "";
    setLoading(true);
    fetch(`${API_BASE}/api/tools/news${params}`)
      .then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then((data) => {
        setItems(data.items || []);
        setLastUpdated(data.last_updated || "");
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [filterCat]);

  const cats = Array.from(new Set(items.map((x) => x.category)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="text-center mb-8">
          <div className="inline-block text-5xl mb-4">📢</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Senaste lagändringar
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
            Håll dig uppdaterad om regelförändringar hos Skatteverket, Försäkringskassan,
            Migrationsverket och andra myndigheter.
          </p>
          {lastUpdated && (
            <p className="text-xs text-slate-400 mt-3">
              Senast uppdaterad: {new Date(lastUpdated).toLocaleString("sv-SE")}
            </p>
          )}
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => setFilterCat("")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !filterCat ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Alla myndigheter
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

        {loading && <div className="text-center text-slate-400 py-12">Laddar nyheter...</div>}

        {/* News list */}
        <div className="space-y-4">
          {items.map((item) => {
            const info = CAT_INFO[item.category] || { name: item.source, color: "#64748b", icon: "📌" };
            return (
              <article
                key={item.id}
                className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 hover:shadow-lg transition-shadow"
                style={{ borderLeftWidth: 4, borderLeftColor: info.color }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: info.color + "20", color: info.color }}
                  >
                    {info.icon} {info.name}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">{formatDate(item.date)}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">{timeAgo(item.date)}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 leading-snug">
                  {item.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-3">
                  {item.summary}
                </p>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Läs mer på {info.name}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                )}
              </article>
            );
          })}
        </div>

        {!loading && items.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-slate-500">Inga nyheter i denna kategori just nu.</p>
          </div>
        )}

        <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-5 text-center">
          <p className="text-sm text-blue-900">
            🔔 <strong>Få nyheter direkt i mailen.</strong> Prenumerera på vårt veckobrev så missar du aldrig en viktig regelförändring.
          </p>
        </div>
      </div>
    </div>
  );
}
