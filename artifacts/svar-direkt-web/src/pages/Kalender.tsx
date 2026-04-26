import { useEffect, useState } from "react";

const API_BASE = import.meta.env.PROD
  ? "https://antiquewhite-lapwing-486017.hostingersite.com"
  : "";

type Item = {
  date: string;
  title: string;
  category: string;
  desc: string;
};

const CAT_INFO: Record<string, { name: string; color: string; icon: string }> = {
  skatteverket: { name: "Skatteverket", color: "#0a7ea4", icon: "📋" },
  forsakringskassan: { name: "Försäkringskassan", color: "#0984e3", icon: "💙" },
  migrationsverket: { name: "Migrationsverket", color: "#6c5ce7", icon: "🛂" },
  kronofogden: { name: "Kronofogden", color: "#dc2626", icon: "⚖️" },
  arbetsformedlingen: { name: "Arbetsförmedlingen", color: "#d97706", icon: "💼" },
  pensionsmyndigheten: { name: "Pensionsmyndigheten", color: "#059669", icon: "👴" },
  socialtjansten: { name: "Socialtjänsten", color: "#0891b2", icon: "🏛️" },
  csn: { name: "CSN", color: "#7c3aed", icon: "🎓" },
};

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const months = ["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function CategoryBadge({ cat }: { cat: string }) {
  const info = CAT_INFO[cat] || { name: cat, color: "#64748b", icon: "📌" };
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
      style={{ backgroundColor: info.color + "20", color: info.color }}
    >
      <span>{info.icon}</span>
      <span>{info.name}</span>
    </span>
  );
}

export default function Kalender() {
  const [upcoming, setUpcoming] = useState<Item[]>([]);
  const [past, setPast] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filterCat, setFilterCat] = useState<string>("");

  useEffect(() => {
    fetch(`${API_BASE}/api/tools/calendar`)
      .then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then((data) => {
        setUpcoming(data.upcoming || []);
        setPast(data.past || []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filterItems = (items: Item[]) =>
    filterCat ? items.filter((i) => i.category === filterCat) : items;

  const cats = Array.from(new Set([...upcoming, ...past].map((x) => x.category)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="text-center mb-10">
          <div className="inline-block text-5xl mb-4">📅</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Myndighetskalender 2026
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
            Alla viktiga datum för deklaration, kvarskatt, A-kassa, föräldrapenning och mer.
            Missa aldrig en deadline igen.
          </p>
        </div>

        {/* Filter */}
        {cats.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <button
              onClick={() => setFilterCat("")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !filterCat ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Alla
            </button>
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setFilterCat(c)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filterCat === c ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {CAT_INFO[c]?.icon} {CAT_INFO[c]?.name || c}
              </button>
            ))}
          </div>
        )}

        {loading && <div className="text-center text-slate-400 py-12">Laddar kalender...</div>}

        {!loading && (
          <>
            {/* Kommande */}
            <section className="mb-12">
              <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Kommande deadlines
              </h2>
              <div className="space-y-3">
                {filterItems(upcoming).map((item, i) => {
                  const days = daysUntil(item.date);
                  const isUrgent = days <= 7;
                  const isSoon = days <= 30;
                  return (
                    <div
                      key={i}
                      className={`bg-white rounded-2xl border p-5 hover:shadow-lg transition-shadow ${
                        isUrgent ? "border-red-200 ring-2 ring-red-100" :
                        isSoon ? "border-amber-200" : "border-slate-100"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <CategoryBadge cat={item.category} />
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                              isUrgent ? "bg-red-100 text-red-700" :
                              isSoon ? "bg-amber-100 text-amber-700" :
                              "bg-slate-100 text-slate-600"
                            }`}>
                              {days === 0 ? "IDAG" : days === 1 ? "Imorgon" : `om ${days} dagar`}
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug">
                            {item.title}
                          </h3>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-2xl font-bold text-slate-900">
                            {new Date(item.date).getDate()}
                          </div>
                          <div className="text-xs text-slate-500 uppercase tracking-wide">
                            {formatDate(item.date).split(" ").slice(1).join(" ")}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
                {filterItems(upcoming).length === 0 && (
                  <div className="text-center text-slate-400 py-8 bg-white rounded-2xl border border-slate-100">
                    Inga kommande deadlines i denna kategori.
                  </div>
                )}
              </div>
            </section>

            {/* Tidigare */}
            {filterItems(past).length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-slate-500 mb-5">Tidigare deadlines</h2>
                <div className="space-y-2">
                  {filterItems(past).map((item, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl border border-slate-100 p-4 opacity-70">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <CategoryBadge cat={item.category} />
                          </div>
                          <h3 className="font-semibold text-slate-700 text-sm truncate">{item.title}</h3>
                        </div>
                        <div className="text-xs text-slate-400 whitespace-nowrap">
                          {formatDate(item.date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-5 text-center">
          <p className="text-sm text-blue-900">
            💡 <strong>Vill du få påminnelser via mail?</strong> Prenumerera på vårt nyhetsbrev så får du tips innan varje deadline.
          </p>
        </div>
      </div>
    </div>
  );
}
