'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function PromoBanner() {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="w-full relative z-[60] bg-[#020617] border-b border-white/5 overflow-hidden"
        role="alert"
        aria-live="polite"
      >
        {/* Glow Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-500/10 to-purple-500/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between gap-x-6">
            
            {/* Main Content */}
            <div className="flex flex-1 items-center justify-center gap-x-4 flex-wrap text-center sm:text-left gap-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30">
                  <Sparkles className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
                </span>
                <p className="text-sm font-medium text-white font-inter">
                  <span className="hidden sm:inline">Oferta de Lançamento: </span>
                  <span className="sm:hidden">Lançamento: </span>
                  Ganhe <strong className="text-blue-400 font-bold">5 créditos grátis</strong> ao criar sua conta!
                </p>
              </div>
              
              <div className="hidden sm:block h-4 w-px bg-white/20" aria-hidden="true" />
              
              <p className="text-xs sm:text-sm text-slate-400 font-inter flex items-center gap-1.5">
                Use o cupom <span className="inline-flex items-center rounded-md bg-white/10 px-2 py-0.5 text-xs font-bold text-white border border-white/20 tracking-wider">IAELITE20</span> para 20% OFF
              </p>

              <Link 
                href="/sign-up" 
                className="hidden md:flex ml-4 items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors group"
              >
                Resgatar agora
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Close Button */}
            <div className="flex flex-1 justify-end shrink-0 sm:flex-none">
              <button
                type="button"
                className="-m-1.5 p-1.5 rounded-full hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                onClick={() => setIsVisible(false)}
                aria-label="Fechar banner promocional"
              >
                <X className="h-4 w-4 text-slate-400 hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
