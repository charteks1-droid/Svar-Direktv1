import { useState } from "react";

const API_BASE = import.meta.env.PROD
  ? "https://antiquewhite-lapwing-486017.hostingersite.com"
  : "";

export function NewsletterForm({ variant = "default" }: { variant?: "default" | "footer" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const r = await fetch(`${API_BASE}/api/tools/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await r.json();
      if (r.ok) {
        setStatus("ok");
        setMessage(data.message || "Tack för din prenumeration!");
        setEmail("");
      } else {
        setStatus("err");
        setMessage(data.error || "Ett fel uppstod.");
      }
    } catch {
      setStatus("err");
      setMessage("Kunde inte ansluta till servern.");
    }
  }

  if (variant === "footer") {
    return (
      <form onSubmit={submit} className="space-y-2">
        <div className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="din@email.se"
            disabled={status === "loading"}
            className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-3 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {status === "loading" ? "..." : "Prenumerera"}
          </button>
        </div>
        {message && (
          <p className={`text-xs ${status === "ok" ? "text-emerald-400" : "text-red-400"}`}>
            {message}
          </p>
        )}
      </form>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 sm:p-8 border border-blue-100">
      <div className="text-center mb-5">
        <div className="inline-block text-4xl mb-3">📬</div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          Få nyheter direkt i mailen
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Veckobrev med viktiga lagändringar, deadlines och tips från svenska myndigheter.
          Gratis. Avregistrera när du vill.
        </p>
      </div>
      <form onSubmit={submit} className="max-w-md mx-auto space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="din@email.se"
            disabled={status === "loading"}
            className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-5 py-3 font-semibold bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {status === "loading" ? "Skickar..." : "Prenumerera"}
          </button>
        </div>
        {message && (
          <p className={`text-sm text-center ${status === "ok" ? "text-emerald-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
