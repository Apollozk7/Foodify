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
import { cn } from "@/lib/utils";
import { BuyCreditsModal } from "@/components/dashboard/buy-credits-modal";
import { Dropdown } from "@/components/ui/dropdown";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'workspace' | 'history' | 'settings'>('workspace');
  const [activeSettingsTab, setActiveSettingsTab] = useState<'account' | 'plan' | 'ai'>('account');
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  
  // Settings States
  const [quality, setQuality] = useState('hd');
  const [language, setLanguage] = useState('pt');

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
            <section className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex flex-col md:flex-row h-full gap-6">
                {/* Internal Settings Sidebar */}
                <aside className="w-full md:w-48 shrink-0 flex md:flex-col gap-1 p-1 bg-white/[0.02] border border-white/5 rounded-2xl md:bg-transparent md:border-none">
                  {[
                    { id: 'account', label: 'Conta', icon: UserButton },
                    { id: 'plan', label: 'Plano', icon: CreditBadge },
                    { id: 'ai', label: 'IA & Estúdio', icon: Sparkles },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSettingsTab(item.id as 'account' | 'plan' | 'ai')}
                      className={cn(
                        "flex-1 md:flex-none flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                        activeSettingsTab === item.id 
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </aside>

                {/* Settings Content Area */}
                <div className="flex-1 min-h-0 overflow-y-auto pr-2 scrollbar-hide space-y-6">
                  {activeSettingsTab === 'account' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-6">
                        <h3 className="text-lg font-bold text-white">Seu Perfil</h3>
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                          <UserButton />
                          <div>
                            <p className="text-white font-medium">Gerenciar Identidade</p>
                            <p className="text-xs text-slate-500">Altere seu nome, email e senha através do Clerk.</p>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-white/5">
                          <NeumorphButton intent="default" size="small" className="text-red-400 hover:text-red-300 border-red-500/10 hover:bg-red-500/5">
                            Encerrar Sessão
                          </NeumorphButton>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSettingsTab === 'plan' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-white">Plano e Créditos</h3>
                          <div className="px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                            Ativo
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20">
                            <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">Saldo Atual</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-bold text-white">124</span>
                              <span className="text-slate-400 text-sm">créditos</span>
                            </div>
                          </div>
                          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-center">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Próximo Faturamento</p>
                            <p className="text-white font-medium">18 de Abril, 2026</p>
                          </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                          <div>
                            <p className="text-white font-bold text-sm">Precisa de mais fotos?</p>
                            <p className="text-xs text-slate-500">Adicione créditos avulsos a qualquer momento.</p>
                          </div>
                          <NeumorphButton 
                            intent="primary" 
                            size="small" 
                            className="px-6"
                            onClick={() => setIsBuyModalOpen(true)}
                          >
                            Adicionar Créditos
                          </NeumorphButton>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSettingsTab === 'ai' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-8">
                        <div className="space-y-4">
                          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Preferências do Estúdio</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                              <div>
                                <p className="text-white text-sm font-medium">Qualidade Padrão</p>
                                <p className="text-[10px] text-slate-500">Resolução de saída das fotos geradas.</p>
                              </div>
                              <Dropdown 
                                label="Selecionar Qualidade"
                                value={quality}
                                onChange={setQuality}
                                options={[
                                  { id: 'sd', label: 'Rápida (SD)' },
                                  { id: 'hd', label: 'Alta (HD)' },
                                  { id: '4k', label: 'Ultra (4K)' },
                                ]}
                              />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                              <div>
                                <p className="text-white text-sm font-medium">Auto-download</p>
                                <p className="text-[10px] text-slate-500">Baixar imagem automaticamente após gerar.</p>
                              </div>
                              <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-pointer group">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-900/40" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Nano Banana 2</h3>
                          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                            <div>
                              <p className="text-white text-sm font-medium">Idioma de Resposta</p>
                              <p className="text-[10px] text-slate-500">Como a IA deve falar com você no chat.</p>
                            </div>
                            <Dropdown 
                              label="Selecionar Idioma"
                              value={language}
                              onChange={setLanguage}
                              options={[
                                { id: 'pt', label: 'Português (Brasil)' },
                                { id: 'en', label: 'English' },
                              ]}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <BuyCreditsModal 
        isOpen={isBuyModalOpen} 
        onClose={() => setIsBuyModalOpen(false)} 
      />
    </div>
  );
}
