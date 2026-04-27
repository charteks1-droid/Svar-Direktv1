import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import logoSrc from "./assets/logo.png";
import { HostingerBannerCompact } from "@/components/HostingerBanner";
import { BLOG_META } from "@/blogMeta";

const SITE = "https://svardirekt.site";

const PAGE_META: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Svar Direkt – Färdiga svar och mallar till svenska myndigheter",
    description: "App med färdiga mallar för Skatteverket, Försäkringskassan, Boverket och Migrationsverket. Kopiera och skicka direkt – spara tid. 79 kr engångspris.",
  },
  "/blogg": {
    title: "Blogg & Guider – Svar Direkt",
    description: "Praktiska råd och guider om myndighetskommunikation i Sverige. Skatteverket, Försäkringskassan, Kronofogden och mer.",
  },
  "/paket": {
    title: "Paket och tillägg – Svar Direkt",
    description: "Utöka Svar Direkt med fler mallar och fraser för arbete, relationer, hälsa och inkasso.",
  },
  "/kontakt": {
    title: "Kontakt – Svar Direkt",
    description: "Kontakta Svar Direkt med frågor, feedback eller support. Vi svarar på info@svardirekt.site.",
  },
  "/funktioner": {
    title: "Funktioner – Svar Direkt",
    description: "Allt som ingår i Svar Direkt – mallar, kategorier och hur appen fungerar.",
  },
  "/om-appen": {
    title: "Om appen – Svar Direkt",
    description: "Lär dig mer om Svar Direkt – appen som hjälper dig kommunicera med myndigheter i Sverige.",
  },
  "/mallar": {
    title: "Gratis mallar – Svar Direkt",
    description: "Gratis jobbansökningsmallar och textmallar. Ladda ner och anpassa direkt.",
  },
  "/mallar-interaktiva": {
    title: "70 Gratis Interaktiva Brevmallar till Svenska Myndigheter | Svar Direkt",
    description: "70 gratis interaktiva brevmallar till Kronofogden, Försäkringskassan, Skatteverket, Migrationsverket, Bolagsverket m.fl. Fyll i dina uppgifter direkt online och skriv ut klart brev – helt gratis.",
  },
  "/verktyg": {
    title: "Juridiska verktyg – JO-anmälan, Skadestånd, GDPR, Överklagande | Svar Direkt",
    description: "7 gratis verktyg som vänder relationen med myndigheten. JO-anmälan, skadeståndsanspråk, offentlighetsprincipen, diskrimineringsanmälan, GDPR-klagomål och överklagande till förvaltningsrätten.",
  },
  "/pdf-guider": {
    title: "PDF-guider – Svar Direkt",
    description: "Nedladdningsbara PDF-guider för Skatteverket, Försäkringskassan, Migrationsverket och mer.",
  },
  "/rattigheter": {
    title: "Dina rättigheter – Förstå svenska lagar på ett enkelt sätt | Svar Direkt",
    description: "En enkel guide till dina rättigheter som konsument, hyresgäst, anställd och medborgare i Sverige. Inget juridiskt krångel, bara klara besked.",
  },
  "/kronofogden-skuldsanering": {
    title: "Skuldsanering – Hur du ansöker och skriver till Kronofogden | Svar Direkt",
    description: "Har du skulder du inte kan betala? Lär dig hur du ansöker om skuldsanering hos Kronofogden – steg för steg guide med färdig exempeltext på svenska.",
  },
  "/skatteverket-deklaration": {
    title: "Problem med deklaration? Så skriver du till Skatteverket | Svar Direkt",
    description: "Har du fått fel på deklarationen eller vill ändra något? Lär dig hur du skriver ett korrekt brev till Skatteverket – med färdig exempeltext att kopiera.",
  },
  "/forsakringskassan-nekad-ersattning": {
    title: "Försäkringskassan nekade din ansökan – Så överklagar du | Svar Direkt",
    description: "Fick du avslag från Försäkringskassan? Lär dig hur du begär omprövning eller överklagar – steg för steg med färdigt brev på svenska att kopiera.",
  },
  "/migrationsverket-ansokan": {
    title: "Problem med Migrationsverket – Hur du skriver rätt brev | Svar Direkt",
    description: "Fått avslag eller problem med ansökan hos Migrationsverket? Guide med färdigt brev på svenska – för uppehållstillstånd, arbetstillstånd och mer.",
  },
};

