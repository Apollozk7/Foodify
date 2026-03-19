'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import NeumorphButton from '@/components/ui/neumorph-button';
import { cn } from '@/lib/utils';

const plans = [
  {
    id: 'avulso',
    name: 'Avulso',
    price: '19,90',
    credits: '10 créditos',
    description: 'Para testes rápidos e pontuais.',
    features: ['10 fotos profissionais', 'Qualidade HD', 'Remoção de fundo', 'Download ilimitado'],
    popular: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '49,90',
    credits: '40 créditos',
    description: 'Ideal para pequenos cardápios.',
    features: ['40 fotos profissionais', 'Qualidade HD+', 'Processamento rápido', 'Download ilimitado', 'Suporte via chat'],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '99,90',
    credits: '120 créditos',
    description: 'O melhor custo-benefício (R$ 0,83/foto).',
    features: ['120 fotos profissionais', 'Qualidade 4K Ultra HD', 'Processamento prioritário', 'Estilos premium inclusos', 'Suporte prioritário'],
    popular: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: '189,90',
    credits: '300 créditos',
    description: 'Para quem precisa de volume e performance.',
    features: ['300 fotos profissionais', 'Tudo do plano Pro', 'Acesso antecipado a modelos', 'Gerente de conta exclusivo', 'API de integração'],
    popular: false,
  },
];

export function Pricing() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto flex flex-col items-center font-poppins">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-4xl md:text-6xl font-bold font-work-sans tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
          Planos flexíveis para seu negócio.<br />Escale quando precisar.
        </h2>
        <p className="text-slate-400 font-inter text-lg max-w-2xl mx-auto">
          Escolha o pacote ideal para o tamanho do seu delivery. <br className="hidden md:block" />
          Pague apenas pelo que usar, sem taxas ocultas.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full items-stretch">
        {plans.map((plan) => (
          <div key={plan.id} className="relative group flex flex-col">
            {plan.popular && (
              <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[34px] blur-sm opacity-50 group-hover:opacity-100 transition-opacity" />
            )}
            <div className={cn(
              "relative flex-1 rounded-[32px] p-6 flex flex-col border transition-all duration-300",
              plan.popular 
                ? "bg-[#020617] border-white/10 backdrop-blur-xl" 
                : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07] backdrop-blur-sm"
            )}>
              {plan.popular && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest absolute -top-3 left-1/2 -translate-x-1/2 shadow-lg">
                  Mais Popular
                </div>
              )}
              
              <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4">{plan.name}</h3>
              
              <div className="flex flex-col mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">R$ {plan.price}</span>
                  <span className="text-slate-500 text-xs">/único</span>
                </div>
                <div className="text-blue-400 font-semibold mt-1">{plan.credits}</div>
              </div>

              <p className="text-slate-500 text-xs mb-6 font-inter h-8">{plan.description}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <PricingFeature key={idx} text={feature} />
                ))}
              </ul>

              <NeumorphButton 
                intent={plan.popular ? "primary" : "default"}
                fullWidth
                className="font-bold"
              >
                {plan.id === 'avulso' ? 'Comprar Créditos' : 'Assinar Plano'}
              </NeumorphButton>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-[13px] text-slate-300">
      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-600/10 flex items-center justify-center">
        <Check className="w-2.5 h-2.5 text-blue-500" />
      </div>
      <span className="leading-tight">{text}</span>
    </li>
  );
}
