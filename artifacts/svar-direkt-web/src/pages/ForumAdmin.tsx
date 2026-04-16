import { useState, useEffect, useCallback } from "react";

const API = `${import.meta.env.BASE_URL}api/forum/admin`;

interface Thread {
  id: number;
  category: string;
  title: string;
  body_preview?: string;
  body?: string;
  is_solved: boolean;
  is_hidden: boolean;
  reply_count: number;
  created_at: string;
  display_name: string;
  replies?: Reply[];
}

interface Reply {
  id: number;
  body: string;
  is_hidden: boolean;
  helpful_count: number;
  is_best_answer: boolean;
  created_at: string;
  display_name: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 2) return "precis nu";
  if (m < 60) return `${m} min sedan`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} tim sedan`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} dagar sedan`;
  return new Date(dateStr).toLocaleDateString("sv-SE");
}

const CATEGORY_NAMES: Record<string, string> = {
  kronofogden: "Kronofogden",
  skatteverket: "Skatteverket",
  forsakringskassan: "Försäkringskassan",
  migrationsverket: "Migrationsverket",
  arbetsformedlingen: "Arbetsförmedlingen",
};

export default function ForumAdmin() {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem("forum_admin_key") || "");
  const [keyInput, setKeyInput] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [expandedThread, setExpandedThread] = useState<Thread | null>(null);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all");
  const [confirmDelete, setConfirmDelete] = useState<{ type: "thread" | "reply"; id: number } | null>(null);

  const fetchThreads = useCallback(async (key: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/threads`, {
        headers: { "x-admin-key": key },
      });
      if (res.status === 401) {
        setError("Fel lösenord. Försök igen.");
        setLoggedIn(false);
        return;
      }
      const data = await res.json();
      setThreads(data);
      setLoggedIn(true);
      sessionStorage.setItem("forum_admin_key", key);
    } catch {
      setError("Kunde inte ansluta till servern.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminKey) {
      fetchThreads(adminKey);
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAdminKey(keyInput);
    await fetchThreads(keyInput);
  }

  async function expandThread(threadId: number) {
    if (expandedId === threadId) {
      setExpandedId(null);
      setExpandedThread(null);
      return;
    }
    setExpandedId(threadId);
    setLoadingReplies(true);
    try {
      const res = await fetch(`${API}/threads/${threadId}`, {
        headers: { "x-admin-key": adminKey },
      });
      const data = await res.json();
      setExpandedThread(data);
    } catch {
      setExpandedThread(null);
    } finally {
      setLoadingReplies(false);
    }
  }

  async function toggleHideThread(threadId: number) {
    const res = await fetch(`${API}/threads/${threadId}/hide`, {
      method: "PATCH",
      headers: { "x-admin-key": adminKey },
    });
    const data = await res.json();
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, is_hidden: data.is_hidden } : t));
    if (expandedThread?.id === threadId) {
      setExpandedThread(prev => prev ? { ...prev, is_hidden: data.is_hidden } : null);
    }
  }

  async function deleteThread(threadId: number) {
    const res = await fetch(`${API}/threads/${threadId}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey },
    });
    if (res.ok) {
      setThreads(prev => prev.filter(t => t.id !== threadId));
      if (expandedId === threadId) {
        setExpandedId(null);
        setExpandedThread(null);
      }
    }
    setConfirmDelete(null);
  }

  async function toggleHideReply(replyId: number) {
    const res = await fetch(`${API}/replies/${replyId}/hide`, {
      method: "PATCH",
      headers: { "x-admin-key": adminKey },
    });
    const data = await res.json();
    setExpandedThread(prev => {
      if (!prev) return null;
      return {
        ...prev,
        replies: prev.replies?.map(r => r.id === replyId ? { ...r, is_hidden: data.is_hidden } : r),
      };
    });
  }

  async function deleteReply(replyId: number) {
    const res = await fetch(`${API}/replies/${replyId}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey },
    });
    if (res.ok) {
      setExpandedThread(prev => {
        if (!prev) return null;
        return { ...prev, replies: prev.replies?.filter(r => r.id !== replyId) };
      });
      setThreads(prev => prev.map(t =>
        t.id === expandedId ? { ...t, reply_count: Math.max(0, t.reply_count - 1) } : t
      ));
    }
    setConfirmDelete(null);
  }

  const filtered = threads.filter(t => {
    if (filter === "visible") return !t.is_hidden;
    if (filter === "hidden") return t.is_hidden;
    return true;
  });

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mx-auto mb-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </div>
            <h1 className="text-lg font-bold text-slate-900">Forum – Administration</h1>
            <p className="text-sm text-slate-500 mt-1">Ange ditt admin-lösenord</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              placeholder="Admin-lösenord"
              required
              autoFocus
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-60"
            >
              {loading ? "Loggar in…" : "Logga in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Forum – Administration</h1>
            <p className="text-sm text-slate-500 mt-0.5">{threads.length} trådar totalt</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchThreads(adminKey)}
              className="px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              ↻ Uppdatera
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("forum_admin_key");
                setLoggedIn(false);
                setAdminKey("");
                setKeyInput("");
              }}
              className="px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600"
            >
              Logga ut
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4">
          {(["all", "visible", "hidden"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f === "all" ? `Alla (${threads.length})` : f === "visible" ? `Synliga (${threads.filter(t => !t.is_hidden).length})` : `Dolda (${threads.filter(t => t.is_hidden).length})`}
            </button>
          ))}
        </div>

        {/* Threads list */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Laddar…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">Inga trådar att visa.</div>
        ) : (
          <div className="space-y-2">
            {filtered.map(thread => (
              <div key={thread.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${thread.is_hidden ? "border-red-200 opacity-70" : "border-slate-200"}`}>
                {/* Thread header */}
                <div className="px-4 py-3 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {CATEGORY_NAMES[thread.category] || thread.category}
                      </span>
                      {thread.is_hidden && (
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                          ● DOLD
                        </span>
                      )}
                      {thread.is_solved && (
                        <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-md">
                          ✓ Löst
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-900 leading-snug">{thread.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {thread.display_name} · {timeAgo(thread.created_at)} · {thread.reply_count} svar
                    </p>
                    {thread.body_preview && (
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">{thread.body_preview}</p>
                    )}
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0 pt-0.5">
                    <button
                      onClick={() => expandThread(thread.id)}
                      className="px-2.5 py-1.5 text-xs bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                    >
                      {expandedId === thread.id ? "Stäng" : "Visa svar"}
                    </button>
                    <button
                      onClick={() => toggleHideThread(thread.id)}
                      className={`px-2.5 py-1.5 text-xs rounded-lg transition-colors font-medium ${
                        thread.is_hidden
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      }`}
                    >
                      {thread.is_hidden ? "Visa" : "Dölj"}
                    </button>
                    <button
                      onClick={() => setConfirmDelete({ type: "thread", id: thread.id })}
                      className="px-2.5 py-1.5 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                    >
                      Radera
                    </button>
                  </div>
                </div>

                {/* Replies */}
                {expandedId === thread.id && (
                  <div className="border-t border-slate-100 bg-slate-50">
                    {loadingReplies ? (
                      <div className="px-4 py-3 text-sm text-slate-400">Laddar svar…</div>
                    ) : !expandedThread?.replies?.length ? (
                      <div className="px-4 py-3 text-sm text-slate-400">Inga svar ännu.</div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {expandedThread!.replies!.map(reply => (
                          <div
                            key={reply.id}
                            className={`px-4 py-3 flex gap-3 ${reply.is_hidden ? "opacity-60 bg-red-50/40" : ""}`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-xs text-slate-400">{reply.display_name} · {timeAgo(reply.created_at)}</span>
                                {reply.is_hidden && (
                                  <span className="text-xs font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">DOLT</span>
                                )}
                                {reply.is_best_answer && (
                                  <span className="text-xs font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded">Bästa svar</span>
                                )}
                              </div>
                              <p className="text-sm text-slate-700 leading-relaxed">{reply.body}</p>
                            </div>
                            <div className="flex gap-1.5 flex-shrink-0">
                              <button
                                onClick={() => toggleHideReply(reply.id)}
                                className={`px-2 py-1 text-xs rounded-lg transition-colors font-medium ${
                                  reply.is_hidden
                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                    : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                }`}
                              >
                                {reply.is_hidden ? "Visa" : "Dölj"}
                              </button>
                              <button
                                onClick={() => setConfirmDelete({ type: "reply", id: reply.id })}
                                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h2 className="font-bold text-slate-900 mb-2">Radera permanent?</h2>
            <p className="text-sm text-slate-500 mb-5">
              {confirmDelete.type === "thread"
                ? "Tråden och alla dess svar raderas permanent. Det går inte att ångra."
                : "Svaret raderas permanent. Det går inte att ångra."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={() => {
                  if (confirmDelete.type === "thread") deleteThread(confirmDelete.id);
                  else deleteReply(confirmDelete.id);
                }}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                Ja, radera
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
