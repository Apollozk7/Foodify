"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { ChatInterface } from "@/components/dashboard/chat-interface";
import { CreditBadge } from "@/components/dashboard/credit-badge";
import { HistoryGrid } from "@/components/dashboard/history-grid";
import { useGeneration } from "@/hooks/use-generation";
import { Sparkles, History, LayoutDashboard, Settings } from "lucide-react";
import NeumorphButton from "@/components/ui/neumorph-button";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'workspace' | 'history' | 'settings'>('workspace');
  const { generate, status, messages, isLoading, error: genError } = useGeneration();
  const [isUploading, setIsUploading] = useState(false);
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

  const handleSendMessage = async (text: string, file: File | null) => {
    if (!file && !text) return;

    try {
      let publicUrl = "";
      if (file) {
        publicUrl = await uploadToSupabase(file);
      }
      
      generate({
        imageUrl: publicUrl,
        prompt: text || "Transforme esta foto em uma imagem profissional de alta qualidade.",
      });
    } catch (err) {
      // Error handled in uploadToSupabase
    }
  };

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
          <NeumorphButton 
            intent={activeTab === 'workspace' ? "primary" : "default"} 
            size="medium" 
            fullWidth 
            onClick={() => setActiveTab('workspace')}
            className={cn(
              "justify-start gap-3 rounded-xl border-white/5",
              activeTab !== 'workspace' && "text-slate-400 hover:text-white rounded-xl border-transparent bg-transparent shadow-none hover:bg-white/5"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            Workspace
          </NeumorphButton>
          <NeumorphButton 
            intent={activeTab === 'history' ? "primary" : "default"} 
            size="medium" 
            fullWidth 
            onClick={() => setActiveTab('history')}
            className={cn(
              "justify-start gap-3 rounded-xl border-white/5",
              activeTab !== 'history' && "text-slate-400 hover:text-white rounded-xl border-transparent bg-transparent shadow-none hover:bg-white/5"
            )}
          >
            <History className="w-4 h-4" />
            Minhas Fotos
          </NeumorphButton>
          <NeumorphButton 
            intent={activeTab === 'settings' ? "primary" : "default"} 
            size="medium" 
            fullWidth 
            onClick={() => setActiveTab('settings')}
            className={cn(
              "justify-start gap-3 rounded-xl border-white/5",
              activeTab !== 'settings' && "text-slate-400 hover:text-white rounded-xl border-transparent bg-transparent shadow-none hover:bg-white/5"
            )}
          >
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
      <main className="lg:ml-64 h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 md:px-10 sticky top-0 bg-black/10 backdrop-blur-md z-30">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white italic">
              E
            </div>
          </div>
          <h1 className="text-lg font-semibold text-white hidden md:block capitalize">{activeTab}</h1>

          <div className="flex items-center gap-4">
            <CreditBadge />
            <div className="lg:hidden">
              <UserButton />
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full flex flex-col min-h-0">
          {activeTab === 'workspace' && (
            <section className="flex-1 flex flex-col min-h-0 space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-bold font-work-sans text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Workspace de Aprimoramento
                </h2>
              </div>

              <ChatInterface 
                messages={messages} 
                onSendMessage={handleSendMessage}
                isLoading={isActionLoading}
              />
              
              {(genError || uploadError) && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2">
                  <p className="text-red-400 text-[10px] text-center font-medium">{genError || uploadError}</p>
                </div>
              )}
            </section>
          )}

          {activeTab === 'history' && (
            <section className="flex-1 flex flex-col min-h-0 space-y-6 overflow-hidden">
              <div className="flex items-center justify-between px-1">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold font-work-sans text-white">Minhas Criações</h2>
                  <p className="text-slate-500 text-xs">Histórico completo de gerações profissionais.</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                <HistoryGrid />
              </div>
            </section>
          )}

          {activeTab === 'settings' && (
            <section className="flex-1 flex flex-col min-h-0 space-y-6 overflow-hidden">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-bold font-work-sans text-white">Configurações</h2>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Seu Plano</h3>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20">
                    <div>
                      <p className="text-white font-bold">Plano Pro</p>
                      <p className="text-xs text-blue-400">Créditos ilimitados para testes</p>
                    </div>
                    <NeumorphButton size="small" className="bg-white text-black border-none">Gerenciar</NeumorphButton>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Suporte</h3>
                  <p className="text-sm text-slate-400">
                    Precisa de ajuda? Entre em contato com nosso time através do e-mail <span className="text-white">suporte@estudioiapro.com.br</span>
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
