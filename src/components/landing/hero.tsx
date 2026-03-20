import React from "react";
import NeumorphButton from "@/components/ui/neumorph-button";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";
import Link from "next/link";

export function Hero() {
  return (
    <section id="hero" className="relative pt-4 pb-8 px-6 lg:pt-6 lg:pb-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
        {/* Left Side: Text Content */}
        <div className="space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start order-2 lg:order-1">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-work-sans tracking-tight leading-[1.1] bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              Fotos de estúdio para o seu delivery, em segundos.
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-inter max-w-2xl mx-auto lg:mx-0">
              Transforme fotos amadoras tiradas com o celular em imagens profissionais de alta qualidade. Aumente seu faturamento com visual de elite.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
            <Link href="/sign-up" className="w-full sm:w-auto">
              <NeumorphButton intent="primary" size="large" className="w-full sm:w-auto">
                Começar agora (5 fotos grátis)
              </NeumorphButton>
            </Link>
            <a href="#gallery" className="w-full sm:w-auto">
              <NeumorphButton size="large" className="w-full sm:w-auto">
                Ver galeria
              </NeumorphButton>
            </a>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#020617] bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">MC</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#020617] bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">RP</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#020617] bg-purple-500 flex items-center justify-center text-[10px] font-bold text-white">JP</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#020617] bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">+</div>
            </div>
            <div className="flex flex-col text-left">
              <div className="flex text-amber-400 text-xs">
                ★★★★★
              </div>
              <p className="text-xs text-slate-400 font-medium font-inter">
                Mais de <span className="text-white">500 restaurantes</span> já usam
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-slate-500 font-inter pt-2">
            <div className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-emerald-500" />
              <span>Processamento Instantâneo</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-emerald-500" />
              <span>Cores Otimizadas</span>
            </div>
            <div className="flex items-center gap-2 hidden sm:flex">
              <CheckIcon className="w-4 h-4 text-emerald-500" />
              <span>Remoção de Fundo IA</span>
            </div>
          </div>
        </div>

        {/* Right Side: Slider */}
        <div className="relative order-1 lg:order-2 w-full max-w-[500px] lg:max-w-none mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[34px] blur-2xl opacity-20" />
          <BeforeAfterSlider
            beforeImage="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800"
            afterImage="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"
            className="shadow-2xl shadow-blue-500/10 border-white/5 rounded-[32px] overflow-hidden"
          />
        </div>
      </div>
    </section>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
