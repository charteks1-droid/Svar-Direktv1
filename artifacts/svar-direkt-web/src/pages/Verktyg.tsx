import { useState, useRef } from "react";

// ── Utilities ─────────────────────────────────────────────────────────────────

function f(val: string, label: string) {
  return val.trim() ? val.trim() : `[${label}]`;
}

function copyText(text: string, setCopied: (v: boolean) => void) {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  });
}

function downloadTxt(text: string, filename: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Shared UI Components ──────────────────────────────────────────────────────

function LegalDisclaimer() {
  return (
    <div className="mt-5 border-t border-slate-100 pt-4">
      <p className="text-xs text-slate-400 leading-relaxed">
        <strong className="font-semibold text-slate-500">Obs: Detta är inte juridisk rådgivning.</strong>{" "}
        Svar Direkt tillhandahåller mallar och exempel baserade på allmän information.
        För juridisk rådgivning rekommenderas att kontakta en advokat eller jurist.
      </p>
    </div>
  );
}

function UpgradeBox({ toolName, upgradeRef }: { toolName: string; upgradeRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className="mt-5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
      <p className="text-sm font-semibold mb-2">Vill du att vi granskar eller förbättrar din text?</p>
      <ul className="text-sm space-y-1 mb-4 text-blue-100">
        <li>✔ Anpassning till din situation</li>
        <li>✔ Starkare formuleringar</li>
        <li>✔ Snabbare resultat</li>
      </ul>
      <button
        onClick={() => upgradeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
        className="w-full py-3 bg-white text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow"
      >
        Få personlig hjälp – 99 kr →
      </button>
    </div>
  );
}

function DocActions({ text, filename }: { text: string; filename: string }) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const hasPlaceholders = text.includes("[");
  return (
    <div className="space-y-2 mt-4">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => copyText(text, setCopied)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-all shadow-sm"
        >
          {copied ? "✓ Kopierat!" : "📋 Kopiera text"}
        </button>
        <button
          onClick={() => { downloadTxt(text, filename); setDownloaded(true); setTimeout(() => setDownloaded(false), 3000); }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm bg-white border-2 border-slate-200 text-slate-700 hover:border-primary hover:text-primary transition-all"
        >
          {downloaded ? "✓ Nedladdat!" : "💾 Spara .txt"}
        </button>
      </div>
      {hasPlaceholders && (
        <p className="text-xs text-amber-600">⚠️ Texten innehåller [platshållare] — fyll i fälten för ett komplett dokument.</p>
      )}
    </div>
  );
}

function DocPreview({ text }: { text: string }) {
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Förhandsgranskning</p>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs leading-relaxed text-slate-700 whitespace-pre-wrap max-h-72 overflow-auto">
        {text}
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", placeholder = "", required = false,
  options, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
  options?: string[]; hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)}
          className="w-full text-sm border-2 border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-primary transition-colors">
          <option value="">Välj…</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4}
          className="w-full text-sm border-2 border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-primary transition-colors resize-none" />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full text-sm border-2 border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-primary transition-colors" />
      )}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

// ── Contact / Upgrade panel (scrolled to) ────────────────────────────────────

function UpgradePanel({ upgradeRef }: { upgradeRef: React.RefObject<HTMLDivElement | null> }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<"idle"|"sending"|"ok"|"err">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fornamn: name, epost: email, beskrivning: msg }),
      });
      const data = await res.json();
      setStatus(data.success ? "ok" : "err");
    } catch { setStatus("err"); }
  }

  return (
    <div ref={upgradeRef} className="max-w-2xl mx-auto bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-xl">
      <div className="text-center mb-6">
        <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">Personlig hjälp</span>
        <h2 className="text-2xl font-bold mb-2">Få din text granskad – 99 kr</h2>
        <p className="text-blue-100 text-sm leading-relaxed">
          Vi hjälper dig formulera ett starkare och mer anpassat brev till myndigheten.
          <strong className="text-white"> Första svaret är alltid gratis.</strong>
        </p>
      </div>

      {status === "ok" ? (
        <div className="bg-white/20 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-2">✓</div>
          <p className="font-bold text-lg">Tack! Vi hör av oss snart.</p>
          <p className="text-blue-100 text-sm mt-1">Första svaret är gratis — du betalar endast om du vill fortsätta.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Ditt namn"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-blue-200 text-sm focus:outline-none focus:border-white" />
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Din e-postadress *"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-blue-200 text-sm focus:outline-none focus:border-white" />
          <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Beskriv kort ditt ärende och vilken myndighet det gäller…" rows={4}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-blue-200 text-sm focus:outline-none focus:border-white resize-none" />
          <button type="submit" disabled={status === "sending"}
            className="w-full py-4 bg-white text-blue-700 rounded-xl font-bold text-base hover:bg-blue-50 transition-colors shadow-lg disabled:opacity-60">
            {status === "sending" ? "Skickar…" : "Skicka förfrågan – första svaret gratis →"}
          </button>
          {status === "err" && <p className="text-red-200 text-sm text-center">Något gick fel. Försök igen.</p>}
          <p className="text-blue-200 text-xs text-center">Ingen registrering. Inget abonnemang. Betala bara om du är nöjd.</p>
        </form>
      )}
    </div>
  );
}

// ── Lawyer lead modal ─────────────────────────────────────────────────────────

