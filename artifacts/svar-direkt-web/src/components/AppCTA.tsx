export default function AppCTA({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const padding = size === "lg" ? "px-8 py-4 text-base" : size === "sm" ? "px-4 py-2 text-xs" : "px-6 py-3 text-sm";
  return (
    <div className={`flex flex-col items-center gap-1.5 ${className}`}>
      <div className={`inline-flex items-center gap-2 ${padding} bg-slate-100 text-slate-400 rounded-xl font-medium cursor-not-allowed select-none border border-slate-200`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
        Appen kommer snart
      </div>
      <p className="text-xs text-slate-400 text-center">Vi jobbar med en liten förbättring – tillgänglig igen snart</p>
    </div>
  );
}
