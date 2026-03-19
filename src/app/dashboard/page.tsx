"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { UploadZone } from "@/components/dashboard/upload-zone";
import { CategorySelector } from "@/components/dashboard/category-selector";
import { GenerationResult } from "@/components/dashboard/generation-result";
import { CreditBadge } from "@/components/dashboard/credit-badge";
import { HistoryGrid } from "@/components/dashboard/history-grid";
import { useGeneration } from "@/hooks/use-generation";
import { Sparkles, History, LayoutDashboard, Settings } from "lucide-react";
import NeumorphButton from "@/components/ui/neumorph-button";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState("lanches");
  const [inputUrl, setInputUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const { generate, reset, status, outputUrl, isLoading, error: genError } = useGeneration();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const supabase = createClient();

  const uploadToSupabase = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadError(null);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `inputs/${fileName}`;

      const { data, error } = await supabase.storage
        .from("generations")
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("generations")
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("Erro ao fazer upload da imagem. Tente novamente.");
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageSelected = async (file: File, previewUrl: string) => {
    setInputUrl(previewUrl);
    setSelectedFile(file);
    setUploadError(null);
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;

    try {
      const publicUrl = await uploadToSupabase(selectedFile);
      
      generate({
        imageUrl: publicUrl,
        category: selectedCategory,
        prompt: `A professional food photography of ${selectedCategory}, highly detailed, studio lighting, 8k`,
        style: "professional",
      });
    } catch (err) {
      // Error handled in uploadToSupabase
    }
  };

  const error = genError || uploadError;
  const isActionLoading = isLoading || isUploading;

  return (
    <div className="min-h-screen bg-transparent text-slate-200 font-inter">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-white/5 bg-black/20 backdrop-blur-xl hidden lg:flex flex-col p-6 z-40">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white italic">
            E
          </div>
          <span className="font-work-sans font-bold text-xl tracking-tight text-white">
            Estúdio IA Pro
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          <NeumorphButton intent="primary" size="medium" fullWidth className="justify-start gap-3 rounded-xl border-white/5">
            <LayoutDashboard className="w-4 h-4" />
            Workspace
          </NeumorphButton>
          <NeumorphButton intent="default" size="medium" fullWidth className="justify-start gap-3 text-slate-400 hover:text-white rounded-xl border-transparent bg-transparent shadow-none hover:bg-white/5">
            <History className="w-4 h-4" />
            Minhas Fotos
          </NeumorphButton>
          <NeumorphButton intent="default" size="medium" fullWidth className="justify-start gap-3 text-slate-400 hover:text-white rounded-xl border-transparent bg-transparent shadow-none hover:bg-white/5">
            <Settings className="w-4 h-4" />
            Configurações
          </NeumorphButton>
        </nav>

        <div className="pt-6 border-t border-white/5 flex items-center gap-3">
          <UserButton />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Sua Conta</span>
            <span className="text-xs text-slate-500">Premium Plan</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-10 sticky top-0 bg-black/10 backdrop-blur-md z-30">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white italic">
              E
            </div>
          </div>
          <h1 className="text-lg font-semibold text-white hidden md:block">Dashboard</h1>

          <div className="flex items-center gap-4">
            <CreditBadge />
            <div className="lg:hidden">
              <UserButton />
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full space-y-12">
          {/* Bento Grid - Top Section */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Upload & Config */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <Sparkles className="w-5 h-5" />
                  <h2 className="text-xl font-bold font-work-sans text-white">Criar Nova Foto</h2>
                </div>
                <p className="text-slate-400 text-sm">
                  Selecione a categoria do seu produto e envie uma foto bem iluminada para começar.
                </p>
              </div>

              <div className="space-y-6 bg-white/[0.02] border border-white/5 p-6 rounded-[32px] backdrop-blur-sm">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-slate-300 ml-1">1. Qual é o produto?</label>
                  <CategorySelector
                    selectedId={selectedCategory}
                    onSelect={setSelectedCategory}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-slate-300 ml-1">2. Envie sua foto</label>
                  <UploadZone
                    onImageSelected={handleImageSelected}
                    isLoading={isActionLoading}
                  />
                </div>

                <NeumorphButton
                  intent="primary"
                  size="large"
                  fullWidth
                  onClick={handleGenerate}
                  disabled={!selectedFile || isActionLoading}
                  loading={isActionLoading}
                  className="rounded-2xl shadow-xl shadow-blue-900/40"
                >
                  {isUploading ? "Enviando Imagem..." : "Transformar em Profissional"}
                </NeumorphButton>
              </div>
            </div>

            {/* Right Column: Result Preview */}
            <div className="lg:col-span-5 space-y-6">
              <div className="h-full flex flex-col">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Resultado</h3>
                </div>

                {status === "idle" ? (
                  <div className="flex-1 rounded-[32px] border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center p-10 text-center space-y-4 min-h-[400px] backdrop-blur-sm">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-slate-600" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-slate-300 font-medium">Sua obra de arte aparecerá aqui</p>
                      <p className="text-slate-500 text-sm max-w-[200px]">
                        Faça o upload de uma foto ao lado para ver a mágica da IA.
                      </p>
                    </div>
                  </div>
                ) : (
                  <GenerationResult
                    status={status}
                    inputUrl={inputUrl}
                    outputUrl={outputUrl}
                    error={error}
                    onReset={reset}
                  />
                )}
              </div>
            </div>
          </section>

          {/* History Section */}
          <section className="space-y-8 pt-8 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold font-work-sans text-white">Minhas Criações</h2>
                <p className="text-slate-500 text-sm">Suas últimas 20 gerações profissionais.</p>
              </div>
              <NeumorphButton size="small" className="rounded-xl border-white/10 bg-white/5">
                Ver Todas
              </NeumorphButton>
            </div>

            <HistoryGrid />
          </section>
        </div>
      </main>
    </div>
  );
}
