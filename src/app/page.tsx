"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  ChevronUp, 
  Menu, 
  X, 
  Instagram, 
  Twitter, 
  Sparkles, 
  Check, 
  Terminal,
  ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Reference standard images for the luxury food feel
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&q=80&w=800",
];

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateTo = (path: string) => {
    setMobileMenuOpen(false);
    window.location.href = path;
  };

  const scrollToId = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden">
      {/* Navigation - Luxury Standard */}
      <nav 
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-500 border-b",
          scrolled 
            ? "bg-black/80 backdrop-blur-xl border-white/5 py-4" 
            : "bg-transparent border-transparent py-6"
        )}
      >
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-extrabold text-black italic text-lg shadow-[0_0_20px_rgba(146,129,247,0.3)]">
              E
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tighter text-white">
              ESTÚDIO IA PRO
            </span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {['Início', 'Preços', 'Galeria', 'FAQ'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                onClick={(e) => scrollToId(e, item.toLowerCase())} 
                className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => navigateTo('/sign-in')}
              className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
            >
              Entrar
            </button>
            <Button 
              onClick={() => navigateTo('/sign-up')}
              className="bg-primary text-black font-extrabold uppercase text-[10px] tracking-[0.2em] px-6 rounded-none h-10 hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(146,129,247,0.2)]"
            >
              CRIAR CONTA
            </Button>
          </div>

          {/* Mobile Hamburguer */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section - Reference Visuals */}
        <section id="inicio" className="relative min-h-screen flex items-center justify-center pt-20">
          {/* Floating Grid Background */}
          <div className="absolute inset-0 z-0 opacity-20 grid grid-cols-2 md:grid-cols-6 gap-4 p-4 pointer-events-none">
            {HERO_IMAGES.map((img, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                className={cn(
                  "relative aspect-[3/4] rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 hairline",
                  idx % 2 === 0 ? "translate-y-12" : "-translate-y-8"
                )}
              >
                <img src={img} className="object-cover w-full h-full" alt="Luxury Food" />
              </motion.div>
            ))}
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-5xl mx-auto text-center px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                +500 RESTAURANTES JÁ TRANSFORMADOS
              </span>
            </motion.div>

            <h1 className="text-6xl md:text-9xl font-heading font-extrabold tracking-tighter text-white mb-8 leading-[0.9]">
              Fotos de estúdio.<br/>
              <span className="text-primary italic">Em segundos.</span>
            </h1>

            <p className="text-lg md:text-2xl text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              Transforme fotos amadoras em imagens profissionais de alta qualidade. Aumente seu faturamento com visual de elite.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Button 
                onClick={() => navigateTo('/sign-up')}
                className="w-full md:w-auto h-16 px-10 bg-primary text-black font-extrabold text-sm uppercase tracking-widest rounded-none hover:bg-white transition-all shadow-[0_0_50px_rgba(146,129,247,0.3)] group"
              >
                Começar agora (5 fotos grátis)
                <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
              <button 
                onClick={(e) => scrollToId(e as any, 'galeria')}
                className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/20 pb-1 hover:border-primary transition-colors"
              >
                VER GALERIA
              </button>
            </div>
          </div>

          {/* Bottom Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none z-[1]" />
        </section>

        {/* Feature Visual Showcase - The "Editorial" Section */}
        <section className="py-32 px-8 max-w-7xl mx-auto">
          <div className="relative group rounded-3xl overflow-hidden hairline shadow-2xl bg-[#050505]">
            <img 
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1600" 
              className="w-full aspect-[21/9] object-cover opacity-60 transition-transform duration-[2s] group-hover:scale-110"
              alt="Professional Output"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent flex items-center p-12 md:p-20">
              <div className="glass p-8 md:p-12 rounded-2xl max-w-lg border-white/10 shadow-3xl">
                <div className="flex items-center gap-3 mb-6 text-primary">
                  <Terminal className="w-5 h-5" />
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase">IA GENERATIVA PRO</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-6 leading-tight">
                  Visual de Michelin com apenas um clique.
                </h2>
                <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                  Nossa inteligência artificial entende a física da luz, texturas orgânicas e composição editorial para criar o desejo imediato de compra no seu cliente.
                </p>
                <div className="flex items-center gap-8 text-[10px] font-mono text-neutral-500 uppercase tracking-tighter border-t border-white/5 pt-6">
                  <span>Latency: 0.8s</span>
                  <span>Res: 4k RAW</span>
                  <span>Status: Online</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Showcase - The "Curated Exhibition" */}
        <section id="galeria" className="py-32 bg-black border-y border-white/5">
          <div className="max-w-7xl mx-auto px-8 mb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 text-primary mb-4">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Exposição Digital</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-heading font-extrabold text-white tracking-tighter leading-none">
                  Resultados Reais.<br />
                  <span className="text-neutral-700">Pessoas Reais.</span>
                </h2>
              </div>
              <p className="text-neutral-500 max-w-sm text-lg leading-relaxed">
                Veja como outros empreendedores estão transformando seus cardápios com apenas um clique.
              </p>
            </div>
          </div>

          {/* Editorial Grid Gallery */}
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-8">
              <div className="hairline rounded-2xl overflow-hidden aspect-[3/4] bg-neutral-900 group">
                <img src={HERO_IMAGES[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Result" />
              </div>
              <div className="hairline rounded-2xl overflow-hidden aspect-square bg-neutral-900 group">
                <img src={HERO_IMAGES[1]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Result" />
              </div>
            </div>
            <div className="space-y-8 md:-translate-y-12">
              <div className="hairline rounded-2xl overflow-hidden aspect-[4/5] bg-neutral-900 group shadow-2xl shadow-primary/10">
                <img src={HERO_IMAGES[2]} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt="Result" />
              </div>
              <div className="hairline rounded-2xl overflow-hidden aspect-[3/4] bg-neutral-900 group">
                <img src={HERO_IMAGES[3]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Result" />
              </div>
            </div>
            <div className="space-y-8">
              <div className="hairline rounded-2xl overflow-hidden aspect-square bg-neutral-900 group">
                <img src={HERO_IMAGES[4]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Result" />
              </div>
              <div className="hairline rounded-2xl overflow-hidden aspect-[3/4] bg-neutral-900 group">
                <img src={HERO_IMAGES[5]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Result" />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section - Clean & High Contrast */}
        <section id="preços" className="py-32 px-8 max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-6 tracking-tighter">Escolha seu Estúdio.</h2>
            <p className="text-neutral-500 text-lg">Pague apenas pelo que usar, sem taxas ocultas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { id: 'avulso', name: 'Avulso', price: '19,90', credits: '10 fotos', desc: 'Para testes rápidos.' },
              { id: 'starter', name: 'Starter', price: '49,90', credits: '40 fotos', desc: 'Pequenos cardápios.' },
              { id: 'pro', name: 'Pro', price: '99,90', credits: '120 fotos', desc: 'O melhor custo-benefício.', popular: true },
              { id: 'scale', name: 'Scale', price: '189,90', credits: '300 fotos', desc: 'Para alto volume.' }
            ].map((plan) => (
              <div 
                key={plan.id}
                className={cn(
                  "p-10 flex flex-col transition-all duration-500",
                  plan.popular 
                    ? "bg-[#0A0A0A] border-2 border-primary/50 shadow-[0_0_50px_rgba(146,129,247,0.1)] scale-105 z-10" 
                    : "bg-black border border-white/5 hover:border-white/20"
                )}
              >
                <div className="mb-10">
                  <h3 className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-neutral-500">R$</span>
                    <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  </div>
                  <div className="text-primary font-bold text-xs mt-2 uppercase tracking-widest">{plan.credits}</div>
                </div>
                
                <ul className="space-y-4 mb-12 flex-grow">
                  {['Download Ilimitado', 'Qualidade Ultra HD', 'Remoção de Fundo'].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-xs text-neutral-400 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40" /> {f}
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => navigateTo('/sign-up')}
                  className={cn(
                    "w-full h-12 rounded-none font-extrabold text-[10px] uppercase tracking-widest transition-all",
                    plan.popular ? "bg-primary text-black" : "bg-white/5 text-white hover:bg-white hover:text-black"
                  )}
                >
                  Selecionar
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-40 px-8 bg-[#050505] border-t border-white/5">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-6xl md:text-8xl font-heading font-extrabold text-white mb-10 tracking-tighter leading-none">
              Pronto para elevar seu<br/>
              <span className="text-primary italic">delivery ao topo?</span>
            </h2>
            <Button 
              onClick={() => navigateTo('/sign-up')}
              className="h-20 px-12 bg-primary text-black font-extrabold text-lg uppercase tracking-[0.2em] rounded-none hover:bg-white transition-all shadow-[0_0_60px_rgba(146,129,247,0.4)]"
            >
              Começar Agora
              <ArrowRight className="ml-4 w-6 h-6" strokeWidth={3} />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer - Reference Styled */}
      <footer className="w-full border-t border-white/5 bg-black pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          <div>
            <div className="text-lg font-extrabold text-white font-heading tracking-tighter mb-6">ESTÚDIO IA PRO</div>
            <p className="text-[10px] text-neutral-500 leading-relaxed max-w-[200px] uppercase tracking-widest font-bold">
              Definindo o futuro visual da excelência culinária brasileira.
            </p>
          </div>
          {['Produto', 'Empresa', 'Legal', 'Social'].map((col) => (
            <div key={col} className="flex flex-col gap-4">
              <span className="text-[10px] font-extrabold text-white uppercase tracking-[0.2em] mb-2">{col}</span>
              <a href="#" className="text-[10px] text-neutral-500 hover:text-white transition-colors uppercase tracking-widest font-bold">Recursos</a>
              <a href="#" className="text-[10px] text-neutral-500 hover:text-white transition-colors uppercase tracking-widest font-bold">Sobre</a>
              <a href="#" className="text-[10px] text-neutral-500 hover:text-white transition-colors uppercase tracking-widest font-bold">Termos</a>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5">
          <div className="text-[10px] text-neutral-600 font-bold tracking-widest uppercase">
            © 2024 ESTÚDIO IA PRO. TODOS OS DIREITOS RESERVADOS.
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[9px] text-neutral-400 font-mono uppercase tracking-widest">Sistemas Operacionais</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
