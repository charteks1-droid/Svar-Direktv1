import { useState } from "react";

// ── Utility ────────────────────────────────────────────────────────────────────

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
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="">Välj…</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      )}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function DocActions({ text, filename }: { text: string; filename: string }) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  return (
    <div className="flex gap-2 flex-wrap mt-4">
      <button
        onClick={() => copyText(text, setCopied)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-all shadow-sm"
      >
        {copied ? "✓ Kopierat!" : "📋 Kopiera text"}
      </button>
      <button
        onClick={() => { downloadTxt(text, filename); setDownloaded(true); setTimeout(() => setDownloaded(false), 3000); }}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-white border border-slate-300 text-slate-700 hover:border-primary hover:text-primary transition-all shadow-sm"
      >
        {downloaded ? "✓ Nedladdat!" : "💾 Spara som .txt"}
      </button>
    </div>
  );
}

function DocPreview({ text }: { text: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 font-mono text-xs leading-relaxed text-slate-700 whitespace-pre-wrap max-h-80 overflow-auto mt-4">
      {text}
    </div>
  );
}

// ── Tool: Handläggningstid-väktaren ───────────────────────────────────────────

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

function HandlaggningstidVaktaren() {
  const [namn, setNamn] = useState("");
  const [pnr, setPnr] = useState("");
  const [myndighet, setMyndighet] = useState("");
  const [arsende, setArsende] = useState("");
  const [arendenr, setArendenr] = useState("");
  const [skickad, setSkickad] = useState("");
  const [ort, setOrt] = useState("");

  const today = new Date();
  const sent = skickad ? new Date(skickad) : null;
  const diffDays = sent ? Math.floor((today.getTime() - sent.getTime()) / 86400000) : 0;
  const rule = myndighet ? AUTHORITY_TIMES[myndighet] : null;
  const exceeded = rule && diffDays > rule.days;

  const doc = namn && myndighet && skickad && arsende ? `${ort || "Ort"}, ${today.toLocaleDateString("sv-SE")}

Till: ${myndighet}
Från: ${namn}
Personnummer: ${pnr || "XXXXXX-XXXX"}
${arendenr ? `Ärendenummer: ${arendenr}` : ""}

Ämne: Påminnelse om handläggningstid – ${arsende}

Med hänvisning till ${rule?.lag || "Förvaltningslagen 9 §"} ska myndigheter avgöra ärenden inom skälig tid.

Jag lämnade in min ansökan/mitt ärende om "${arsende}" den ${sent?.toLocaleDateString("sv-SE")}. Det har nu gått ${diffDays} dagar utan att jag fått ett beslut eller en motivering till fördröjningen.${exceeded ? `\n\nDen normala handläggningstiden för ${myndighet} är ${rule?.days} dagar. Denna tid har överskridits med ${diffDays - rule!.days} dagar.` : ""}

Jag begär:
1. Svar på aktuell status i mitt ärende inom 5 arbetsdagar
2. Upplysning om beräknad tid till beslut
3. Motivering till eventuell fördröjning

Om svar uteblir förbehåller jag mig rätten att anmäla till Justitieombudsmannen (JO) för bristfällig handläggning.

Med vänliga hälsningar,
${namn}
${pnr || ""}

Kontaktuppgifter: [din e-post / telefon]` : "";

  const ready = !!(namn && myndighet && skickad && arsende);
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Ditt namn" value={namn} onChange={setNamn} placeholder="Anna Svensson" required />
        <Field label="Personnummer" value={pnr} onChange={setPnr} placeholder="XXXXXX-XXXX" />
        <Field label="Myndighet" value={myndighet} onChange={setMyndighet} required
          options={Object.keys(AUTHORITY_TIMES)} />
        <Field label="Ärendetyp" value={arsende} onChange={setArsende}
          placeholder="t.ex. sjukpenningansökan" required />
        <Field label="Ärendenummer (om du har)" value={arendenr} onChange={setArendenr} placeholder="Valfritt" />
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
      {ready && <><DocPreview text={doc} /><DocActions text={doc} filename="Handlaggningstid_paminnelse.txt" /></>}
      {!ready && <p className="text-xs text-slate-400">Fyll i markerade fält för att generera påminnelsen.</p>}
    </div>
  );
}

// ── Tool: JO Anmälan-generator ────────────────────────────────────────────────

