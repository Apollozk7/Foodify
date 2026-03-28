"use client";

import React, { useState, useEffect } from "react";
import { PromoBanner } from "@/components/landing/promo-banner";
import { Hero } from "@/components/landing/hero";
import { CommunityShowcase } from "@/components/landing/community-showcase";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronUp, Menu, X, Instagram, Twitter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    <div className="flex flex-col min-h-screen relative">
      <PromoBanner />
      {/* Navigation */}
      <nav 
        className={cn(
          "sticky top-0 w-full z-50 border-b border-white/5 backdrop-blur-md transition-all duration-300",
          scrolled ? "bg-black/80 border-white/10 py-2" : "bg-black/20 py-4"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white italic">
              E
            </div>
            <span className="font-work-sans font-bold text-xl tracking-tight">
              Estúdio IA Pro
            </span>
          </div>
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#hero" onClick={(e) => scrollToId(e, 'hero')} className="hover:text-white transition-colors">Início</a>
            <a href="#pricing" onClick={(e) => scrollToId(e, 'pricing')} className="hover:text-white transition-colors">Preços</a>
            <a href="#gallery" onClick={(e) => scrollToId(e, 'gallery')} className="hover:text-white transition-colors">Galeria</a>
          </div>
          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="neumorph" 
              size="neumorph-sm" 
              className="text-slate-300 hover:text-white font-inter"
              onClick={() => navigateTo('/sign-in')}
            >
              Entrar
            </Button>
            <Button 
              variant="neumorph-primary" 
              size="neumorph-sm" 
              className="font-inter"
              onClick={() => navigateTo('/sign-up')}
            >
              Criar conta
            </Button>
          </div>
          {/* Mobile: CTA + hamburguer */}
          <div className="flex md:hidden items-center gap-3">
            <Button 
              variant="neumorph-primary" 
              size="neumorph-sm" 
              className="font-inter text-xs px-3"
              onClick={() => navigateTo('/sign-up')}
            >
              Criar conta
            </Button>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-white/5 bg-black/80 backdrop-blur-md"
            >
              <div className="flex flex-col px-4 py-4 gap-1">
                <a href="#hero" onClick={(e) => scrollToId(e, 'hero')} className="text-slate-300 hover:text-white py-3 px-4 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium">Início</a>
                <a href="#pricing" onClick={(e) => scrollToId(e, 'pricing')} className="text-slate-300 hover:text-white py-3 px-4 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium">Preços</a>
                <a href="#gallery" onClick={(e) => scrollToId(e, 'gallery')} className="text-slate-300 hover:text-white py-3 px-4 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium">Galeria</a>
                <div className="border-t border-white/5 my-2" />
                <Button 
                  variant="neumorph" 
                  size="neumorph-sm" 
                  className="w-full font-inter justify-center"
                  onClick={() => navigateTo('/sign-in')}
                >
                  Entrar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1">
        <Hero />
        <CommunityShowcase />
        <Pricing />
        <FAQ />

        {/* Final CTA Section - Keeping better colors */}
        <section className="py-10 px-4 sm:py-14 sm:px-6 max-w-7xl mx-auto border-t border-white/5 font-inter">
          <div className="w-full flex flex-col md:flex-row items-center justify-between text-center md:text-left bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 md:p-20 text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(t-b,white,transparent)]" />
            <div className="relative z-10 space-y-3">
              <h2 className="text-3xl sm:text-4xl md:text-[46px] md:leading-[60px] font-bold bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text tracking-tight">
                Pronto para transformar<br className="hidden sm:block" /> suas fotos agora?
              </h2>
              <p className="text-blue-100/90 text-base sm:text-lg md:text-xl font-medium">
                Sua nova ferramenta favorita está a apenas um clique de distância.
              </p>
            </div>
            <div className="relative z-10 mt-6 md:mt-0 w-full sm:w-auto">
              <Button 
                variant="neumorph-white" 
                size="neumorph-lg" 
                className="group/btn w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-bold flex items-center justify-center gap-2"
                onClick={() => navigateTo('/sign-up')}
              >
                Começar Agora
                <ArrowRight className="inline-block w-5 h-5 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" strokeWidth={3} />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/40 backdrop-blur-sm py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center font-bold text-xs text-white italic">
                E
              </div>
              <span className="font-work-sans font-bold text-lg tracking-tight">
                Estúdio IA Pro
              </span>
            </div>
            <p className="text-sm text-slate-500 font-inter">
              Transformando o visual do delivery brasileiro com o poder da Inteligência Artificial.
            </p>
          </div>
          <div>
            <h4 className="font-work-sans font-semibold mb-4">Produto</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#hero" onClick={(e) => scrollToId(e, 'hero')} className="hover:text-white transition-colors">Como funciona</a></li>
              <li><a href="#gallery" onClick={(e) => scrollToId(e, 'gallery')} className="hover:text-white transition-colors">Funcionalidades</a></li>
              <li><a href="#pricing" onClick={(e) => scrollToId(e, 'pricing')} className="hover:text-white transition-colors">Preços</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-work-sans font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-slate-500 font-inter">
              <li><a href="#" className="hover:text-white transition-colors">Sobre nós</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos de uso</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-work-sans font-semibold mb-4">Redes Sociais</h4>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Instagram className="w-4 h-4 text-slate-400" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Twitter className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600 font-inter">
          <p>© 2024 Estúdio IA Pro. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-[100] w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-600/90 text-white shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-md flex items-center justify-center hover:bg-blue-600 transition-all border border-white/20 active:scale-95 group"
          >
            <ChevronUp className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:-translate-y-1" strokeWidth={3} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
