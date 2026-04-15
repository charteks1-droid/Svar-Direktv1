import { useState } from "react";

const categories = [
  {
    id: "kronofogden",
    name: "Kronofogden",
    icon: "⚖️",
    desc: "Skulder, utmätning, betalningsanmärkningar",
    threads: 142,
    unanswered: 8,
    color: "#dc2626",
  },
  {
    id: "skatteverket",
    name: "Skatteverket",
    icon: "📋",
    desc: "Deklaration, folkbokföring, personnummer",
    threads: 98,
    unanswered: 3,
    color: "#0a7ea4",
  },
  {
    id: "forsakringskassan",
    name: "Försäkringskassan",
    icon: "🏥",
    desc: "Sjukpenning, föräldrapenning, bidrag",
    threads: 211,
    unanswered: 14,
    color: "#059669",
  },
  {
    id: "migrationsverket",
    name: "Migrationsverket",
    icon: "🌐",
    desc: "Uppehållstillstånd, medborgarskap, asyl",
    threads: 87,
    unanswered: 6,
    color: "#7c3aed",
  },
  {
    id: "arbetsformedlingen",
    name: "Arbetsförmedlingen",
    icon: "💼",
    desc: "A-kassa, aktivitetsrapport, åtgärder",
    threads: 64,
    unanswered: 2,
    color: "#d97706",
  },
];

const recent = [
  {
    id: 1,
    category: "Kronofogden",
    title: "Fick ett betalningsföreläggande – vad händer om jag inte svarar?",
    author: "Anonym",
    time: "2 timmar sedan",
    replies: 3,
    solved: false,
    color: "#dc2626",
  },
  {
    id: 2,
    category: "Försäkringskassan",
    title: "De kräver att jag ska betala tillbaka sjukpenning från 2022",
    author: "Anonym",
    time: "5 timmar sedan",
    replies: 7,
    solved: true,
    color: "#059669",
  },
  {
    id: 3,
    category: "Skatteverket",
    title: "Hur lång tid tar det att få svar på inkomstdeklarationen?",
    author: "Anonym",
    time: "1 dag sedan",
    replies: 2,
    solved: false,
    color: "#0a7ea4",
  },
  {
    id: 4,
    category: "Migrationsverket",
    title: "Ansökan om permanent uppehållstillstånd – inga svar på 8 månader",
    author: "Anonym",
    time: "2 dagar sedan",
    replies: 5,
    solved: false,
    color: "#7c3aed",
  },
];

export default function ForumOverview() {
  const [activeTab, setActiveTab] = useState<"categories" | "recent">("categories");

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ background: "#0d1b2e", color: "white", padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 900, margin: "0 auto" }}>
          <div>
            <div style={{ fontSize: 11, color: "#0a7ea4", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
              svardirekt.site
            </div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Frågor & Svar</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94a3b8" }}>
              Ställ din fråga – få svar från någon som varit med om samma sak
            </p>
          </div>
          <button style={{
            background: "#0a7ea4",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}>
            + Ställ en fråga
          </button>
        </div>

        <div style={{ maxWidth: 900, margin: "16px auto 0", display: "flex", gap: 24 }}>
          {[
            { label: "602 frågor", sub: "totalt" },
            { label: "1 847 svar", sub: "från communityn" },
            { label: "89% lösta", sub: "markerade som lösta" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#0a7ea4" }}>{s.label}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #e2e8f0", margin: "20px 0 0" }}>
          {(["categories", "recent"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "none",
                border: "none",
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                color: activeTab === tab ? "#0a7ea4" : "#64748b",
                borderBottom: activeTab === tab ? "2px solid #0a7ea4" : "2px solid transparent",
                marginBottom: -2,
              }}
            >
              {tab === "categories" ? "Kategorier" : "Senaste frågorna"}
            </button>
          ))}
        </div>

        {activeTab === "categories" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16, paddingBottom: 24 }}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                style={{
                  background: "white",
                  borderRadius: 10,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                  borderLeft: `4px solid ${cat.color}`,
                }}
              >
                <div style={{ fontSize: 28 }}>{cat.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#0d1b2e" }}>{cat.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{cat.desc}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0d1b2e" }}>{cat.threads}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>frågor</div>
                  {cat.unanswered > 0 && (
                    <div style={{ fontSize: 11, color: "#dc2626", fontWeight: 600, marginTop: 2 }}>
                      {cat.unanswered} obesvarade
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "recent" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16, paddingBottom: 24 }}>
            {recent.map((q) => (
              <div
                key={q.id}
                style={{
                  background: "white",
                  borderRadius: 10,
                  padding: "14px 18px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                  borderLeft: `4px solid ${q.color}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: q.color,
                        background: `${q.color}15`,
                        padding: "2px 8px",
                        borderRadius: 4,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}>
                        {q.category}
                      </span>
                      {q.solved && (
                        <span style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#059669",
                          background: "#05966920",
                          padding: "2px 8px",
                          borderRadius: 4,
                        }}>
                          ✓ Löst
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0d1b2e", lineHeight: 1.4 }}>
                      {q.title}
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
                      {q.author} · {q.time}
                    </div>
                  </div>
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#0a7ea4" }}>{q.replies}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8" }}>svar</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
