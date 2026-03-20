'use client';

import * as React from 'react';
import { MotionCarousel } from '@/components/animate-ui/components/community/motion-carousel';
import { EmblaOptionsType } from 'embla-carousel';
import { Sparkles } from 'lucide-react';

export function CommunityShowcase() {
  const OPTIONS: EmblaOptionsType = { 
    loop: true,
    align: 'start',
    dragFree: true,
  };
  const SLIDE_COUNT = 6;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

  return (
    <section id="gallery" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 font-medium">
              <Sparkles className="w-5 h-5" />
              <span>Galeria da Comunidade</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold font-work-sans tracking-tight">
              Resultados Reais.<br />
              <span className="text-slate-500">Pessoas Reais.</span>
            </h2>
          </div>
          <p className="text-slate-400 font-inter max-w-md text-lg">
            Veja como outros empreendedores estão transformando seus cardápios com apenas um clique.
          </p>
        </div>
      </div>

      <div className="w-full">
        <MotionCarousel slides={SLIDES} options={OPTIONS} />
      </div>
    </section>
  );
}
