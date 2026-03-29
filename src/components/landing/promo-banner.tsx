'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PromoBannerProps {
  onClose?: () => void;
}

export function PromoBanner({ onClose }: PromoBannerProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
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

          <div className="max-w-7xl mx-auto px-3 py-2 sm:py-3 sm:px-6 lg:px-8 relative">
            <div className="flex items-center gap-x-3">
              {/* Main Content — mobile: row wrapping as needed */}
              <div className="flex-1 flex items-center justify-center gap-x-2 sm:gap-x-4 flex-wrap gap-y-1.5 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <span className="flex-shrink-0 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30">
                    <Sparkles
                      className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-400"
                      aria-hidden="true"
                    />
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-white font-inter">
                    <span className="hidden sm:inline">Oferta de Lançamento: Ganhe </span>
                    <span className="sm:hidden">Ganhe </span>
                    <strong className="text-blue-400 font-bold">5 créditos grátis</strong>
                    <span className="hidden sm:inline"> ao criar sua conta!</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* cupom — badge compacto no mobile, texto completo no desktop */}
                  <span className="flex-shrink-0 inline-flex items-center rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] sm:text-xs font-bold text-white border border-white/20 tracking-wider">
                    IAELITE20
                  </span>
                  <span className="hidden sm:inline text-xs text-slate-400 font-inter">
                    para 20% OFF
                  </span>

                  <Link
                    href="/sign-up"
                    className="hidden md:flex ml-2 items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors group"
                  >
                    Resgatar agora
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Close Button */}
              <div className="shrink-0">
                <button
                  type="button"
                  className="-m-1 p-1 rounded-full hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  onClick={handleClose}
                  aria-label="Fechar banner promocional"
                >
                  <X className="h-4 w-4 text-slate-400 hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
