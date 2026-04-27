import { useEffect, useState } from "react";

const API_BASE = import.meta.env.PROD
  ? "https://antiquewhite-lapwing-486017.hostingersite.com"
  : "";

type Stats = {
  forum_threads: number;
  forum_replies: number;
  forum_solved: number;
  templates_count: number;
  online_now: number;
  page_views: number;
  news_count: number;
};

export function StatsBar() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const load = () =>
      fetch(`${API_BASE}/api/tools/stats`)
        .then((r) => {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .then(setStats)
        .catch(() => {});

    load();
    // Track page view (fire and forget)
    fetch(`${API_BASE}/api/tools/stats/view`, { method: "POST" }).catch(() => {});

    // Refresh stats every 30s for "online now" effect
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  const items = [
    { label: "Online nu", value: stats.online_now, icon: "🟢", highlight: true },
    { label: "Mallar", value: stats.templates_count, icon: "📄" },
    { label: "Forumtrådar", value: stats.forum_threads, icon: "💬" },
    { label: "Svar i forum", value: stats.forum_replies, icon: "✉️" },
    { label: "Sidvisningar", value: stats.page_views, icon: "👁️" },
  ];

  return (
    <div className="bg-white border-y border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          {items.map((it) => (
            <div key={it.label} className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                {it.highlight && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
                <span className="text-base">{it.icon}</span>
                <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                  {it.value.toLocaleString("sv-SE")}
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 uppercase tracking-wide">
                {it.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