function JOAnmalan() {
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
  const doc = namn && myndighet && vad ? `ANMÄLAN TILL JUSTITIEOMBUDSMANNEN (JO)

Datum: ${today}
Ort: ${ort || "Ort"}

ANMÄLARE:
Namn: ${namn}
Personnummer: ${pnr || "XXXXXX-XXXX"}
Adress: ${adress || "[din adress]"}
E-post: ${epost || "[din e-post]"}

ANMÄLAN AVSER:
Myndighet: ${myndighet}
${handlaggare ? `Handläggare (om känd): ${handlaggare}` : ""}
${datum ? `Datum för händelse: ${datum}` : ""}
${arendenr ? `Ärendenummer: ${arendenr}` : ""}

VAD HAR HÄNT:
${vad}

VARFÖR ANSER JAG ATT DET ÄR FEL:
Myndigheten har inte följt gällande lagar och regler. Förvaltningslagen kräver att myndigheter agerar sakligt, opartiskt och i enlighet med principen om likabehandling. Den agerande myndigheten har brustit i detta avseende.

${krav ? `VAD JAG BEGÄR ATT JO UTREDER:\n${krav}` : "VAD JAG BEGÄR ATT JO UTREDER:\nJag begär att JO granskar myndighetens agerande och bedömer om det strider mot gällande lagar och god förvaltningssed."}

BILAGOR:
[ ] Kopia av brev/beslut från myndigheten
[ ] Eventuell korrespondens
[ ] Övriga handlingar

Undertecknat,
${namn}

---
OBS: Skicka anmälan till jo@jo.se eller via formulär på www.jo.se
JO är kostnadsfri och alla kan anmäla.` : "";

  const ready = !!(namn && myndighet && vad);
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
        <strong>JO (Justitieombudsmannen)</strong> granskar att myndigheter följer lagar och regler. Anmälan är gratis och kan lämnas av vem som helst. Skickas till <strong>jo@jo.se</strong> eller via <strong>jo.se</strong>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Ditt namn" value={namn} onChange={setNamn} required placeholder="Anna Svensson" />
        <Field label="Personnummer" value={pnr} onChange={setPnr} placeholder="XXXXXX-XXXX" />
        <Field label="Din adress" value={adress} onChange={setAdress} placeholder="Gatan 1, 12345 Stad" />
        <Field label="Din e-post" value={epost} onChange={setEpost} type="email" placeholder="anna@mail.se" />
        <Field label="Anmäld myndighet" value={myndighet} onChange={setMyndighet} required placeholder="Försäkringskassan" />
        <Field label="Handläggares namn (om känt)" value={handlaggare} onChange={setHandlaggare} placeholder="Valfritt" />
        <Field label="Datum för händelse" value={datum} onChange={setDatum} type="date" />
        <Field label="Ärendenummer" value={arendenr} onChange={setArendenr} placeholder="Valfritt" />
        <Field label="Din ort" value={ort} onChange={setOrt} placeholder="Stockholm" />
      </div>
      <Field label="Beskriv vad som hände" value={vad} onChange={setVad} type="textarea" required
        placeholder="Beskriv konkret vad myndigheten gjorde eller inte gjorde, när det hände och hur det påverkade dig." />
      <Field label="Vad vill du att JO ska utreda?" value={krav} onChange={setKrav} type="textarea"
        placeholder="T.ex. om handläggningstiden var orimlig, om du behandlades diskriminerande, om du fick felaktig information..." />
      {ready && <><DocPreview text={doc} /><DocActions text={doc} filename="JO_Anmalan.txt" /></>}
      {!ready && <p className="text-xs text-slate-400">Fyll i namn, myndighet och beskrivning för att generera anmälan.</p>}
    </div>
  );
}

// ── Tool: Skadestånd-kalkulator ───────────────────────────────────────────────

const DAMAGE_TYPES = [
  "Lång handläggningstid (inkomstbortfall)",
  "Felaktigt beslut om sjukpenning",
  "Felaktigt beslut om a-kassa",
  "Felaktig skattedebiterng",
  "Socialtjänstens felaktiga omhändertagande",
  "Diskriminering av myndighet",
  "Brott mot GDPR av myndighet",
  "Uteblivet beslut (passivitet)",
  "Annan skada av myndighetsagerande",
];

