export function CheapEnergyBanner() {
  return (
    <a
      href="https://addrevenue.io/t?a=985028&c=3467552"
      target="_blank"
      rel="noopener sponsored"
      className="block group"
      aria-label="Cheap Energy – billig el med elavtal som tål att jämföras"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white px-6 py-7 sm:px-10 sm:py-8 shadow-lg border-2 border-[#E30613]/20 group-hover:border-[#E30613]/40 transition-colors">
        {/* Red top stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E30613] via-[#FF1A27] to-[#E30613]" />

        <div className="relative flex flex-col sm:flex-row items-center gap-5">
          {/* Logo */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
            <img
              src="/cheap-energy-logo.webp"
              alt="Cheap Energy"
              className="h-14 w-auto object-contain"
            />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Äkta svenskt elbolag
            </span>
          </div>

          {/* Text */}
          <div className="flex-1 text-center sm:text-left">
            <div className="inline-block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 px-2 py-0.5 rounded-full border border-slate-200 bg-slate-50">
              Samarbetspartner · Reklam
            </div>
            <h3 className="text-slate-900 font-black text-xl sm:text-2xl leading-tight">
              Billig el – elavtal som tål att jämföras!
            </h3>
            <p className="text-slate-600 text-sm mt-1.5 leading-relaxed">
              <strong className="text-[#E30613]">Cheap Energy</strong> har levererat prisvärd el i 20+ år. Enkla avtal, inga dolda avgifter och ett av Sveriges billigaste elbolag på nätet.
            </p>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#E30613] text-white font-bold text-sm shadow group-hover:shadow-lg group-hover:scale-105 transition-all whitespace-nowrap">
              Jämför nu →
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

export function CheapEnergyBannerCompact() {
  return (
    <a
      href="https://addrevenue.io/t?a=985028&c=3467552"
      target="_blank"
      rel="noopener sponsored"
      className="flex items-center gap-3 group"
      aria-label="Cheap Energy – billig el"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#E30613] flex items-center justify-center overflow-hidden border border-red-200">
        <img src="/cheap-energy-logo.webp" alt="CE" className="w-8 h-8 object-cover" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Samarbetspartner</p>
        <p className="text-sm text-slate-200 group-hover:text-white transition-colors font-medium leading-tight">
          Cheap Energy – billig el till ditt hem
        </p>
      </div>
      <span className="ml-auto text-xs text-red-400 group-hover:text-red-300 font-semibold whitespace-nowrap transition-colors">
        Jämför →
      </span>
    </a>
  );
}

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

export function JustInCaseBanner() {
  return (
    <a
      href="https://addrevenue.io/t?a=984578&c=3467552&l=1"
      target="_blank"
      rel="noopener sponsored"
      className="block group"
      aria-label="JustInCase – livförsäkring utan hälsofrågor"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E8475F] via-[#D63B53] to-[#BF2E44] px-6 py-7 sm:px-10 sm:py-8 shadow-lg border border-red-400/20">
        {/* decorative circles */}
        <div className="pointer-events-none absolute -top-12 -right-12 w-52 h-52 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-8 -left-6 w-36 h-36 rounded-full bg-white/5" />

        <div className="relative flex flex-col sm:flex-row items-center gap-5">
          {/* Icon */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 shadow-inner">
              <span className="text-2xl font-black text-white leading-none">JiC</span>
            </div>
            <span className="text-[9px] font-bold text-red-200 uppercase tracking-wider whitespace-nowrap">
              Sveriges livförsäkringsspecialist
            </span>
          </div>

          {/* Text */}
          <div className="flex-1 text-center sm:text-left">
            <div className="inline-block text-[10px] font-bold uppercase tracking-widest text-red-200 mb-1.5 px-2 py-0.5 rounded-full border border-red-300/30 bg-white/10">
              Samarbetspartner · Reklam
            </div>
            <h3 className="text-white font-black text-xl sm:text-2xl leading-tight">
              Räcker 100 månadslöner?
            </h3>
            <p className="text-red-100 text-sm mt-1.5 leading-relaxed">
              <strong className="text-white">JustInCase</strong> — livförsäkring utan hälsofrågor. 500&nbsp;000&nbsp;kr skattefritt till din familj. Tecknas direkt, fullt arbetsför och under 65 år.
            </p>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-[#D63B53] font-bold text-sm shadow group-hover:shadow-lg group-hover:scale-105 transition-all whitespace-nowrap">
              Läs mer →
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

export function JustInCaseBannerCompact() {
  return (
    <a
      href="https://addrevenue.io/t?a=984578&c=3467552&l=1"
      target="_blank"
      rel="noopener sponsored"
      className="flex items-center gap-3 group"
      aria-label="JustInCase livförsäkring"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#E8475F] to-[#BF2E44] flex items-center justify-center">
        <span className="text-[10px] font-black text-white">JiC</span>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Samarbetspartner</p>
        <p className="text-sm text-slate-200 group-hover:text-white transition-colors font-medium leading-tight">
          JustInCase – livförsäkring utan hälsofrågor
        </p>
      </div>
      <span className="ml-auto text-xs text-red-400 group-hover:text-red-300 font-semibold whitespace-nowrap transition-colors">
        Läs mer →
      </span>
    </a>
  );
}

export function TalenomBanner() {
  return (
    <a
      href="https://addrevenue.io/t?a=985498&c=3467552"
      target="_blank"
      rel="noopener sponsored"
      className="block group"
      aria-label="Talenom – redovisningsbyrå för företag"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460] px-6 py-7 sm:px-10 sm:py-8 shadow-lg border border-slate-700/40">
        <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/4" />
        <div className="pointer-events-none absolute -bottom-8 -left-6 w-32 h-32 rounded-full bg-white/4" />

        <div className="relative flex flex-col sm:flex-row items-center gap-5">
          {/* Logo area */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 border border-white/10">
              <span className="text-xl font-black text-white tracking-tighter leading-none">TAL</span>
            </div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
              30 kontor i Sverige
            </span>
          </div>

          {/* Text */}
          <div className="flex-1 text-center sm:text-left">
            <div className="inline-block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 px-2 py-0.5 rounded-full border border-slate-600/40 bg-white/5">
              Samarbetspartner · Reklam
            </div>
            <h3 className="text-white font-black text-xl sm:text-2xl leading-tight">
              Redovisning som sparar din tid
            </h3>
            <p className="text-slate-300 text-sm mt-1.5 leading-relaxed">
              <strong className="text-white">Talenom</strong> — kundnära redovisningsbyrå för små och medelstora företag. Digitalt, enkelt, pålitligt. 30 kontor runt om i Sverige.
            </p>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-[#1A1A2E] font-bold text-sm shadow group-hover:shadow-lg group-hover:scale-105 transition-all whitespace-nowrap">
              Kom igång →
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

export function TalenomBannerCompact() {
  return (
    <a
      href="https://addrevenue.io/t?a=985498&c=3467552"
      target="_blank"
      rel="noopener sponsored"
      className="flex items-center gap-3 group"
      aria-label="Talenom redovisning"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#1A1A2E] to-[#0F3460] flex items-center justify-center">
        <span className="text-[9px] font-black text-white tracking-tighter">TAL</span>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Samarbetspartner</p>
        <p className="text-sm text-slate-200 group-hover:text-white transition-colors font-medium leading-tight">
          Talenom – redovisning för företag
        </p>
      </div>
      <span className="ml-auto text-xs text-slate-400 group-hover:text-slate-300 font-semibold whitespace-nowrap transition-colors">
        Läs mer →
      </span>
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
