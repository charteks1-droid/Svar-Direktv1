const AFFILIATE_URL = "https://www.hostinger.com?REFERRALCODE=DAJCHARTEFXU";

export function HostingerBannerFull() {
  return (
    <a
      href={AFFILIATE_URL}
      target="_blank"
      rel="noopener sponsored"
      className="block group"
      aria-label="Hostinger – webbhotell från 7 kr per månad"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#673DE6] via-[#7B52ED] to-[#4B28B8] px-6 py-7 sm:px-10 sm:py-8 shadow-lg border border-purple-400/20">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-white/5" />

        <div className="relative flex flex-col sm:flex-row items-center gap-5">
          {/* Icon */}
          <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 text-3xl shadow-inner">
            🌐
          </div>

          {/* Text */}
          <div className="flex-1 text-center sm:text-left">
            <div className="inline-block text-[10px] font-bold uppercase tracking-widest text-purple-200 mb-1 px-2 py-0.5 rounded-full border border-purple-300/30 bg-white/10">
              Samarbetspartner · Reklam
            </div>
            <h3 className="text-white font-bold text-lg sm:text-xl leading-tight">
              Bygg din egen hemsida med Hostinger
            </h3>
            <p className="text-purple-200 text-sm mt-1 leading-relaxed">
              Snabbt, pålitligt webbhotell från&nbsp;<strong className="text-white">7&nbsp;kr/mån</strong> — gratis domän ingår det första året.
            </p>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-[#673DE6] font-bold text-sm shadow group-hover:shadow-lg group-hover:scale-105 transition-all">
              Se erbjudande →
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

export function HostingerBannerCompact() {
  return (
    <a
      href={AFFILIATE_URL}
      target="_blank"
      rel="noopener sponsored"
      className="flex items-center gap-3 group"
      aria-label="Hostinger webbhotell"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#673DE6] to-[#4B28B8] flex items-center justify-center text-base">
        🌐
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Samarbetspartner</p>
        <p className="text-sm text-slate-200 group-hover:text-white transition-colors font-medium leading-tight">
          Hostinger – webbhotell från 7 kr/mån
        </p>
      </div>
      <span className="ml-auto text-xs text-purple-400 group-hover:text-purple-300 font-semibold whitespace-nowrap transition-colors">
        Se erbjudande →
      </span>
    </a>
  );
}
