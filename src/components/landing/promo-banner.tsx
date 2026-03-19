'use client';

import * as React from 'react';

export function PromoBanner() {
  return (
    <div className="w-full py-2.5 font-poppins font-medium text-[13px] md:text-sm text-white text-center bg-gradient-to-r from-violet-500 via-[#9938CA] to-[#E0724A] relative z-[60]">
      <p className="px-4">
        🚀 Oferta de Lançamento: Ganhe 5 créditos grátis ao criar sua conta hoje! | Use o cupom <span className="font-bold">IAELITE20</span> para 20% OFF
      </p>
    </div>
  );
}
