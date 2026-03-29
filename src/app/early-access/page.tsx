'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { redirect } from 'next/navigation';

// ⚠️ ROTA TEMPORARIAMENTE DESATIVADA — remover esta linha para restaurar
export default function EarlyAccessPage() {
  redirect('/');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao inscrever. Tente novamente.');
      }

      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao inscrever. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#020617]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white italic">
              E
            </div>
            <span className="font-work-sans font-bold text-xl text-white tracking-tight">
              Estúdio IA Pro
            </span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-12 backdrop-blur-xl shadow-2xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Apenas 5 vagas restantes
          </div>

          <h1 className="text-3xl md:text-4xl font-work-sans font-bold text-white leading-tight mb-4">
            Seja um dos primeiros a transformar seu cardápio com IA.
          </h1>

          <p className="text-slate-400 font-inter text-base mb-8">
            Inscreva-se para garantir acesso antecipado ao Estúdio IA Pro. Receba o convite em
            primeira mão e destaque seu delivery.
          </p>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center flex flex-col items-center gap-4"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                <div>
                  <h3 className="text-white font-bold text-lg">Inscrição confirmada!</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Fique de olho na sua caixa de entrada.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Seu melhor e-mail"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#020617] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-inter"
                  />
                </div>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <Button
                  variant="default"
                  size="lg"
                  className="w-full py-5"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Garantir meu acesso
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                <p className="text-xs text-slate-500 text-center font-inter mt-4">
                  Zero spam. Cancele quando quiser.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