function SkadestandKalkulator() {
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

  const doc = namn && myndighet && skadetyp && beloppKr ? `SKADESTÅNDSANSPRÅK MOT STATEN
(Skickas till Justitiekanslern: jk@jk.se eller Box 2308, 103 17 Stockholm)

Datum: ${today}
Ort: ${ort || "Ort"}

SÖKANDE:
Namn: ${namn}
Personnummer: ${pnr || "XXXXXX-XXXX"}
E-post: ${epost || "[din e-post]"}

ANSPRÅK MOT: ${myndighet} (statlig myndighet)

SKADETYP: ${skadetyp}
${period ? `PERIOD: ${period}` : ""}

BESKRIVNING AV SKADAN:
${vad || "[Beskriv vad som hände och hur det orsakade skadan]"}

BERÄKNING AV SKADESTÅND:
Direkta ekonomiska skador:           ${belopp.toLocaleString("sv-SE")} kr
Ombudskostnader (uppskattning 25%):  ${ombud.toLocaleString("sv-SE")} kr
Dröjsmålsränta (6% per år):          ${ranta.toLocaleString("sv-SE")} kr
─────────────────────────────────────────
TOTALT ANSPRÅK:                       ${total.toLocaleString("sv-SE")} kr

RÄTTSLIG GRUND:
Skadeståndslagen (1972:207) 3 kap. 2 § — staten ansvarar för skada som vållats av fel eller försummelse vid myndighetsutövning.

KRAV:
Jag begär ersättning med totalt ${total.toLocaleString("sv-SE")} kronor för den skada som ${myndighet} orsakat mig genom felaktigt myndighetsutövande.

BILAGOR:
[ ] Kopior av beslut
[ ] Bevis på ekonomisk skada (intyg, kontoutdrag etc.)
[ ] Eventuella läkarintyg eller övriga handlingar

Med vänliga hälsningar,
${namn}` : "";

  const ready = !!(namn && myndighet && skadetyp && beloppKr);
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700">
        <strong>Justitiekanslern (JK)</strong> handlägger skadeståndsanspråk mot staten. Anmäl på <strong>jk.se</strong> eller skicka till <strong>jk@jk.se</strong>. Krav under 7 500 kr kan prövas i tingsrätt direkt.
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Ditt namn" value={namn} onChange={setNamn} required placeholder="Anna Svensson" />
        <Field label="Personnummer" value={pnr} onChange={setPnr} placeholder="XXXXXX-XXXX" />
        <Field label="Ansvarig myndighet" value={myndighet} onChange={setMyndighet} required
          options={["Försäkringskassan","Arbetsförmedlingen","Skatteverket","Kronofogden","Socialtjänsten","Migrationsverket","Polismyndigheten","Annan statlig myndighet"]} />
        <Field label="Typ av skada" value={skadetyp} onChange={setSkadetyp} required options={DAMAGE_TYPES} />
        <Field label="Ekonomisk förlust (kr)" value={beloppKr} onChange={setBeloppKr} required
          placeholder="t.ex. 15000" hint="Ange din direkta ekonomiska förlust i kronor" />
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
      {ready && <><DocPreview text={doc} /><DocActions text={doc} filename="Skadestandsansprak.txt" /></>}
      {!ready && <p className="text-xs text-slate-400">Fyll i namn, myndighet, skadetyp och belopp för att generera anspråket.</p>}
    </div>
  );
}

// ── Tool: Offentlighetsprincipen ──────────────────────────────────────────────

