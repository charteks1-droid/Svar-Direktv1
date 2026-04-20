import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";

// ── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: string; name: string; icon: string; desc: string; color: string;
  threads: number; replies: number; unanswered: number;
}

interface Thread {
  id: number; category: string; title: string; body: string;
  body_preview?: string; is_solved: boolean; reply_count: number;
  display_name: string; created_at: string; is_hidden?: boolean;
}

interface Reply {
  id: number; thread_id: number; body: string; display_name: string;
  helpful_count: number; is_best_answer: boolean;
  created_at: string; is_hidden?: boolean;
}

type View =
  | { type: "categories" }
  | { type: "threads"; categoryId: string }
  | { type: "thread"; threadId: number }
  | { type: "new-thread"; categoryId: string }
  | { type: "admin" };

// ── Helpers ──────────────────────────────────────────────────────────────────

function getToken(): string {
  let t = localStorage.getItem("forum_token");
  if (!t) { t = crypto.randomUUID(); localStorage.setItem("forum_token", t); }
  return t;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just nu";
  if (m < 60) return `${m} min sedan`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} tim sedan`;
  return `${Math.floor(h / 24)} dag${Math.floor(h / 24) > 1 ? "ar" : ""} sedan`;
}

const API = (import.meta.env.VITE_API_BASE_URL ?? "") + "/api/forum";
const API_UNAVAILABLE = "Forumet kräver en serveranslutning som inte är tillgänglig på den här webbplatsen. Besök svardirekt.site och prova igen om en stund, eller skicka din fråga direkt till info@svardirekt.site.";

async function apiFetch(path: string, opts?: RequestInit) {
  const res = await fetch(API + path, opts);
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) throw new Error(API_UNAVAILABLE);
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || "Serverfel"); }
  return res.json();
}

const CAT_META: Record<string, { bg: string; border: string; badge: string }> = {
  kronofogden:    { bg: "bg-red-50",     border: "border-red-200",    badge: "bg-red-100 text-red-700" },
  skatteverket:   { bg: "bg-blue-50",    border: "border-blue-200",   badge: "bg-blue-100 text-blue-700" },
  forsakringskassan: { bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700" },
  migrationsverket: { bg: "bg-purple-50", border: "border-purple-200", badge: "bg-purple-100 text-purple-700" },
  arbetsformedlingen: { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700" },
};

// ── Sub-components ───────────────────────────────────────────────────────────

function Spinner() {
  return <div className="flex justify-center py-12"><div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
}

function ErrorMsg({ msg }: { msg: string }) {
  const isOffline = msg.includes("serveranslutning") || msg.includes("info@svardirekt");
  if (isOffline) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 my-4">
        <p className="text-sm font-semibold text-amber-800 mb-1">Forumet är inte tillgängligt just nu</p>
        <p className="text-sm text-amber-700 mb-2">Ställ din fråga direkt via e-post – vi svarar inom 24 timmar.</p>
        <a href="mailto:info@svardirekt.site" className="text-sm font-bold text-amber-900 underline hover:no-underline">
          info@svardirekt.site →
        </a>
      </div>
    );
  }
  return <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 my-3">{msg}</p>;
}

// ── Categories view ──────────────────────────────────────────────────────────

function CategoriesView({ onSelect }: { onSelect: (id: string) => void }) {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    apiFetch("/categories").then(setCats).catch(e => setErr(e.message)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const isOffline = err.includes("serveranslutning") || err.includes("info@svardirekt");

  return (
    <div>
      {err && <ErrorMsg msg={err} />}
      <div className="space-y-2">
        {(cats.length ? cats : Object.keys(CAT_META).map(id => ({ id, name: id, icon: "📋", desc: "", color: "#666", threads: 0, replies: 0, unanswered: 0 }))).map(cat => {
          const m = CAT_META[cat.id] ?? { bg: "bg-slate-50", border: "border-slate-200", badge: "bg-slate-100 text-slate-700" };
          return (
            <button key={cat.id} onClick={() => !isOffline && onSelect(cat.id)} disabled={isOffline}
              className={`w-full text-left p-4 rounded-2xl border ${m.bg} ${m.border} transition-all group flex items-start gap-3 ${isOffline ? "opacity-60 cursor-not-allowed" : "hover:shadow-md cursor-pointer"}`}>
              <span className="text-xl mt-0.5 flex-shrink-0">{cat.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 group-hover:text-primary transition-colors">{cat.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{cat.desc}</div>
                <div className="flex gap-3 mt-2 text-xs text-slate-400">
                  <span>{cat.threads} trådar</span>
                  <span>{cat.replies} svar</span>
                  {cat.unanswered > 0 && <span className={`${m.badge} px-2 py-0.5 rounded-full font-medium`}>{cat.unanswered} obesvarade</span>}
                </div>
              </div>
              <span className="text-slate-300 group-hover:text-primary transition-colors text-lg">›</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Thread list view ─────────────────────────────────────────────────────────

function ThreadsView({ categoryId, cats, onThread, onNew }: {
  categoryId: string; cats: Category[];
  onThread: (id: number) => void; onNew: () => void;
}) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const cat = cats.find(c => c.id === categoryId);
  const m = CAT_META[categoryId] ?? { bg: "bg-slate-50", border: "border-slate-200", badge: "bg-slate-100 text-slate-700" };

  useEffect(() => {
    setLoading(true);
    apiFetch(`/threads?category=${categoryId}`).then(setThreads).catch(e => setErr(e.message)).finally(() => setLoading(false));
  }, [categoryId]);

  if (loading) return <Spinner />;

  return (
    <div>
      {cat && (
        <div className={`flex items-center gap-3 p-4 rounded-2xl ${m.bg} border ${m.border} mb-4`}>
          <span className="text-2xl">{cat.icon}</span>
          <div>
            <div className="font-bold text-slate-900">{cat.name}</div>
            <div className="text-xs text-slate-500">{cat.desc}</div>
          </div>
          <button onClick={onNew}
            className="ml-auto bg-primary text-white text-xs px-4 py-2 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex-shrink-0">
            + Ny fråga
          </button>
        </div>
      )}
      {err && <ErrorMsg msg={err} />}
      {threads.length === 0 && !err && (
        <div className="text-center py-12 text-slate-400">
          <p className="mb-4">Inga frågor ännu. Ställ den första!</p>
          <button onClick={onNew} className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors">
            Ställ en fråga
          </button>
        </div>
      )}
      <div className="space-y-2">
        {threads.map(t => (
          <button key={t.id} onClick={() => onThread(t.id)}
            className="w-full text-left bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-all group">
            <div className="flex items-start gap-2 mb-1">
              {t.is_solved && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0 mt-0.5">✓ Löst</span>}
              <span className="font-medium text-slate-900 group-hover:text-primary transition-colors leading-snug">{t.title}</span>
            </div>
            {t.body_preview && <p className="text-xs text-slate-500 line-clamp-2 mt-1">{t.body_preview}</p>}
            <div className="flex gap-3 mt-2 text-xs text-slate-400">
              <span>{t.display_name}</span>
              <span>{timeAgo(t.created_at)}</span>
              <span className="ml-auto">{t.reply_count} svar</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Thread detail view ───────────────────────────────────────────────────────

function ThreadView({ threadId, onBack }: { threadId: number; onBack: () => void }) {
  const [thread, setThread] = useState<Thread & { replies: Reply[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);
  const [replyErr, setReplyErr] = useState("");
  const token = getToken();

  const load = useCallback(() => {
    apiFetch(`/threads/${threadId}`).then(setThread).catch(e => setErr(e.message)).finally(() => setLoading(false));
  }, [threadId]);

  useEffect(() => { load(); }, [load]);

  const submitReply = async () => {
    if (!replyBody.trim() || replyBody.length < 10) { setReplyErr("Svaret måste vara minst 10 tecken"); return; }
    setSending(true); setReplyErr("");
    try {
      await apiFetch(`/threads/${threadId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: replyBody, author_token: token }),
      });
      setReplyBody("");
      load();
    } catch (e: any) { setReplyErr(e.message); }
    finally { setSending(false); }
  };

  const toggleHelpful = async (replyId: number) => {
    try {
      await apiFetch(`/replies/${replyId}/helpful`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voter_token: token }),
      });
      load();
    } catch { /* ignore */ }
  };

  if (loading) return <Spinner />;
  if (err) return <ErrorMsg msg={err} />;
  if (!thread) return null;

  return (
    <div>
      {/* Thread */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-4">
        <div className="flex items-start gap-2 mb-3">
          {thread.is_solved && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0 mt-1">✓ Löst</span>}
          <h2 className="font-bold text-slate-900 text-lg leading-snug">{thread.title}</h2>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{thread.body}</p>
        <div className="flex gap-3 mt-4 text-xs text-slate-400 border-t border-slate-100 pt-3">
          <span>{thread.display_name}</span>
          <span>{timeAgo(thread.created_at)}</span>
          <span className="ml-auto">{thread.reply_count} svar</span>
        </div>
      </div>

      {/* Replies */}
      {thread.replies.length > 0 && (
        <div className="space-y-3 mb-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide px-1">Svar ({thread.replies.length})</h3>
          {thread.replies.map(r => (
            <div key={r.id} className={`bg-white border rounded-2xl p-4 ${r.is_best_answer ? "border-emerald-300 bg-emerald-50" : "border-slate-200"}`}>
              {r.is_best_answer && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium mb-2 inline-block">⭐ Bästa svar</span>}
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{r.body}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                <span>{r.display_name}</span>
                <span>{timeAgo(r.created_at)}</span>
                <button
                  onClick={() => toggleHelpful(r.id)}
                  className="ml-auto flex items-center gap-1 hover:text-primary transition-colors"
                >
                  👍 {r.helpful_count > 0 ? r.helpful_count : ""} Hjälpsam
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Skriv ett svar</h3>
        <textarea
          value={replyBody}
          onChange={e => setReplyBody(e.target.value)}
          rows={4}
          placeholder="Dela med dig av din erfarenhet eller kunskap..."
          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
        />
        {replyErr && <ErrorMsg msg={replyErr} />}
        <div className="flex justify-between items-center mt-3">
          <p className="text-xs text-slate-400">Du svarar anonymt</p>
          <button
            onClick={submitReply}
            disabled={sending}
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {sending ? "Skickar…" : "Posta svar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── New thread form ──────────────────────────────────────────────────────────

function NewThreadForm({ categoryId, cats, onCreated }: {
  categoryId: string; cats: Category[]; onCreated: (id: number) => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const cat = cats.find(c => c.id === categoryId);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (title.trim().length < 10) { setErr("Titeln måste vara minst 10 tecken"); return; }
    if (body.trim().length < 20) { setErr("Frågan måste vara minst 20 tecken"); return; }
    setSending(true);
    try {
      const t = await apiFetch("/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: categoryId, title, body, author_token: getToken() }),
      });
      onCreated(t.id);
    } catch (e: any) { setErr(e.message); }
    finally { setSending(false); }
  };

  return (
    <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl p-5">
      <h2 className="font-bold text-slate-900 text-lg mb-4">
        Ny fråga {cat && <span className="text-slate-400 font-normal text-base">i {cat.name}</span>}
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Rubrik <span className="text-red-500">*</span></label>
          <input
            value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Beskriv ditt problem kortfattat..."
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Din fråga <span className="text-red-500">*</span></label>
          <textarea
            value={body} onChange={e => setBody(e.target.value)}
            rows={5}
            placeholder="Beskriv situationen i detalj. Vad hände? Vilket brev/beslut fick du? Vad behöver du hjälp med?"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
          />
        </div>
        {err && <ErrorMsg msg={err} />}
        <div className="flex justify-between items-center">
          <p className="text-xs text-slate-400">Du postar anonymt. Dela inga personuppgifter.</p>
          <button type="submit" disabled={sending}
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60">
            {sending ? "Postar…" : "Posta fråga"}
          </button>
        </div>
      </div>
    </form>
  );
}

// ── Admin panel ──────────────────────────────────────────────────────────────

function AdminPanel() {
  const [key, setKey] = useState(localStorage.getItem("forum_admin_key") || "");
  const [authed, setAuthed] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = () => {
    setLoading(true); setErr("");
    fetch(API + "/admin/threads", { headers: { "x-admin-key": key } })
      .then(r => { if (!r.ok) throw new Error("Fel admin-nyckel"); return r.json(); })
      .then(data => { setThreads(data); setAuthed(true); localStorage.setItem("forum_admin_key", key); })
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  };

  const toggleHide = async (id: number) => {
    await fetch(API + `/admin/threads/${id}/hide`, { method: "PATCH", headers: { "x-admin-key": key } });
    load();
  };

  const deleteThread = async (id: number) => {
    if (!confirm("Radera tråden permanent?")) return;
    await fetch(API + `/admin/threads/${id}`, { method: "DELETE", headers: { "x-admin-key": key } });
    load();
  };

  if (!authed) return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 max-w-sm mx-auto mt-8">
      <h2 className="font-bold text-slate-900 mb-4">Admin-inloggning</h2>
      <input
        type="password" value={key} onChange={e => setKey(e.target.value)}
        placeholder="Admin-nyckel"
        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
        onKeyDown={e => e.key === "Enter" && load()}
      />
      {err && <ErrorMsg msg={err} />}
      <button onClick={load} disabled={loading}
        className="w-full bg-primary text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors">
        {loading ? "Loggar in…" : "Logga in"}
      </button>
    </div>
  );

  return (
    <div>
      <h2 className="font-bold text-slate-900 text-lg mb-4">Moderering ({threads.length} trådar)</h2>
      {loading && <Spinner />}
      <div className="space-y-2">
        {threads.map(t => (
          <div key={t.id} className={`bg-white border rounded-2xl p-4 ${t.is_hidden ? "opacity-50 border-dashed" : "border-slate-200"}`}>
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 text-sm leading-snug">{t.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t.display_name} · {t.category} · {t.reply_count} svar · {timeAgo(t.created_at)}</p>
                {t.body_preview && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{t.body_preview}</p>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => toggleHide(t.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${t.is_hidden ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-amber-100 text-amber-700 hover:bg-amber-200"}`}>
                  {t.is_hidden ? "Visa" : "Dölj"}
                </button>
                <button onClick={() => deleteThread(t.id)}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors">
                  Radera
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Forum component ─────────────────────────────────────────────────────

export default function Forum() {
  const [view, setView] = useState<View>({ type: "categories" });
  const [cats, setCats] = useState<Category[]>([]);
  const [history, setHistory] = useState<View[]>([]);

  useEffect(() => {
    apiFetch("/categories").then(setCats).catch(() => {});
  }, []);

  const navigate = (next: View) => {
    setHistory(h => [...h, view]);
    setView(next);
  };

  const goBack = () => {
    const prev = history[history.length - 1];
    if (prev) { setView(prev); setHistory(h => h.slice(0, -1)); }
    else setView({ type: "categories" });
  };

  const canGoBack = history.length > 0 || view.type !== "categories";

  const breadcrumb = () => {
    if (view.type === "categories") return null;
    if (view.type === "admin") return "Admin";
    if (view.type === "threads") return cats.find(c => c.id === (view as any).categoryId)?.name ?? "Kategori";
    if (view.type === "new-thread") return "Ny fråga";
    if (view.type === "thread") return "Fråga";
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            {canGoBack ? (
              <button onClick={goBack} className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors mb-1">
                ← {view.type === "categories" ? "Startsida" : "Tillbaka"}
              </button>
            ) : (
              <Link href="/" className="flex items-center gap-1 text-sm text-slate-400 hover:text-primary transition-colors mb-1">
                ← Startsida
              </Link>
            )}
            <h1 className="text-2xl font-bold text-slate-900">
              {view.type === "categories" ? "Forum" : breadcrumb()}
            </h1>
            {view.type === "categories" && (
              <p className="text-sm text-slate-500 mt-0.5">Ställ frågor och hjälp varandra med svenska myndigheter</p>
            )}
          </div>
          {view.type === "categories" && (
            <button onClick={() => navigate({ type: "admin" })}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors px-2 py-1 rounded-lg">
              Admin
            </button>
          )}
        </div>

        {/* Views */}
        {view.type === "categories" && (
          <CategoriesView onSelect={id => navigate({ type: "threads", categoryId: id })} />
        )}
        {view.type === "threads" && (
          <ThreadsView
            categoryId={(view as any).categoryId}
            cats={cats}
            onThread={id => navigate({ type: "thread", threadId: id })}
            onNew={() => navigate({ type: "new-thread", categoryId: (view as any).categoryId })}
          />
        )}
        {view.type === "thread" && (
          <ThreadView threadId={(view as any).threadId} onBack={goBack} />
        )}
        {view.type === "new-thread" && (
          <NewThreadForm
            categoryId={(view as any).categoryId}
            cats={cats}
            onCreated={id => { setHistory([]); setView({ type: "thread", threadId: id }); }}
          />
        )}
        {view.type === "admin" && <AdminPanel />}
      </div>
    </div>
  );
}