function LawyerModal({ onClose }: { onClose: () => void }) {
  const [namn, setNamn] = useState("");
  const [epost, setEpost] = useState("");
  const [beskrivning, setBeskrivning] = useState("");
  const [status, setStatus] = useState<"idle"|"sending"|"ok"|"err">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/jurist-kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ namn, epost, beskrivning }),
      });
      const data = await res.json();
      setStatus(data.success ? "ok" : "err");
    } catch { setStatus("err"); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xl font-bold">×</button>
        {status === "ok" ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">✓</div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Vi återkommer!</h3>
            <p className="text-slate-500 text-sm">Din förfrågan har skickats. Första kontakt är gratis.</p>
            <button onClick={onClose} className="mt-4 px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm">Stäng</button>
          </div>
        ) : (
          <>
            <h3 className="font-bold text-xl text-slate-900 mb-1">Kontakta jurist</h3>
            <p className="text-slate-500 text-sm mb-5">Beskriv ditt ärende – vi hjälper dig komma i kontakt med rätt jurist. Första kontakt gratis.</p>
            <form onSubmit={submit} className="space-y-3">
              <Field label="Ditt namn" value={namn} onChange={setNamn} placeholder="Anna Svensson" />
              <Field label="E-postadress" value={epost} onChange={setEpost} type="email" placeholder="anna@mail.se" required />
              <Field label="Beskriv ditt ärende" value={beskrivning} onChange={setBeskrivning} type="textarea"
                placeholder="Vilken myndighet? Vad hände? Vad vill du uppnå?" />
              <button type="submit" disabled={status === "sending"}
                className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60">
                {status === "sending" ? "Skickar…" : "Skicka förfrågan – gratis"}
              </button>
              {status === "err" && <p className="text-red-500 text-xs text-center">Något gick fel. Försök igen.</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ── Email capture ─────────────────────────────────────────────────────────────

function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"sending"|"ok"|"err">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ epost: email, kalla: "verktyg-nyhetsbrev" }),
      });
      const data = await res.json();
      setStatus(data.success ? "ok" : "err");
    } catch { setStatus("err"); }
  }

  return (
    <div className="bg-slate-900 rounded-3xl p-8 text-white text-center">
      <div className="text-2xl mb-2">📩</div>
      <h3 className="font-bold text-xl mb-2">Få fler gratis mallar och guider</h3>
      <p className="text-slate-400 text-sm mb-5">Vi skickar nya verktyg och mallar direkt till din inkorg. Gratis, avsluta när du vill.</p>
      {status === "ok" ? (
        <div className="bg-white/10 rounded-2xl p-4">
          <p className="font-bold text-lg">✓ Du är med!</p>
          <p className="text-slate-400 text-sm mt-1">Välkommen till listan.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="flex gap-2 max-w-md mx-auto">
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder="din@email.se"
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-white" />
          <button type="submit" disabled={status === "sending"}
            className="px-5 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors whitespace-nowrap disabled:opacity-60">
            {status === "sending" ? "…" : "Få tillgång"}
          </button>
        </form>
      )}
      {status === "err" && <p className="text-red-400 text-xs mt-2">Något gick fel. Försök igen.</p>}
    </div>
  );
}

// ── Trust badges ──────────────────────────────────────────────────────────────

function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
      {[
        "✓ 100% gratis verktyg",
        "✓ Ingen registrering krävs",
        "✓ Dina uppgifter lämnar inte din enhet",
        "✓ Inga konton",
      ].map(t => <span key={t} className="font-medium">{t}</span>)}
    </div>
  );
}

// ── Tool form field ───────────────────────────────────────────────────────────

const AUTHORITY_TIMES: Record<string, { days: number; lag: string }> = {
  "Försäkringskassan": { days: 90, lag: "Förvaltningslagen 9 §" },
  "Arbetsförmedlingen": { days: 30, lag: "Förvaltningslagen 9 §" },
  "Skatteverket": { days: 60, lag: "Skatteförfarandelagen" },
  "Migrationsverket": { days: 180, lag: "Utlänningslagen" },
  "Kronofogden": { days: 30, lag: "Utsökningsbalken" },
  "Socialtjänsten": { days: 90, lag: "Socialtjänstlagen 11 kap. 2 §" },
  "Kommunen": { days: 60, lag: "Plan- och bygglagen / Förvaltningslagen" },
  "Bolagsverket": { days: 30, lag: "Förvaltningslagen 9 §" },
  "Annan myndighet": { days: 90, lag: "Förvaltningslagen 9 §" },
};

