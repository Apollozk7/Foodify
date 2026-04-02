'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    question: 'Preciso ter um celular caro para usar?',
    answer:
      'Não! Nossa IA foi feita justamente para quem tem um celular simples. Ela corrige a iluminação, melhora a nitidez e cria um cenário profissional, não importa a marca ou modelo do seu aparelho.',
  },
  {
    question: "A foto vai parecer 'mentira' para o meu cliente?",
    answer:
      'De jeito nenhum. O Apetit realça o seu produto real. Nós trocamos o fundo e melhoramos a luz para que o cliente veja a qualidade real do seu produto, mantendo a fidelidade do que será entregue.',
  },
  {
    question: 'Como recebo minhas fotos?',
    answer:
      'O processo é instantâneo. Você envia a foto pelo nosso painel e, em segundos, a imagem final em alta resolution (4K) já está disponível para download imediato no seu arquivo digital.',
  },
  {
    question: 'Posso usar no iFood e nas redes sociais?',
    answer:
      'Com certeza! As fotos são entregues no formato ideal para iFood, Instagram, WhatsApp Business e cardápios digitais, prontas para atrair mais cliques e aumentar seu faturamento.',
  },
  {
    question: 'O que são os créditos e como funcionam?',
    answer:
      '1 crédito equivale a 1 produção fotográfica completa. Você compra o pacote que melhor atende sua necessidade e usa os créditos quando quiser, sem mensalidades ou taxas escondidas.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 md:py-40 px-6 md:px-8 bg-black relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-white tracking-tighter leading-none mb-6">
            Dúvidas <span className="text-primary italic">Frequentes.</span>
          </h2>
          <p className="text-neutral-500 text-sm md:text-base font-medium">
            Tudo o que você precisa saber para transformar seu negócio hoje.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className={cn(
                'rounded-[24px] border transition-all duration-300 overflow-hidden',
                openIndex === idx
                  ? 'bg-white/[0.03] border-primary/20 shadow-[0_10px_30px_rgba(var(--primary-rgb),0.05)]'
                  : 'bg-white/[0.01] border-white/5 hover:border-white/10'
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left group"
              >
                <span
                  className={cn(
                    'text-sm md:text-lg font-bold tracking-tight transition-colors',
                    openIndex === idx ? 'text-white' : 'text-neutral-400 group-hover:text-white'
                  )}
                >
                  {faq.question}
                </span>
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center transition-all',
                    openIndex === idx
                      ? 'bg-primary text-white rotate-0'
                      : 'bg-white/5 text-neutral-500 rotate-90'
                  )}
                >
                  {openIndex === idx ? (
                    <Minus className="w-4 h-4" strokeWidth={3} />
                  ) : (
                    <Plus className="w-4 h-4" strokeWidth={3} />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 md:px-8 pb-8 pt-0">
                      <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-medium border-t border-white/5 pt-6">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Support CTA */}
        <div className="mt-16 text-center">
          <p className="text-neutral-600 text-xs font-bold uppercase tracking-widest mb-6">
            Ainda tem dúvidas?
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all hover:scale-105"
          >
            <MessageCircle className="w-4 h-4 text-primary" />
            FALAR COM UM ESPECIALISTA
          </a>
        </div>
      </div>
    </section>
  );
}
