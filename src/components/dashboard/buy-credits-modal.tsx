"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Sparkles, ArrowRight, Check } from "lucide-react";
import NeumorphButton from "@/components/ui/neumorph-button";
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
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#020617] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
        >
          <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/20">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white leading-tight">Comprar Créditos</h3>
                  <p className="text-xs text-slate-500">Escolha o plano ideal para suas necessidades.</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/5 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={cn(
                    "relative cursor-pointer rounded-2xl p-5 border transition-all duration-200",
                    selectedPlanId === plan.id
                      ? "bg-blue-600/10 border-blue-500"
                      : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-lg">
                      Mais Popular
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-slate-300 font-medium">{plan.name}</h3>
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center border transition-colors",
                      selectedPlanId === plan.id
                        ? "bg-blue-500 border-blue-500"
                        : "border-slate-600"
                    )}>
                      {selectedPlanId === plan.id && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl font-bold text-white">R$ {plan.price}</span>
                  </div>
                  <div className="text-blue-400 font-semibold text-sm mt-1">{plan.credits} créditos</div>
                </div>
              ))}
            </div>

            {/* Action */}
            <div className="pt-2">
              <NeumorphButton 
                intent="primary" 
                size="large" 
                fullWidth 
                onClick={handleContinue}
                disabled={isRedirecting}
                loading={isRedirecting}
                className="rounded-2xl py-6"
              >
                {!isRedirecting && <CreditCard className="w-5 h-5 mr-2" />}
                {isRedirecting ? "Processando..." : `Pagar R$ ${selectedPlan.price}`}
                {!isRedirecting && <ArrowRight className="w-4 h-4 ml-auto" />}
              </NeumorphButton>

              <p className="text-[10px] text-center text-slate-600 mt-4">
                Pagamento 100% seguro. Créditos caem na conta instantaneamente.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
