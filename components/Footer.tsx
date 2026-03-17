"use client";

import Link from "next/link";

const LINKS = {
  Produto: ["Como funciona", "Galeria", "Preços", "API (em breve)"],
  Empresa: ["Sobre nós", "Blog", "Imprensa", "Contato"],
  Legal: ["Termos de uso", "Privacidade", "Cookies"],
};

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg-surface)", padding: "64px 0 32px" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32,
                background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16,
              }}>🍽️</div>
              <span style={{ fontWeight: 800, fontSize: "1.05rem" }}>FoodSnap<span style={{ color: "#f59e0b" }}>AI</span></span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: 1.65, maxWidth: 200 }}>
              Transformando a fotografia de comida no Brasil com Inteligência Artificial.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {["𝕏", "📸", "💼"].map((icon, i) => (
                <div key={i} style={{
                  width: 36, height: 36,
                  background: "var(--bg-muted)",
                  borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  transition: "background 0.2s",
                }}>
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 style={{ fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.5px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 }}>
                {group}
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.85rem", transition: "color 0.2s" }}
                      onMouseOver={e => (e.currentTarget.style.color = "var(--text-primary)")}
                      onMouseOut={e => (e.currentTarget.style.color = "var(--text-secondary)")}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr style={{ border: "none", borderTop: "1px solid var(--border)", marginBottom: 24 }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
            © 2025 FoodSnapAI. Todos os direitos reservados.
          </p>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 8px rgba(34,197,94,0.6)",
              animation: "pulse-glow 2s infinite",
            }} />
            <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>Todos os sistemas operacionais</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
