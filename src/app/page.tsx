'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Menu, X, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Reference standard images for the luxury food feel
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&q=80&w=800',
];

import { FAQ } from '@/components/landing/faq';

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Controla o background blur (passou de 50px)
      setScrolled(currentScrollY > 50);

      // Controla a visibilidade (rolando pra cima revela, pra baixo esconde, se for depois de 200px)
      if (currentScrollY > 200) {
        setShowNavbar(currentScrollY < lastScrollY);
      } else {
        setShowNavbar(true); // Sempre mostra no topo
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    const sections = ['inicio', 'preços', 'galeria', 'faq'];
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const navigateTo = (path: string) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

  const scrollToId = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      {/* Navigation - Floating Glass Island with Hide/Show logic */}
      <div
        className={cn(
          'fixed top-6 left-0 w-full z-50 px-6 flex justify-center pointer-events-none transition-transform duration-500',
          showNavbar ? 'translate-y-0' : '-translate-y-[150%]'
        )}
      >
        <nav
          className={cn(
            'w-full max-w-5xl pointer-events-auto transition-all duration-500 rounded-full border',
            scrolled
              ? 'bg-black/40 backdrop-blur-2xl border-white/10 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
              : 'bg-transparent border-transparent py-5'
          )}
        >
          <div className="px-6 md:px-10 flex items-center justify-between">
            <button onClick={scrollToTop} className="flex items-center gap-3 group cursor-pointer">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-extrabold text-white italic text-lg shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] font-heading transition-transform group-hover:scale-105">
                E
              </div>
              <span className="font-heading font-extrabold text-lg md:text-xl tracking-tighter text-white transition-opacity group-hover:opacity-80">
                ESTÚDIO IA PRO
              </span>
            </button>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {['Início', 'Galeria', 'Preços', 'FAQ'].map(item => {
                const sectionId = item === 'Início' ? 'inicio' : item.toLowerCase();
                const isActive = activeSection === sectionId;

                return (
                  <button
                    key={item}
                    onClick={e => scrollToId(e, sectionId)}
                    className={cn(
                      'text-[10px] font-black tracking-label transition-colors bg-transparent border-none shadow-none px-0 h-auto cursor-pointer uppercase',
                      isActive ? 'text-primary' : 'text-neutral-400 hover:text-primary'
                    )}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigateTo('/sign-in')}
                className="text-[10px] font-black tracking-label text-neutral-400 hover:text-primary transition-colors bg-transparent border-none shadow-none px-0 h-auto cursor-pointer uppercase"
              >
                Entrar
              </button>
              <Button
                onClick={() => navigateTo('/sign-up')}
                className="bg-primary text-white font-black text-[11px] tracking-label px-8 rounded-full h-11 transition-all shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]"
              >
                Criar conta
              </Button>
            </div>

            {/* Mobile Hamburguer */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white z-50 p-2 hover:text-primary transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col pt-32 px-8 gap-8 md:hidden"
          >
            {['Início', 'Preços', 'Galeria', 'FAQ'].map(item => {
              const sectionId = item === 'Início' ? 'inicio' : item.toLowerCase();
              const isActive = activeSection === sectionId;

              return (
                <button
                  key={item}
                  onClick={e => scrollToId(e, sectionId)}
                  className={cn(
                    'text-3xl font-black tracking-tighter transition-colors text-left',
                    isActive ? 'text-primary' : 'text-neutral-400 hover:text-primary'
                  )}
                >
                  {item}
                </button>
              );
            })}
            <div className="h-px bg-white/10 my-4" />
            <button
              onClick={() => navigateTo('/sign-in')}
              className="text-xl font-bold tracking-wide text-neutral-400 hover:text-primary transition-colors text-left uppercase"
            >
              Entrar
            </button>
            <Button
              onClick={() => navigateTo('/sign-up')}
              className="bg-primary text-white font-black text-sm tracking-wide w-full h-16 rounded-2xl shadow-[0_10px_40px_rgba(var(--primary-rgb),0.3)]"
            >
              CRIAR CONTA AGORA
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        {/* Hero Section - Reference Visuals */}
        <section
          id="inicio"
          className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
        >
          {/* Floating Grid Background - Optimized for mobile */}
          <div className="absolute inset-0 z-0 opacity-10 md:opacity-20 grid grid-cols-2 md:grid-cols-6 gap-4 p-4 pointer-events-none">
            {HERO_IMAGES.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                className={cn(
                  'relative aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-700 hairline',
                  idx % 2 === 0 ? 'translate-y-12' : '-translate-y-8',
                  idx > 3 && 'hidden md:block' // Simplify on mobile
                )}
              >
                <Image
                  src={img}
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  className="object-cover w-full h-full"
                  alt="Luxury Food"
                />
              </motion.div>
            ))}
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-5xl mx-auto text-center px-6 md:px-8">
            <h1 className="text-5xl md:text-8xl font-heading font-extrabold tracking-tighter text-white mb-8 leading-[0.9]">
              Fotos de estúdio.
              <br />
              <span className="text-primary italic">Em segundos.</span>
            </h1>

            <p className="text-base md:text-xl text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              Transforme fotos amadoras em imagens profissionais de alta qualidade. Aumente seu
              faturamento com visual de elite.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Button
                onClick={() => navigateTo('/sign-up')}
                className="w-full md:w-auto h-16 px-10 bg-primary text-white font-extrabold text-sm tracking-wide rounded-full transition-all shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)]"
              >
                Começar agora (5 fotos grátis)
                <ArrowRight className="ml-3" />
              </Button>
              <button
                onClick={e => scrollToId(e, 'galeria')}
                className="text-xs font-bold tracking-wide text-white border-b border-white/20 pb-1 transition-all hover:text-primary hover:border-primary/50"
              >
                Ver galeria
              </button>
            </div>
          </div>

          {/* Bottom Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none z-[1]" />
        </section>

        {/* Feature Visual Showcase - Editorial Visuals Only */}
        <section className="py-20 md:py-32 px-6 md:px-8 max-w-7xl mx-auto">
          <div className="relative group rounded-[32px] md:rounded-[40px] overflow-hidden hairline shadow-2xl bg-[#050505] flex flex-col md:block">
            <div className="relative w-full aspect-square md:aspect-[21/9]">
              <img
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1600"
                className="w-full h-full object-cover opacity-60 transition-transform duration-[2s]"
                alt="Professional Output"
              />
              {/* Desktop Gradient Overlay */}
              <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
              {/* Mobile Gradient Overlay */}
              <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            </div>

            <div className="relative md:absolute md:inset-0 flex items-center p-6 md:p-20 mt-[-60px] md:mt-0 z-10">
              <div className="glass bg-secondary/10 p-8 md:p-14 rounded-[24px] md:rounded-[32px] max-w-lg border-white/10 shadow-3xl">
                <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-white mb-4 md:mb-6 leading-tight">
                  Fotos que dão fome com apenas um clique.
                </h2>
                <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
                  Nossa IA transforma fotos simples do seu celular em imagens que parecem ter saído
                  de um estúdio profissional. Atraia mais clientes e aumente suas vendas no delivery
                  hoje mesmo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Showcase - The "Curated Exhibition" */}
        <section id="galeria" className="py-20 md:py-32 bg-black border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-8 mb-16 md:mb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 text-primary mb-4">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs font-bold tracking-wide">Exposição Digital</span>
                </div>
                <h2 className="text-4xl md:text-7xl font-heading font-extrabold text-white tracking-tighter leading-none">
                  Resultados Reais.
                  <br />
                  <span className="text-primary">Pessoas Reais.</span>
                </h2>{' '}
              </div>
              <p className="text-neutral-500 max-w-sm text-base md:text-lg leading-relaxed">
                Veja como outros empreendedores estão transformando seus cardápios com apenas um
                clique.
              </p>
            </div>
          </div>

          {/* Editorial Grid Gallery */}
          <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-8">
              <div className="hairline rounded-3xl overflow-hidden aspect-[3/4] bg-neutral-900 group">
                <img
                  src={HERO_IMAGES[0]}
                  className="w-full h-full object-cover transition-all duration-700"
                  alt="Result"
                />
              </div>
              <div className="hairline rounded-3xl overflow-hidden aspect-square bg-neutral-900 group">
                <img
                  src={HERO_IMAGES[1]}
                  className="w-full h-full object-cover transition-all duration-700"
                  alt="Result"
                />
              </div>
            </div>
            <div className="space-y-8 md:-translate-y-12">
              <div className="hairline rounded-3xl overflow-hidden aspect-[4/5] bg-neutral-900 group shadow-2xl shadow-primary/10">
                <img
                  src={HERO_IMAGES[2]}
                  className="w-full h-full object-cover transition-all duration-700"
                  alt="Result"
                />
              </div>
              <div className="hairline rounded-3xl overflow-hidden aspect-[3/4] bg-neutral-900 group">
                <img
                  src={HERO_IMAGES[3]}
                  className="w-full h-full object-cover transition-all duration-700"
                  alt="Result"
                />
              </div>
            </div>
            <div className="space-y-8">
              <div className="hairline rounded-3xl overflow-hidden aspect-square bg-neutral-900 group">
                <img
                  src={HERO_IMAGES[4]}
                  className="w-full h-full object-cover transition-all duration-700"
                  alt="Result"
                />
              </div>
              <div className="hairline rounded-3xl overflow-hidden aspect-[3/4] bg-neutral-900 group">
                <img
                  src={HERO_IMAGES[5]}
                  className="w-full h-full object-cover transition-all duration-700"
                  alt="Result"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section - Eye-catching & Magnetism Visuals */}
        <section id="preços" className="py-24 md:py-40 px-6 md:px-8 relative">
          {/* Subtle background glow for the whole section */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16 md:mb-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6"
              >
                <Zap className="w-3 h-3 text-primary fill-primary" />
                <span className="text-[10px] font-extrabold tracking-label text-primary uppercase">
                  Investimento inteligente
                </span>
              </motion.div>
              <h2 className="text-5xl md:text-8xl font-heading font-extrabold text-white mb-6 md:mb-8 tracking-tighter leading-none">
                Escolha seu <span className="text-primary italic">Estúdio.</span>
              </h2>
              <p className="text-neutral-500 text-lg md:text-xl font-medium">
                Pague apenas pelo que usar, sem taxas ocultas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
              {[
                {
                  id: 'avulso',
                  name: 'Single Shot',
                  price: '19,90',
                  credits: '10 créditos',
                  desc: 'Para produções pontuais.',
                },
                {
                  id: 'starter',
                  name: 'The Studio',
                  price: '49,90',
                  credits: '40 créditos',
                  desc: 'Pequenos cardápios.',
                },
                {
                  id: 'pro',
                  name: 'The Atelier',
                  price: '99,90',
                  credits: '120 créditos',
                  desc: 'Fidelidade editorial completa.',
                  popular: true,
                },
                {
                  id: 'scale',
                  name: 'The Maison',
                  price: '189,90',
                  credits: '300 créditos',
                  desc: 'Para impérios de delivery.',
                },
              ].map(plan => (
                <div
                  key={plan.id}
                  className={cn(
                    'group relative p-8 md:p-10 flex flex-col transition-all duration-500 rounded-[40px] overflow-hidden h-full',
                    plan.popular
                      ? 'bg-[#050505] border-2 border-primary/20 shadow-[0_30px_100px_rgba(var(--primary-rgb),0.15)]'
                      : 'bg-white/[0.02] border border-white/5'
                  )}
                >
                  {/* ... resto do componente de glow ... */}
                  {plan.popular && (
                    <>
                      {/* Bloom layer (soft glow) */}
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-[-100%] z-0 opacity-30 blur-2xl pointer-events-none"
                        style={{
                          background:
                            'conic-gradient(from 0deg, transparent 0%, transparent 70%, var(--primary) 100%)',
                        }}
                      />
                      {/* Sharp layer (border light) */}
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-[-100%] z-0 opacity-50 pointer-events-none"
                        style={{
                          background:
                            'conic-gradient(from 0deg, transparent 0%, transparent 70%, var(--primary) 100%)',
                        }}
                      />
                      <div className="absolute inset-[2px] bg-[#050505] rounded-[38px] z-[1] pointer-events-none" />
                    </>
                  )}

                  {/* Content wrapper to stay above animated border */}
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Spotlight effect for Popular plan */}
                    {plan.popular && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] -translate-y-16 translate-x-16 pointer-events-none" />
                    )}

                    <div className="mb-10 md:mb-12">
                      <div className="flex justify-between items-center mb-8 pb-2 border-b border-white/5">
                        <h3
                          className={cn(
                            'text-[11px] font-black tracking-accent',
                            plan.popular ? 'text-primary' : 'text-neutral-500'
                          )}
                        >
                          {plan.name}
                        </h3>
                        {plan.popular && (
                          <span className="bg-primary text-black text-[8px] font-black px-2 py-0.5 rounded-full tracking-wide">
                            POPULAR
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-bold text-neutral-600 tracking-wide">
                            R$
                          </span>
                          <span className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
                            {plan.price}
                          </span>
                        </div>
                        <div
                          className={cn(
                            'text-xs font-black mt-4 tracking-label py-2 px-4 inline-block w-fit rounded-full',
                            plan.popular
                              ? 'bg-primary/10 text-primary border border-primary/20'
                              : 'bg-white/5 text-neutral-400'
                          )}
                        >
                          {plan.credits}
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-5 mb-12 flex-grow">
                      {[
                        'Exportação em Alta Fidelidade',
                        'Resolução Retina (4K)',
                        'Isolamento de Objeto IA',
                      ].map(f => (
                        <li
                          key={f}
                          className="flex items-center gap-4 text-[11px] text-neutral-400 font-bold tracking-wide uppercase"
                        >
                          <div
                            className={cn(
                              'w-1.5 h-1.5 rounded-full shrink-0',
                              plan.popular
                                ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]'
                                : 'bg-neutral-700'
                            )}
                          />{' '}
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => navigateTo('/sign-up')}
                      className={cn(
                        'w-full h-14 rounded-full font-black text-[11px] tracking-label transition-all',
                        plan.popular
                          ? 'bg-primary text-white shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)]'
                          : 'bg-white/5 text-white'
                      )}
                    >
                      SELECIONAR PLANO
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FAQ />

        {/* Final CTA */}
        <section className="py-24 md:py-40 px-6 md:px-8 bg-[#050505] border-t border-white/5 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-primary/[0.02] pointer-events-none" />
          <div className="max-w-5xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-8xl font-heading font-extrabold text-white mb-10 tracking-tighter leading-none">
              Pronto para elevar seu
              <br />
              <span className="text-primary italic">delivery ao topo?</span>
            </h2>
            <Button
              onClick={() => navigateTo('/sign-up')}
              className="w-full md:w-auto h-20 md:h-24 px-10 md:px-16 bg-primary text-white font-black text-lg md:text-xl tracking-label rounded-full transition-all shadow-[0_0_80px_rgba(var(--primary-rgb),0.4)] group"
            >
              Começar Agora
              <ArrowRight className="ml-4 md:ml-6 w-6 h-6 md:w-8 md:h-8" strokeWidth={4} />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer - Reference Styled */}
      <footer className="w-full border-t border-white/5 bg-black pt-20 md:pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2 md:col-span-1">
            <div className="text-lg font-extrabold text-white font-heading tracking-tighter mb-6">
              Estúdio IA Pro
            </div>
            <p className="text-[10px] text-neutral-500 leading-relaxed max-w-[200px] tracking-wide font-bold uppercase">
              Definindo o futuro visual da excelência culinária brasileira.
            </p>
          </div>
          {['Produto', 'Empresa', 'Legal', 'Social'].map(col => (
            <div key={col} className="flex flex-col gap-4">
              <span className="text-[10px] font-extrabold text-white tracking-label mb-2 uppercase">
                {col}
              </span>
              <a
                href="#"
                className="text-[10px] text-neutral-500 hover:text-white transition-colors tracking-wide font-bold uppercase"
              >
                Recursos
              </a>
              <a
                href="#"
                className="text-[10px] text-neutral-500 hover:text-white transition-colors tracking-wide font-bold uppercase"
              >
                Sobre
              </a>
              <a
                href="#"
                className="text-[10px] text-neutral-500 hover:text-white transition-colors tracking-wide font-bold uppercase"
              >
                Termos
              </a>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5 text-center md:text-left">
          <div className="text-[10px] text-neutral-600 font-bold tracking-wide uppercase">
            © 2024 Estúdio IA Pro. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[9px] text-neutral-400 font-heading tracking-wide uppercase">
                Sistemas Operacionais
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
