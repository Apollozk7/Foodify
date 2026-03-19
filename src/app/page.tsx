"use client";

import React, { useState, useEffect } from "react";
import { PromoBanner } from "@/components/landing/promo-banner";
import { Hero } from "@/components/landing/hero";
import { CommunityShowcase } from "@/components/landing/community-showcase";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import NeumorphButton from "@/components/ui/neumorph-button";
import { ArrowRight, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  return (
    <div className="flex flex-col min-h-screen relative">
      <PromoBanner />
      {/* Navigation */}
      <AnimatePresence>
        {!scrolled && (
          <motion.nav 
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-10 w-full z-50 border-b border-white/5 bg-black/20 backdrop-blur-md"
          >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white italic">
                  E
                </div>
                <span className="font-work-sans font-bold text-xl tracking-tight">
                  Estúdio IA Pro
                </span>
              </div>
              <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                <a href="#" className="hover:text-white transition-colors">Início</a>
                <a href="#" className="hover:text-white transition-colors">Preços</a>
                <a href="#" className="hover:text-white transition-colors">Galeria</a>
              </div>
              <div className="flex items-center gap-4">
                <NeumorphButton intent="default" size="small" className="text-slate-400 hover:text-white font-inter">
                  Entrar
                </NeumorphButton>
                <NeumorphButton intent="primary" size="small" className="font-inter">
                  Criar conta
                </NeumorphButton>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-16">
        <Hero />
        <CommunityShowcase />
        <Pricing />
        <FAQ />

        {/* Final CTA Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 font-poppins">
          <div className="w-full flex flex-col md:flex-row items-center justify-between text-center md:text-left bg-gradient-to-b from-blue-600 to-indigo-900 rounded-[32px] p-10 md:p-20 text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(t-b,white,transparent)]" />
            <div className="relative z-10 space-y-4">
              <h2 className="text-4xl md:text-[46px] md:leading-[60px] font-bold bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text tracking-tight">
                Pronto para transformar<br className="hidden md:block" /> suas fotos agora?
              </h2>
              <p className="text-blue-100/80 text-lg md:text-xl font-medium">
                Sua nova ferramenta favorita está a apenas um clique de distância.
              </p>
            </div>
            <div className="relative z-10 mt-8 md:mt-0">
              <NeumorphButton intent="white" size="large" className="group/btn px-12 py-6 text-lg font-bold flex items-center gap-2">
                Começar Agora
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" strokeWidth={3} />
              </NeumorphButton>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/40 backdrop-blur-sm py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
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
            <ul className="space-y-2 text-sm text-slate-500 font-inter">
              <li><a href="#" className="hover:text-white transition-colors">Como funciona</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
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
                <InstagramIcon className="w-4 h-4 text-slate-400" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <TwitterIcon className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600 font-inter">
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
            className="fixed bottom-8 right-8 z-[100] w-14 h-14 rounded-full bg-blue-600/90 text-white shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-md flex items-center justify-center hover:bg-blue-600 transition-all border border-white/20 active:scale-95 group"
          >
            <ChevronUp className="w-7 h-7 transition-transform duration-300 group-hover:-translate-y-1" strokeWidth={3} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}
