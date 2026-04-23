import { useState } from "react";
import { Link } from "wouter";

type Right = {
  title: string;
  text: string;
  icon: string;
};

type Category = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  activeColor: string;
  rights: Right[];
};

const CATEGORIES: Category[] = [
  {
    id: "konsument",
    label: "Konsument",
    emoji: "🛒",
    color: "text-blue-600",
    activeColor: "bg-blue-600",
    rights: [
      {
        title: "Ångerrätt på nätet",
        icon: "↩️",
        text: "När du köper något på nätet har du alltid 14 dagars ångerrätt från den dag du tar emot varan. Du behöver inte ange någon anledning för att skicka tillbaka den.",
      },
      {
        title: "Tre års reklamationsrätt",
        icon: "🔧",
        text: "Om en vara går sönder och det inte är ditt fel, har du rätt att klaga (reklamera) i upp till tre år. Företaget måste laga varan, ge dig en ny eller ge pengarna tillbaka.",
      },
      {
        title: "Garanti är frivilligt, reklamation är lag",
        icon: "⚖️",
        text: 'Många företag säger "garantin har gått ut". Det spelar ingen roll – din lagstadgade reklamationsrätt på tre år gäller alltid, oavsett vad deras egen garanti säger.',
      },
      {
        title: "Avsluta abonnemang",
        icon: "✂️",
        text: "Du har alltid rätt att säga upp ett abonnemang (t.ex. gym eller telefon). Företaget får inte tvinga dig att stanna längre än den uppsägningstid som står i ditt avtal, oftast 1–3 månader.",
      },
      {
        title: "Inkasso får inte hota dig",
        icon: "🚫",
        text: "Ett inkassobolag får inte ringa dig mitt i natten, hota dig eller vara aggressiva. De måste följa god inkassosed. Om du anser att en skuld är felaktig har du rätt att bestrida den – då pausas kravet.",
      },
    ],
  },
  {
    id: "medborgare",
    label: "Medborgare",
    emoji: "🏛️",
    color: "text-violet-600",
    activeColor: "bg-violet-600",
    rights: [
      {
        title: "Rätt att överklaga",
        icon: "📋",
        text: "Om en myndighet (t.ex. Försäkringskassan eller Migrationsverket) fattar ett beslut du inte håller med om, har du alltid rätt att överklaga. Myndigheten är skyldig att berätta för dig exakt hur du gör.",
      },
      {
        title: "Rätt till tolk",
        icon: "🗣️",
        text: "Om du inte pratar eller förstår svenska tillräckligt bra, har du rätt till en gratis tolk när du har möte med sjukvården, polisen eller andra myndigheter.",
      },
      {
        title: "Offentlighetsprincipen",
        icon: "📂",
        text: "Du har rätt att läsa nästan alla dokument som skickas till eller från svenska myndigheter. Du kan mejla en kommun och be att få se specifika handlingar, och de måste svara snabbt.",
      },
      {
        title: "Myndigheters serviceskyldighet",
        icon: "🤝",
        text: "En myndighet måste hjälpa dig att förstå hur du ska fylla i blanketter och svara på dina frågor. De får inte bara hänvisa till en krånglig webbsida om du ber om personlig hjälp.",
      },
    ],
  },
  {
    id: "hyresgast",
    label: "Hyresgäst",
    emoji: "🏠",
    color: "text-emerald-600",
    activeColor: "bg-emerald-600",
    rights: [
      {
        title: "Hyresvärden får inte gå in hur som helst",
        icon: "🔑",
        text: "Din hyresvärd får aldrig gå in i din lägenhet utan din tillåtelse, förutom i akuta nödsituationer (t.ex. vattenläcka). De måste alltid boka tid med dig först.",
      },
      {
        title: "Rätt till en fungerande bostad",
        icon: "🔨",
        text: "Om kylen går sönder eller det är iskallt i lägenheten, är det hyresvärdens ansvar att fixa det snabbt. Om de väntar för länge kan du ha rätt till sänkt hyra under tiden felet fanns.",
      },
      {
        title: "Uppsägningstid",
        icon: "📅",
        text: "Även om du hyr i andra hand har du rättigheter. Du kan inte bli utkastad från en dag till en annan. Det finns alltid en lagstadgad uppsägningstid som måste följas.",
      },
      {
        title: "Oskälig hyra i andra hand",
        icon: "💰",
        text: "Om du hyr en lägenhet i andra hand och betalar mycket mer än vad förstahandshyresgästen betalar, kan du i efterhand kräva tillbaka pengar via Hyresnämnden.",
      },
    ],
  },
  {
    id: "anstalld",
    label: "Anställd",
    emoji: "💼",
    color: "text-orange-600",
    activeColor: "bg-orange-600",
    rights: [
      {
        title: "Krav på saklig grund för uppsägning",
        icon: "🛡️",
        text: 'Din chef kan inte sparka dig bara för att de inte gillar dig. Det måste finnas en "saklig grund", till exempel arbetsbrist eller att du allvarligt misskött ditt jobb.',
      },
      {
        title: "Rätt till anställningsavtal",
        icon: "📝",
        text: "Senast en månad efter att du börjat jobba måste du få ett skriftligt avtal som visar din lön, dina arbetstider och dina arbetsuppgifter. Muntliga avtal gäller, men skriftliga är ett lagkrav.",
      },
      {
        title: "Sjuklön från dag två",
        icon: "🏥",
        text: "Den första dagen du är sjuk är en karensdag (du får ett litet avdrag), men från dag två till dag 14 är din arbetsgivare skyldig att betala dig sjuklön (80% av din lön).",
      },
      {
        title: "Skyddad del av lönen (Förbehållsbelopp)",
        icon: "🔒",
        text: 'Även om du har skulder hos Kronofogden och de gör löneutmätning, får de aldrig ta hela din lön. Du har alltid rätt att behålla ett "förbehållsbelopp" som ska täcka hyra, mat och grundläggande levnadskostnader.',
      },
    ],
  },
];

