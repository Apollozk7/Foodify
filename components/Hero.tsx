import Link from "next/link";
import ImageSlider from "./ImageSlider";

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
      paddingTop: 120,
      paddingBottom: 100,
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
          fontSize: "clamp(2.6rem, 7vw, 4.8rem)",
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: "-0.04em",
          marginBottom: 24,
          maxWidth: 900,
          margin: "0 auto 24px",
          fontFamily: "var(--font-header)",
        }}>
          <span className="gradient-text">Fotos profissionais</span>
          <br />
          <span className="accent-text">de comida com IA</span>
        </h1>

        {/* Sub */}
        <p className="animate-fade-up-delay-2" style={{
          textAlign: "center",
          color: "var(--text-secondary)",
          fontSize: "1.15rem",
          maxWidth: 600,
          margin: "0 auto 48px",
          lineHeight: 1.6,
        }}>
          Envie uma foto simples do seu prato e receba uma imagem de cardápio
          <strong style={{ color: "var(--text-primary)" }}> pronta para usar</strong> em segundos —
          sem estúdio, sem complicação.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up-delay-3" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 80 }}>
          <Link href="/cadastro" className="btn-primary" style={{ padding: "16px 36px", fontSize: "1rem" }}>
            🚀 Criar conta grátis
          </Link>
          <a href="#galeria" className="btn-secondary" style={{ padding: "16px 36px", fontSize: "1rem" }}>
            Ver galeria
          </a>
        </div>

        {/* Visual Showcase (Slider) */}
        <div className="animate-fade-up-delay-3" style={{ maxWidth: 960, margin: "0 auto 80px" }}>
          <ImageSlider 
            before="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop" 
            after="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=1200&auto=format&fit=crop"
            beforeLabel="Foto do Celular"
            afterLabel="Resultado FoodSnapAI"
          />
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 1,
          maxWidth: 720,
          margin: "0 auto",
          background: "var(--border)",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid var(--border)",
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              background: "var(--bg-surface)",
              padding: "24px 16px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: i === 3 ? "var(--text-primary)" : "var(--accent)", letterSpacing: "-0.03em" }}>
                {s.value}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