function OffentlighetsTool() {
  const [namn, setNamn] = useState("");
  const [epost, setEpost] = useState("");
  const [telefon, setTelefon] = useState("");
  const [myndighet, setMyndighet] = useState("");
  const [handling, setHandling] = useState("");
  const [period, setPeriod] = useState("");
  const [syfte, setSyfte] = useState("");
  const [format, setFormat] = useState("digitalt (e-post/PDF)");
  const [ort, setOrt] = useState("");

  const today = new Date().toLocaleDateString("sv-SE");
  const doc = namn && myndighet && handling ? `BEGÄRAN OM UTLÄMNANDE AV ALLMÄN HANDLING
(Offentlighetsprincipen – Tryckfrihetsförordningen 2 kap.)

Datum: ${today}
Till: ${myndighet}

SÖKANDE:
Namn: ${namn}
E-post: ${epost || "[din e-post]"}
${telefon ? `Telefon: ${telefon}` : ""}
Ort: ${ort || "Ort"}

BEGÄRAN:
Jag begär att få ta del av följande allmänna handling/-ar hos ${myndighet}:

${handling}
${period ? `\nAvsedd period: ${period}` : ""}

FORMAT:
Jag önskar handlingarna ${format}.
${syfte ? `\nSYFTE/SAMMANHANG:\n${syfte}` : ""}

RÄTTSLIG GRUND:
Enligt Tryckfrihetsförordningen 2 kap. 1 § har var och en rätt att ta del av allmänna handlingar hos myndigheter. Handlingar ska lämnas ut skyndsamt — normalt inom en till två dagar.

Om handlingen eller delar av den sekretessbeläggs, begär jag ett skriftligt beslut med möjlighet att överklaga till kammarrätten.

Jag lämnar inte per automatik medgivande till att myndigheten registrerar mig eller kräver att jag uppger mitt syfte — detta krävs inte enligt lag, om det inte behövs för sekretessprövning.

Med vänliga hälsningar,
${namn}
${epost || ""}` : "";

  const ready = !!(namn && myndighet && handling);
  return (
    <div className="space-y-4">
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-xs text-emerald-700">
        <strong>Offentlighetsprincipen</strong> — du har rätt att begära alla allmänna handlingar hos myndigheter. Du behöver <strong>inte</strong> ange varför. Myndigheten måste svara <strong>skyndsamt</strong> (1–2 dagar).
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Ditt namn" value={namn} onChange={setNamn} required placeholder="Anna Svensson" />
        <Field label="Din e-post" value={epost} onChange={setEpost} type="email" placeholder="anna@mail.se" />
        <Field label="Telefon (valfritt)" value={telefon} onChange={setTelefon} placeholder="070-000 00 00" />
        <Field label="Myndighet" value={myndighet} onChange={setMyndighet} required placeholder="Försäkringskassan" />
        <Field label="Önskat format" value={format} onChange={setFormat}
          options={["digitalt (e-post/PDF)", "papperskopia (post)", "för granskning på plats"]} />
        <Field label="Period (valfritt)" value={period} onChange={setPeriod} placeholder="t.ex. 2025-2026" />
        <Field label="Din ort" value={ort} onChange={setOrt} placeholder="Stockholm" />
      </div>
      <Field label="Beskriv vilka handlingar du begär" value={handling} onChange={setHandling} type="textarea" required
        placeholder="T.ex. Alla inkomna och utgångna e-postmeddelanden rörande ärendenummer 12345 under perioden jan-mars 2026. Eller: Alla tjänsteutlåtanden i ärendet om [ämne]." />
      <Field label="Syfte (frivilligt)" value={syfte} onChange={setSyfte} type="textarea"
        placeholder="Du behöver inte ange syfte, men det kan påskynda hanteringen. Valfritt." />
      {ready && <><DocPreview text={doc} /><DocActions text={doc} filename="Offentlighetsprincipen_begaran.txt" /></>}
      {!ready && <p className="text-xs text-slate-400">Fyll i ditt namn, myndighet och beskriv handlingarna du begär.</p>}
    </div>
  );
}

// ── Tool: DO Anmälan ──────────────────────────────────────────────────────────

const DO_GROUNDS = [
  "Kön",
  "Könsöverskridande identitet eller uttryck",
  "Etnisk tillhörighet",
  "Religion eller annan trosuppfattning",
  "Funktionsnedsättning",
  "Sexuell läggning",
  "Ålder",
];

const DO_CONTEXTS = [
  "Arbetslivet",
  "Utbildning",
  "Varor och tjänster",
  "Bostadsmarknaden",
  "Socialtjänsten / socialförsäkringen",
  "Hälso- och sjukvård",
  "Offentlig anställning / myndighetsutövning",
];

