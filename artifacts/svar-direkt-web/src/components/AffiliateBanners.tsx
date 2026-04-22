export function MinDeklarationBanner() {
  return (
    <a
      href="https://addrevenue.io/t?a=984566&c=3467552"
      target="_blank"
      rel="noopener sponsored"
      className="block group"
      aria-label="Min Deklaration – personlig hjälp med din deklaration"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0055A4] via-[#0066CC] to-[#004A8F] px-6 py-7 sm:px-10 sm:py-8 shadow-lg border border-blue-400/20">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/5" />

        <div className="relative flex flex-col sm:flex-row items-center gap-5">
          {/* Badge + icon */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 text-3xl shadow-inner">
              📋
            </div>
            <span className="text-[9px] font-bold text-blue-200 uppercase tracking-wider whitespace-nowrap">
              ⭐ Rekommenderat 2025
            </span>
          </div>

          {/* Text */}
          <div className="flex-1 text-center sm:text-left">
            <div className="inline-block text-[10px] font-bold uppercase tracking-widest text-blue-200 mb-1.5 px-2 py-0.5 rounded-full border border-blue-300/30 bg-white/10">
              Samarbetspartner · Reklam
            </div>
            <h3 className="text-white font-bold text-lg sm:text-xl leading-tight">
              Behöver du hjälp med din deklaration?
            </h3>
            <p className="text-blue-100 text-sm mt-1.5 leading-relaxed">
              Personligt deklarationsombud hjälper dig via&nbsp;<strong className="text-white">webbmöte</strong> — oavsett om du har reavinster, utländska inkomster eller komplex deklaration.
            </p>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-[#0055A4] font-bold text-sm shadow group-hover:shadow-lg group-hover:scale-105 transition-all whitespace-nowrap">
              Boka webbmöte →
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

export function MinDeklarationBannerCompact() {
  return (
    <a
      href="https://addrevenue.io/t?a=984566&c=3467552"
      target="_blank"
      rel="noopener sponsored"
      className="flex items-center gap-3 group"
      aria-label="Min Deklaration"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#0055A4] to-[#004A8F] flex items-center justify-center text-base">
        📋
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Samarbetspartner</p>
        <p className="text-sm text-slate-200 group-hover:text-white transition-colors font-medium leading-tight">
          Min Deklaration – personlig hjälp via webbmöte
        </p>
      </div>
      <span className="ml-auto text-xs text-blue-400 group-hover:text-blue-300 font-semibold whitespace-nowrap transition-colors">
        Boka →
      </span>
    </a>
  );
}
