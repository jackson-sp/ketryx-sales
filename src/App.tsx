import { useMemo, useState } from "react";

type Section = { title: string; bullets: string[] };

const THEME = {
  primaryText: "#003B3D",
  primaryAction: "#003B3D",
  secondaryText: "#4A6B6D",
  bg: "#F9FAFA",
  border: "#E5EAEB",
  resultBg: "#FAFBFC",
  cardBg: "rgba(255,255,255,0.85)",
};

/** Normalize for keyword lookup: trim, lowercase, strip trailing ?, remove quotes. */
function normalizeKeyword(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\?+$/, "")
    .replace(/"/g, "")
    .trim() || "";
}

const KEYWORD_CHIPS = [
  "AI",
  "Agent",
  "Docs",
  "Traceability",
  "Compliance vs Speed",
  '"Spreadsheet" Objection',
] as const;

/** Single source of truth for primary actions (Get talking points, Get answer). */
const PRIMARY_BUTTON_STYLE: React.CSSProperties = {
  background: "linear-gradient(180deg, #0D5C63 0%, #003B3D 100%)",
  color: "white",
  border: "1px solid rgba(0,59,61,0.4)",
  padding: "10px 18px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 14,
  whiteSpace: "nowrap",
  boxShadow: "0 2px 8px rgba(0,59,61,0.2)",
  minWidth: 172,
  height: 42,
  boxSizing: "border-box",
};

/** Applied when primary button is disabled (same for both buttons). */
const PRIMARY_BUTTON_DISABLED: React.CSSProperties = {
  opacity: 0.6,
  cursor: "not-allowed",
};