const tabAccent: Record<string, string> = {
  konsument: "border-blue-600 text-blue-700 bg-blue-50",
  medborgare: "border-violet-600 text-violet-700 bg-violet-50",
  hyresgast: "border-emerald-600 text-emerald-700 bg-emerald-50",
  anstalld: "border-orange-600 text-orange-700 bg-orange-50",
};

const cardBorder: Record<string, string> = {
  konsument: "border-blue-100 hover:border-blue-300",
  medborgare: "border-violet-100 hover:border-violet-300",
  hyresgast: "border-emerald-100 hover:border-emerald-300",
  anstalld: "border-orange-100 hover:border-orange-300",
};

const iconBg: Record<string, string> = {
  konsument: "bg-blue-50 text-blue-600",
  medborgare: "bg-violet-50 text-violet-600",
  hyresgast: "bg-emerald-50 text-emerald-600",
  anstalld: "bg-orange-50 text-orange-600",
};

export default function Rattigheter() {
  const [active, setActive] = useState("konsument");
  const cat = CATEGORIES.find((c) => c.id === active)!;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-14 px-4 sm:px-6 border-b border-slate-100">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            Dina rättigheter
          </span>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
            Förstå dina rättigheter – utan juridiskt krångel
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
            En enkel guide till vad du faktiskt har rätt till som konsument, medborgare, hyresgäst och anställd i Sverige. Klara besked, inga konstiga ord.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="sticky top-16 z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto gap-1 py-2 scrollbar-hide">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border-2 ${
                  active === c.id
                    ? tabAccent[c.id]
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <span className="text-base">{c.emoji}</span>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {cat.rights.map((r) => (
            <div
              key={r.title}
              className={`bg-white rounded-2xl border-2 p-5 shadow-sm transition-all ${cardBorder[cat.id]}`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg ${iconBg[cat.id]}`}>
                  {r.icon}
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-[15px] mb-1.5 leading-snug">
                    {r.title}
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {r.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary to-primary/80 py-14 px-4 sm:px-6 mx-4 sm:mx-6 mb-10 rounded-3xl max-w-4xl md:mx-auto">
        <div className="text-center">
          <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-2">
            Nästa steg
          </p>
          <h2 className="text-2xl font-bold text-white mb-3 leading-snug">
            Behöver du hävda din rätt?
          </h2>
          <p className="text-white/80 text-sm mb-7 max-w-md mx-auto leading-relaxed">
            Använd våra färdiga mallar för att skriva till företag och myndigheter. Tydliga brev, rätt ton – utan att du behöver kunna juridik.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/mallar-interaktiva"
              className="inline-block px-6 py-3 bg-white text-primary font-bold rounded-xl shadow hover:shadow-md hover:scale-105 transition-all text-sm"
            >
              70 gratis brevmallar →
            </Link>
            <Link
              href="/paket"
              className="inline-block px-6 py-3 bg-white/15 text-white border border-white/30 font-semibold rounded-xl hover:bg-white/25 transition-all text-sm"
            >
              Se alla paket
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <p className="text-center text-xs text-slate-400 pb-10 px-4">
        Informationen är ett pedagogiskt sammandrag och ersätter inte juridisk rådgivning. Kontakta en jurist vid komplexa ärenden.
      </p>
    </div>
  );
}
