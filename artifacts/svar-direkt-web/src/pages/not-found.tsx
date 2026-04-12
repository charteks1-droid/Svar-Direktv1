import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-slate-400">
          <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M16 11v5M16 20h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
      <p className="text-slate-500 text-sm mb-6 max-w-xs">
        Sidan du letar efter finns inte eller har flyttats.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Gå till startsidan
      </Link>
    </div>
  );
}