function HandlaggningstidVaktaren({ upgradeRef }: { upgradeRef: React.RefObject<HTMLDivElement | null> }) {
  const [namn, setNamn] = useState("");
  const [pnr, setPnr] = useState("");
  const [myndighet, setMyndighet] = useState("");
  const [arsende, setArsende] = useState("");
  const [arendenr, setArendenr] = useState("");
  const [skickad, setSkickad] = useState("");
  const [ort, setOrt] = useState("");

  const today = new Date();
  const sent = skickad ? new Date(skickad) : null;
  const diffDays = sent ? Math.floor((today.getTime() - sent.getTime()) / 86400000) : null;
  const rule = myndighet ? AUTHORITY_TIMES[myndighet] : null;
  const exceeded = rule && diffDays && diffDays > rule.days;

  const doc = `${f(ort, "din ort")}, ${today.toLocaleDateString("sv-SE")}

Till: ${f(myndighet, "myndighet")}
Från: ${f(namn, "ditt namn")}
Personnummer: ${f(pnr, "XXXXXX-XXXX")}${arendenr ? `\nÄrendenummer: ${arendenr}` : ""}

Ämne: Påminnelse om handläggningstid – ${f(arsende, "ärendetyp")}

Med hänvisning till ${rule?.lag || "Förvaltningslagen 9 §"} ska myndigheter avgöra ärenden inom skälig tid.

Jag lämnade in min ansökan/mitt ärende om "${f(arsende, "ärendetyp")}" den ${sent?.toLocaleDateString("sv-SE") || "[datum för ansökan]"}. Det har nu gått ${diffDays ?? "[antal]"} dagar utan att jag fått ett beslut eller en motivering till fördröjningen.${exceeded ? `\n\nDen normala handläggningstiden för ${myndighet} är ${rule?.days} dagar. Denna tid har överskridits med ${diffDays! - rule!.days} dagar.` : ""}

Jag begär:
1. Svar på aktuell status i mitt ärende inom 5 arbetsdagar
2. Upplysning om beräknad tid till beslut
3. Motivering till eventuell fördröjning

Om svar uteblir förbehåller jag mig rätten att anmäla till Justitieombudsmannen (JO).

Med vänliga hälsningar,
${f(namn, "ditt namn")}
${pnr || ""}`;

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Ditt namn" value={namn} onChange={setNamn} placeholder="Anna Svensson" required />
        <Field label="Personnummer" value={pnr} onChange={setPnr} placeholder="XXXXXX-XXXX" />
        <Field label="Myndighet" value={myndighet} onChange={setMyndighet} required options={Object.keys(AUTHORITY_TIMES)} />
        <Field label="Ärendetyp" value={arsende} onChange={setArsende} placeholder="t.ex. sjukpenningansökan" required />
        <Field label="Ärendenummer (valfritt)" value={arendenr} onChange={setArendenr} placeholder="Valfritt" />
        <Field label="Ansökan skickades" value={skickad} onChange={setSkickad} type="date" required />
        <Field label="Din ort" value={ort} onChange={setOrt} placeholder="Stockholm" />
      </div>
      {sent && myndighet && rule && (
        <div className={`rounded-xl px-4 py-3 text-sm font-semibold border ${exceeded ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
          {exceeded
            ? `⚠️ Handläggningstiden har överskridits! ${diffDays} dagar gångna, norm: ${rule.days} dagar.`
            : `✓ ${diffDays} dagar sedan ansökan. Normal tid: ${rule.days} dagar.`}
        </div>
      )}
      <DocPreview text={doc} />
      <DocActions text={doc} filename="Handlaggningstid_paminnelse.txt" />
      <UpgradeBox toolName="Handläggningstid-väktaren" upgradeRef={upgradeRef} />
      <LegalDisclaimer />
    </div>
  );
}

function JOAnmalan({ upgradeRef }: { upgradeRef: React.RefObject<HTMLDivElement | null> }) {
  const [namn, setNamn] = useState("");
  const [pnr, setPnr] = useState("");
  const [adress, setAdress] = useState("");
  const [epost, setEpost] = useState("");
  const [myndighet, setMyndighet] = useState("");
  const [handlaggare, setHandlaggare] = useState("");
  const [datum, setDatum] = useState("");
  const [arendenr, setArendenr] = useState("");
  const [vad, setVad] = useState("");
  const [krav, setKrav] = useState("");
  const [ort, setOrt] = useState("");

  const today = new Date().toLocaleDateString("sv-SE");
  const doc = `ANMÄLAN TILL JUSTITIEOMBUDSMANNEN (JO)

Datum: ${today}
Ort: ${f(ort, "din ort")}

ANMÄLARE:
Namn: ${f(namn, "ditt namn")}
Personnummer: ${f(pnr, "XXXXXX-XXXX")}
Adress: ${f(adress, "din adress")}
E-post: ${f(epost, "din e-post")}

ANMÄLAN AVSER:
Myndighet: ${f(myndighet, "myndighet")}${handlaggare ? `\nHandläggare: ${handlaggare}` : ""}${datum ? `\nDatum för händelse: ${new Date(datum).toLocaleDateString("sv-SE")}` : ""}${arendenr ? `\nÄrendenummer: ${arendenr}` : ""}

VAD HAR HÄNT:
${f(vad, "Beskriv vad som hände — vad myndigheten gjorde eller inte gjorde, när det hände och hur det påverkade dig.")}

VARFÖR ANSER JAG ATT DET ÄR FEL:
Myndigheten har inte följt gällande lagar och regler. Förvaltningslagen kräver att myndigheter agerar sakligt, opartiskt och i enlighet med principen om likabehandling.

${krav ? `VAD JAG BEGÄR ATT JO UTREDER:\n${krav}` : "VAD JAG BEGÄR ATT JO UTREDER:\nJag begär att JO granskar myndighetens agerande och bedömer om det strider mot gällande lagar och god förvaltningssed."}

BILAGOR:
[ ] Kopia av brev/beslut från myndigheten
[ ] Eventuell korrespondens

Undertecknat,
${f(namn, "ditt namn")}

---
Skicka till: jo@jo.se eller via www.jo.se`;

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
        <strong>JO (Justitieombudsmannen)</strong> granskar att myndigheter följer lagar. Gratis. Skicka till <strong>jo@jo.se</strong>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Ditt namn" value={namn} onChange={setNamn} required placeholder="Anna Svensson" />
        <Field label="Personnummer" value={pnr} onChange={setPnr} placeholder="XXXXXX-XXXX" />
        <Field label="Din adress" value={adress} onChange={setAdress} placeholder="Gatan 1, 12345 Stad" />
        <Field label="Din e-post" value={epost} onChange={setEpost} type="email" placeholder="anna@mail.se" />
        <Field label="Anmäld myndighet" value={myndighet} onChange={setMyndighet} required placeholder="Försäkringskassan" />
        <Field label="Handläggares namn (valfritt)" value={handlaggare} onChange={setHandlaggare} placeholder="Valfritt" />
        <Field label="Datum för händelse" value={datum} onChange={setDatum} type="date" />
        <Field label="Ärendenummer (valfritt)" value={arendenr} onChange={setArendenr} placeholder="Valfritt" />
        <Field label="Din ort" value={ort} onChange={setOrt} placeholder="Stockholm" />
      </div>
      <Field label="Beskriv vad som hände" value={vad} onChange={setVad} type="textarea" required
        placeholder="Beskriv konkret vad myndigheten gjorde eller inte gjorde, när det hände och hur det påverkade dig." />
      <Field label="Vad vill du att JO ska utreda?" value={krav} onChange={setKrav} type="textarea"
        placeholder="T.ex. om handläggningstiden var orimlig, om du behandlades diskriminerande..." />
      <DocPreview text={doc} />
      <DocActions text={doc} filename="JO_Anmalan.txt" />
      <UpgradeBox toolName="JO Anmälan" upgradeRef={upgradeRef} />
      <LegalDisclaimer />
    </div>
  );
}

const DAMAGE_TYPES = [
  "Lång handläggningstid (inkomstbortfall)",
  "Felaktigt beslut om sjukpenning",
  "Felaktigt beslut om a-kassa",
  "Felaktig skattedebitering",
  "Socialtjänstens felaktiga omhändertagande",
  "Diskriminering av myndighet",
  "Brott mot GDPR av myndighet",
  "Uteblivet beslut (passivitet)",
  "Annan skada av myndighetsagerande",
];

function SkadestandKalkulator({ upgradeRef }: { upgradeRef: React.RefObject<HTMLDivElement | null> }) {
  const [namn, setNamn] = useState("");
  const [pnr, setPnr] = useState("");
  const [myndighet, setMyndighet] = useState("");
  const [skadetyp, setSkadetyp] = useState("");
  const [beloppKr, setBeloppKr] = useState("");
  const [period, setPeriod] = useState("");
  const [vad, setVad] = useState("");
  const [ort, setOrt] = useState("");
  const [epost, setEpost] = useState("");

  const today = new Date().toLocaleDateString("sv-SE");
  const belopp = parseFloat(beloppKr.replace(/\s/g, "").replace(",", ".")) || 0;
  const ombud = Math.round(belopp * 0.25);
  const ranta = Math.round(belopp * 0.06);
  const total = belopp + ombud + ranta;

  const doc = `SKADESTÅNDSANSPRÅK MOT STATEN
(Skickas till Justitiekanslern: jk@jk.se eller Box 2308, 103 17 Stockholm)

Datum: ${today}
Ort: ${f(ort, "din ort")}

SÖKANDE:
Namn: ${f(namn, "ditt namn")}
Personnummer: ${f(pnr, "XXXXXX-XXXX")}
E-post: ${f(epost, "din e-post")}

ANSPRÅK MOT: ${f(myndighet, "myndighetsnamn")}
SKADETYP: ${f(skadetyp, "välj typ av skada")}${period ? `\nPERIOD: ${period}` : ""}

BESKRIVNING AV SKADAN:
${f(vad, "Beskriv vad som hände och hur det orsakade skadan")}

BERÄKNING AV SKADESTÅND:
Direkta ekonomiska skador:           ${belopp > 0 ? belopp.toLocaleString("sv-SE") : "[belopp]"} kr
Ombudskostnader (uppskattning 25%):  ${belopp > 0 ? ombud.toLocaleString("sv-SE") : "[25% av belopp]"} kr
Dröjsmålsränta (6% per år):          ${belopp > 0 ? ranta.toLocaleString("sv-SE") : "[6% av belopp]"} kr
─────────────────────────────────────────
TOTALT ANSPRÅK:                       ${belopp > 0 ? total.toLocaleString("sv-SE") : "[totalt]"} kr

RÄTTSLIG GRUND:
Skadeståndslagen (1972:207) 3 kap. 2 §.

KRAV:
Jag begär ersättning med totalt ${belopp > 0 ? total.toLocaleString("sv-SE") : "[belopp]"} kronor.

BILAGOR:
[ ] Kopior av beslut
[ ] Bevis på ekonomisk skada

Med vänliga hälsningar,
${f(namn, "ditt namn")}`;

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700">
        <strong>Justitiekanslern (JK)</strong> handlägger skadeståndsanspråk mot staten. Skicka till <strong>jk@jk.se</strong>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Ditt namn" value={namn} onChange={setNamn} required placeholder="Anna Svensson" />
        <Field label="Personnummer" value={pnr} onChange={setPnr} placeholder="XXXXXX-XXXX" />
        <Field label="Ansvarig myndighet" value={myndighet} onChange={setMyndighet} required
          options={["Försäkringskassan","Arbetsförmedlingen","Skatteverket","Kronofogden","Socialtjänsten","Migrationsverket","Polismyndigheten","Annan statlig myndighet"]} />
        <Field label="Typ av skada" value={skadetyp} onChange={setSkadetyp} required options={DAMAGE_TYPES} />
        <Field label="Ekonomisk förlust (kr)" value={beloppKr} onChange={setBeloppKr} required
          placeholder="t.ex. 15000" hint="Din direkta ekonomiska förlust" />
        <Field label="Period (valfritt)" value={period} onChange={setPeriod} placeholder="t.ex. jan–mars 2026" />
        <Field label="Din e-post" value={epost} onChange={setEpost} type="email" placeholder="anna@mail.se" />
        <Field label="Din ort" value={ort} onChange={setOrt} placeholder="Stockholm" />
      </div>
      <Field label="Beskriv skadan" value={vad} onChange={setVad} type="textarea"
        placeholder="Hur uppstod skadan? Vad gjorde myndigheten fel? Hur påverkade det din ekonomi?" />
      {belopp > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm">
          <div className="font-semibold text-slate-700 mb-2">Beräkning:</div>
          <div className="space-y-1 text-slate-600">
            <div className="flex justify-between"><span>Direkt förlust:</span><span className="font-medium">{belopp.toLocaleString("sv-SE")} kr</span></div>
            <div className="flex justify-between"><span>Ombudskostnader (25%):</span><span>{ombud.toLocaleString("sv-SE")} kr</span></div>
            <div className="flex justify-between"><span>Dröjsmålsränta (6%):</span><span>{ranta.toLocaleString("sv-SE")} kr</span></div>
            <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1 mt-1">
              <span>Totalt anspråk:</span><span className="text-primary">{total.toLocaleString("sv-SE")} kr</span>
            </div>
          </div>
        </div>
      )}
      <DocPreview text={doc} />
      <DocActions text={doc} filename="Skadestandsansprak.txt" />
      <UpgradeBox toolName="Skadestånd-kalkulator" upgradeRef={upgradeRef} />
      <LegalDisclaimer />
    </div>
  );
}

function OffentlighetsTool({ upgradeRef }: { upgradeRef: React.RefObject<HTMLDivElement | null> }) {
  const [namn, setNamn] = useState("");
  const [epost, setEpost] = useState("");
  const [telefon, setTelefon] = useState("");
  const [myndighet, setMyndighet] = useState("");
  const [handling, setHandling] = useState("");
  const [period, setPeriod] = useState("");
  const [format, setFormat] = useState("digitalt (e-post/PDF)");
  const [ort, setOrt] = useState("");

  const today = new Date().toLocaleDateString("sv-SE");
  const doc = `BEGÄRAN OM UTLÄMNANDE AV ALLMÄN HANDLING
(Tryckfrihetsförordningen 2 kap.)

Datum: ${today}
Till: ${f(myndighet, "myndighetsnamn")}

SÖKANDE:
Namn: ${f(namn, "ditt namn")}
E-post: ${f(epost, "din e-post")}${telefon ? `\nTelefon: ${telefon}` : ""}
Ort: ${f(ort, "din ort")}

BEGÄRAN:
Jag begär att få ta del av följande allmänna handling/-ar hos ${f(myndighet, "myndighetsnamn")}:

${f(handling, "Beskriv vilka handlingar du vill ha")}${period ? `\nAvsedd period: ${period}` : ""}

FORMAT:
Jag önskar handlingarna ${format}.

RÄTTSLIG GRUND:
Tryckfrihetsförordningen 2 kap. 1 §. Handlingar ska lämnas ut skyndsamt.

Om handlingen sekretessbeläggs begär jag ett skriftligt beslut med möjlighet att överklaga.

Med vänliga hälsningar,
${f(namn, "ditt namn")}
${epost || ""}`;

  return (
    <div className="space-y-4">
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-xs text-emerald-700">
        <strong>Offentlighetsprincipen</strong> — du behöver <strong>inte</strong> ange varför du vill ha handlingarna. Svar inom 1–2 dagar.
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Ditt namn" value={namn} onChange={setNamn} required placeholder="Anna Svensson" />
        <Field label="Din e-post" value={epost} onChange={setEpost} type="email" placeholder="anna@mail.se" />
        <Field label="Telefon (valfritt)" value={telefon} onChange={setTelefon} placeholder="070-000 00 00" />
        <Field label="Myndighet" value={myndighet} onChange={setMyndighet} required placeholder="Försäkringskassan" />
        <Field label="Önskat format" value={format} onChange={setFormat}
          options={["digitalt (e-post/PDF)", "papperskopia (post)", "för granskning på plats"]} />
        <Field label="Period (valfritt)" value={period} onChange={setPeriod} placeholder="t.ex. 2025–2026" />
        <Field label="Din ort" value={ort} onChange={setOrt} placeholder="Stockholm" />
      </div>
      <Field label="Beskriv vilka handlingar du begär" value={handling} onChange={setHandling} type="textarea" required
        placeholder="T.ex. Alla inkomna och utgångna e-postmeddelanden rörande ärendenummer 12345 under perioden jan-mars 2026." />
      <DocPreview text={doc} />
      <DocActions text={doc} filename="Offentlighetsprincipen_begaran.txt" />
      <UpgradeBox toolName="Offentlighetsprincipen" upgradeRef={upgradeRef} />
      <LegalDisclaimer />
    </div>
  );
}

const DO_GROUNDS = ["Kön","Könsöverskridande identitet eller uttryck","Etnisk tillhörighet","Religion eller annan trosuppfattning","Funktionsnedsättning","Sexuell läggning","Ålder"];
const DO_CONTEXTS = ["Arbetslivet","Utbildning","Varor och tjänster","Bostadsmarknaden","Socialtjänsten / socialförsäkringen","Hälso- och sjukvård","Offentlig anställning / myndighetsutövning"];

function DOAnmalan({ upgradeRef }: { upgradeRef: React.RefObject<HTMLDivElement | null> }) {
  const [namn, setNamn] = useState("");
  const [pnr, setPnr] = useState("");
  const [epost, setEpost] = useState("");
  const [motpart, setMotpart] = useState("");
  const [grund, setGrund] = useState("");
  const [sammanhang, setSammanhang] = useState("");
  const [datum, setDatum] = useState("");
  const [vad, setVad] = useState("");
  const [vittnen, setVittnen] = useState("");
  const [ort, setOrt] = useState("");

  const today = new Date().toLocaleDateString("sv-SE");
  const doc = `ANMÄLAN TILL DISKRIMINERINGSOMBUDSMANNEN (DO)

Datum: ${today}
Ort: ${f(ort, "din ort")}

ANMÄLARE:
Namn: ${f(namn, "ditt namn")}
Personnummer: ${f(pnr, "XXXXXX-XXXX")}
E-post: ${f(epost, "din e-post")}

ANMÄLAN AVSER:
Motpart: ${f(motpart, "arbetsgivare / myndighet / företag")}
Diskrimineringsgrund: ${f(grund, "välj diskrimineringsgrund")}
Sammanhang: ${sammanhang || "Ej angivet"}${datum ? `\nDatum: ${new Date(datum).toLocaleDateString("sv-SE")}` : ""}

VAD HAR HÄNT:
${f(vad, "Beskriv vad som hände och varför du anser att det handlade om diskriminering.")}

${vittnen ? `VITTNEN/BEVIS:\n${vittnen}` : ""}

RÄTTSLIG GRUND:
Diskrimineringslagen (2008:567).

VAD JAG BEGÄR:
Jag anmäler ovanstående händelse till DO för utredning.

BILAGOR:
[ ] Eventuell skriftlig dokumentation

Med vänliga hälsningar,
${f(namn, "ditt namn")}

---
Skicka till: anmalan@do.se eller via www.do.se`;

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 text-xs text-purple-700">
        <strong>DO (Diskrimineringsombudsmannen)</strong> utreder diskriminering gratis. Skicka till <strong>anmalan@do.se</strong>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Ditt namn" value={namn} onChange={setNamn} required placeholder="Anna Svensson" />
        <Field label="Personnummer" value={pnr} onChange={setPnr} placeholder="XXXXXX-XXXX" />
        <Field label="Din e-post" value={epost} onChange={setEpost} type="email" placeholder="anna@mail.se" />
        <Field label="Motpart" value={motpart} onChange={setMotpart} required placeholder="t.ex. Försäkringskassan" />
        <Field label="Diskrimineringsgrund" value={grund} onChange={setGrund} required options={DO_GROUNDS} />
        <Field label="Sammanhang" value={sammanhang} onChange={setSammanhang} options={DO_CONTEXTS} />
        <Field label="Datum för händelse" value={datum} onChange={setDatum} type="date" />
        <Field label="Din ort" value={ort} onChange={setOrt} placeholder="Stockholm" />
      </div>
      <Field label="Beskriv diskrimineringen" value={vad} onChange={setVad} type="textarea" required
        placeholder="Beskriv vad som hände och varför du anser att det handlade om diskriminering." />
      <Field label="Vittnen eller bevis (valfritt)" value={vittnen} onChange={setVittnen} type="textarea"
        placeholder="Finns det vittnen? E-postmeddelanden? Inspelningar?" />
      <DocPreview text={doc} />
      <DocActions text={doc} filename="DO_Anmalan.txt" />
      <UpgradeBox toolName="DO Anmälan" upgradeRef={upgradeRef} />
      <LegalDisclaimer />
    </div>
  );
}

const GDPR_VIOLATIONS = [
  "Utebliven respons på tillgångsbegäran (art. 15)",
  "Nekad radering av personuppgifter (art. 17)",
  "Olaglig behandling av personuppgifter",
  "Dataintrång utan information (art. 34)",
  "Felaktiga personuppgifter som inte rättats (art. 16)",
  "Personuppgifter vidarebefordrade utan samtycke",
  "Avsaknad av integritetspolicy",
  "Annan GDPR-överträdelse",
];

function IMYKlagan({ upgradeRef }: { upgradeRef: React.RefObject<HTMLDivElement | null> }) {
  const [namn, setNamn] = useState("");
  const [epost, setEpost] = useState("");
  const [motpart, setMotpart] = useState("");
  const [overträdelse, setOverträdelse] = useState("");
  const [datum, setDatum] = useState("");
  const [vad, setVad] = useState("");
  const [begaran, setBegaran] = useState("");
  const [svar, setSvar] = useState("");
  const [ort, setOrt] = useState("");

  const today = new Date().toLocaleDateString("sv-SE");
  const doc = `KLAGOMÅL TILL INTEGRITETSSKYDDSMYNDIGHETEN (IMY)
(Artikel 77 GDPR)

Datum: ${today}
Ort: ${f(ort, "din ort")}

KLAGANDE:
Namn: ${f(namn, "ditt namn")}
E-post: ${f(epost, "din e-post")}

KLAGOMÅL MOT:
Personuppgiftsansvarig: ${f(motpart, "företag / myndighet")}${datum ? `\nDatum: ${new Date(datum).toLocaleDateString("sv-SE")}` : ""}
Typ av överträdelse: ${f(overträdelse, "välj typ av GDPR-överträdelse")}

BESKRIVNING:
${f(vad, "Beskriv vad motparten gjort med dina personuppgifter och varför det strider mot GDPR.")}

${begaran ? `VAD JAG BEGÄRDE:\n${begaran}` : ""}${svar ? `\nSVAR FRÅN MOTPARTEN:\n${svar}` : ""}

RÄTTSLIG GRUND:
GDPR (EU 2016/679). Svar ska lämnas inom 1 månad (art. 12.3).

BILAGOR:
[ ] Kopia av min begäran till motparten

Med vänliga hälsningar,
${f(namn, "ditt namn")}

---
Skicka till: imy@imy.se eller via www.imy.se`;

  return (
    <div className="space-y-4">
      <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-xs text-rose-700">
        <strong>IMY</strong> kan utfärda böter upp till <strong>20 miljoner euro</strong>. Klagomål är gratis. Skicka till <strong>imy@imy.se</strong>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Ditt namn" value={namn} onChange={setNamn} required placeholder="Anna Svensson" />
        <Field label="Din e-post" value={epost} onChange={setEpost} type="email" placeholder="anna@mail.se" />
        <Field label="Motpart" value={motpart} onChange={setMotpart} required placeholder="t.ex. Företaget AB" />
        <Field label="Typ av GDPR-överträdelse" value={overträdelse} onChange={setOverträdelse} options={GDPR_VIOLATIONS} />
        <Field label="Datum för händelse" value={datum} onChange={setDatum} type="date" />
        <Field label="Din ort" value={ort} onChange={setOrt} placeholder="Stockholm" />
      </div>
      <Field label="Vad har hänt?" value={vad} onChange={setVad} type="textarea" required
        placeholder="Beskriv konkret vad motparten gjort med dina personuppgifter och varför det strider mot GDPR." />
      <Field label="Vad begärde du av motparten?" value={begaran} onChange={setBegaran} type="textarea"
        placeholder="T.ex. Jag skickade en tillgångsbegäran den 1 mars 2026..." />
      <Field label="Vad svarade motparten?" value={svar} onChange={setSvar} type="textarea"
        placeholder="Eventuellt svar, eller notera om du inte fick något svar." />
      <DocPreview text={doc} />
      <DocActions text={doc} filename="IMY_GDPR_Klagan.txt" />
      <UpgradeBox toolName="IMY/GDPR-klagomål" upgradeRef={upgradeRef} />
      <LegalDisclaimer />
    </div>
  );
}

const APPEAL_AUTHORITIES: Record<string, string> = {
  "Försäkringskassan": "Förvaltningsrätten i den ort där du bor",
  "Arbetsförmedlingen": "Förvaltningsrätten i den ort där du bor",
  "Skatteverket": "Förvaltningsrätten i den ort där du bor",
  "Migrationsverket": "Migrationsdomstolen",
  "Kronofogden": "Tingsrätten",
  "Socialtjänsten": "Förvaltningsrätten i den ort där du bor",
  "Kommunen": "Förvaltningsrätten i den ort där du bor",
  "Transportstyrelsen": "Förvaltningsrätten i Karlstad",
  "Annan myndighet": "Förvaltningsrätten i den ort där du bor",
};

function ForvaltningsrattenWizard({ upgradeRef }: { upgradeRef: React.RefObject<HTMLDivElement | null> }) {
  const [step, setStep] = useState(1);
  const [namn, setNamn] = useState("");
  const [pnr, setPnr] = useState("");
  const [adress, setAdress] = useState("");
  const [epost, setEpost] = useState("");
  const [myndighet, setMyndighet] = useState("");
  const [beslutDatum, setBeslutDatum] = useState("");
  const [arendenr, setArendenr] = useState("");
  const [vad, setVad] = useState("");
  const [argument, setArgument] = useState("");
  const [yrkande, setYrkande] = useState("");
  const [bilagor, setBilagor] = useState("");

  const today = new Date().toLocaleDateString("sv-SE");
  const beslut = beslutDatum ? new Date(beslutDatum) : null;
  const deadline = beslut ? new Date(beslut.getTime() + 21 * 86400000) : null;
  const daysLeft = deadline ? Math.floor((deadline.getTime() - Date.now()) / 86400000) : null;
  const domstol = myndighet ? (APPEAL_AUTHORITIES[myndighet] || "Förvaltningsrätten") : "[domstol]";

  const doc = `ÖVERKLAGANDE AV MYNDIGHETSBESLUT

Till: ${domstol}
Via: ${f(myndighet, "myndighetsnamn")}

Datum: ${today}

KLAGANDE:
Namn: ${f(namn, "ditt namn")}
Personnummer: ${f(pnr, "XXXXXX-XXXX")}
Adress: ${f(adress, "din adress")}
E-post: ${f(epost, "din e-post")}

ÖVERKLAGAT BESLUT:
Myndighet: ${f(myndighet, "myndighetsnamn")}${beslut ? `\nBeslutsdatum: ${beslut.toLocaleDateString("sv-SE")}` : ""}${arendenr ? `\nÄrendenummer: ${arendenr}` : ""}

YRKANDE:
Jag yrkar att ${domstol} ${f(yrkande, "t.ex. upphäver beslutet och beviljar min ansökan")}

GRUNDER:
${f(vad, "Beskriv varför beslutet är fel")}

${argument ? `ARGUMENT OCH BEVISNING:\n${argument}` : ""}

RÄTTSLIG GRUND:
Förvaltningslagen (2017:900) 40–48 §§.

${bilagor ? `BILAGOR:\n${bilagor}` : "BILAGOR:\n[ ] Kopia av det överklagade beslutet\n[ ] Övriga handlingar"}

Undertecknat,
${f(namn, "ditt namn")}

---
OBS: Lämna överklagandet till ${f(myndighet, "myndigheten")}, inte direkt till domstolen.`;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[1,2,3].map(s => (
          <button key={s} onClick={() => setStep(s)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${step === s ? "bg-primary text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
            Steg {s}: {s === 1 ? "Dina uppgifter" : s === 2 ? "Beslutet" : "Argument"}
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Ditt namn" value={namn} onChange={setNamn} required placeholder="Anna Svensson" />
          <Field label="Personnummer" value={pnr} onChange={setPnr} placeholder="XXXXXX-XXXX" />
          <Field label="Din adress" value={adress} onChange={setAdress} placeholder="Gatan 1, 12345 Stad" />
          <Field label="Din e-post" value={epost} onChange={setEpost} type="email" placeholder="anna@mail.se" />
          <button onClick={() => setStep(2)}
            className="sm:col-span-2 mt-2 py-3.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90">
            Nästa steg →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Beslutande myndighet" value={myndighet} onChange={setMyndighet} required options={Object.keys(APPEAL_AUTHORITIES)} />
          <Field label="Beslutsdatum" value={beslutDatum} onChange={setBeslutDatum} type="date" required hint="Du har 3 veckor att överklaga" />
          <Field label="Ärendenummer (valfritt)" value={arendenr} onChange={setArendenr} placeholder="Valfritt" />
          {deadline && (
            <div className={`sm:col-span-2 rounded-xl px-4 py-3 text-sm font-semibold border ${(daysLeft ?? 0) < 7 ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
              {(daysLeft ?? 0) < 0 ? "⚠️ Överklagandefristen har löpt ut! Kontakta jurist." : `⏱ Sista dag: ${deadline.toLocaleDateString("sv-SE")} (${daysLeft} dagar kvar)`}
            </div>
          )}
          {myndighet && (
            <div className="sm:col-span-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700">
              Överklagandet skickas till: <strong>{domstol}</strong> via {myndighet}
            </div>
          )}
          <div className="sm:col-span-2 flex gap-2">
            <button onClick={() => setStep(1)} className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm">← Tillbaka</button>
            <button onClick={() => setStep(3)} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90">Nästa steg →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <Field label="Vad är fel med beslutet?" value={vad} onChange={setVad} type="textarea" required
            placeholder="Beskriv varför beslutet är fel." />
          <Field label="Ditt yrkande" value={yrkande} onChange={setYrkande} type="textarea" required
            placeholder="T.ex. 'upphäver beslutet och beviljar min ansökan om sjukpenning'." />
          <Field label="Bevisning och argument" value={argument} onChange={setArgument} type="textarea"
            placeholder="Hänvisa till lagar, läkarintyg eller andra handlingar." />
          <Field label="Bilagor" value={bilagor} onChange={setBilagor} type="textarea"
            placeholder="Lista bilagor du bifogar..." />
          <button onClick={() => setStep(2)} className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm">← Tillbaka</button>
        </div>
      )}

      <DocPreview text={doc} />
      <DocActions text={doc} filename="Overklagan_Forvaltningsratten.txt" />
      <UpgradeBox toolName="Förvaltningsrätten-wizard" upgradeRef={upgradeRef} />
      <LegalDisclaimer />
    </div>
  );
}

