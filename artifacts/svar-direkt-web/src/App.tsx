import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { useState } from "react";
import Home from "@/pages/Home";
import AboutApp from "@/pages/AboutApp";
import Features from "@/pages/Features";
import Packages from "@/pages/Packages";
import PdfGuides from "@/pages/PdfGuides";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import Generator from "@/pages/Generator";
import NotFound from "@/pages/not-found";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function useHashLocation(): [string, (to: string) => void] {
  const [loc, setLoc] = useLocation();
  return [loc, setLoc];
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [loc] = useLocation();

  const links = [
    { href: "/", label: "Startsida" },
    { href: "/om-appen", label: "Om appen" },
    { href: "/funktioner", label: "Funktioner" },
    { href: "/paket", label: "Paket" },
    { href: "/pdf-guider", label: "PDF-guider" },
    { href: "/blogg", label: "Blogg" },
    { href: "/generator", label: "Textgenerator" },
    { href: "/kontakt", label: "Kontakt" },
  ];

  const isActive = (href: string) =>
    href === "/" ? loc === "/" : loc.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="14" height="10" rx="2" fill="white" fillOpacity="0.9"/>
                <rect x="2" y="14" width="6" height="2" rx="1" fill="white" fillOpacity="0.7"/>
                <rect x="10" y="14" width="6" height="2" rx="1" fill="white" fillOpacity="0.7"/>
              </svg>
            </div>
            <span className="font-semibold text-slate-900 text-[15px]">Svar Direkt</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
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
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/paket"
              className="text-sm font-medium text-primary hover:underline"
            >
              Se paket
            </Link>
            <a
              href="https://payhip.com/b/WxtV3"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Ladda ner appen
            </a>
          </div>

          <button
            className="md:hidden p-2 rounded-md text-slate-500 hover:bg-slate-50"
            onClick={() => setOpen(!open)}
            aria-label="Meny"
          >
            {open ? (
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

        {open && (
          <div className="md:hidden border-t border-slate-100 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive(l.href)
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-2 mt-1 border-t border-slate-100 flex flex-col gap-2">
              <a
                href="https://payhip.com/b/WxtV3"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2.5 rounded-lg bg-primary text-white text-sm font-medium text-center"
                onClick={() => setOpen(false)}
              >
                Ladda ner appen
              </a>
            </div>
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
        { label: "Funktioner", href: "/funktioner" },
        { label: "Hur det fungerar", href: "/#hur-det-fungerar" },
        { label: "Blogg", href: "/blogg" },
      ],
    },
    {
      title: "Produkter",
      links: [
        { label: "Paket", href: "/paket" },
        { label: "PDF-guider", href: "/pdf-guider" },
        { label: "Snabba svar – Arbete", href: "/paket" },
        { label: "Snabba svar – Relationer", href: "/paket" },
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
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="2" width="14" height="10" rx="2" fill="white" fillOpacity="0.9"/>
                  <rect x="2" y="14" width="6" height="2" rx="1" fill="white" fillOpacity="0.7"/>
                  <rect x="10" y="14" width="6" height="2" rx="1" fill="white" fillOpacity="0.7"/>
                </svg>
              </div>
              <span className="font-semibold text-white text-[15px]">Svar Direkt</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Färdiga mallar och snabba svar för verkliga situationer i Sverige.
            </p>
            <div className="mt-4">
              <a href="mailto:info@svardirekt.se" className="text-sm text-slate-400 hover:text-white transition-colors">
                info@svardirekt.se
              </a>
            </div>
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
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
      </div>
    </WouterRouter>
  );
}
