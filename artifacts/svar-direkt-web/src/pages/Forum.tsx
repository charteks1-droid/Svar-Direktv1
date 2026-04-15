import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

const API = `${import.meta.env.BASE_URL}api/forum`;

const CATEGORIES = [
  { id: "kronofogden",      name: "Kronofogden",       icon: "⚖️", desc: "Skulder, utmätning, betalningsanmärkningar", color: "#dc2626" },
  { id: "skatteverket",     name: "Skatteverket",      icon: "📋", desc: "Deklaration, folkbokföring, personnummer",    color: "#0a7ea4" },
  { id: "forsakringskassan",name: "Försäkringskassan", icon: "🏥", desc: "Sjukpenning, föräldrapenning, bidrag",        color: "#059669" },
  { id: "migrationsverket", name: "Migrationsverket",  icon: "🌐", desc: "Uppehållstillstånd, medborgarskap, asyl",    color: "#7c3aed" },
  { id: "arbetsformedlingen",name:"Arbetsförmedlingen",icon: "💼", desc: "A-kassa, aktivitetsrapport, åtgärder",       color: "#d97706" },
];

function getToken(): string {
  let t = localStorage.getItem("forum_token");
  if (!t) {
    t = crypto.randomUUID();
    localStorage.setItem("forum_token", t);
  }
  return t;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 2) return "precis nu";
  if (m < 60) return `${m} min sedan`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} tim sedan`;
  const d = Math.floor(h / 24);
  return `${d} dag${d > 1 ? "ar" : ""} sedan`;
}

interface Thread {
  id: number;
  category: string;
  title: string;
  body_preview: string;
  is_solved: boolean;
  reply_count: number;
  created_at: string;
  display_name: string;
}

interface CatStats {
  id: string;
  name: string;
  icon: string;
  desc: string;
  color: string;
  threads: number;
  replies: number;
  unanswered: number;
}

interface NewThreadForm {
  category: string;
  title: string;
  body: string;
}

export default function Forum({ categoryFilter }: { categoryFilter?: string } = {}) {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"categories" | "recent">(categoryFilter ? "recent" : "categories");
  const [categories, setCategories] = useState<CatStats[]>([]);
  const [recent, setRecent] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewThreadForm>({ category: categoryFilter ?? "", title: "", body: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const threadsUrl = categoryFilter
      ? `${API}/threads?category=${categoryFilter}`
      : `${API}/threads`;
    Promise.all([
      fetch(`${API}/categories`).then(r => r.json()),
      fetch(threadsUrl).then(r => r.json()),
    ]).then(([cats, threads]) => {
      if (Array.isArray(cats)) setCategories(cats);
      if (Array.isArray(threads)) setRecent(categoryFilter ? threads : threads.slice(0, 10));
    }).finally(() => setLoading(false));
  }, [categoryFilter]);

  async function submitThread() {
    setError("");
    if (!form.category) { setError("Välj en kategori"); return; }
    if (form.title.trim().length < 10) { setError("Titeln måste vara minst 10 tecken"); return; }
    if (form.body.trim().length < 20) { setError("Frågan måste vara minst 20 tecken"); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/threads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, author_token: getToken() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Något gick fel"); return; }
      setLocation(`/forum/trad/${data.id}`);
    } catch {
      setError("Nätverksfel – försök igen");
    } finally {
      setSubmitting(false);
    }
  }

  const catMap = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ background: "#0d1b2e" }} className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#0a7ea4" }}>
                Svar Direkt
              </p>
              <h1 className="text-2xl font-bold text-white mb-1">Frågor & Svar</h1>
              <p className="text-sm text-slate-400">
                Ställ din fråga anonymt – få svar från andra som var med om samma sak
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex-shrink-0 text-white text-sm font-bold px-4 py-2 rounded-lg"
              style={{ background: "#0a7ea4" }}
            >
              + Ställ en fråga
            </button>
          </div>

          {!loading && (
            <div className="flex gap-6 mt-5">
              {[
                { val: categories.reduce((a, c) => a + c.threads, 0), label: "frågor" },
                { val: categories.reduce((a, c) => a + c.replies, 0), label: "svar" },
              ].map((s, i) => (
                <div key={i}>
                  <span className="text-lg font-bold" style={{ color: "#0a7ea4" }}>{s.val} </span>
                  <span className="text-sm text-slate-400">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-0 border-b border-gray-200 mb-5">
          {(["categories", "recent"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? "border-teal-600 text-teal-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "categories" ? "Kategorier" : "Senaste frågorna"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Laddar...</div>
        ) : activeTab === "categories" ? (
          <div className="flex flex-col gap-3">
            {categories.map(cat => {
              const meta = catMap[cat.id] ?? cat;
              return (
                <Link key={cat.id} href={`/forum/kategori/${cat.id}`}>
                  <div
                    className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    style={{ borderLeft: `4px solid ${meta.color}` }}
                  >
                    <div className="text-2xl">{meta.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800">{cat.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{meta.desc}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-base font-bold text-slate-800">{cat.threads}</div>
                      <div className="text-xs text-gray-400">frågor</div>
                      {cat.unanswered > 0 && (
                        <div className="text-xs font-semibold mt-1" style={{ color: "#dc2626" }}>
                          {cat.unanswered} obesvarade
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recent.length === 0 && (
              <div className="text-center py-12 text-gray-400">Inga frågor än. Var först!</div>
            )}
            {recent.map(q => {
              const meta = catMap[q.category];
              return (
                <Link key={q.id} href={`/forum/trad/${q.id}`}>
                  <div
                    className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    style={{ borderLeft: `4px solid ${meta?.color ?? "#94a3b8"}` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded"
                            style={{ color: meta?.color, background: `${meta?.color}18` }}
                          >
                            {meta?.name ?? q.category}
                          </span>
                          {q.is_solved && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-100 text-green-700">
                              ✓ Löst
                            </span>
                          )}
                        </div>
                        <div className="font-semibold text-slate-800 text-sm leading-snug">{q.title}</div>
                        <div className="text-xs text-gray-400 mt-1.5">{q.display_name} · {timeAgo(q.created_at)}</div>
                      </div>
                      <div className="text-center flex-shrink-0">
                        <div className="text-lg font-bold" style={{ color: "#0a7ea4" }}>{q.reply_count}</div>
                        <div className="text-xs text-gray-400">svar</div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800">Ställ din fråga</h2>
              <button onClick={() => { setShowForm(false); setError(""); }} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Välj en kategori...</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Rubrik</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Vad handlar din fråga om?"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Din fråga</label>
              <textarea
                value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                placeholder="Beskriv din situation och vad du behöver hjälp med..."
                rows={5}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>

            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-gray-400">🔒 Du är helt anonym. Inget namn eller email sparas.</p>
              <button
                onClick={submitThread}
                disabled={submitting}
                className="flex-shrink-0 text-white text-sm font-bold px-5 py-2 rounded-lg disabled:opacity-50"
                style={{ background: "#0a7ea4" }}
              >
                {submitting ? "Skickar..." : "Skicka fråga"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
