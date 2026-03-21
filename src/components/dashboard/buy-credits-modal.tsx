"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import NeumorphButton from "@/components/ui/neumorph-button";

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BuyCreditsModal({ isOpen, onClose }: BuyCreditsModalProps) {
  const [amount, setAmount] = useState<number | "">(10);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const MIN_CREDITS = 10;
  const PRICE_PER_CREDIT = 1.99;
  const numericAmount = typeof amount === "number" ? amount : 0;
  const totalPrice = (numericAmount * PRICE_PER_CREDIT).toFixed(2);

  const handleContinue = () => {
    if (numericAmount < MIN_CREDITS) return;
    
    setIsRedirecting(true);
    // Placeholder para futuro checkout
    setTimeout(() => {
      alert(`Módulo de Pagamento: Redirecionando para checkout de R$ ${totalPrice} por ${numericAmount} créditos...`);
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
          className="relative w-full max-w-md bg-[#020617] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
        >
          <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/20">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white leading-tight">Adicionar Créditos</h3>
                  <p className="text-xs text-slate-500">Transforme fotos em nível profissional.</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/5 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input Section */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-300 ml-1">Quantidade de créditos</label>
              <div className="relative group">
                <input 
                  type="number"
                  min={MIN_CREDITS}
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setAmount("");
                    } else {
                      setAmount(parseInt(val) || 0);
                    }
                  }}
                  onFocus={(e) => e.target.select()}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all group-hover:border-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-medium pointer-events-none select-none">
                  fotos
                </div>
              </div>
              {numericAmount < MIN_CREDITS && amount !== "" && (
                <p className="text-[10px] text-blue-400 ml-1">Mínimo de {MIN_CREDITS} créditos para compra avulsa.</p>
              )}
            </div>

            {/* Price Summary */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Preço por foto</span>
                <span className="text-white font-medium">R$ {PRICE_PER_CREDIT}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/5">
                <span className="text-slate-200 font-bold text-lg">Total</span>
                <span className="text-white font-black text-2xl">R$ {totalPrice}</span>
              </div>
            </div>

            {/* Action */}
            <NeumorphButton 
              intent="primary" 
              size="large" 
              fullWidth 
              onClick={handleContinue}
              disabled={numericAmount < MIN_CREDITS || isRedirecting}
              loading={isRedirecting}
              className="rounded-2xl py-6"
            >
              {!isRedirecting && <CreditCard className="w-5 h-5 mr-2" />}
              {isRedirecting ? "Processando..." : "Ir para o Pagamento"}
              {!isRedirecting && <ArrowRight className="w-4 h-4 ml-auto" />}
            </NeumorphButton>

            <p className="text-[10px] text-center text-slate-600">
              Pagamento 100% seguro. Créditos caem na conta instantaneamente.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
