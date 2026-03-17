"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.3s ease",
        background: scrolled
          ? "rgba(10, 10, 11, 0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 32, height: 32,
            background: "linear-gradient(135deg, #f59e0b, #ef4444)",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>
            🍽️
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.3px", color: "#f2f2f3" }}>
            FoodSnap<span style={{ color: "#f59e0b" }}>AI</span>
          </span>
        </Link>

        {/* Links */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          <a href="#como-funciona" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, transition: "color 0.2s" }}
            onMouseOver={e => (e.currentTarget.style.color = "#f2f2f3")}
            onMouseOut={e => (e.currentTarget.style.color = "var(--text-secondary)")}>
            Como funciona
          </a>
          <a href="#galeria" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, transition: "color 0.2s" }}
            onMouseOver={e => (e.currentTarget.style.color = "#f2f2f3")}
            onMouseOut={e => (e.currentTarget.style.color = "var(--text-secondary)")}>
            Galeria
          </a>
          <a href="#precos" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, transition: "color 0.2s" }}
            onMouseOver={e => (e.currentTarget.style.color = "#f2f2f3")}
            onMouseOut={e => (e.currentTarget.style.color = "var(--text-secondary)")}>
            Preços
          </a>
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/login" className="btn-secondary" style={{ padding: "9px 20px", fontSize: "0.85rem" }}>
            Entrar
          </Link>
          <Link href="/cadastro" className="btn-primary" style={{ padding: "9px 20px", fontSize: "0.85rem" }}>
            Começar grátis →
          </Link>
        </div>
      </div>
    </nav>
  );
}
