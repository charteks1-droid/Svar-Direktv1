import { Link } from "wouter";

const DOWNLOAD_BASE = "/api/download/";

const guides = [
  {
    id: "inkasso-och-kronofogden",
    title: "Inkasso och Kronofogden",
    subtitle: "Hur vanliga människor tar tillbaka kontrollen",
    desc: "En praktisk guide som förklarar hur inkasso och Kronofogden verkligen fungerar – bortom skrämselbrev och myndighetsspråk. Lär dig vad du har rätt att göra, hur du agerar strategiskt och hur du tar tillbaka kontrollen.",
    topics: [
      "Vad inkasso faktiskt får och inte får göra",
      "Hur du bestrider ett inkassokrav",
      "Kronofogden – steg för steg",
      "Hur du undviker betalningsanmärkning",
      "Skuldsanering – vem kan ansöka?",
      "Agera lugnt istället för i panik",
    ],
    pages: "ca 80 sidor",
    format: "PDF",
    price: "29 kr",
    badge: "Ekonomiguide",
    badgeColor: "#e17055",
    downloadFile: "inkasso-och-kronofogden.pdf",
    payhipUrl: "https://payhip.com/b/kcqCZ",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="3" width="20" height="22" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M9 9h10M9 13h10M9 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "tjana-pengar-sverige-2025",
    title: "30 sätt att tjäna pengar i Sverige 2025",
    subtitle: "Utan investering – bara tid och initiativ",
    desc: "30 konkreta och beprövade sätt att tjäna pengar i Sverige utan att investera en krona. Från översättning och städning till digital coaching och sociala medier. Alla idéer går att börja med direkt.",
    topics: [
      "Tjäna pengar utan startkapital",
      "Digitala sidoinkomster",
      "Lokala tjänster med stor efterfrågan",
      "Plattformar och marknadsplatser",
      "Frilansarbete och fakturering",
      "Skalningsbara idéer för Sverige",
    ],
    pages: "ca 15 sidor",
    format: "PDF",
    price: "29 kr",
    badge: "Praktisk guide",
    badgeColor: "#0984e3",
    downloadFile: "30-satt-att-tjana-pengar-sverige-2025.pdf",
    payhipUrl: "https://payhip.com/b/ZM38i",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M14 9v10M11 11.5c0-1.38 1.34-2.5 3-2.5s3 1.12 3 2.5S17 14 14 14s-3 1.12-3 2.5S12.34 19 14 19s3-1.12 3-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "overklagan-csn",
    title: "Överklagan till CSN",
    subtitle: "Skriv rätt – få rätt",
    desc: "En praktisk guide med färdiga mallar och tydliga instruktioner för att överklaga beslut från CSN. Perfekt vid avslag på lån, felaktiga återkrav eller ändrad studietakt.",
    topics: [
      "Hur du läser och förstår CSN:s beslut",
      "Steg-för-steg att skriva en överklagan",
      "Färdig mall att fylla i direkt",
      "Vad du måste skicka med som bilaga",
      "Tidsfrister och vart du skickar",
      "Vad händer efter att du överklagat?",
    ],
    pages: "ca 10 sidor",
    format: "PDF",
    price: "5 kr",
    badge: "Överklagan",
    badgeColor: "#6c5ce7",
    downloadFile: "overklagan-csn.pdf",
    payhipUrl: "https://payhip.com/b/3K12w",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="3" width="20" height="22" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M9 9h10M9 13h10M9 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="20" cy="20" r="5" fill="white" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M18 20l1.5 1.5L22 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "overklagan-migrationsverket",
    title: "Överklagan till Migrationsverket",
    subtitle: "Ta tillbaka din rätt att stanna",
    desc: "Guide med mallar och vägledning för att överklaga avslag från Migrationsverket – uppehållstillstånd, asyl eller visum. Anpassad för den som inte har juridisk bakgrund.",
    topics: [
      "Förstå Migrationsverkets avslagsbeslut",
      "Skillnaden mellan omprövning och överklagan",
      "Färdig mall för överklagandet",
      "Vilka dokument och bevis du ska bifoga",
      "Tidsfrist – viktigt att agera snabbt",
      "Förvaltningsrätten – vad händer sen?",
    ],
    pages: "ca 10 sidor",
    format: "PDF",
    price: "5 kr",
    badge: "Överklagan",
    badgeColor: "#6c5ce7",
    downloadFile: "overklagan-migrationsverket.pdf",
    payhipUrl: "https://payhip.com/b/MI8mo",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="3" width="20" height="22" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M9 9h10M9 13h10M9 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="20" cy="20" r="5" fill="white" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M18 20l1.5 1.5L22 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "overklagan-arbetsformedlingen",
    title: "Överklagan till Arbetsförmedlingen",
    subtitle: "Känn till dina rättigheter som arbetssökande",
    desc: "Praktisk guide med färdiga mallar för att överklaga beslut från Arbetsförmedlingen – avslag på ersättning, varningar eller krav på återbetalning av a-kassa.",
    topics: [
      "Förstå Arbetsförmedlingens beslutsbrev",
      "Hur du bestrider en varning eller avstängning",
      "Färdig mall för överklagandet",
      "Vad som räknas som giltig frånvaro",
      "IAF – vad de granskar och hur",
      "Tidsfrist och vart du skickar handlingarna",
    ],
    pages: "ca 10 sidor",
    format: "PDF",
    price: "5 kr",
    badge: "Överklagan",
    badgeColor: "#6c5ce7",
    downloadFile: "overklagan-arbetsformedlingen.pdf",
    payhipUrl: "https://payhip.com/b/2bwR1",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="3" width="20" height="22" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M9 9h10M9 13h10M9 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="20" cy="20" r="5" fill="white" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M18 20l1.5 1.5L22 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function PdfGuides() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          PDF-guider
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
          Praktiska guider för verkliga situationer
        </h1>
        <p className="text-slate-500 text-base max-w-xl leading-relaxed">
          Våra PDF-guider förklarar komplicerade ämnen på ett enkelt och tydligt sätt. Perfekt att ha sparad på telefonen. Letar du efter färdiga mallar istället? Se vår{" "}
          <Link href="/mallar" className="text-primary underline hover:no-underline">samling av jobbansökningsmallar</Link>{" "}
          eller{" "}
          <Link href="/funktioner" className="text-primary underline hover:no-underline">appens alla funktioner</Link>.
        </p>
      </div>

      {/* Info */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-10 flex gap-4 items-start">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary mt-0.5">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M9 8v5M9 6h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <div className="font-semibold text-slate-900 text-sm mb-1">Om PDF-guiderna</div>
          <p className="text-slate-500 text-xs leading-relaxed">
            PDF-guiderna är fristående dokument som köps separat och laddas ner direkt till din enhet. Utformade för att vara enkla att läsa och spara på telefonen för offline-användning.
          </p>
        </div>
      </div>

      {/* Guides */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {guides.map((guide) => (
          <div
            key={guide.id}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
          >
            <div className="p-6 flex-1">
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                  {guide.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-tight mb-1">{guide.title}</h3>
                  <div
                    className="text-xs font-medium px-2 py-0.5 rounded-full inline-block text-white"
                    style={{ backgroundColor: guide.badgeColor }}
                  >
                    {guide.badge}
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-500 leading-relaxed mb-1 font-medium">{guide.subtitle}</p>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">{guide.desc}</p>

              {/* Topics */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Innehåll</div>
                <ul className="space-y-1.5">
                  {guide.topics.map((topic) => (
                    <li key={topic} className="flex items-center gap-2 text-xs text-slate-600">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-primary flex-shrink-0">
                        <path d="M2 6l2.5 2.5L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Meta */}
              <div className="flex gap-3">
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="1.5" y="1.5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1"/>
                    <path d="M3.5 4h5M3.5 6h5M3.5 8h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                  {guide.pages}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 2v6M4 6l2 2 2-2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 9h8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                  {guide.format}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 p-4 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-2xl font-bold text-slate-900">{guide.price}</span>
                <span className="text-xs text-slate-400 ml-1">engångspris</span>
              </div>
              <div className="flex gap-2">
                <a
                  href={guide.payhipUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Köp – {guide.price}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Related content */}
      <div className="mb-8 bg-slate-50 rounded-2xl border border-slate-100 p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-1">Relaterat innehåll</h2>
        <p className="text-xs text-slate-400 mb-4">Andra sidor som kan vara till hjälp</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { href: "/mallar", label: "Jobbansökningsmallar", desc: "15 färdiga mallar att redigera direkt" },
            { href: "/funktioner", label: "Appens alla funktioner", desc: "52+ myndighetmallar, snabba svar och mer" },
            { href: "/om-appen", label: "Om Svar Direkt", desc: "Vad appen är och vem den är till för" },
            { href: "/blogg", label: "Blogg och guider", desc: "Artiklar om myndigheter och kommunikation" },
          ].map(item => (
            <Link key={item.href} href={item.href} className="flex items-start gap-2 p-3 bg-white rounded-xl border border-slate-100 hover:border-primary/30 transition-colors group">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-primary mt-0.5 flex-shrink-0">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <div className="text-sm font-medium text-slate-800 group-hover:text-primary transition-colors">{item.label}</div>
                <div className="text-xs text-slate-400">{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
        <h3 className="font-bold text-slate-900 mb-4">Vanliga frågor om PDF-guiderna</h3>
        <div className="space-y-4">
          {[
            {
              q: "Hur tar jag del av PDF-guiden?",
              a: "Du köper guiden och laddar ner den direkt till din enhet. Du kan öppna den i din mobils PDF-läsare eller spara den för offline-läsning.",
            },
            {
              q: "Är guiderna på svenska?",
              a: "Ja, samtliga guider är skrivna på svenska och anpassade för svenska förhållanden och lagstiftning.",
            },
            {
              q: "Kan jag läsa guiden offline?",
              a: "Ja. När du har laddat ner PDF-filen kan du läsa den utan internetanslutning.",
            },
            {
              q: "Vad är skillnaden mellan PDF-guiderna och appen?",
              a: "PDF-guiderna är fristående dokument om specifika ämnen (inkasso, tjäna pengar). Appen innehåller interaktiva mallar och färdiga fraser för myndighetskommunikation. De kompletterar varandra.",
            },
          ].map((faq) => (
            <div key={faq.q} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="font-medium text-slate-900 text-sm mb-1">{faq.q}</div>
              <div className="text-slate-500 text-xs leading-relaxed">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
