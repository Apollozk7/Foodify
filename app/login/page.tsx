"use client";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: "var(--bg-void)" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 38, height: 38, background: "linear-gradient(135deg, #f59e0b, #ef4444)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🍽️</div>
            <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "#f2f2f3" }}>FoodSnap<span style={{ color: "#f59e0b" }}>AI</span></span>
          </Link>
        </div>

        <div className="glass-card" style={{ padding: "36px 32px" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 8, letterSpacing: "-0.5px" }}>Bem-vindo de volta</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: 28 }}>
            Entre na sua conta para continuar criando.
          </p>

          <button style={{
            width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border)",
            borderRadius: 10, padding: "13px 16px", color: "var(--text-primary)", fontSize: "0.9rem",
            fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20, transition: "border-color 0.2s",
          }}
            onMouseOver={e => (e.currentTarget.style.borderColor = "var(--border-hover)")}
            onMouseOut={e => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <span>🔵</span> Continuar com Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <hr style={{ flex: 1, border: "none", borderTop: "1px solid var(--border)" }} />
            <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>ou com e-mail</span>
            <hr style={{ flex: 1, border: "none", borderTop: "1px solid var(--border)" }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: 6, color: "var(--text-secondary)" }}>E-mail</label>
              <input type="email" required placeholder="voce@email.com" className="input-field" />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)" }}>Senha</label>
                <a href="#" style={{ fontSize: "0.78rem", color: "var(--accent)", textDecoration: "none" }}>Esqueceu?</a>
              </div>
              <input type="password" required placeholder="Sua senha" className="input-field" />
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: "center", marginTop: 4, fontSize: "0.95rem", padding: "13px" }}>
              {loading ? (
                <span style={{ display: "inline-block", width: 18, height: 18, border: "2.5px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              ) : "Entrar →"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.83rem", color: "var(--text-muted)" }}>
          Não tem conta?{" "}
          <Link href="/cadastro" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Criar grátis</Link>
        </p>
      </div>
    </div>
  );
}