function DOAnmalan() {
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
  const doc = namn && motpart && grund && vad ? `ANMÄLAN TILL DISKRIMINERINGSOMBUDSMANNEN (DO)

Datum: ${today}
Ort: ${ort || "Ort"}

ANMÄLARE:
Namn: ${namn}
Personnummer: ${pnr || "XXXXXX-XXXX"}
E-post: ${epost || "[din e-post]"}

ANMÄLAN AVSER:
Motpart (arbetsgivare/myndighet/företag): ${motpart}
Diskrimineringsgrund: ${grund}
Sammanhang: ${sammanhang || "Ej angivet"}
${datum ? `Datum för händelse: ${datum}` : ""}

VAD HAR HÄNT:
${vad}

${vittnen ? `VITTNEN/BEVIS:\n${vittnen}` : ""}

RÄTTSLIG GRUND:
Diskrimineringslagen (2008:567) förbjuder diskriminering på grund av ${grund.toLowerCase()}. Lagen gäller i ${sammanhang.toLowerCase() || "detta sammanhang"}.

VAD JAG BEGÄR:
Jag anmäler ovanstående händelse till DO för utredning och begär att DO vidtar lämpliga åtgärder för att komma till rätta med diskrimineringen. Jag förbehåller mig rätten att kräva skadestånd.

BILAGOR:
[ ] Eventuell skriftlig dokumentation
[ ] Vittnesintyg
[ ] Övriga bevis

Med vänliga hälsningar,
${namn}

---
Skicka till: anmalan@do.se eller via formulär på www.do.se` : "";

  const ready = !!(namn && motpart && grund && vad);
  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 text-xs text-purple-700">
        <strong>DO (Diskrimineringsombudsmannen)</strong> utreder diskriminering. Anmäl gratis på <strong>do.se</strong> eller <strong>anmalan@do.se</strong>. DO kan kräva skadestånd å dina vägnar.
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Ditt namn" value={namn} onChange={setNamn} required placeholder="Anna Svensson" />
        <Field label="Personnummer" value={pnr} onChange={setPnr} placeholder="XXXXXX-XXXX" />
        <Field label="Din e-post" value={epost} onChange={setEpost} type="email" placeholder="anna@mail.se" />
        <Field label="Motpart (vem diskriminerade?)" value={motpart} onChange={setMotpart} required
          placeholder="t.ex. Försäkringskassan / Företaget AB" />
        <Field label="Diskrimineringsgrund" value={grund} onChange={setGrund} required options={DO_GROUNDS} />
        <Field label="Sammanhang" value={sammanhang} onChange={setSammanhang} options={DO_CONTEXTS} />
        <Field label="Datum för händelse" value={datum} onChange={setDatum} type="date" />
        <Field label="Din ort" value={ort} onChange={setOrt} placeholder="Stockholm" />
      </div>
      <Field label="Beskriv diskrimineringen" value={vad} onChange={setVad} type="textarea" required
        placeholder="Beskriv vad som hände, vad som sades eller gjordes, och varför du anser att det handlade om diskriminering." />
      <Field label="Vittnen eller bevis" value={vittnen} onChange={setVittnen} type="textarea"
        placeholder="Finns det vittnen? E-postmeddelanden? Inspelningar? Valfritt." />
      {ready && <><DocPreview text={doc} /><DocActions text={doc} filename="DO_Anmalan.txt" /></>}
      {!ready && <p className="text-xs text-slate-400">Fyll i namn, motpart, grund och beskrivning för att generera anmälan.</p>}
    </div>
  );
}

// ── Tool: IMY/GDPR skarga ─────────────────────────────────────────────────────

