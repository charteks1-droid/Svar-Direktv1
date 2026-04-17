import { useState, useEffect, useRef } from "react";

const DOWNLOADS: { name: string; city: string }[] = [
  { name: "Anna K.", city: "Stockholm" },
  { name: "Erik L.", city: "Göteborg" },
  { name: "Maria J.", city: "Malmö" },
  { name: "Johan S.", city: "Uppsala" },
  { name: "Sara N.", city: "Västerås" },
  { name: "David H.", city: "Örebro" },
  { name: "Emma B.", city: "Linköping" },
  { name: "Lars M.", city: "Helsingborg" },
  { name: "Sofia P.", city: "Jönköping" },
  { name: "Anders G.", city: "Norrköping" },
  { name: "Fatima A.", city: "Lund" },
  { name: "Mohammed K.", city: "Umeå" },
  { name: "Ingrid T.", city: "Gävle" },
  { name: "Peter W.", city: "Borås" },
  { name: "Kristina F.", city: "Södertälje" },
  { name: "Ahmed R.", city: "Eskilstuna" },
  { name: "Helena C.", city: "Halmstad" },
  { name: "Mikael D.", city: "Växjö" },
  { name: "Nadia O.", city: "Karlstad" },
  { name: "Stefan V.", city: "Sundsvall" },
  { name: "Johanna E.", city: "Östersund" },
  { name: "Marcus R.", city: "Trollhättan" },
  { name: "Leila S.", city: "Luleå" },
  { name: "Tobias H.", city: "Borlänge" },
  { name: "Cecilia A.", city: "Falun" },
  { name: "Ivan P.", city: "Kalmar" },
  { name: "Maja L.", city: "Kristianstad" },
  { name: "Oscar B.", city: "Skövde" },
  { name: "Aisha M.", city: "Karlskrona" },
  { name: "Gustav K.", city: "Nacka" },
  { name: "Linnea S.", city: "Täby" },
  { name: "Carlos M.", city: "Huddinge" },
  { name: "Elin T.", city: "Solna" },
  { name: "Björn F.", city: "Haninge" },
  { name: "Zara N.", city: "Järfälla" },
  { name: "Viktor A.", city: "Tyresö" },
  { name: "Reza H.", city: "Botkyrka" },
  { name: "Klara O.", city: "Lidingö" },
  { name: "Daniel C.", city: "Upplands Väsby" },
  { name: "Miriam S.", city: "Värnamo" },
];

const MINUTES = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function RecentDownload() {
  const [visible, setVisible] = useState(false);
  const [entry, setEntry] = useState({ name: "Anna K.", city: "Stockholm", minutes: 3 });
  const usedRef = useRef<Set<number>>(new Set());

  const showNext = () => {
    let idx: number;
    do {
      idx = Math.floor(Math.random() * DOWNLOADS.length);
    } while (usedRef.current.has(idx) && usedRef.current.size < DOWNLOADS.length);

    if (usedRef.current.size >= DOWNLOADS.length) usedRef.current.clear();
    usedRef.current.add(idx);

    setEntry({
      ...DOWNLOADS[idx],
      minutes: randomItem(MINUTES),
    });
    setVisible(true);
  };

  useEffect(() => {
    const initialDelay = setTimeout(() => {
      showNext();
    }, 4000);

    return () => clearTimeout(initialDelay);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const hideTimer = setTimeout(() => setVisible(false), 4500);
    return () => clearTimeout(hideTimer);
  }, [visible, entry]);

  useEffect(() => {
    if (visible) return;
    const nextDelay = setTimeout(() => showNext(), 7000 + Math.random() * 5000);
    return () => clearTimeout(nextDelay);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-20 left-3 z-50 max-w-[260px] pointer-events-none"
      style={{
        animation: "slideInLeft 0.4s ease-out",
      }}
    >
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3.5 py-2.5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-lg">
          📲
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-slate-800 truncate">
            {entry.name} från {entry.city}
          </p>
          <p className="text-[10px] text-slate-500 leading-tight">
            laddade ner appen · {entry.minutes} min sedan
          </p>
        </div>
      </div>
    </div>
  );
}
