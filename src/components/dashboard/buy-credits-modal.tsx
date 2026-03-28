"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Sparkles, ArrowRight, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  {
    id: 'avulso',
    name: 'Avulso',
    price: '19,90',
    numericPrice: 19.90,
    credits: 10,
    popular: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '49,90',
    numericPrice: 49.90,
    credits: 40,
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '99,90',
    numericPrice: 99.90,
    credits: 120,
    popular: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: '189,90',
    numericPrice: 189.90,
    credits: 300,
    popular: false,
  },
];

export function BuyCreditsModal({ isOpen, onClose }: BuyCreditsModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("pro");
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[2];

  const handleContinue = () => {
    setIsRedirecting(true);
    // Placeholder para futuro checkout
    setTimeout(() => {
      alert(`Módulo de Pagamento: Redirecionando para checkout do plano ${selectedPlan.name} (R$ ${selectedPlan.price} por ${selectedPlan.credits} créditos)...`);
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

        {/* Modal - Editorial Look */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="relative w-full max-w-2xl bg-black border border-white/5 rounded-none overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]"
        >
          <div className="p-10 space-y-10">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-primary">
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.3em]">Hardware de Elite</span>
                </div>
                <h3 className="text-3xl font-heading font-extrabold text-white tracking-tighter uppercase">Adquirir Créditos.</h3>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Selecione o volume de processamento desejado.</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-neutral-600 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>

            {/* Plans Grid - Clean Editorial */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={cn(
                    "relative cursor-pointer p-6 border transition-all duration-300",
                    selectedPlanId === plan.id
                      ? "bg-white/5 border-primary shadow-[0_0_30px_rgba(146,129,247,0.1)]"
                      : "bg-transparent border-white/5 hover:border-white/20"
                  )}
                >
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-neutral-500">{plan.name}</h3>
                    {selectedPlanId === plan.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[10px] font-bold text-neutral-600 uppercase">R$</span>
                      <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                    </div>
                    <div className="text-primary font-extrabold text-[10px] uppercase tracking-widest">{plan.credits} FOTOS</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action - Minimal Bold */}
            <div className="pt-4 space-y-6">
              <Button 
                variant="neumorph-primary" 
                className="w-full h-16 rounded-none font-extrabold uppercase text-sm tracking-[0.2em]"
                onClick={handleContinue}
                disabled={isRedirecting}
                loading={isRedirecting}
              >
                {!isRedirecting && <span className="flex items-center gap-3">CONFIRMAR PEDIDO <ArrowRight className="w-4 h-4" /></span>}
                {isRedirecting && "PROCESSANDO..."}
              </Button>

              <div className="flex items-center justify-center gap-6 py-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-600" />
                  <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">Pagamento Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-neutral-600" />
                  <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">Entrega Instantânea</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function ShieldCheck(props: any) {
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