// ── Tools config ──────────────────────────────────────────────────────────────

const TOOLS = [
  { id: "handlaggningstid", icon: "⏱", title: "Handläggningstid-väktaren", tagline: "Har myndigheten tagit för lång tid?", desc: "Kontrollera om din handläggningstid är orimlig och generera en formell påminnelse.", color: "bg-blue-50 border-blue-200", tagColor: "bg-blue-100 text-blue-700", tag: "Alla myndigheter", Component: HandlaggningstidVaktaren },
  { id: "jo", icon: "🔴", title: "JO Anmälan-generator", tagline: "Anmäl felaktig myndighetsutövning", desc: "Generera en komplett JO-anmälan mot myndighet som agerat felaktigt.", color: "bg-red-50 border-red-200", tagColor: "bg-red-100 text-red-700", tag: "Alla myndigheter", Component: JOAnmalan },
  { id: "skadestand", icon: "💰", title: "Skadestånd-kalkulator", tagline: "Kräv ersättning av staten", desc: "Beräkna ditt anspråk och generera ett formellt brev till Justitiekanslern.", color: "bg-amber-50 border-amber-200", tagColor: "bg-amber-100 text-amber-700", tag: "Staten", Component: SkadestandKalkulator },
  { id: "offentlighet", icon: "📂", title: "Offentlighetsprincipen", tagline: "Begär ut allmänna handlingar", desc: "Generera en formell begäran om utlämnande av allmänna handlingar.", color: "bg-emerald-50 border-emerald-200", tagColor: "bg-emerald-100 text-emerald-700", tag: "Alla myndigheter", Component: OffentlighetsTool },
  { id: "do", icon: "⚖️", title: "DO Anmälan", tagline: "Anmäl diskriminering", desc: "Generera en anmälan till Diskrimineringsombudsmannen.", color: "bg-purple-50 border-purple-200", tagColor: "bg-purple-100 text-purple-700", tag: "Diskriminering", Component: DOAnmalan },
  { id: "imy", icon: "🔒", title: "IMY/GDPR-klagomål", tagline: "Brott mot dataskyddslagen", desc: "Generera ett GDPR-klagomål till Integritetsskyddsmyndigheten.", color: "bg-rose-50 border-rose-200", tagColor: "bg-rose-100 text-rose-700", tag: "GDPR", Component: IMYKlagan },
  { id: "forvaltningsratten", icon: "🏛️", title: "Förvaltningsrätten-wizard", tagline: "Överklaga myndighetsbeslut", desc: "Steg-för-steg-guide för överklagande med deadlineräknare.", color: "bg-slate-50 border-slate-200", tagColor: "bg-slate-100 text-slate-700", tag: "Alla beslut", Component: ForvaltningsrattenWizard },
];

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Verktyg() {
  const [active, setActive] = useState<string | null>(null);
  const [lawyerOpen, setLawyerOpen] = useState(false);
  const upgradeRef = useRef<HTMLDivElement>(null);

  const activeTool = TOOLS.find(t => t.id === active);

  if (activeTool) {
    const { Component } = activeTool;
    return (
      <>
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
          <button onClick={() => setActive(null)}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors">
            ← Tillbaka till alla verktyg
          </button>

          <div className={`rounded-2xl border p-1 ${activeTool.color}`}>
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-3xl">{activeTool.icon}</div>
                <div>
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${activeTool.tagColor}`}>{activeTool.tag}</span>
                  <h1 className="text-xl font-bold text-slate-900">{activeTool.title}</h1>
                  <p className="text-sm text-slate-500 mt-1">{activeTool.desc}</p>
                </div>
              </div>
              <Component upgradeRef={upgradeRef} />
            </div>
          </div>

          {/* Upgrade panel anchor */}
          <UpgradePanel upgradeRef={upgradeRef} />

          {/* Lawyer section */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <h3 className="font-bold text-slate-900 mb-2">Behöver du professionell juridisk hjälp?</h3>
            <p className="text-slate-500 text-sm mb-4">Vi kan hjälpa dig komma i kontakt med rätt jurist.<br /><strong>Första kontakt gratis.</strong></p>
            <button onClick={() => setLawyerOpen(true)}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors">
              Kontakta jurist →
            </button>
          </div>

          <TrustBadges />

          {/* Global disclaimer */}
          <div className="border border-slate-100 rounded-xl p-4 bg-slate-50">
            <p className="text-xs text-slate-400 leading-relaxed text-center">
              <strong className="font-semibold text-slate-500">Obs: Detta är inte juridisk rådgivning.</strong>{" "}
              Svar Direkt tillhandahåller mallar och exempel baserade på allmän information.
              För juridisk rådgivning rekommenderas att kontakta en advokat eller jurist.
            </p>
          </div>
        </div>

        {lawyerOpen && <LawyerModal onClose={() => setLawyerOpen(false)} />}
      </>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-primary/20 text-primary text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            7 gratis juridiska verktyg
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Vänd relationen<br className="sm:hidden" /> med myndigheten
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-6">
            Generera färdiga mallar — JO-anmälningar, skadeståndsanspråk, GDPR-klagomål, överklaganden.
            Kopiera texten och skicka direkt.
          </p>
          <TrustBadges />
        </div>
      </section>

      {/* Tools grid */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map(tool => (
            <button key={tool.id} onClick={() => setActive(tool.id)}
              className={`text-left rounded-2xl border p-5 hover:shadow-lg transition-all cursor-pointer group ${tool.color}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{tool.icon}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tool.tagColor}`}>{tool.tag}</span>
              </div>
              <h2 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-primary transition-colors">{tool.title}</h2>
              <p className="text-xs text-slate-500 font-medium mb-2">{tool.tagline}</p>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{tool.desc}</p>
              <div className="flex items-center gap-1 text-xs font-bold text-primary">
                Öppna och kopiera <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Email capture */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <EmailCapture />
      </section>

      {/* Lawyer section */}
      <section className="bg-slate-50 border-y border-slate-200 py-12 px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Behöver du professionell juridisk hjälp?</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Vi kan hjälpa dig komma i kontakt med rätt jurist.<br />
            <strong>Första kontakt gratis.</strong>
          </p>
          <button onClick={() => setLawyerOpen(true)}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-base hover:bg-slate-700 transition-colors shadow-lg">
            Kontakta jurist →
          </button>
        </div>
      </section>

      {/* SEO content */}
      <section className="max-w-3xl mx-auto px-4 py-14 space-y-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Om verktygen</h2>
          <p className="text-slate-500 text-sm leading-relaxed">Alla verktyg genererar färdiga malltexter anpassade till svenska myndigheter och lagar. Texten skapas direkt i webbläsaren och lämnar aldrig din enhet.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { h: "⏱ Handläggningstid-väktaren", p: "Förvaltningslagen kräver att myndigheter avgör ärenden inom skälig tid. Om Försäkringskassan eller Arbetsförmedlingen dröjer för länge kan du kräva svar med en formell påminnelse." },
            { h: "🔴 JO Anmälan", p: "Justitieombudsmannen granskar om myndigheter följer lagar och god förvaltningssed. En JO-anmälan är gratis och kan leda till offentlig kritik mot myndigheten." },
            { h: "💰 Skadestånd av staten", p: "Om ett felaktigt beslut orsakat ekonomisk skada kan du kräva skadestånd via Justitiekanslern. Skadeståndslagen ger rätt till ersättning vid fel i myndighetsutövning." },
            { h: "📂 Offentlighetsprincipen", p: "Alla har rätt att begära ut allmänna handlingar. Du behöver inte ange varför. Myndigheten ska svara inom en till två dagar." },
            { h: "⚖️ DO Anmälan", p: "Diskrimineringslagen skyddar mot diskriminering på grund av kön, etnicitet, funktionsnedsättning, ålder och mer. En anmälan kan leda till ekonomiskt skadestånd." },
            { h: "🔒 GDPR-klagomål", p: "IMY kan bötfälla upp till 20 miljoner euro. Om ett företag eller myndighet hanterar dina personuppgifter felaktigt kan du anmäla gratis till IMY." },
          ].map(item => (
            <div key={item.h}>
              <h3 className="font-bold text-slate-900 mb-2 text-sm">{item.h}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.p}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4 text-center">Vanliga frågor</h3>
          <div className="space-y-4">
            {[
              { q: "Är verktygen juridisk rådgivning?", a: "Nej. Verktygen genererar malltexter baserade på allmän information. De ersätter inte juridisk rådgivning. Vid komplexa ärenden bör du kontakta en jurist." },
              { q: "Behöver jag skapa ett konto?", a: "Nej. Alla verktyg är anonyma — inga uppgifter sparas." },
              { q: "Kostar det något?", a: "Alla sju verktyg är gratis. Personlig hjälp med formulering kostar 99 kr, och första svaret är alltid gratis." },
              { q: "Hur lång tid har jag att överklaga?", a: "Normalt tre veckor från beslutet. Vår wizard räknar ut deadline automatiskt." },
            ].map(item => (
              <div key={item.q} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <p className="font-semibold text-slate-800 text-sm mb-1">{item.q}</p>
                <p className="text-slate-500 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Global disclaimer */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-center">
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-500">Obs: Detta är inte juridisk rådgivning.</strong>{" "}
            Svar Direkt tillhandahåller mallar och exempel baserade på allmän information.
            För juridisk rådgivning rekommenderas att kontakta en advokat eller jurist.
          </p>
        </div>
      </section>

      {lawyerOpen && <LawyerModal onClose={() => setLawyerOpen(false)} />}
    </>
  );
}
