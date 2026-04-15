import { useState } from "react";

const question = {
  title: "Fick ett betalningsföreläggande från Kronofogden – vad händer om jag inte svarar?",
  category: "Kronofogden",
  body: `Hej, jag fick ett brev från Kronofogden igår. Det står "Betalningsföreläggande" och att jag har 10 dagar att svara. Skulden gäller ett gammalt telefonabonnemang på 1 200 kr som jag bestrider – jag sa upp avtalet i tid men de hävdar att jag inte gjorde det.

Vad händer om jag inte gör någonting? Kan de ta pengar direkt från mitt konto?`,
  author: "Anonym",
  time: "2 timmar sedan",
};

const answers = [
  {
    id: 1,
    author: "Maria S.",
    time: "1 timme sedan",
    text: `Jag var med om exakt samma sak förra året. Om du INTE svarar inom 10 dagar utfärdar Kronofogden ett utslag automatiskt, och då kan de utmäta lön eller bankkonto. Det är viktigt att du BESTRIDER skulden skriftligt innan fristen går ut.

Du behöver inte bevisa att du har rätt nu – det räcker att du "bestrider" så att ärendet skickas till tingsrätten. Sedan är det upp till telefonbolaget att bevisa sin sak.`,
    helpful: 12,
    isAccepted: false,
  },
  {
    id: 2,
    author: "Erik L.",
    time: "45 minuter sedan",
    text: `Precis vad Maria säger. Svara ALLTID, även om du bestrider. Att inte svara är det värsta du kan göra.

Svar Direkt har en mall för just detta – "Bestridande av betalningsföreläggande". Jag använde den mot Klarna och fick rätt. Mallen tar 5 minuter att fylla i.`,
    helpful: 8,
    isAccepted: true,
    templateLink: "Bestridande av betalningsföreläggande – Kronofogden",
  },
  {
    id: 3,
    author: "Anna K.",
    time: "20 minuter sedan",
    text: "Tänk på att deadline räknas från det datum du mottog brevet, inte från avsändningsdatumet. Om du är osäker på när du fick det – skicka bestridet idag för säkerhets skull.",
    helpful: 5,
    isAccepted: false,
  },
];

export default function ForumThread() {
  const [replyText, setReplyText] = useState("");
  const [helpfulVotes, setHelpfulVotes] = useState<Record<number, boolean>>({});

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ background: "#0d1b2e", padding: "16px 24px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>
            <span style={{ color: "#0a7ea4", cursor: "pointer" }}>← Kronofogden</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "white", lineHeight: 1.4 }}>
            {question.title}
          </h1>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
            {question.author} · {question.time}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "20px 24px" }}>
        <div style={{
          background: "white",
          borderRadius: 10,
          padding: "20px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          borderLeft: "4px solid #dc2626",
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, whiteSpace: "pre-line" }}>
            {question.body}
          </div>
          <div style={{
            marginTop: 16,
            padding: "12px 16px",
            background: "#fef3c7",
            borderRadius: 8,
            fontSize: 13,
            color: "#92400e",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <span>⏰</span>
            <span><strong>Deadline:</strong> Du har 10 dagar från brevets datum att svara. Räkna från mottagningsdatumet.</span>
          </div>
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {answers.length} svar
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          {answers.map((ans) => (
            <div
              key={ans.id}
              style={{
                background: "white",
                borderRadius: 10,
                padding: "18px 20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                border: ans.isAccepted ? "2px solid #059669" : "1px solid #e2e8f0",
                position: "relative",
              }}
            >
              {ans.isAccepted && (
                <div style={{
                  position: "absolute",
                  top: -1,
                  right: 16,
                  background: "#059669",
                  color: "white",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "0 0 6px 6px",
                }}>
                  ✓ Bästa svar
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#0a7ea420",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#0a7ea4",
                }}>
                  {ans.author[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0d1b2e" }}>{ans.author}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{ans.time}</div>
                </div>
              </div>
              <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                {ans.text}
              </div>
              {ans.templateLink && (
                <div style={{
                  marginTop: 14,
                  padding: "10px 14px",
                  background: "#0a7ea410",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                  border: "1px solid #0a7ea430",
                }}>
                  <span style={{ fontSize: 18 }}>📄</span>
                  <div>
                    <div style={{ fontSize: 12, color: "#0a7ea4", fontWeight: 700 }}>Rekommenderad mall</div>
                    <div style={{ fontSize: 13, color: "#0d1b2e", fontWeight: 600 }}>{ans.templateLink}</div>
                  </div>
                  <div style={{ marginLeft: "auto", fontSize: 12, color: "#0a7ea4", fontWeight: 700 }}>
                    Hämta →
                  </div>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14 }}>
                <button
                  onClick={() => setHelpfulVotes(v => ({ ...v, [ans.id]: !v[ans.id] }))}
                  style={{
                    background: helpfulVotes[ans.id] ? "#0a7ea420" : "none",
                    border: "1px solid #e2e8f0",
                    borderRadius: 6,
                    padding: "5px 12px",
                    fontSize: 12,
                    color: helpfulVotes[ans.id] ? "#0a7ea4" : "#64748b",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  👍 Hjälpsamt ({ans.helpful + (helpfulVotes[ans.id] ? 1 : 0)})
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: "white",
          borderRadius: 10,
          padding: "20px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          border: "2px dashed #e2e8f0",
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0d1b2e", marginBottom: 12 }}>
            Skriv ett svar
          </div>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Har du varit med om samma sak? Dela din erfarenhet – det hjälper någon i stres..."
            style={{
              width: "100%",
              minHeight: 100,
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "12px",
              fontSize: 14,
              fontFamily: "system-ui",
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
              color: "#374151",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>
              🔒 Ditt svar publiceras anonymt
            </div>
            <button
              style={{
                background: replyText.length > 10 ? "#0a7ea4" : "#e2e8f0",
                color: replyText.length > 10 ? "white" : "#94a3b8",
                border: "none",
                borderRadius: 8,
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 700,
                cursor: replyText.length > 10 ? "pointer" : "default",
                transition: "all 0.2s",
              }}
            >
              Skicka svar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
