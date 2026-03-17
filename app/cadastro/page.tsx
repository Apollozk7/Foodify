"use client";
import Link from "next/link";
import { useState } from "react";

export default function CadastroPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1400);
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "40px 24px", 
      background: "var(--bg-void)",
      fontFamily: "var(--font-body)"
    }}>
      {/* Background glow */}
      <div style={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: "var(--grad-hero)", 
        pointerEvents: "none",
        opacity: 0.6
      }} />

      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div style={{ 
              width: 42, height: 42, 
              background: "linear-gradient(135deg, #f59e0b, #ef4444)", 
              borderRadius: 12, 
              display: "flex", alignItems: "center", justifyContent: "center", 
              fontSize: 22,
              boxShadow: "0 0 20px rgba(245,158,11,0.2)"
            }}>
              🍽️
            </div>
            <span style={{ 
              fontWeight: 800, 
              fontSize: "1.4rem", 
              color: "#f2f2f3", 
              fontFamily: "var(--font-header)",
              letterSpacing: "-0.03em" 
            }}>
              FoodSnap<span style={{ color: "var(--accent)" }}>AI</span>
            </span>
          </Link>
        </div>

        <div className="glass-card" style={{ 
          padding: "40px 36px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)"
        }}>
          {step === 1 ? (
            <>
              <h1 style={{ 
                fontSize: "1.75rem", 
                fontWeight: 800, 
                marginBottom: 10, 
                fontFamily: "var(--font-header)",
                letterSpacing: "-0.03em"
              }}>
                Criar sua conta
              </h1>
              <p style={{ 
                color: "var(--text-secondary)", 
                fontSize: "0.95rem", 
                marginBottom: 32, 
                lineHeight: 1.6 
              }}>
                Comece com <strong style={{ color: "var(--accent)" }}>20 créditos grátis</strong> por dia.
              </p>

              {/* Social Login */}
              <button style={{
                width: "100%", 
                background: "var(--bg-void)", 
                border: "1px solid var(--border)",
                borderRadius: 10, 
                padding: "14px 16px", 
                color: "var(--text-primary)", 
                fontSize: "0.9rem",
                fontWeight: 600, 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: 12, 
                marginBottom: 24, 
                transition: "all 0.2s",
              }}
                onMouseOver={e => (e.currentTarget.style.borderColor = "var(--border-hover)")}
                onMouseOut={e => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <span style={{ fontSize: "1.2rem" }}>G</span> Continuar com Google
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <hr style={{ flex: 1, border: "none", borderTop: "1px solid var(--border)" }} />
                <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>ou</span>
                <hr style={{ flex: 1, border: "none", borderTop: "1px solid var(--border)" }} />
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Nome</label>
                  <input type="text" required placeholder="Seu nome completo" className="input-field" style={{ background: "var(--bg-void)" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>E-mail</label>
                  <input type="email" required placeholder="voce@email.com" className="input-field" style={{ background: "var(--bg-void)" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Senha</label>
                  <input type="password" required placeholder="Mínimo 8 caracteres" className="input-field" style={{ background: "var(--bg-void)" }} />
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ 
                  justifyContent: "center", 
                  marginTop: 10, 
                  fontSize: "1rem", 
                  padding: "16px",
                  boxShadow: "0 8px 16px rgba(245,158,11,0.2)"
                }}>
                  {loading ? (
                    <span style={{ display: "inline-block", width: 20, height: 20, border: "2.5px solid rgba(0,0,0,0.2)", borderTopColor: "#000", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  ) : "Criar minha conta →"}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <div style={{ fontSize: "3.5rem", marginBottom: 24 }}>✨</div>
              <h2 style={{ 
                fontWeight: 800, 
                fontSize: "1.75rem", 
                marginBottom: 16,
                fontFamily: "var(--font-header)",
                letterSpacing: "-0.03em"
              }}>
                Bem-vindo ao FoodSnapAI!
              </h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 32, fontSize: "1.05rem" }}>
                Sua conta foi criada e você já tem <strong style={{ color: "var(--accent)" }}>20 créditos</strong> disponíveis para hoje.
              </p>
              <Link href="/dashboard" className="btn-primary" style={{ display: "block", textAlign: "center", padding: "16px", fontSize: "1rem" }}>
                Começar a criar agora →
              </Link>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 32, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          Já tem uma conta?{" "}
          <Link href="/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 700 }}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}
