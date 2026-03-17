"use client";
import { useState } from "react";

const ITEMS = [
  { category: "Pizza", emoji: "🍕", prompt: "Neapolitan pizza, wood-fired oven, marble slab, oregano garnish, side view, dramatic lighting" },
  { category: "Hambúrguer", emoji: "🍔", prompt: "Gourmet smash burger, sesame bun, dripping cheese, dark moody background, close-up" },
  { category: "Sobremesa", emoji: "🍰", prompt: "Strawberry cheesecake slice, rustic wood, powdered sugar falling, golden hour" },
  { category: "Salada", emoji: "🥗", prompt: "Fresh caesar salad, overhead flat lay, vibrant greens, croutons, white marble" },
  { category: "Sushi", emoji: "🍣", prompt: "Premium sashimi platter, minimalist black plate, sesame seeds, zen garden vibes" },
  { category: "Coffee", emoji: "☕", prompt: "Artisan latte with leaf art, ceramic mug, bokeh cafe background, warm tones" },
];

const MOCK_COLORS = [
  ["#3d2708","#8b4513"],
  ["#1a0a00","#4a2500"],
  ["#2d0a1a","#6b1f3d"],
  ["#0d2d0d","#1a5c1a"],
  ["#0a0d1a","#1a2142"],
  ["#1a1000","#3d2d00"],
];

export default function Gallery() {
  const [active, setActive] = useState(0);

  return (
    <section id="galeria" style={{ padding: "100px 0", background: "var(--bg-surface)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="badge" style={{ marginBottom: 20 }}>Galeria</span>
          <h2 style={{
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 800,
            letterSpacing: "-0.8px",
            lineHeight: 1.15,
            marginBottom: 16,
          }}>
            O que nossa IA cria
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 440, margin: "0 auto", lineHeight: 1.7 }}>
            Cada imagem foi gerada a partir de um prompt simples — assim como o seu descrição vai ser processada.
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 40, flexWrap: "wrap" }}>
          {["Todos", ...ITEMS.map(i => i.category)].map((cat, idx) => (
            <button key={idx}
              onClick={() => setActive(idx === 0 ? 0 : idx)}
              style={{
                background: "transparent",
                border: `1px solid ${active === (idx === 0 ? 0 : idx) || (idx === 0 && active === 0) ? "var(--accent)" : "var(--border)"}`,
                color: active === (idx === 0 ? 0 : idx) && idx > 0 ? "var(--accent)" : idx === 0 && active === 0 ? "var(--accent)" : "var(--text-secondary)",
                borderRadius: 8,
                padding: "7px 16px",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {idx > 0 ? ITEMS[idx - 1].emoji + " " : ""}{cat}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}>
          {ITEMS.map((item, i) => (
            <div key={i}
              className="glass-card"
              style={{
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s, border-color 0.3s",
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(245,158,11,0.4)";
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "none";
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
              }}
            >
              {/* Placeholder "image" with gradient */}
              <div style={{
                height: 220,
                background: `radial-gradient(ellipse at 40% 40%, ${MOCK_COLORS[i][1]}, ${MOCK_COLORS[i][0]})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{ fontSize: "4.5rem", filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.6))" }}>
                  {item.emoji}
                </div>
                {/* Generated badge */}
                <div style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "rgba(0,0,0,0.6)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 6,
                  padding: "3px 8px",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: "var(--accent)",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}>
                  IA Gerada
                </div>
              </div>
              {/* Info */}
              <div style={{ padding: "16px 18px" }}>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 6 }}>{item.category}</div>
                <p style={{
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>
                  {item.prompt}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.78rem", marginTop: 28 }}>
          * Exemplos representativos dos prompts — imagens reais são geradas em tempo real com Fal.ai FLUX
        </p>
      </div>
    </section>
  );
}