function CanonicalUpdater() {
  const [loc] = useLocation();
  useEffect(() => {
    const url = `${SITE}${loc === "/" ? "/" : loc}`;
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
    if (canonical) canonical.href = url;
    if (ogUrl) ogUrl.content = url;

    let meta = PAGE_META[loc];

    // Blog article pages: look up from BLOG_META
    if (!meta && loc.startsWith("/blogg/")) {
      const slug = loc.replace("/blogg/", "");
      const blogMeta = BLOG_META[slug];
      if (blogMeta) meta = blogMeta;
    }

    if (meta) {
      document.title = meta.title;
      const desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (desc) desc.content = meta.description;
      const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
      const ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
      if (ogTitle) ogTitle.content = meta.title;
      if (ogDesc) ogDesc.content = meta.description;
    }
  }, [loc]);
  return null;
}

import Home from "@/pages/Home";
import AboutApp from "@/pages/AboutApp";
import Features from "@/pages/Features";
import Packages from "@/pages/Packages";
import PdfGuides from "@/pages/PdfGuides";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import Generator from "@/pages/Generator";
import Mallar from "@/pages/Mallar";
import MallarInteraktiva from "@/pages/MallarInteraktiva";
import Verktyg from "@/pages/Verktyg";
import Landing from "@/pages/Landing";
import Tjanst from "@/pages/Tjanst";
import Forum from "@/pages/Forum";
import SeoLanding, { seoPages } from "@/pages/SeoLanding";
import SeoGuide, { seoGuidePages } from "@/pages/SeoGuide";
import Rattigheter from "@/pages/Rattigheter";
import Kalender from "@/pages/Kalender";
import Lexikon from "@/pages/Lexikon";
import Nyheter from "@/pages/Nyheter";
import NotFound from "@/pages/not-found";

