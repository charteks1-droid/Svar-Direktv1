import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";

const API = `${import.meta.env.BASE_URL}api/forum`;

const CATEGORIES: Record<string, { name: string; color: string; icon: string }> = {
  kronofogden:       { name: "Kronofogden",       color: "#dc2626", icon: "⚖️" },
  skatteverket:      { name: "Skatteverket",       color: "#0a7ea4", icon: "📋" },
  forsakringskassan: { name: "Försäkringskassan",  color: "#059669", icon: "🏥" },
  migrationsverket:  { name: "Migrationsverket",   color: "#7c3aed", icon: "🌐" },
  arbetsformedlingen:{ name: "Arbetsförmedlingen", color: "#d97706", icon: "💼" },
};

function getToken(): string {
  let t = localStorage.getItem("forum_token");
  if (!t) { t = crypto.randomUUID(); localStorage.setItem("forum_token", t); }
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

interface Reply {
  id: number;
  body: string;
  display_name: string;
  helpful_count: number;
  is_best_answer: boolean;
  template_name: string | null;
  created_at: string;
}

interface Thread {
  id: number;
  category: string;
  title: string;
  body: string;
  display_name: string;
  is_solved: boolean;
  reply_count: number;
  created_at: string;
  replies: Reply[];
}

export default function ForumThread() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const id = params.id;

  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [replyBody, setReplyBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyError, setReplyError] = useState("");

  const [votedReplies, setVotedReplies] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("forum_votes") || "[]")); }
    catch { return new Set(); }
  });

  const myToken = getToken();

  async function load() {
    try {
      const res = await fetch(`${API}/threads/${id}`);
      if (res.status === 404) { setNotFound(true); return; }
      const data = await res.json();
      setThread(data);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  async function submitReply() {
    setReplyError("");
    if (replyBody.trim().length < 10) { setReplyError("Svaret måste vara minst 10 tecken"); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/threads/${id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: replyBody.trim(), author_token: myToken }),
      });
      const data = await res.json();
      if (!res.ok) { setReplyError(data.error || "Något gick fel"); return; }
      setReplyBody("");
      setThread(t => t ? { ...t, reply_count: t.reply_count + 1, replies: [...t.replies, data] } : t);
    } catch {
      setReplyError("Nätverksfel – försök igen");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleHelpful(replyId: number) {
    try {
      const res = await fetch(`${API}/replies/${replyId}/helpful`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voter_token: myToken }),
      });
      const data = await res.json();
      setVotedReplies(prev => {
        const next = new Set(prev);
        data.action === "added" ? next.add(replyId) : next.delete(replyId);
        localStorage.setItem("forum_votes", JSON.stringify([...next]));
        return next;
      });
      setThread(t => t ? {
        ...t,
        replies: t.replies.map(r =>
          r.id === replyId
            ? { ...r, helpful_count: r.helpful_count + (data.action === "added" ? 1 : -1) }
            : r
        ),
      } : t);
    } catch {}
  }

  async function toggleSolved() {
    if (!thread) return;
    try {
      const res = await fetch(`${API}/threads/${thread.id}/solve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author_token: myToken }),
      });
      const data = await res.json();
      if (res.ok) setThread(t => t ? { ...t, is_solved: data.is_solved } : t);
    } catch {}
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Laddar...</div>;
  if (notFound || !thread) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500">Tråden hittades inte.</p>
      <Link href="/forum" className="text-sm font-semibold" style={{ color: "#0a7ea4" }}>← Tillbaka till forumet</Link>
    </div>
  );

  const cat = CATEGORIES[thread.category];
  const myHash = Array.from(crypto.getRandomValues ? new Uint8Array(0) : []).join("");
  const isOwner = false;

  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ background: "#0d1b2e" }} className="py-5 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href={`/forum/kategori/${thread.category}`}
            className="text-xs font-semibold mb-3 inline-flex items-center gap-1 hover:underline"
            style={{ color: "#0a7ea4" }}
          >
            ← {cat?.name ?? thread.category}
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {thread.is_solved && (
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-500 text-white">✓ Löst</span>
            )}
          </div>
          <h1 className="text-xl font-bold text-white leading-snug">{thread.title}</h1>
          <p className="text-xs text-slate-400 mt-1.5">{thread.display_name} · {timeAgo(thread.created_at)}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-5">
        <div
          className="bg-white rounded-xl p-5 shadow-sm"
          style={{ borderLeft: `4px solid ${cat?.color ?? "#94a3b8"}` }}
        >
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{thread.body}</p>
        </div>

        <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
          {thread.reply_count} svar
        </div>

        {thread.replies.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-xl shadow-sm">
            Inga svar än. Var den första att hjälpa!
          </div>
        )}

        {thread.replies.map(reply => {
          const voted = votedReplies.has(reply.id);
          return (
            <div
              key={reply.id}
              className="bg-white rounded-xl p-5 shadow-sm"
              style={{ border: reply.is_best_answer ? "2px solid #059669" : "1px solid #e5e7eb" }}
            >
              {reply.is_best_answer && (
                <div className="inline-block text-xs font-bold bg-green-600 text-white px-2 py-0.5 rounded mb-3">
                  ✓ Bästa svar
                </div>
              )}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: "#0a7ea420", color: "#0a7ea4" }}
                >
                  {reply.display_name.slice(-1)}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">{reply.display_name}</div>
                  <div className="text-xs text-gray-400">{timeAgo(reply.created_at)}</div>
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line mb-4">{reply.body}</p>

              {reply.template_name && (
                <div
                  className="flex items-center gap-3 p-3 rounded-lg mb-4"
                  style={{ background: "#0a7ea410", border: "1px solid #0a7ea430" }}
                >
                  <span className="text-lg">📄</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold" style={{ color: "#0a7ea4" }}>Rekommenderad mall</div>
                    <div className="text-sm font-semibold text-slate-800">{reply.template_name}</div>
                  </div>
                </div>
              )}

              <button
                onClick={() => toggleHelpful(reply.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                  voted
                    ? "border-teal-300 bg-teal-50 text-teal-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                👍 Hjälpsamt ({reply.helpful_count})
              </button>
            </div>
          );
        })}

        <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: "2px dashed #e5e7eb" }}>
          <h3 className="font-bold text-slate-800 mb-3">Skriv ett svar</h3>
          <textarea
            value={replyBody}
            onChange={e => setReplyBody(e.target.value)}
            placeholder="Har du erfarenhet av samma situation? Skriv ditt svar – det hjälper någon i stress..."
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none mb-3"
          />
          {replyError && <p className="text-red-600 text-sm mb-2">{replyError}</p>}
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-gray-400">🔒 Ditt svar publiceras anonymt</p>
            <button
              onClick={submitReply}
              disabled={submitting}
              className="flex-shrink-0 text-white text-sm font-bold px-4 py-2 rounded-lg disabled:opacity-50"
              style={{ background: replyBody.trim().length >= 10 ? "#0a7ea4" : "#94a3b8" }}
            >
              {submitting ? "Skickar..." : "Skicka svar"}
            </button>
          </div>
        </div>

        <div className="text-center">
          <Link href="/forum" className="text-sm font-semibold" style={{ color: "#0a7ea4" }}>
            ← Tillbaka till alla frågor
          </Link>
        </div>
      </div>
    </div>
  );
}
