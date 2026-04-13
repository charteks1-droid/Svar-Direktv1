import { useState } from "react";

function copyToClipboard(text: string, setCopied: (v: boolean) => void) {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  });
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40";
const textareaCls = inputCls + " resize-none";

// ─── CV Generator ────────────────────────────────────────────────────────────

interface WorkEntry { arbetsgivare: string; tjanst: string; start: string; slut: string; uppgifter: string }
interface EduEntry  { skola: string; utbildning: string; start: string; slut: string }

function emptyWork(): WorkEntry { return { arbetsgivare: "", tjanst: "", start: "", slut: "", uppgifter: "" }; }
function emptyEdu(): EduEntry   { return { skola: "", utbildning: "", start: "", slut: "" }; }

function CVGenerator() {
  const [fornamn, setFornamn]   = useState("");
  const [efternamn, setEfternamn] = useState("");
  const [pnr, setPnr]           = useState("");
  const [tel, setTel]           = useState("");
  const [epost, setEpost]       = useState("");
  const [adress, setAdress]     = useState("");
  const [work, setWork]         = useState<WorkEntry[]>([emptyWork(), emptyWork()]);
  const [edu, setEdu]           = useState<EduEntry[]>([emptyEdu(), emptyEdu()]);
  const [komp, setKomp]         = useState("");
  const [sprak, setSprak]       = useState("");
  const [result, setResult]     = useState("");
  const [copied, setCopied]     = useState(false);

  function updateWork(i: number, k: keyof WorkEntry, v: string) {
    setWork(prev => prev.map((w, idx) => idx === i ? { ...w, [k]: v } : w));
  }
  function updateEdu(i: number, k: keyof EduEntry, v: string) {
    setEdu(prev => prev.map((e, idx) => idx === i ? { ...e, [k]: v } : e));
  }

  function generate() {
    const lines: string[] = ["CV", ""];
    const namn = [fornamn, efternamn].filter(Boolean).join(" ");
    if (namn)   lines.push(`Namn: ${namn}`);
    if (pnr)    lines.push(`Personnummer: ${pnr}`);
    if (tel)    lines.push(`Telefon: ${tel}`);
    if (epost)  lines.push(`E-post: ${epost}`);
    if (adress) lines.push(`Adress: ${adress}`);

    const validWork = work.filter(w => w.tjanst || w.arbetsgivare);
    if (validWork.length) {
      lines.push("", "Arbetslivserfarenhet:");
      validWork.forEach(w => {
        const period = [w.start, w.slut].filter(Boolean).join(" – ");
        const header = [w.tjanst, w.arbetsgivare ? `hos ${w.arbetsgivare}` : "", period ? `(${period})` : ""].filter(Boolean).join(" ");
        lines.push(`\n• ${header}`);
        if (w.uppgifter) lines.push(`  Arbetsuppgifter: ${w.uppgifter}`);
      });
    }

    const validEdu = edu.filter(e => e.utbildning || e.skola);
    if (validEdu.length) {
      lines.push("", "Utbildning:");
      validEdu.forEach(e => {
        const period = [e.start, e.slut].filter(Boolean).join(" – ");
        const header = [e.utbildning, e.skola ? `vid ${e.skola}` : "", period ? `(${period})` : ""].filter(Boolean).join(" ");
        lines.push(`• ${header}`);
      });
    }

    if (komp)  lines.push("", "Kompetenser:", komp);
    if (sprak) lines.push("", "Språk:", sprak);

    setResult(lines.join("\n"));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col gap-5">
        <h3 className="font-semibold text-slate-800 text-base">Personuppgifter</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Förnamn *"><input className={inputCls} value={fornamn} onChange={e => setFornamn(e.target.value)} placeholder="Anna" /></Field>
          <Field label="Efternamn *"><input className={inputCls} value={efternamn} onChange={e => setEfternamn(e.target.value)} placeholder="Svensson" /></Field>
          <Field label="Personnummer"><input className={inputCls} value={pnr} onChange={e => setPnr(e.target.value)} placeholder="ÅÅMMDD-XXXX" /></Field>
          <Field label="Telefonnummer"><input className={inputCls} value={tel} onChange={e => setTel(e.target.value)} placeholder="+46 70 000 00 00" /></Field>
          <Field label="E-post"><input className={inputCls} type="email" value={epost} onChange={e => setEpost(e.target.value)} placeholder="anna@example.se" /></Field>
          <Field label="Adress"><input className={inputCls} value={adress} onChange={e => setAdress(e.target.value)} placeholder="Storgatan 1, 111 11 Stockholm" /></Field>
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 text-base">Arbetslivserfarenhet</h3>
          <button onClick={() => setWork(p => [...p, emptyWork()])} className="text-xs text-primary font-medium hover:underline">+ Lägg till</button>
        </div>
        {work.map((w, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Erfarenhet {i + 1}</span>
              {work.length > 1 && <button onClick={() => setWork(p => p.filter((_, idx) => idx !== i))} className="text-xs text-red-400 hover:text-red-600">Ta bort</button>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Tjänst"><input className={inputCls} value={w.tjanst} onChange={e => updateWork(i, "tjanst", e.target.value)} placeholder="Kundtjänstmedarbetare" /></Field>
              <Field label="Arbetsgivare"><input className={inputCls} value={w.arbetsgivare} onChange={e => updateWork(i, "arbetsgivare", e.target.value)} placeholder="AB Företaget" /></Field>
              <Field label="Startdatum"><input className={inputCls} value={w.start} onChange={e => updateWork(i, "start", e.target.value)} placeholder="jan 2022" /></Field>
              <Field label="Slutdatum"><input className={inputCls} value={w.slut} onChange={e => updateWork(i, "slut", e.target.value)} placeholder="dec 2023" /></Field>
            </div>
            <Field label="Arbetsuppgifter"><textarea className={textareaCls} rows={2} value={w.uppgifter} onChange={e => updateWork(i, "uppgifter", e.target.value)} placeholder="Beskriv dina arbetsuppgifter kortfattat…" /></Field>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 text-base">Utbildning</h3>
          <button onClick={() => setEdu(p => [...p, emptyEdu()])} className="text-xs text-primary font-medium hover:underline">+ Lägg till</button>
        </div>
        {edu.map((e, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Utbildning {i + 1}</span>
              {edu.length > 1 && <button onClick={() => setEdu(p => p.filter((_, idx) => idx !== i))} className="text-xs text-red-400 hover:text-red-600">Ta bort</button>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Utbildning"><input className={inputCls} value={e.utbildning} onChange={ev => updateEdu(i, "utbildning", ev.target.value)} placeholder="Gymnasieutbildning" /></Field>
              <Field label="Skola"><input className={inputCls} value={e.skola} onChange={ev => updateEdu(i, "skola", ev.target.value)} placeholder="Stockholms gymnasium" /></Field>
              <Field label="Startdatum"><input className={inputCls} value={e.start} onChange={ev => updateEdu(i, "start", ev.target.value)} placeholder="aug 2018" /></Field>
              <Field label="Slutdatum"><input className={inputCls} value={e.slut} onChange={ev => updateEdu(i, "slut", ev.target.value)} placeholder="jun 2021" /></Field>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col gap-4">
        <h3 className="font-semibold text-slate-800 text-base">Kompetenser & språk</h3>
        <Field label="Kompetenser"><textarea className={textareaCls} rows={2} value={komp} onChange={e => setKomp(e.target.value)} placeholder="Microsoft Office, körkort, kundservice…" /></Field>
        <Field label="Språk"><input className={inputCls} value={sprak} onChange={e => setSprak(e.target.value)} placeholder="Svenska (modersmål), Engelska (flytande)" /></Field>
      </div>

      <button onClick={generate} className="w-full py-3 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors">
        Generera CV
      </button>

      {result && (
        <div className="bg-slate-900 rounded-2xl p-5 flex flex-col gap-3">
          <pre className="text-slate-100 text-sm whitespace-pre-wrap leading-relaxed font-mono">{result}</pre>
          <button
            onClick={() => copyToClipboard(result, setCopied)}
            className="self-start px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {copied ? "✓ Kopierat!" : "Kopiera CV"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Personal Letter ──────────────────────────────────────────────────────────

function PersonligtBrev() {
  const [namn, setNamn]         = useState("");
  const [tjanst, setTjanst]     = useState("");
  const [foretag, setForetag]   = useState("");
  const [erfarenhet, setErfarenhet] = useState("");
  const [styrkor, setStyrkor]   = useState("");
  const [motivation, setMotivation] = useState("");
  const [result, setResult]     = useState("");
  const [copied, setCopied]     = useState(false);

  function generate() {
    const lines: string[] = [];
    lines.push("Hej,", "");
    if (namn && tjanst && foretag)
      lines.push(`Jag heter ${namn} och söker tjänsten som ${tjanst} hos ${foretag}.`);
    else if (namn && tjanst)
      lines.push(`Jag heter ${namn} och söker tjänsten som ${tjanst}.`);
    else
      lines.push("Jag söker denna tjänst med stort intresse.");

    if (erfarenhet) { lines.push("", "Jag har erfarenhet av:", erfarenhet); }
    if (styrkor)    { lines.push("", "Mina styrkor:", styrkor); }
    if (motivation) { lines.push("", "Jag är intresserad av tjänsten eftersom:", motivation); }

    lines.push("", "Jag ser fram emot möjligheten att berätta mer om mig själv.", "");
    lines.push("Med vänliga hälsningar,");
    if (namn) lines.push(namn);

    setResult(lines.join("\n"));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col gap-4">
        <h3 className="font-semibold text-slate-800 text-base">Uppgifter</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Ditt namn *"><input className={inputCls} value={namn} onChange={e => setNamn(e.target.value)} placeholder="Anna Svensson" /></Field>
          <Field label="Tjänst som söks *"><input className={inputCls} value={tjanst} onChange={e => setTjanst(e.target.value)} placeholder="Kundtjänstmedarbetare" /></Field>
          <Field label="Företag / organisation" ><input className={inputCls} value={foretag} onChange={e => setForetag(e.target.value)} placeholder="AB Företaget" /></Field>
        </div>
        <Field label="Erfarenhet">
          <textarea className={textareaCls} rows={3} value={erfarenhet} onChange={e => setErfarenhet(e.target.value)} placeholder="Beskriv relevant arbetslivserfarenhet…" />
        </Field>
        <Field label="Mina styrkor">
          <textarea className={textareaCls} rows={3} value={styrkor} onChange={e => setStyrkor(e.target.value)} placeholder="T.ex. strukturerad, kommunikativ, lösningsorienterad…" />
        </Field>
        <Field label="Varför söker du tjänsten?">
          <textarea className={textareaCls} rows={3} value={motivation} onChange={e => setMotivation(e.target.value)} placeholder="Beskriv din motivation…" />
        </Field>
      </div>

      <button onClick={generate} className="w-full py-3 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors">
        Generera brev
      </button>

      {result && (
        <div className="bg-slate-900 rounded-2xl p-5 flex flex-col gap-3">
          <pre className="text-slate-100 text-sm whitespace-pre-wrap leading-relaxed font-mono">{result}</pre>
          <button
            onClick={() => copyToClipboard(result, setCopied)}
            className="self-start px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {copied ? "✓ Kopierat!" : "Kopiera brev"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Authority Message ────────────────────────────────────────────────────────

const MYNDIGHETER = [
  "Skatteverket",
  "Kronofogden",
  "Försäkringskassan",
  "Migrationsverket",
  "Arbetsförmedlingen",
  "Boverket",
  "Socialtjänsten",
  "Annan myndighet",
];

function MyndighetsMeddelande() {
  const [myndighet, setMyndighet] = useState("");
  const [arende, setArende]       = useState("");
  const [pnr, setPnr]             = useState("");
  const [namn, setNamn]           = useState("");
  const [meddelande, setMeddelande] = useState("");
  const [result, setResult]       = useState("");
  const [copied, setCopied]       = useState(false);

  function generate() {
    const lines: string[] = [];
    const till = myndighet || "Er myndighet";
    lines.push(`Till ${till},`, "");

    if (arende) lines.push(`Jag kontaktar er angående: ${arende}`, "");

    const hasInfo = namn || pnr;
    if (hasInfo) {
      lines.push("Mina uppgifter:");
      if (namn) lines.push(`Namn: ${namn}`);
      if (pnr)  lines.push(`Personnummer: ${pnr}`);
      lines.push("");
    }

    if (meddelande) lines.push(meddelande, "");

    lines.push("Jag ser fram emot ert svar.", "");
    lines.push("Med vänliga hälsningar,");
    if (namn) lines.push(namn);

    setResult(lines.join("\n"));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col gap-4">
        <h3 className="font-semibold text-slate-800 text-base">Uppgifter</h3>
        <Field label="Myndighet *">
          <select className={inputCls} value={myndighet} onChange={e => setMyndighet(e.target.value)}>
            <option value="">Välj myndighet…</option>
            {MYNDIGHETER.map(m => <option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Ärende *">
          <input className={inputCls} value={arende} onChange={e => setArende(e.target.value)} placeholder="Vad gäller kontakten?" />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Namn *"><input className={inputCls} value={namn} onChange={e => setNamn(e.target.value)} placeholder="Anna Svensson" /></Field>
          <Field label="Personnummer"><input className={inputCls} value={pnr} onChange={e => setPnr(e.target.value)} placeholder="ÅÅMMDD-XXXX" /></Field>
        </div>
        <Field label="Meddelande">
          <textarea className={textareaCls} rows={4} value={meddelande} onChange={e => setMeddelande(e.target.value)} placeholder="Beskriv ditt ärende mer utförligt om du vill…" />
        </Field>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Observera: Svar Direkt erbjuder inte juridisk rådgivning. Det genererade meddelandet är ett neutralt utkast som du anpassar efter din situation.
      </p>

      <button onClick={generate} className="w-full py-3 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors">
        Generera meddelande
      </button>

      {result && (
        <div className="bg-slate-900 rounded-2xl p-5 flex flex-col gap-3">
          <pre className="text-slate-100 text-sm whitespace-pre-wrap leading-relaxed font-mono">{result}</pre>
          <button
            onClick={() => copyToClipboard(result, setCopied)}
            className="self-start px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {copied ? "✓ Kopierat!" : "Kopiera meddelande"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "cv",      label: "CV" },
  { id: "brev",    label: "Personligt brev" },
  { id: "myndighet", label: "Myndighetsbrev" },
] as const;
type TabId = typeof TABS[number]["id"];

export default function Generator() {
  const [tab, setTab] = useState<TabId>("cv");

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Textgenerator</h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          Fyll i dina uppgifter – få ett färdigt utkast på svenska som du kan kopiera direkt.
        </p>
      </div>

      <div className="flex rounded-xl bg-slate-100 p-1 mb-8 gap-1">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "cv"        && <CVGenerator />}
      {tab === "brev"      && <PersonligtBrev />}
      {tab === "myndighet" && <MyndighetsMeddelande />}
    </div>
  );
}
