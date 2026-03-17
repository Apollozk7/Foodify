"use client";

const STEPS = [
  {
    num: "01",
    icon: "📸",
    title: "Tire ou envie uma foto",
    desc: "Use a câmera do celular ou envie uma foto existente do seu prato. Quanto mais nítida, melhor o resultado.",
  },
  {
    num: "02",
    icon: "✍️",
    title: "Descreva o resultado",
    desc: 'Digite o que você quer: "fundo de mármore, iluminação suave, ângulo 45°". Nossa IA melhora seu prompt automaticamente.',
  },
  {
    num: "03",
    icon: "⚡",
    title: "IA gera em segundos",
    desc: "O FLUX processa sua imagem e retorna uma versão profissional em até 15 segundos. Sem espera, sem frustração.",
  },
  {
    num: "04",
    icon: "⬇️",
    title: "Baixe e use em qualquer lugar",
    desc: "Faça download em 1K, 2K ou 4K. Pronto para cardápio, Instagram, iFood, Rappi — onde precisar.",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" style={{ padding: "100px 0" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="badge" style={{ marginBottom: 20 }}>Como funciona</span>
          <h2 style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 800,
            letterSpacing: "-0.8px",
            lineHeight: 1.15,
            marginBottom: 16,
          }}>
            <span className="gradient-text">4 passos.</span> Uma foto incrível.
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            Projetado para quem não tem tempo nem conhecimento técnico. Tudo é automático — só você e seu prato.
          </p>
        </div>

        {/* Steps grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
          position: "relative",
        }}>
          {/* Connector line */}
          <div style={{
            position: "absolute",
            top: 40,
            left: "12%",
            right: "12%",
            height: 1,
            background: "linear-gradient(90deg, transparent, var(--border-hover), var(--accent), var(--border-hover), transparent)",
            pointerEvents: "none",
          }} />

          {STEPS.map((step, i) => (
            <div key={i} className="glass-card" style={{ padding: "28px 24px", position: "relative", overflow: "hidden", transition: "border-color 0.3s, transform 0.3s" }}
              onMouseOver={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(245,158,11,0.4)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLDivElement).style.transform = "none";
              }}
            >
              {/* Step number */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: i === 2 ? "linear-gradient(135deg, #f59e0b, #ef4444)" : "var(--bg-muted)",
                fontWeight: 800,
                fontSize: "0.75rem",
                color: i === 2 ? "#000" : "var(--text-secondary)",
                marginBottom: 20,
                letterSpacing: "1px",
                position: "relative",
                zIndex: 1,
              }}>
                {step.num}
              </div>

              <div style={{ fontSize: "1.6rem", marginBottom: 12 }}>{step.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 10, color: "var(--text-primary)", lineHeight: 1.3 }}>
                {step.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.83rem", lineHeight: 1.65 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom cta */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Plano Starter inclui <strong style={{ color: "var(--text-primary)" }}>20 créditos grátis</strong> — sem cartão de crédito
          </p>
        </div>
      </div>
    </section>
  );
}
