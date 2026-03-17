"use client";
import { useState, useRef } from "react";
import Link from "next/link";

const MOCK_HISTORY = [
  { id: 1, emoji: "🍕", label: "Pizza Margherita", time: "há 2h", status: "done" },
  { id: 2, emoji: "🍔", label: "Smash Burger", time: "há 5h", status: "done" },
  { id: 3, emoji: "🥗", label: "Caesar Salad", time: "ontem", status: "done" },
];

const STYLE_PRESETS = [
  { key: "dramatic", label: "Dramático", icon: "🌑", description: "Sombras profundas e luz pontual" },
  { key: "clean", label: "Limpo", icon: "⬜", description: "Fundo claro e luz suave" },
  { key: "rustic", label: "Rústico", icon: "🪵", description: "Texturas de madeira e tons quentes" },
  { key: "minimal", label: "Minimalista", icon: "◻️", description: "Cenário simples e foco total" },
  { key: "warm", label: "Quente", icon: "🌅", description: "Golden hour e brilho dourado" },
];

export default function DashboardPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("dramatic");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState<"generate" | "gallery" | "credits">("generate");
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const credits = 20;

  const handleGenerate = () => {
    if (!uploadedFile && !prompt) return;
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(URL.createObjectURL(file));
  };

  const tabs = [
    { key: "generate", label: "Gerar", icon: "⚡" },
    { key: "gallery", label: "Galeria", icon: "🖼️" },
    { key: "credits", label: "Créditos", icon: "💎" },
  ] as const;

  return (
    <div style={{ 
      height: "100vh", 
      background: "var(--bg-void)", 
      display: "flex", 
      overflow: "hidden",
      fontFamily: "var(--font-body)"
    }}>
      
      {/* Column 1: Side Nav (Narrow) */}
      <aside style={{ 
        width: "72px", 
        background: "var(--bg-surface)", 
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px 0",
        gap: 20,
        zIndex: 100
      }}>
        <Link href="/" style={{ marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #f59e0b, #ef4444)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🍽️</div>
        </Link>

        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            title={tab.label}
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: activeTab === tab.key ? "var(--accent-soft)" : "transparent",
              border: "none",
              color: activeTab === tab.key ? "var(--accent)" : "var(--text-muted)",
              fontSize: "1.2rem",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {tab.icon}
          </button>
        ))}

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
           <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: "0.85rem", color: "var(--text-secondary)",
              cursor: "pointer"
            }}>F</div>
        </div>
      </aside>

      {/* Main Container for columns 2 and 3 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        
        {/* Top Header */}
        <header style={{ 
          height: "60px", 
          background: "var(--bg-void)", 
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          justifyContent: "space-between"
        }}>
          <h1 style={{ fontSize: "1rem", fontWeight: 700, fontFamily: "var(--font-header)", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>
            {tabs.find(t => t.key === activeTab)?.label}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
             <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "var(--bg-surface)", border: "1px solid var(--border)",
              borderRadius: 8, padding: "6px 14px",
            }}>
              <span style={{ fontSize: "0.8rem" }}>💎</span>
              <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--accent)" }}>{credits}</span>
            </div>
            <button className="btn-primary" style={{ padding: "8px 16px", fontSize: "0.8rem" }}>Upgrade</button>
          </div>
        </header>

        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          
          {/* Column 2: Editor Controls */}
          <section style={{ 
            width: "400px", 
            background: "var(--bg-surface)", 
            borderRight: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            padding: "24px"
          }}>
            {activeTab === "generate" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>1. Imagem Base</label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    style={{
                      border: `2px dashed ${uploadedFile ? "var(--accent)" : "var(--border)"}`,
                      borderRadius: 12,
                      padding: uploadedFile ? 0 : "32px 16px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      overflow: "hidden",
                      background: uploadedFile ? "var(--bg-void)" : "rgba(255,255,255,0.02)",
                    }}
                  >
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
                    {uploadedFile ? (
                      <div style={{ position: "relative" }}>
                        <img src={uploadedFile} alt="preview" style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
                        <div style={{
                          position: "absolute", top: 8, right: 8,
                          background: "rgba(0,0,0,0.8)", borderRadius: 6, padding: "4px 8px",
                          fontSize: "0.7rem", color: "#fff", cursor: "pointer",
                        }} onClick={e => { e.stopPropagation(); setUploadedFile(null); }}>
                          ✕ Remover
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>📸</div>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Upload da foto original</p>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>2. Estilo Visual</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {STYLE_PRESETS.map(s => (
                      <button key={s.key}
                        onClick={() => setSelectedStyle(s.key)}
                        style={{
                          background: selectedStyle === s.key ? "var(--bg-void)" : "transparent",
                          border: `1px solid ${selectedStyle === s.key ? "var(--accent)" : "var(--border)"}`,
                          borderRadius: 10, padding: "12px",
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        <div style={{ fontSize: "1.2rem", marginBottom: 6 }}>{s.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: "0.85rem", color: selectedStyle === s.key ? "var(--text-primary)" : "var(--text-secondary)" }}>{s.label}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2, lineHeight: 1.3 }}>{s.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>3. Detalhes (Opcional)</label>
                  <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Ex: 'fundo de mármore, manjericão fresco...'"
                    className="input-field"
                    style={{ minHeight: 100, fontSize: "0.85rem" }}
                  />
                </div>

                <button
                  className="btn-primary"
                  disabled={generating || (!uploadedFile && !prompt)}
                  onClick={handleGenerate}
                  style={{ width: "100%", justifyContent: "center", padding: "16px", marginTop: 8 }}
                >
                  {generating ? "Gerando Imagem..." : "⚡ Gerar Imagem (5 créditos)"}
                </button>
              </div>
            ) : activeTab === "gallery" ? (
               <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Selecione uma imagem para ver detalhes.</div>
            ) : (
               <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Histórico de transações.</div>
            )}
          </section>

          {/* Column 3: Preview Area */}
          <section style={{ 
            flex: 1, 
            background: "var(--bg-void)", 
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflowY: "auto"
          }}>
            {activeTab === "generate" ? (
              <div style={{ width: "100%", maxWidth: "700px" }}>
                <div style={{ 
                  aspectRatio: "1",
                  background: "var(--bg-surface)", 
                  border: "1px solid var(--border)",
                  borderRadius: 20,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 20px 80px rgba(0,0,0,0.4)"
                }}>
                  {generating ? (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ width: 48, height: 48, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
                      <p style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Processando sua foto com FLUX...</p>
                    </div>
                  ) : generated ? (
                    <img src="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=1200&auto=format&fit=crop" alt="Result" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ textAlign: "center", opacity: 0.3 }}>
                      <div style={{ fontSize: "4rem", marginBottom: 16 }}>🍽️</div>
                      <p style={{ fontWeight: 600 }}>Configure o editor e gere sua foto</p>
                    </div>
                  )}
                </div>

                {generated && !generating && (
                  <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "center" }}>
                    <button className="btn-secondary" style={{ padding: "12px 24px" }}>⬇ Download 1K</button>
                    <button className="btn-secondary" style={{ padding: "12px 24px" }}>⬇ Download 2K</button>
                    <button className="btn-primary" style={{ padding: "12px 24px" }}>✨ Upscale 4K</button>
                  </div>
                )}
              </div>
            ) : activeTab === "gallery" ? (
               <div style={{ width: "100%", height: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20, alignContent: "start" }}>
                  {MOCK_HISTORY.map(item => (
                    <div key={item.id} className="glass-card" style={{ overflow: "hidden", cursor: "pointer" }}>
                      <div style={{ height: 200, background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>{item.emoji}</div>
                      <div style={{ padding: "12px" }}>
                        <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{item.label}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>{item.time}</div>
                      </div>
                    </div>
                  ))}
               </div>
            ) : (
              <div className="glass-card" style={{ width: "100%", maxWidth: "600px", padding: "32px" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 24, fontFamily: "var(--font-header)" }}>Gerenciar Créditos</h2>
                <div style={{ background: "var(--bg-void)", padding: "24px", borderRadius: 12, marginBottom: 24 }}>
                   <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: 8 }}>Saldo Disponível</div>
                   <div style={{ fontSize: "3rem", fontWeight: 900, color: "var(--accent)", lineHeight: 1 }}>{credits}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                   {["20 créditos - R$ 9", "50 créditos - R$ 19", "120 créditos - R$ 39"].map((p, i) => (
                     <button key={i} className="btn-secondary" style={{ justifyContent: "space-between", padding: "16px" }}>
                        <span>{p}</span>
                        <span>→</span>
                     </button>
                   ))}
                </div>
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}
