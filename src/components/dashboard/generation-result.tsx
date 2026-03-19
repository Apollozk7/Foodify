"use client";

import { BeforeAfterSlider } from "@/components/ui/before-after-slider";
import { Loader2, Download, RefreshCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GenerationStatus } from "@/hooks/use-generation";
import { cn } from "@/lib/utils";

interface GenerationResultProps {
  status: GenerationStatus;
  inputUrl: string | null;
  outputUrl: string | null;
  error: string | null;
  onReset: () => void;
}

export function GenerationResult({
  status,
  inputUrl,
  outputUrl,
  error,
  onReset,
}: GenerationResultProps) {
  if (status === "idle") return null;

  const isProcessing = status === "pending" || status === "processing";

  const handleDownload = async () => {
    if (!outputUrl) return;
    try {
      const response = await fetch(outputUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `estudio-ia-pro-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-white/5">
        {isProcessing && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-white/5 border-t-blue-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-lg font-bold text-white">
                {status === "pending" ? "Iniciando..." : "Sua mágica está sendo criada..."}
              </h4>
              <p className="text-sm text-slate-400 max-w-[240px]">
                Nossa IA está refinando sua foto e gerando um cenário profissional.
              </p>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-red-500/10 backdrop-blur-md space-y-4 p-6">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/50">
              <RefreshCcw className="w-6 h-6 text-red-500" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-lg font-bold text-white">Ops! Algo deu errado</h4>
              <p className="text-sm text-slate-400">{error || "Houve um erro na geração. Tente novamente."}</p>
            </div>
            <Button onClick={onReset} variant="outline" className="border-white/10 hover:bg-white/10">
              Tentar Novamente
            </Button>
          </div>
        )}

        {status === "done" && inputUrl && outputUrl && (
          <BeforeAfterSlider 
            beforeImage={inputUrl}
            afterImage={outputUrl}
          />
        )}
        
        {/* Placeholder for isProcessing to show the original image while it loads */}
        {isProcessing && inputUrl && (
          <img src={inputUrl} alt="Original" className="w-full h-full object-cover opacity-30 grayscale" />
        )}
      </div>

      {status === "done" && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Foto Gerada com Sucesso!</p>
              <p className="text-xs text-slate-400">Pronta para o seu cardápio.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="flex-1 sm:flex-none border-white/10 hover:bg-white/10 font-medium"
              onClick={onReset}
            >
              Nova Foto
            </Button>
            <Button 
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 text-white font-bold"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Download HD
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