function CookieBanner() {
  const [visible, setVisible] = useState(() => {
    try { return !localStorage.getItem("cookie_ok"); } catch { return true; }
  });
  if (!visible) return null;
  const accept = () => {
    try { localStorage.setItem("cookie_ok", "1"); } catch {}
    setVisible(false);
  };
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 px-4 py-4 shadow-2xl">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <p className="text-xs text-slate-300 leading-relaxed flex-1">
          Vi använder nödvändiga cookies för att webbplatsen ska fungera. Ingen spårning för reklam sker.
          Läs mer i vår{" "}
          <a href="/integritetspolicy.html" className="text-primary underline">integritetspolicy</a>.
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={accept}
            className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Jag förstår
          </button>
        </div>
      </div>
    </div>
  );
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function useHashLocation(): [string, (to: string) => void] {
  const [loc, setLoc] = useLocation();
  return [loc, setLoc];
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen]     = useState(false);
  const [loc] = useLocation();
  const dropRef = useRef<HTMLDivElement>(null);

  const primary = [
    { href: "/",       label: "Startsida" },
    { href: "/forum",  label: "Forum" },
    { href: "/nyheter", label: "Nyheter" },
    { href: "/kalender", label: "Kalender" },
    { href: "/blogg",  label: "Blogg" },
  ];

  const secondary = [
    { href: "/lexikon",            label: "📖 Lexikon" },
    { href: "/rattigheter",        label: "📖 Dina rättigheter" },
    { href: "/verktyg",            label: "⚖️ Juridiska verktyg" },
    { href: "/mallar-interaktiva", label: "70 interaktiva mallar" },
    { href: "/mallar",             label: "Mallar & texter" },
    { href: "/pdf-guider",         label: "PDF-guider" },
    { href: "/paket",              label: "Paket" },
    { href: "/om-appen",           label: "Om appen" },
    { href: "/funktioner",         label: "Funktioner" },
    { href: "/kontakt",            label: "Kontakt" },
  ];

  const allLinks = [...primary, ...secondary];

  const isActive = (href: string) =>
    href === "/" ? loc === "/" : loc.startsWith(href);

  const secondaryActive = secondary.some(l => isActive(l.href));

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img src={logoSrc} alt="Svar Direkt" className="h-10 w-10 rounded-lg object-cover" />
            <span className="font-semibold text-slate-900 text-[15px]">Svar Direkt</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {primary.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive(l.href)
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {l.label}
              </Link>
            ))}

            {/* "Mer" dropdown */}
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDropOpen(p => !p)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  secondaryActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Mer
                <svg
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  className={`transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`}
                >
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {dropOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-48 bg-white rounded-xl border border-slate-100 shadow-lg py-1.5 z-50">
                  {secondary.map(l => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setDropOpen(false)}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        isActive(l.href)
                          ? "text-primary font-medium bg-primary/5"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>


          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-slate-500 hover:bg-slate-50"
            onClick={() => setMobileOpen(p => !p)}
            aria-label="Meny"
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 flex flex-col gap-1">
            {allLinks.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive(l.href)
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

function Footer() {
  const sections = [
    {
      title: "Svar Direkt",
      links: [
        { label: "Startsida", href: "/" },
        { label: "Om appen", href: "/om-appen" },
        { label: "Forum", href: "/forum" },
        { label: "Blogg", href: "/blogg" },
        { label: "Kontakt", href: "/kontakt" },
      ],
    },
    {
      title: "Verktyg & Resurser",
      links: [
        { label: "📢 Senaste lagändringar", href: "/nyheter" },
        { label: "📅 Myndighetskalender", href: "/kalender" },
        { label: "📖 Lexikon", href: "/lexikon" },
        { label: "📖 Dina rättigheter", href: "/rattigheter" },
        { label: "⚖️ Juridiska verktyg", href: "/verktyg" },
        { label: "70 interaktiva mallar", href: "/mallar-interaktiva" },
      ],
    },
    {
      title: "Information",
      links: [
        { label: "Kontakt", href: "/kontakt" },
        { label: "Integritetspolicy", href: "/integritetspolicy.html" },
        { label: "Användarvillkor", href: "/anvandarvillkor.html" },
        { label: "Cookies", href: "/cookies.html" },
        { label: "Ansvarsfriskrivning", href: "/ansvarsfriskrivning.html" },
      ],
    },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src={logoSrc} alt="Svar Direkt" className="h-12 w-12 rounded-xl object-cover" />
              <span className="font-semibold text-white text-[15px]">Svar Direkt</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Färdiga mallar och snabba svar för verkliga situationer i Sverige.
            </p>
            <a href="mailto:info@svardirekt.site" className="text-sm text-slate-400 hover:text-white transition-colors block mb-4">
              info@svardirekt.site
            </a>
          </div>

          {sections.map((s) => (
            <div key={s.title}>
              <h4 className="text-white font-medium text-sm mb-3">{s.title}</h4>
              <ul className="space-y-2">
                {s.links.map((l) => (
                  <li key={l.label}>
                    {l.href.endsWith(".html") ? (
                      <a href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Hostinger affiliate */}
        <div className="mb-6 p-4 rounded-xl border border-slate-700 bg-slate-800/50">
          <HostingerBannerCompact />
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Svar Direkt. Alla rättigheter förbehållna.
          </p>
          <p className="text-xs text-slate-500">
            Byggt för människor i Sverige.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <WouterRouter base={BASE}>
      <CanonicalUpdater />
      <Switch>
        {/* Landing page — standalone, no navbar/footer */}
        <Route path="/landing" component={Landing} />

        {/* All other pages — full site layout */}
        <Route>
          <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-1">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/om-appen" component={AboutApp} />
                <Route path="/funktioner" component={Features} />
                <Route path="/paket" component={Packages} />
                <Route path="/pdf-guider" component={PdfGuides} />
                <Route path="/kontakt" component={Contact} />
                <Route path="/blogg/:slug" component={Blog} />
                <Route path="/blogg" component={Blog} />
                <Route path="/generator" component={Generator} />
                <Route path="/mallar" component={Mallar} />
                <Route path="/mallar-interaktiva" component={MallarInteraktiva} />
                <Route path="/verktyg" component={Verktyg} />
                <Route path="/tjanst" component={Tjanst} />
                <Route path="/forum" component={Forum} />
                <Route path="/rattigheter" component={Rattigheter} />
                <Route path="/kalender" component={Kalender} />
                <Route path="/lexikon" component={Lexikon} />
                <Route path="/nyheter" component={Nyheter} />
                {seoPages.map((p) => (
                  <Route key={p.slug} path={`/${p.slug}`}>
                    {() => <SeoLanding slug={p.slug} />}
                  </Route>
                ))}
                {seoGuidePages.map((p) => (
                  <Route key={p.slug} path={`/${p.slug}`}>
                    {() => <SeoGuide slug={p.slug} />}
                  </Route>
                ))}
                <Route component={NotFound} />
              </Switch>
            </main>
            <Footer />
            <CookieBanner />
          </div>
        </Route>
      </Switch>
    </WouterRouter>
  );
}