function IMYKlagan() {
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
  const doc = namn && motpart && vad ? `KLAGOMÅL TILL INTEGRITETSSKYDDSMYNDIGHETEN (IMY)
(Artikel 77 GDPR – Rätt att lämna klagomål)

Datum: ${today}
Ort: ${ort || "Ort"}

KLAGANDE:
Namn: ${namn}
E-post: ${epost || "[din e-post]"}

KLAGOMÅL MOT:
Personuppgiftsansvarig: ${motpart}
${datum ? `Datum för händelse: ${datum}` : ""}
Typ av överträdelse: ${overträdelse || "Ej specificerad"}

BESKRIVNING AV HÄNDELSEN:
${vad}

${begaran ? `VAD JAG BEGÄRDE (och när):\n${begaran}` : ""}
${svar ? `SVAR FRÅN MOTPARTEN:\n${svar}` : ""}

RÄTTSLIG GRUND:
Enligt GDPR (EU 2016/679) har den registrerade rätt till:
– Tillgång till sina personuppgifter (art. 15)
– Rättelse (art. 16) och radering (art. 17)
– Begränsning av behandling (art. 18)
– Invändning mot behandling (art. 21)
– Dataportabilitet (art. 20)

Svar på begäran ska lämnas inom 1 månad (art. 12.3).

VAD JAG BEGÄR AV IMY:
Jag begär att IMY utreder klagomålet och vidtar lämpliga åtgärder mot ${motpart} för brott mot GDPR.

BILAGOR:
[ ] Kopia av min begäran till motparten
[ ] Eventuellt svar (eller bevis om utebliven respons)
[ ] Övriga handlingar

Med vänliga hälsningar,
${namn}

---
Skicka till: imy@imy.se eller via formulär på www.imy.se` : "";

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

  const ready = !!(namn && motpart && vad);
  return (
    <div className="space-y-4">
      <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-xs text-rose-700">
        <strong>IMY (Integritetsskyddsmyndigheten)</strong> övervakar GDPR. Klagomål är gratis. IMY kan utfärda böter upp till <strong>20 miljoner euro</strong> eller 4% av omsättningen. Skicka till <strong>imy@imy.se</strong>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Ditt namn" value={namn} onChange={setNamn} required placeholder="Anna Svensson" />
        <Field label="Din e-post" value={epost} onChange={setEpost} type="email" placeholder="anna@mail.se" />
        <Field label="Motpart (vem behandlar dina data?)" value={motpart} onChange={setMotpart} required
          placeholder="t.ex. Försäkringskassan / Företaget AB" />
        <Field label="Typ av GDPR-överträdelse" value={overträdelse} onChange={setOverträdelse} options={GDPR_VIOLATIONS} />
        <Field label="Datum för händelse" value={datum} onChange={setDatum} type="date" />
        <Field label="Din ort" value={ort} onChange={setOrt} placeholder="Stockholm" />
      </div>
      <Field label="Vad har hänt?" value={vad} onChange={setVad} type="textarea" required
        placeholder="Beskriv konkret vad motparten gjort med dina personuppgifter och varför du anser att det strider mot GDPR." />
      <Field label="Vad begärde du av motparten (och när)?" value={begaran} onChange={setBegaran} type="textarea"
        placeholder="T.ex. Jag skickade en tillgångsbegäran den 1 mars 2026 och har inte fått svar." />
      <Field label="Vad svarade motparten?" value={svar} onChange={setSvar} type="textarea"
        placeholder="Eventuellt svar du fick — eller notera om du inte fick något svar." />
      {ready && <><DocPreview text={doc} /><DocActions text={doc} filename="IMY_GDPR_Klagan.txt" /></>}
      {!ready && <p className="text-xs text-slate-400">Fyll i namn, motpart och beskrivning för att generera klagomålet.</p>}
    </div>
  );
}

// ── Tool: Förvaltningsrätten wizard ───────────────────────────────────────────

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

