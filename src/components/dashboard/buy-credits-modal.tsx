'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  {
    id: 'avulso',
    name: 'Avulso',
    price: '19,90',
    numericPrice: 19.9,
    credits: 10,
    popular: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '49,90',
    numericPrice: 49.9,
    credits: 40,
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '99,90',
    numericPrice: 99.9,
    credits: 120,
    popular: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: '189,90',
    numericPrice: 189.9,
    credits: 300,
    popular: false,
  },
];

export function BuyCreditsModal({ isOpen, onClose }: BuyCreditsModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('pro');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[2];

  const handleContinue = () => {
    setIsRedirecting(true);
    // Placeholder para futuro checkout
    setTimeout(() => {
      alert(
        `Módulo de Pagamento: Redirecionando para checkout do plano ${selectedPlan.name} (R$ ${selectedPlan.price} por ${selectedPlan.credits} créditos)...`
      );
      setIsRedirecting(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop - Luxury Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        />

        {/* Modal - Editorial Look Rounded */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-[#000103] border border-white/5 rounded-[32px] md:rounded-[40px] overflow-y-auto shadow-[0_0_100px_rgba(0,0,0,1)] scrollbar-hide"
        >
          <div className="p-6 md:p-10 space-y-8 md:space-y-10">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-white tracking-tighter uppercase">
                  Adquirir Créditos.
                </h3>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wide">
                  Selecione o volume de processamento desejado.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-neutral-600 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>

            {/* Plans Grid - Clean Editorial Rounded */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {plans.map(plan => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={cn(
                    'relative cursor-pointer p-5 md:p-6 border transition-all duration-300 rounded-2xl md:rounded-3xl',
                    selectedPlanId === plan.id
                      ? 'bg-white/5 border-primary shadow-[0_0_30px_rgba(244,93,1,0.15)]'
                      : 'bg-transparent border-white/5 hover:border-white/20'
                  )}
                >
                  <div className="flex justify-between items-start mb-4 md:mb-6">
                    <h3
                      className={cn(
                        'text-[10px] font-extrabold uppercase tracking-label',
                        selectedPlanId === plan.id ? 'text-primary' : 'text-neutral-500'
                      )}
                    >
                      {plan.name}
                    </h3>
                    {selectedPlanId === plan.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_#F45D01]" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[10px] font-bold text-neutral-600 uppercase">R$</span>
                      <span className="text-2xl md:text-3xl font-extrabold text-white">
                        {plan.price}
                      </span>
                    </div>
                    <div className="text-primary font-extrabold text-[10px] uppercase tracking-wide">
                      {plan.credits} CRÉDITOS
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action - Minimal Bold Rounded */}
            <div className="pt-2 md:pt-4 space-y-6">
              <Button
                variant="default"
                className="w-full h-14 md:h-16 rounded-full font-extrabold uppercase text-xs md:text-sm tracking-label bg-primary hover:bg-primary/90 text-white shadow-[0_8px_30px_rgba(244,93,1,0.2)]"
                onClick={handleContinue}
                disabled={isRedirecting}
              >
                {!isRedirecting && (
                  <span className="flex items-center gap-3">
                    CONFIRMAR PEDIDO <ArrowRight className="w-4 h-4" />
                  </span>
                )}
                {isRedirecting && 'PROCESSANDO...'}
              </Button>

              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-600" />
                  <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-wide">
                    Pagamento Seguro
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-neutral-600" />
                  <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-wide">
                    Entrega Instantânea
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function ShieldCheck(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
