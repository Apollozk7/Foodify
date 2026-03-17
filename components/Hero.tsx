import Link from "next/link";

const BEFORE_AFTER = [
  {
    emoji: "🍕",
    label: "Pizza Margherita",
    before: "Foto tirada com celular, fundo de mesa suja, iluminação péssima",
    after: "Studio light, marble background, professional depth of field",
  },
  {
    emoji: "🍔",
    label: "X-Burguer",
    before: "Embalagem aberta, ângulo reto, sem contexto visual",
    after: "Golden hour, bokeh background, sesame seeds mid-air",
  },
  {
    emoji: "🥗",
    label: "Salada Caesar",
    before: "Prato branco comum, mesa de plástico",
    after: "Rustic wood surface, overhead shot, herb-scattered",
  },
];

const STATS = [
  { value: "3s", label: "Tempo médio de geração" },
  { value: "10k+", label: "Imagens criadas" },
  { value: "4.9★", label: "Avaliação dos usuários" },
  { value: "0", label: "Fotógrafo necessário" },
];

export default function Hero() {
  return (
    <section style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      paddingTop: 100,
      paddingBottom: 80,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "var(--grad-hero)",
        pointerEvents: "none",
      }} />
      {/* Subtle grid */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        pointerEvents: "none",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Badge */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <span className="badge animate-fade-up">
            <span>✨</span> Powered by Fal.ai FLUX
          </span>
        </div>

        {/* Heading */}
        <h1 className="animate-fade-up-delay-1" style={{
          textAlign: "center",
          fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
          fontWeight: 900,
          lineHeight: 1.08,
          letterSpacing: "-1.5px",
          marginBottom: 24,
          maxWidth: 820,
          margin: "0 auto 24px",
        }}>
          <span className="gradient-text">Fotos profissionais</span>
          <br />
          <span className="accent-text">de comida com IA</span>
          <br />
          <span style={{ color: "var(--text-secondary)", fontWeight: 400, fontSize: "0.65em" }}>
            para quem não tem budget de fotógrafo
          </span>
        </h1>

        {/* Sub */}
        <p className="animate-fade-up-delay-2" style={{
          textAlign: "center",
          color: "var(--text-secondary)",
          fontSize: "1.1rem",
          maxWidth: 560,
          margin: "0 auto 40px",
          lineHeight: 1.7,
        }}>
          Envie uma foto simples do seu prato e receba uma imagem de cardápio
          <strong style={{ color: "var(--text-primary)" }}> pronta para usar</strong> em segundos —
          sem fotógrafo, sem estúdio, sem complicação.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up-delay-3" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 72 }}>
          <Link href="/cadastro" className="btn-primary" style={{ fontSize: "1rem", padding: "14px 32px" }}>
            🚀 Criar conta grátis
          </Link>
          <a href="#galeria" className="btn-secondary" style={{ fontSize: "1rem", padding: "14px 32px" }}>
            Ver exemplos
          </a>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 1,
          maxWidth: 640,
          margin: "0 auto 72px",
          background: "var(--border)",
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid var(--border)",
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              background: "var(--bg-card)",
              padding: "20px 16px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: i === 3 ? "var(--text-primary)" : "var(--accent)", letterSpacing: "-1px" }}>
                {s.value}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: 4, fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Before / After cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}>
          {BEFORE_AFTER.map((item, i) => (
            <div key={i} className="glass-card" style={{ padding: 24, position: "relative", overflow: "hidden" }}>
              {/* Accent glow */}
              <div style={{
                position: "absolute",
                top: -40, right: -40,
                width: 120, height: 120,
                background: "radial-gradient(circle, rgba(245,158,11,0.12), transparent 60%)",
                pointerEvents: "none",
              }} />
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>{item.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 16, color: "var(--text-primary)" }}>
                {item.label}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 8,
                  padding: "10px 12px",
                }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#ef4444", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>Antes</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{item.before}</div>
                </div>
                <div style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--accent)" }}>↓ IA transforma em →</div>
                <div style={{
                  background: "rgba(245,158,11,0.08)",
                  border: "1px solid rgba(245,158,11,0.25)",
                  borderRadius: 8,
                  padding: "10px 12px",
                }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--accent)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>Depois</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-primary)", lineHeight: 1.5 }}>{item.after}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