export default function App() {
  const [prospectName, setProspectName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [stage, setStage] = useState("");
  const [callDate, setCallDate] = useState("");

  const [keywordInput, setKeywordInput] = useState("");
  const [activeKeyword, setActiveKeyword] = useState<string>("");
  const [heartflowOpen, setHeartflowOpen] = useState(false);

  const [questionInput, setQuestionInput] = useState("");

  const [notes, setNotes] = useState("");

  const aiSections: Section[] = useMemo(
    () => [
      {
        title: "AI: High-Level Talking Points",
        bullets: [
          "AI accelerates compliance workflows without replacing regulatory oversight.",
          "Automatically structures and connects documentation across systems.",
          "Reduces manual traceability burden for engineering teams.",
          "Helps teams move faster while staying audit-ready.",
        ],
      },
      {
        title: "Highlights",
        bullets: ["Document generation", "AI agent", "Natural language checklists"],
      },
    ],
    []
  );

  const agentSections: Section[] = useMemo(
    () => [
      {
        title: "AI Agent",
        bullets: [
          "Tuned to your product, context, and internal SOPs, regulations, and standards",
          "Helps assess change requests and associated risks",
          "Generates 90%-final change assessment documentation",
        ],
      },
    ],
    []
  );

  const docsSections: Section[] = useMemo(
    () => [
      {
        title: "Document Generation",
        bullets: [
          "AI-assisted creation of structured regulatory documentation.",
          "Reduces documentation time by up to 90%.",
          "Keeps artifacts aligned with engineering changes automatically.",
          "Example: HeartFlow used Ketryx to scale compliant documentation while accelerating product iteration.",
        ],
      },
    ],
    []
  );

  const traceabilitySections: Section[] = useMemo(
    () => [
      {
        title: "Traceability",
        bullets: [
          "Required for FDA / ISO audits in regulated software",
          "Links requirements → code → tests automatically",
          "Eliminates manual trace matrices and spreadsheet tracking",
          "Prevents last-minute compliance fire drills",
          "Gets you to audit-ready faster without slowing engineering",
        ],
      },
    ],
    []
  );

  const complianceVsSpeedSections: Section[] = useMemo(
    () => [
      {
        title: "Compliance vs Speed",
        bullets: [
          "Compliance shouldn't slow development — bad workflows do",
          "Most teams treat compliance as a final checkpoint instead of building it in",
          "That's what creates backlog and launch delays",
          "We embed compliance directly into the dev workflow",
          "So when engineering is done, you're already audit-ready",
        ],
      },
    ],
    []
  );

  const spreadsheetObjectionSections: Section[] = useMemo(
    () => [
      {
        title: '"We already use Jira + spreadsheets."',
        bullets: [
          "Spreadsheets break the moment things change",
          "Manual trace matrices don't scale with real software teams",
          "You end up doing retrospective documentation before launch",
          "That's where weeks (or months) get lost",
          "We automate traceability in real time instead of rebuilding it later",
        ],
      },
    ],
    []
  );

  const responseForKeyword = (
    k: string
  ): { sections: Section[]; showHeartflow: boolean } | null => {
    const key = normalizeKeyword(k);
    if (!key) return null;

    if (key === "ai") return { sections: aiSections, showHeartflow: false };
    if (key === "agent") return { sections: agentSections, showHeartflow: false };
    if (key === "docs") return { sections: docsSections, showHeartflow: true };
    if (key === "traceability") return { sections: traceabilitySections, showHeartflow: false };
    if (key === "compliance vs speed") return { sections: complianceVsSpeedSections, showHeartflow: false };
    if (key === "spreadsheet objection") return { sections: spreadsheetObjectionSections, showHeartflow: false };

    return {
      sections: [
        {
          title: "No preset found",
          bullets: ["Try: AI  •  Agent  •  Docs  •  Traceability  •  Compliance vs Speed  •  \"Spreadsheet\" Objection"],
        },
      ],
      showHeartflow: false,
    };
  };

  const keywordResult = responseForKeyword(activeKeyword);

  const runKeywordLookup = (fromInput?: string) => {
    const next = normalizeKeyword(fromInput ?? keywordInput);
    setActiveKeyword(next);
    setHeartflowOpen(next === "docs" ? heartflowOpen : false);
  };

  const onKeywordChipClick = (chip: string) => {
    const key = normalizeKeyword(chip);
    if (activeKeyword === key) {
      setKeywordInput("");
      setActiveKeyword("");
      setHeartflowOpen(false);
      return;
    }
    setKeywordInput(chip);
    setActiveKeyword(key);
    setHeartflowOpen(false);
  };

  /** Get answer is a placeholder: no API call, no fetch, no errors. */
  const onGetAnswerClick = () => {};

  const inputFieldStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 8,
    border: `1px solid ${THEME.border}`,
    fontSize: 14,
    outline: "none",
    color: THEME.primaryText,
    background: "#fff",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${THEME.bg} 0%, #F0F2F2 100%)`,
        padding: "40px 20px",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        color: THEME.primaryText,
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 28, letterSpacing: -0.2, fontWeight: 700 }}>
            Ketryx Sales Rapidfyre
          </h1>
          <p style={{ margin: "8px 0 0", color: THEME.secondaryText, fontSize: 15, lineHeight: 1.4 }}>
            Fast talking points to help you close.
          </p>
        </div>

        <div
          style={{
            background: THEME.cardBg,
            backdropFilter: "blur(8px)",
            border: `1px solid ${THEME.border}`,
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
          }}
        >
          {/* Call Context */}
          <section style={{ marginBottom: 24 }}>
            <h2 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: THEME.primaryText }}>
              Call Context
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                padding: 16,
                border: `1px solid ${THEME.border}`,
                borderRadius: 12,
                background: THEME.resultBg,
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: 12, color: THEME.secondaryText, marginBottom: 4 }}>Prospect Name</label>
                <input
                  value={prospectName}
                  onChange={(e) => setProspectName(e.target.value)}
                  placeholder="Name"
                  style={inputFieldStyle}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, color: THEME.secondaryText, marginBottom: 4 }}>Company</label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company"
                  style={inputFieldStyle}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, color: THEME.secondaryText, marginBottom: 4 }}>Role</label>
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Role"
                  style={inputFieldStyle}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, color: THEME.secondaryText, marginBottom: 4 }}>Stage</label>
                <input
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  placeholder="Stage"
                  style={inputFieldStyle}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: 12, color: THEME.secondaryText, marginBottom: 4 }}>Date</label>
                <input
                  type="date"
                  value={callDate}
                  onChange={(e) => setCallDate(e.target.value)}
                  style={inputFieldStyle}
                />
              </div>
            </div>
          </section>

          <div style={{ height: 1, background: THEME.border, margin: "20px 0" }} />

          {/* Keywords */}
          <section style={{ marginBottom: 28 }}>
            <h2 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: THEME.primaryText }}>
              Keywords
            </h2>
            <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
              <input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runKeywordLookup()}
                placeholder="Enter a keyword for rapid talking points."
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: `1px solid ${THEME.border}`,
                  fontSize: 15,
                  outline: "none",
                  color: THEME.primaryText,
                  background: "#fff",
                  height: 42,
                  boxSizing: "border-box",
                }}
              />
              <button type="button" onClick={() => runKeywordLookup()} style={PRIMARY_BUTTON_STYLE}>
                Get talking points
              </button>
            </div>

            {keywordResult && (
              <div
                style={{
                  marginTop: 14,
                  background: THEME.resultBg,
                  border: `1px solid ${THEME.border}`,
                  borderRadius: 12,
                  padding: 16,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                }}
              >
                {keywordResult.sections.map((s) => (
                  <div key={s.title} style={{ marginBottom: s.bullets.length ? 14 : 0 }}>
                    <div style={{ marginBottom: 6, fontWeight: 700, fontSize: 14 }}>
                      {s.title}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 20, color: THEME.primaryText, fontSize: 14, lineHeight: 1.45 }}>
                      {s.bullets.map((b) => (
                        <li key={b} style={{ margin: "4px 0" }}>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {keywordResult.showHeartflow && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${THEME.border}` }}>
                    <button
                      type="button"
                      onClick={() => setHeartflowOpen((v) => !v)}
                      style={{
                        background: "#fff",
                        color: THEME.primaryText,
                        border: `1px solid ${THEME.border}`,
                        padding: "8px 12px",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      Learn more about HeartFlow
                      <span style={{ color: THEME.secondaryText, marginLeft: 8 }}>
                        {heartflowOpen ? "▲" : "▼"}
                      </span>
                    </button>
                    {heartflowOpen && (
                      <div
                        style={{
                          marginTop: 10,
                          padding: 12,
                          background: "#fff",
                          border: `1px solid ${THEME.border}`,
                          borderRadius: 8,
                          fontSize: 13,
                        }}
                      >
                        {[
                          {
                            title: "Customer Pain Points",
                            bullets: [
                              "Documentation + approvals delayed releases",
                              "Manual traceability + scripts across tools created burden and errors",
                            ],
                          },
                          {
                            title: "Ketryx Solution",
                            bullets: [
                              "Real-time traceability + automated documentation in Jira/GitHub",
                              "Integrated approvals + workflow enforcement guardrails",
                            ],
                          },
                          {
                            title: "Outcomes",
                            bullets: [
                              'Reduced complexity by 90% and implemented "system of systems" in 10 weeks',
                              "Broke down a 100k+ item monolith into modular components (including deprecating 90k items)",
                            ],
                          },
                        ].map((block) => (
                          <div key={block.title} style={{ marginBottom: 10 }}>
                            <div style={{ fontWeight: 700, marginBottom: 4 }}>{block.title}</div>
                            <ul style={{ margin: 0, paddingLeft: 20 }}>
                              {block.bullets.map((b) => (
                                <li key={b} style={{ margin: "2px 0", lineHeight: 1.4 }}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <div style={{ color: THEME.secondaryText, fontSize: 12, marginTop: 8 }}>
                          Tip: keep this to 20–30 seconds spoken. Offer to send details after the call.
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <p style={{ margin: "12px 0 0", color: THEME.secondaryText, fontSize: 13 }}>
              Enter a keyword for quick bullet points.
            </p>
            <p style={{ margin: "8px 0 0", color: THEME.secondaryText, fontSize: 13 }}>
              Try these:
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              {KEYWORD_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => onKeywordChipClick(chip)}
                  style={{
                    border: `1px solid ${THEME.border}`,
                    background: activeKeyword === normalizeKeyword(chip) ? THEME.primaryAction : "#fff",
                    color: activeKeyword === normalizeKeyword(chip) ? "white" : THEME.primaryText,
                    padding: "6px 12px",
                    borderRadius: 999,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </section>

          <div style={{ height: 1, background: THEME.border, margin: "24px 0" }} />

          {/* Ask a Question */}
          <section>
            <h2 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: THEME.primaryText }}>
              Ask a Question
            </h2>
            <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
              <input
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder='For example: "Why does traceability matter?"'
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: `1px solid ${THEME.border}`,
                  fontSize: 15,
                  outline: "none",
                  color: THEME.primaryText,
                  background: "#fff",
                  boxSizing: "border-box",
                  height: 42,
                }}
              />
              <button
                type="button"
                disabled={!questionInput.trim()}
                onClick={onGetAnswerClick}
                style={{
                  ...PRIMARY_BUTTON_STYLE,
                  ...(!questionInput.trim() ? PRIMARY_BUTTON_DISABLED : {}),
                }}
              >
                Get answer
              </button>
            </div>
            <p
              style={{
                margin: "8px 0 0",
                color: THEME.secondaryText,
                fontSize: 12,
                lineHeight: 1.4,
              }}
            >
              This feature would use an Anthropic API key and a RAG system of company content to generate contextual answers.
            </p>
          </section>

          <div style={{ height: 1, background: THEME.border, margin: "24px 0" }} />

          {/* Notes */}
          <section>
            <h2 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: THEME.primaryText }}>
              Notes
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Capture call notes, objections, follow-ups…"
              rows={5}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: `1px solid ${THEME.border}`,
                fontSize: 14,
                outline: "none",
                color: THEME.primaryText,
                background: "#fff",
                fontFamily: "inherit",
                resize: "vertical",
                boxSizing: "border-box",
                lineHeight: 1.5,
              }}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
