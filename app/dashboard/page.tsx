"use client";
import { useState, useRef } from "react";
import Link from "next/link";

const MOCK_HISTORY = [
  { id: 1, emoji: "🍕", label: "Pizza Margherita", time: "há 2h", status: "done" },
  { id: 2, emoji: "🍔", label: "Smash Burger", time: "há 5h", status: "done" },
  { id: 3, emoji: "🥗", label: "Caesar Salad", time: "ontem", status: "done" },
];

const STYLE_PRESETS = [
  { key: "dramatic", label: "Dramático", icon: "🌑" },
  { key: "clean", label: "Limpo", icon: "⬜" },
  { key: "rustic", label: "Rústico", icon: "🪵" },
  { key: "minimal", label: "Minimalista", icon: "◻️" },
  { key: "warm", label: "Quente", icon: "🌅" },
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
    <div style={{ minHeight: "100vh", background: "var(--bg-void)", display: "flex", flexDirection: "column" }}>
      {/* Top nav */}
      <header style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #f59e0b, #ef4444)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🍽️</div>
            <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#f2f2f3" }}>FoodSnap<span style={{ color: "#f59e0b" }}>AI</span></span>
          </Link>

          <nav style={{ display: "flex", gap: 4 }}>
            {tabs.map(tab => (
              <button key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background: activeTab === tab.key ? "var(--bg-elevated)" : "transparent",
                  border: activeTab === tab.key ? "1px solid var(--border)" : "1px solid transparent",
                  borderRadius: 8,
                  padding: "7px 16px",
                  color: activeTab === tab.key ? "var(--text-primary)" : "var(--text-secondary)",
                  fontSize: "0.84rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.2s",
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Credits chip */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "var(--bg-elevated)", border: "1px solid rgba(245,158,11,0.3)",
              borderRadius: 100, padding: "5px 12px",
            }}>
              <span style={{ fontSize: "0.7rem" }}>💎</span>
              <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--accent)" }}>{credits} créditos</span>
            </div>
            {/* Avatar */}
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "linear-gradient(135deg, #f59e0b, #ef4444)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: "0.85rem", color: "#000",
              cursor: "pointer",
            }}>F</div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main style={{ flex: 1, padding: "40px 0" }}>
        <div className="container" style={{ maxWidth: 1000 }}>

          {/* GENERATE TAB */}
          {activeTab === "generate" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
              {/* Left: Editor */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div className="glass-card" style={{ padding: 28 }}>
                  <h2 style={{ fontWeight: 800, fontSize: "1.15rem", marginBottom: 20 }}>Nova Geração</h2>

                  {/* Upload area */}
                  <div
                    onClick={() => fileRef.current?.click()}
                    style={{
                      border: `2px dashed ${uploadedFile ? "rgba(245,158,11,0.4)" : "var(--border)"}`,
                      borderRadius: 12,
                      padding: uploadedFile ? 0 : "40px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                      marginBottom: 20,
                      transition: "border-color 0.2s",
                      overflow: "hidden",
                      background: uploadedFile ? "var(--bg-muted)" : "transparent",
                    }}
                    onMouseOver={e => !uploadedFile && ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)")}
                    onMouseOut={e => !uploadedFile && ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)")}
                  >
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
                    {uploadedFile ? (
                      <div style={{ position: "relative" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={uploadedFile} alt="preview" style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
                        <div style={{
                          position: "absolute", top: 8, right: 8,
                          background: "rgba(0,0,0,0.7)", borderRadius: 6, padding: "4px 8px",
                          fontSize: "0.72rem", color: "#fff", cursor: "pointer",
                        }} onClick={e => { e.stopPropagation(); setUploadedFile(null); }}>
                          ✕ Remover
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: "2rem", marginBottom: 10 }}>📷</div>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: 4 }}>
                          Arraste ou clique para enviar a foto do prato
                        </p>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>PNG, JPG, WEBP · até 20MB</p>
                      </>
                    )}
                  </div>

                  {/* Style presets */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>Estilo</label>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {STYLE_PRESETS.map(s => (
                        <button key={s.key}
                          onClick={() => setSelectedStyle(s.key)}
                          style={{
                            background: selectedStyle === s.key ? "rgba(245,158,11,0.15)" : "var(--bg-muted)",
                            border: `1px solid ${selectedStyle === s.key ? "var(--accent)" : "var(--border)"}`,
                            borderRadius: 8, padding: "7px 13px",
                            color: selectedStyle === s.key ? "var(--accent)" : "var(--text-secondary)",
                            fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 5,
                            transition: "all 0.2s",
                          }}
                        >
                          {s.icon} {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Prompt */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Prompt (opcional)</label>
                    <textarea
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      placeholder="Descreva o estilo: ex. 'fundo de mármore branco, iluminação natural, folhas de manjericão fresco'"
                      className="input-field"
                      style={{ resize: "vertical", minHeight: 80, fontSize: "0.87rem", lineHeight: 1.6 }}
                    />
                    <p style={{ color: "var(--text-muted)", fontSize: "0.72rem", marginTop: 6 }}>
                      💡 Quanto mais específico, melhor o resultado. Nossa IA vai aprimorar seu prompt automaticamente.
                    </p>
                  </div>

                  <button
                    className="btn-primary"
                    disabled={generating || (!uploadedFile && !prompt)}
                    onClick={handleGenerate}
                    style={{ width: "100%", justifyContent: "center", fontSize: "0.95rem", padding: "13px", opacity: (!uploadedFile && !prompt) ? 0.5 : 1 }}
                  >
                    {generating ? (
                      <><span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Gerando...</>
                    ) : "⚡ Gerar Imagem (5 créditos)"}
                  </button>
                </div>
              </div>

              {/* Right: Result / Preview */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div className="glass-card" style={{ padding: 24 }}>
                  <h3 style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 16, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Resultado</h3>

                  {generating ? (
                    <div style={{ height: 280, background: "var(--bg-muted)", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Gerando com FLUX AI…</p>
                    </div>
                  ) : generated ? (
                    <>
                      <div style={{
                        height: 280,
                        background: "radial-gradient(ellipse at 40% 40%, #8b4513, #1a0a00)",
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "5rem",
                        marginBottom: 16,
                        position: "relative",
                        overflow: "hidden",
                      }}>
                        🍕
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)" }} />
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {["1K", "2K"].map(res => (
                          <button key={res} className="btn-secondary" style={{ flex: 1, justifyContent: "center", fontSize: "0.82rem", padding: "9px" }}>
                            ⬇ {res}
                          </button>
                        ))}
                      </div>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", textAlign: "center", marginTop: 10 }}>
                        Salvo na sua galeria automaticamente
                      </p>
                    </>
                  ) : (
                    <div style={{ height: 280, background: "var(--bg-muted)", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <div style={{ fontSize: "2.5rem", opacity: 0.3 }}>🖼️</div>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>O resultado aparecerá aqui</p>
                    </div>
                  )}
                </div>

                {/* Recent generations */}
                <div className="glass-card" style={{ padding: 24 }}>
                  <h3 style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 14, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Recentes</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {MOCK_HISTORY.map(item => (
                      <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "var(--bg-muted)", borderRadius: 10, cursor: "pointer", transition: "background 0.2s" }}
                        onMouseOver={e => (e.currentTarget as HTMLDivElement).style.background = "var(--bg-elevated)"}
                        onMouseOut={e => (e.currentTarget as HTMLDivElement).style.background = "var(--bg-muted)"}
                      >
                        <div style={{ width: 38, height: 38, background: "var(--bg-elevated)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>{item.emoji}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{item.label}</div>
                          <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{item.time}</div>
                        </div>
                        <span style={{ color: "var(--accent)", fontSize: "0.7rem" }}>⬇</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GALLERY TAB */}
          {activeTab === "gallery" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontWeight: 800, fontSize: "1.15rem" }}>Sua Galeria</h2>
                <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>3 de 10 imagens usadas</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {MOCK_HISTORY.map(item => (
                  <div key={item.id} className="glass-card" style={{ overflow: "hidden", cursor: "pointer", transition: "transform 0.2s, border-color 0.2s" }}
                    onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(245,158,11,0.4)"; }}
                    onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; }}
                  >
                    <div style={{ height: 180, background: "var(--bg-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>{item.emoji}</div>
                    <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.84rem" }}>{item.label}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>{item.time}</div>
                      </div>
                      <button className="btn-secondary" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>⬇ 1K</button>
                    </div>
                  </div>
                ))}
                {/* Empty state slots */}
                {Array(7).fill(0).map((_, i) => (
                  <div key={`empty-${i}`} style={{
                    height: 214,
                    background: "var(--bg-surface)",
                    border: "2px dashed var(--border)",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    opacity: 0.4,
                  }}>+ gerar</div>
                ))}
              </div>
            </div>
          )}

          {/* CREDITS TAB */}
          {activeTab === "credits" && (
            <div style={{ maxWidth: 640, margin: "0 auto" }}>
              <h2 style={{ fontWeight: 800, fontSize: "1.15rem", marginBottom: 24 }}>Seus Créditos</h2>

              <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: 6 }}>Saldo atual</p>
                    <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--accent)" }}>{credits}</div>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginTop: 4 }}>créditos disponíveis</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: 6 }}>Plano atual</p>
                    <div style={{ fontWeight: 700, fontSize: "1rem" }}>Starter Grátis</div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: 4 }}>Renova diariamente</p>
                  </div>
                </div>

                <div style={{ marginTop: 24, background: "var(--bg-muted)", borderRadius: 100, height: 8, overflow: "hidden" }}>
                  <div style={{ width: "25%", height: "100%", background: "linear-gradient(90deg, #f59e0b, #ef4444)", borderRadius: 100, transition: "width 0.6s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  <span>15 usados hoje</span>
                  <span>5 restantes</span>
                </div>
              </div>

              <div className="glass-card" style={{ padding: 28 }}>
                <h3 style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 16, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Comprar créditos avulsos</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
                  {[
                    { amt: 20, price: "R$ 9", per: "R$ 0,45/crédito" },
                    { amt: 50, price: "R$ 19", per: "R$ 0,38/crédito" },
                    { amt: 120, price: "R$ 39", per: "R$ 0,33/crédito" },
                  ].map((pkg, i) => (
                    <div key={i} className="glass-card" style={{ padding: "16px", textAlign: "center", cursor: "pointer", transition: "border-color 0.2s, background 0.2s" }}
                      onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(245,158,11,0.05)"; }}
                      onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLDivElement).style.background = ""; }}
                    >
                      <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--accent)" }}>{pkg.amt}</div>
                      <div style={{ fontWeight: 600, fontSize: "0.8rem", marginBottom: 4 }}>créditos</div>
                      <div style={{ fontWeight: 700, fontSize: "1rem" }}>{pkg.price}</div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>{pkg.per}</div>
                    </div>
                  ))}
                </div>
                <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px" }}>
                  Comprar agora
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
