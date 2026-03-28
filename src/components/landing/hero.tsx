import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";
import { Check } from "lucide-react";

export function Hero() {
  const router = useRouter();

  const handleStartNow = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = '/sign-up';
  };

  const scrollToGallery = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const element = document.getElementById('gallery');
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-4 pb-8 px-4 sm:px-6 lg:pt-6 lg:pb-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
        {/* Left Side: Text Content */}
        <div className="space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start order-2 lg:order-1">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-work-sans tracking-tight leading-[1.1] bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              Fotos de estúdio para o seu delivery, em segundos.
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-inter max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Transforme fotos amadoras tiradas com o celular em imagens profissionais de alta qualidade. Aumente seu faturamento com visual de elite.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto pt-1">
            <Button
              variant="neumorph-primary"
              size="neumorph-lg"
              className="w-full sm:w-auto font-bold shadow-lg shadow-blue-500/10"
              onClick={handleStartNow}
            >
              Começar agora (5 fotos grátis)
            </Button>
            <Button
              variant="neumorph"
              size="neumorph-lg"
              className="w-full sm:w-auto font-bold text-slate-300"
              onClick={scrollToGallery}
            >
              Ver galeria
            </Button>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#020617] bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white shadow-md">MC</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#020617] bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white shadow-md">RP</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#020617] bg-purple-500 flex items-center justify-center text-[10px] font-bold text-white shadow-md">JP</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#020617] bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white shadow-md">+</div>
            </div>
            <div className="flex flex-col text-left">
              <div className="flex text-amber-400 text-xs">
                ★★★★★
              </div>
              <p className="text-xs text-slate-400 font-bold font-inter">
                Mais de <span className="text-white">500 restaurantes</span> já usam
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-slate-500 font-inter pt-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" strokeWidth={3} />
              <span>Processamento Instantâneo</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" strokeWidth={3} />
              <span>Cores Otimizadas</span>
            </div>
            <div className="flex items-center gap-2 hidden sm:flex">
              <Check className="w-4 h-4 text-emerald-500" strokeWidth={3} />
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
            className="shadow-2xl shadow-blue-500/10 border border-white/5 rounded-[32px] overflow-hidden"
          />
        </div>
      </div>
    </section>
  );
}