function ForvaltningsrattenWizard() {
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
  const domstol = myndighet ? (APPEAL_AUTHORITIES[myndighet] || "Förvaltningsrätten") : "";

  const doc = namn && myndighet && beslutDatum && vad && yrkande ? `ÖVERKLAGANDE AV MYNDIGHETSBESLUT

Till: ${domstol}
Via: ${myndighet} (överklagandet lämnas till myndigheten som fattade beslutet)

Datum: ${today}

KLAGANDE:
Namn: ${namn}
Personnummer: ${pnr || "XXXXXX-XXXX"}
Adress: ${adress || "[din adress]"}
E-post: ${epost || "[din e-post]"}

ÖVERKLAGAT BESLUT:
Myndighet: ${myndighet}
Beslutsdatum: ${beslut?.toLocaleDateString("sv-SE")}
${arendenr ? `Ärendenummer: ${arendenr}` : ""}
Överklagandedatum: ${today}

YRKANDE:
Jag yrkar att ${domstol || "förvaltningsrätten"} ${yrkande}

GRUNDER FÖR ÖVERKLAGANDET:
${vad}

${argument ? `ARGUMENT OCH BEVISNING:\n${argument}` : ""}

RÄTTSLIG GRUND:
Förvaltningslagen (2017:900) 40–48 §§ ger rätt att överklaga förvaltningsbeslut. Överklagandeskriften ska lämnas till ${myndighet} inom tre veckor från den dag beslutet meddelades.

${bilagor ? `BILAGOR:\n${bilagor}` : `BILAGOR:\n[ ] Kopia av det överklagade beslutet\n[ ] Övriga handlingar`}

Undertecknat,
${namn}

---
OBS: Lämna överklagandet till ${myndighet}, inte direkt till domstolen.
De vidarebefordrar det till rätt instans.` : "";

  const ready = !!(namn && myndighet && beslutDatum && vad && yrkande);

  return (
    <div className="space-y-4">
      {/* Step indicator */}
      <div className="flex gap-2">
        {[1,2,3].map(s => (
          <button key={s} onClick={() => setStep(s)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${step === s ? "bg-primary text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
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
            className="sm:col-span-2 mt-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90">
            Nästa steg →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Beslutande myndighet" value={myndighet} onChange={setMyndighet} required
            options={Object.keys(APPEAL_AUTHORITIES)} />
          <Field label="Beslutsdatum" value={beslutDatum} onChange={setBeslutDatum} type="date" required
            hint="Du har 3 veckor från beslutet att överklaga" />
          <Field label="Ärendenummer" value={arendenr} onChange={setArendenr} placeholder="Valfritt" />
          {deadline && (
            <div className={`sm:col-span-2 rounded-xl px-4 py-3 text-sm font-semibold border ${(daysLeft ?? 0) < 7 ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
              {(daysLeft ?? 0) < 0
                ? "⚠️ Överklagandefristen har löpt ut! Kontakta jurist."
                : `⏱ Sista dag att överklaga: ${deadline.toLocaleDateString("sv-SE")} (${daysLeft} dagar kvar)`}
            </div>
          )}
          {myndighet && (
            <div className="sm:col-span-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700">
              Överklagandet skickas till: <strong>{domstol}</strong> via {myndighet}
            </div>
          )}
          <div className="sm:col-span-2 flex gap-2">
            <button onClick={() => setStep(1)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm">← Tillbaka</button>
            <button onClick={() => setStep(3)} className="flex-1 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90">Nästa steg →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <Field label="Vad är fel med beslutet?" value={vad} onChange={setVad} type="textarea" required
            placeholder="Beskriv varför beslutet är fel. T.ex. myndigheten har feltolkat lagen, inte tagit hänsyn till rätt fakta, eller fattat beslutet på felaktigt underlag." />
          <Field label="Ditt yrkande (vad du begär att domstolen gör)" value={yrkande} onChange={setYrkande} type="textarea" required
            placeholder="T.ex. 'upphäver beslutet och beviljar min ansökan om sjukpenning' eller 'återförvisar ärendet till Försäkringskassan för ny prövning'." />
          <Field label="Bevisning och argument" value={argument} onChange={setArgument} type="textarea"
            placeholder="Hänvisa till lagar, förarbeten, läkarintyg eller andra handlingar som stöder ditt överklagande." />
          <Field label="Bilagor" value={bilagor} onChange={setBilagor} type="textarea"
            placeholder="Lista de bilagor du bifogar, t.ex. läkarintyg, tidigare beslut, intyg..." />
          <div className="flex gap-2">
            <button onClick={() => setStep(2)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm">← Tillbaka</button>
          </div>
        </div>
      )}

      {step === 3 && ready && <><DocPreview text={doc} /><DocActions text={doc} filename="Overklagan_Forvaltningsratten.txt" /></>}
      {step === 3 && !ready && <p className="text-xs text-slate-400">Fyll i alla obligatoriska fält i steg 1–3 för att generera överklagandet.</p>}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

const TOOLS = [
  {
    id: "handlaggningstid",
    icon: "⏱",
    title: "Handläggningstid-väktaren",
    tagline: "Har myndigheten tagit för lång tid?",
    desc: "Kontrollera om din handläggningstid är för lång och generera en formell påminnelse.",
    color: "bg-blue-50 border-blue-200",
    tag: "Alla myndigheter",
    tagColor: "bg-blue-100 text-blue-700",
    Component: HandlaggningstidVaktaren,
  },
  {
    id: "jo",
    icon: "🔴",
    title: "JO Anmälan-generator",
    tagline: "Anmäl felaktig myndighetsutövning",
    desc: "Generera en komplett JO-anmälan mot myndighet som agerat felaktigt. JO kan rikta offentlig kritik.",
    color: "bg-red-50 border-red-200",
    tag: "Alla myndigheter",
    tagColor: "bg-red-100 text-red-700",
    Component: JOAnmalan,
  },
  {
    id: "skadestand",
    icon: "💰",
    title: "Skadestånd-kalkulator",
    tagline: "Kräv ersättning av staten",
    desc: "Beräkna ditt skadeståndsanspråk och generera ett formellt brev till Justitiekanslern.",
    color: "bg-amber-50 border-amber-200",
    tag: "Staten",
    tagColor: "bg-amber-100 text-amber-700",
    Component: SkadestandKalkulator,
  },
  {
    id: "offentlighet",
    icon: "📂",
    title: "Offentlighetsprincipen",
    tagline: "Begär ut allmänna handlingar",
    desc: "Generera en formell begäran om utlämnande av allmänna handlingar. Myndigheten måste svara skyndsamt.",
    color: "bg-emerald-50 border-emerald-200",
    tag: "Alla myndigheter",
    tagColor: "bg-emerald-100 text-emerald-700",
    Component: OffentlighetsTool,
  },
  {
    id: "do",
    icon: "⚖️",
    title: "DO Anmälan",
    tagline: "Anmäl diskriminering",
    desc: "Generera en anmälan till Diskrimineringsombudsmannen. DO kan driva ärendet och kräva skadestånd.",
    color: "bg-purple-50 border-purple-200",
    tag: "Diskriminering",
    tagColor: "bg-purple-100 text-purple-700",
    Component: DOAnmalan,
  },
  {
    id: "imy",
    icon: "🔒",
    title: "IMY/GDPR-klagomål",
    tagline: "Brott mot dataskyddslagen",
    desc: "Generera ett GDPR-klagomål till Integritetsskyddsmyndigheten. IMY kan bötfälla med upp till 20 miljoner euro.",
    color: "bg-rose-50 border-rose-200",
    tag: "GDPR",
    tagColor: "bg-rose-100 text-rose-700",
    Component: IMYKlagan,
  },
  {
    id: "forvaltningsratten",
    icon: "🏛️",
    title: "Förvaltningsrätten-wizard",
    tagline: "Överklaga myndighetsbeslut",
    desc: "Steg-för-steg-guide som genererar ett komplett överklagande till förvaltningsrätten. Deadlineräknare ingår.",
    color: "bg-slate-50 border-slate-200",
    tag: "Alla beslut",
    tagColor: "bg-slate-100 text-slate-700",
    Component: ForvaltningsrattenWizard,
  },
];

export default function Verktyg() {
  const [active, setActive] = useState<string | null>(null);
  const activeTool = TOOLS.find(t => t.id === active);

  if (activeTool) {
    const { Component } = activeTool;
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button onClick={() => setActive(null)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors mb-6">
          ← Tillbaka till alla verktyg
        </button>
        <div className={`rounded-2xl border p-1 mb-6 ${activeTool.color}`}>
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="text-3xl">{activeTool.icon}</div>
              <div>
                <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${activeTool.tagColor}`}>
                  {activeTool.tag}
                </span>
                <h1 className="text-xl font-bold text-slate-900">{activeTool.title}</h1>
                <p className="text-sm text-slate-500 mt-1">{activeTool.desc}</p>
              </div>
            </div>
            <Component />
          </div>
        </div>
        <div className="text-xs text-slate-400 text-center">
          ⚠️ Dessa verktyg genererar malltexter. De ersätter inte juridisk rådgivning. Kontakta jurist vid komplexa ärenden.
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-primary/20 text-primary text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            Gratis juridiska verktyg
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Vänd relationen med myndigheten
          </h1>
          <p className="text-slate-300 text-base leading-relaxed max-w-2xl mx-auto">
            7 kraftfulla verktyg som genererar färdiga dokument — JO-anmälningar, skadeståndsanspråk, GDPR-klagomål, överklaganden och mer. Det enda sättet att möta en myndighet på lika villkor.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6 text-xs text-slate-400">
            <span>✓ 100% gratis</span>
            <span>✓ Inga konton</span>
            <span>✓ Dina uppgifter lämnar inte webbläsaren</span>
            <span>✓ Juridiskt korrekta mallar</span>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActive(tool.id)}
              className={`text-left rounded-2xl border p-5 hover:shadow-md transition-all cursor-pointer group ${tool.color}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{tool.icon}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tool.tagColor}`}>
                  {tool.tag}
                </span>
              </div>
              <h2 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-primary transition-colors">
                {tool.title}
              </h2>
              <p className="text-xs text-slate-500 font-medium mb-2">{tool.tagline}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{tool.desc}</p>
              <div className="mt-4 text-xs font-semibold text-primary flex items-center gap-1">
                Öppna verktyget <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-10 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
          <p className="text-sm text-slate-600 mb-2">
            Behöver du mer personlig hjälp med ditt ärende?
          </p>
          <a href="/tjanst"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-sm">
            Få personlig hjälp – första svaret gratis →
          </a>
        </div>
      </section>
    </>
  );
}
