"use client";
import { useState } from "react";
import Link from "next/link";

const PLANS = [
  {
    key: "starter",
    name: "Starter",
    price: "Grátis",
    priceNote: "20 créditos por dia",
    credits: 20,
    gallery: 10,
    highlight: false,
    features: [
      "20 créditos grátis por dia",
      "4 gerações de imagem / dia",
      "Download em 1K",
      "Galeria de 10 imagens",
      "Marca d'água removível",
    ],
    cta: "Começar grátis",
    href: "/cadastro",
  },
  {
    key: "medium",
    name: "Profissional",
    price: "R$ 29",
    priceNote: "/mês • 80 créditos",
    credits: 80,
    gallery: 50,
    highlight: true,
    badge: "Mais popular",
    features: [
      "80 créditos por mês",
      "16 gerações de imagem",
      "Download em 1K e 2K",
      "Galeria de 50 imagens",
      "Sem marca d'água",
      "Créditos avulsos com 10% desc.",
    ],
    cta: "Assinar agora",
    href: "/cadastro?plano=medium",
  },
  {
    key: "high",
    name: "Negócio",
    price: "R$ 49",
    priceNote: "/mês • 100 créditos",
    credits: 100,
    gallery: 100,
    highlight: false,
    features: [
      "100 créditos por mês",
      "20 gerações de imagem",
      "Download em 1K, 2K e 4K",
      "Galeria de 100 imagens",
      "Sem marca d'água",
      "Créditos avulsos com 15% desc.",
      "Suporte prioritário",
    ],
    cta: "Assinar agora",
    href: "/cadastro?plano=high",
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: "R$ 99",
    priceNote: "/mês • 250 créditos",
    credits: 250,
    gallery: -1,
    highlight: false,
    features: [
      "250 créditos por mês",
      "50 gerações de imagem",
      "Download em todas as resoluções",
      "Galeria ilimitada",
      "Sem marca d'água",
      "Créditos avulsos com 20% desc.",
      "Suporte 24h dedicado",
      "API access (em breve)",
    ],
    cta: "Falar com vendas",
    href: "/contato",
  },
];

export default function Pricing() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="precos" style={{ padding: "100px 0" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="badge" style={{ marginBottom: 20 }}>Preços</span>
          <h2 style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 800,
            letterSpacing: "-0.8px",
            lineHeight: 1.15,
            marginBottom: 16,
          }}>
            Simples, sem surpresas
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
            1 crédito = 1 geração de imagem custa <strong style={{ color: "var(--accent)" }}>5 créditos</strong>.
            Escolha o plano ideal para o seu negócio.
          </p>
        </div>

        {/* Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          alignItems: "stretch",
        }}>
          {PLANS.map((plan) => (
            <div key={plan.key}
              className="glass-card"
              onMouseOver={() => setHovered(plan.key)}
              onMouseOut={() => setHovered(null)}
              style={{
                padding: 28,
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.3s, border-color 0.3s",
                transform: plan.highlight ? "scale(1.03)" : hovered === plan.key ? "translateY(-4px)" : "none",
                border: plan.highlight ? "1px solid rgba(245,158,11,0.6)" : "1px solid var(--border)",
                boxShadow: plan.highlight ? "0 0 40px rgba(245,158,11,0.15)" : "none",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {plan.highlight && (
                <div style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0,
                  height: 3,
                  background: "linear-gradient(90deg, #f59e0b, #ef4444)",
                }} />
              )}
              
              <div style={{ flex: "0 0 auto" }}>
                {plan.badge ? (
                  <div style={{
                    display: "inline-block",
                    background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                    color: "#000",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "3px 10px",
                    borderRadius: 100,
                    marginBottom: 16,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}>
                    {plan.badge}
                  </div>
                ) : (
                  <div style={{ height: 26, marginBottom: 16 }} /> // Spacer to keep title alignment
                )}

                <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 4 }}>{plan.name}</h3>
                <div style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-1px", color: plan.highlight ? "var(--accent)" : "var(--text-primary)", lineHeight: 1 }}>
                  {plan.price}
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginBottom: 24, marginTop: 4 }}>
                  {plan.priceNote}
                </div>

                <Link href={plan.href}
                  className={plan.highlight ? "btn-primary" : "btn-secondary"}
                  style={{ display: "block", textAlign: "center", marginBottom: 24, padding: "11px 16px", fontSize: "0.85rem" }}
                >
                  {plan.cta}
                </Link>

                <hr style={{ border: "none", borderTop: "1px solid var(--border)", marginBottom: 20 }} />
              </div>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, flex: "1 1 auto" }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Credit addon */}
        <div className="glass-card" style={{ marginTop: 32, padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 6 }}>Precisa de mais créditos?</h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              Compre créditos avulsos a qualquer momento, com desconto progressivo por plano.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { amt: 20, price: "R$ 9" },
              { amt: 50, price: "R$ 19" },
              { amt: 120, price: "R$ 39" },
            ].map((pkg, i) => (
              <div key={i} className="glass-card" style={{ padding: "12px 20px", textAlign: "center", cursor: "pointer", transition: "border-color 0.2s" }}
                onMouseOver={e => (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)"}
                onMouseOut={e => (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"}
              >
                <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{pkg.amt} créditos</div>
                <div style={{ color: "var(--accent)", fontSize: "0.9rem", fontWeight: 600 }}>{pkg.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
