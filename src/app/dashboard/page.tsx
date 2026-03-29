'use client';

import { useState } from 'react';
import { UserButton, useClerk } from '@clerk/nextjs';
import { ChatInterface } from '@/components/dashboard/chat-interface';
import { CreditBadge } from '@/components/dashboard/credit-badge';
import { HistoryGrid } from '@/components/dashboard/history-grid';
import { useGeneration } from '@/hooks/use-generation';
import {
  Sparkles,
  History,
  LayoutDashboard,
  Settings,
  LogOut,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { BuyCreditsModal } from '@/components/dashboard/buy-credits-modal';
import { Dropdown } from '@/components/ui/dropdown';

export default function DashboardPage() {
  const { signOut } = useClerk();
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

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}-${Date.now()}.${fileExt}`;
      const filePath = `inputs/${fileName}`;

      const { data, error } = await supabase.storage.from('generations').upload(filePath, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from('generations').getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError('Erro ao fazer upload da imagem. Tente novamente.');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (text: string, file: File | null) => {
    if (!file && !text) return;

    try {
      let publicUrl = '';
      if (file) {
        publicUrl = await uploadToSupabase(file);
      }

      generate({
        imageUrl: publicUrl,
        prompt: text || 'Transforme esta foto em uma imagem profissional de alta qualidade.',
      });
    } catch (err) {
      // Error handled in uploadToSupabase
    }
  };

  const isActionLoading = isLoading || isUploading;

  return (
    <div className="min-h-screen bg-black text-neutral-400 font-sans selection:bg-primary/20 selection:text-primary overflow-hidden">
      {/* Sidebar - Reference Luxury Style */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 border-r border-white/5 bg-[#050505] hidden lg:flex flex-col p-8 z-40">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-extrabold text-black italic text-lg">
            E
          </div>
          <span className="font-heading font-extrabold text-lg tracking-tighter text-white uppercase">
            Estúdio IA Pro
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {(
            [
              { id: 'workspace', label: 'Estúdio de Criação', icon: LayoutDashboard },
              { id: 'history', label: 'Arquivo Digital', icon: History },
              { id: 'settings', label: 'Configurações', icon: Settings },
            ] as const
          ).map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'w-full flex items-center gap-4 px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.2em] transition-all',
                activeTab === item.id
                  ? 'bg-white/5 text-primary border-l-2 border-primary'
                  : 'text-neutral-600 hover:text-white hover:bg-white/[0.02] border-l-2 border-transparent'
              )}
            >
              <item.icon
                className={cn(
                  'w-4 h-4',
                  activeTab === item.id ? 'text-primary' : 'text-neutral-700'
                )}
              />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/5 space-y-6">
          <div className="flex items-center gap-4 px-2">
            <UserButton
              appearance={{
                elements: { userButtonAvatarBox: 'w-10 h-10 rounded-none border border-white/10' },
              }}
            />
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold text-white uppercase tracking-wider">
                Identidade Digital
              </span>
              <span className="text-[9px] text-primary font-bold uppercase tracking-widest">
                Premium Access
              </span>
            </div>
          </div>

          <button
            onClick={() => signOut({ redirectUrl: '/early-access' })}
            className="w-full flex items-center gap-3 px-4 py-3 text-[9px] font-extrabold uppercase tracking-[0.2em] text-neutral-600 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:ml-72 h-screen flex flex-col relative">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 md:px-12 sticky top-0 bg-black/80 backdrop-blur-xl z-30">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-8 h-8 bg-primary rounded flex items-center justify-center font-bold text-black italic">
              E
            </div>
            <h1 className="text-[10px] font-extrabold text-white uppercase tracking-[0.3em]">
              {activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <CreditBadge />
            <div className="lg:hidden">
              <UserButton />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-hide">
          <div className="max-w-5xl mx-auto w-full">
            {activeTab === 'workspace' && (
              <section className="space-y-8 animate-fade-up">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-primary">
                    <Zap className="w-4 h-4" />
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.3em]">
                      IA Engine Active
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white tracking-tighter">
                    Workspace de Aprimoramento.
                  </h2>
                </div>

                <div className="glass rounded-none p-1 shadow-2xl hairline">
                  <ChatInterface
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isLoading={isActionLoading}
                  />
                </div>

                {(genError || uploadError) && (
                  <div className="border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <p className="text-red-400 text-[10px] font-extrabold uppercase tracking-widest">
                      {genError || uploadError}
                    </p>
                  </div>
                )}
              </section>
            )}

            {activeTab === 'history' && (
              <section className="space-y-10 animate-fade-up">
                <div className="space-y-2">
                  <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white tracking-tighter">
                    Arquivo Digital.
                  </h2>
                  <p className="text-[10px] text-neutral-500 font-extrabold uppercase tracking-[0.2em]">
                    Histórico completo de gerações profissionais.
                  </p>
                </div>
                <HistoryGrid />
              </section>
            )}

            {activeTab === 'settings' && (
              <section className="space-y-12 animate-fade-up">
                <div className="flex flex-col md:flex-row gap-12">
                  {/* Internal Settings Nav */}
                  <aside className="w-full md:w-48 flex md:flex-col gap-2">
                    {(
                      [
                        { id: 'account', label: 'Conta' },
                        { id: 'plan', label: 'Plano' },
                        { id: 'ai', label: 'IA Estúdio' },
                      ] as const
                    ).map(item => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSettingsTab(item.id)}
                        className={cn(
                          'px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest text-left transition-all',
                          activeSettingsTab === item.id
                            ? 'text-primary border-l border-primary'
                            : 'text-neutral-600 hover:text-white border-l border-transparent'
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </aside>

                  {/* Settings Panels */}
                  <div className="flex-1 space-y-8">
                    {activeSettingsTab === 'account' && (
                      <div className="space-y-8">
                        <div className="hairline p-8 space-y-8 bg-[#050505]">
                          <h3 className="text-sm font-extrabold text-white uppercase tracking-[0.2em]">
                            Perfil do Curador
                          </h3>
                          <div className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5">
                            <UserButton
                              appearance={{
                                elements: { userButtonAvatarBox: 'w-12 h-12 rounded-none' },
                              }}
                            />
                            <div>
                              <p className="text-white text-xs font-extrabold uppercase tracking-widest">
                                Gerenciar Identidade
                              </p>
                              <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
                                Configurações de acesso e segurança.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSettingsTab === 'plan' && (
                      <div className="space-y-8">
                        <div className="hairline p-8 space-y-8 bg-[#050505]">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-extrabold text-white uppercase tracking-[0.2em]">
                              Status do Plano
                            </h3>
                            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                              <ShieldCheck className="w-3 h-3 text-primary" />
                              <span className="text-[9px] font-extrabold text-primary uppercase tracking-widest">
                                Ativo
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 bg-white/[0.02] border border-white/5 space-y-4">
                              <p className="text-neutral-500 text-[10px] font-extrabold uppercase tracking-widest">
                                Saldo de Créditos
                              </p>
                              <div className="flex items-baseline gap-2 text-white">
                                <span className="text-4xl font-extrabold tracking-tighter">
                                  124
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                                  Unidades
                                </span>
                              </div>
                            </div>
                            <div className="p-8 bg-white/[0.02] border border-white/5 space-y-4">
                              <p className="text-neutral-500 text-[10px] font-extrabold uppercase tracking-widest">
                                Renovação
                              </p>
                              <p className="text-sm font-extrabold text-white uppercase tracking-widest">
                                18 ABR 2026
                              </p>
                            </div>
                          </div>

                          <Button
                            variant="neumorph-primary"
                            className="w-full h-14 font-extrabold uppercase text-xs tracking-[0.2em] rounded-none"
                            onClick={() => setIsBuyModalOpen(true)}
                          >
                            Adicionar Créditos
                          </Button>
                        </div>
                      </div>
                    )}

                    {activeSettingsTab === 'ai' && (
                      <div className="hairline p-8 space-y-10 bg-[#050505]">
                        <div className="space-y-6">
                          <h3 className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-[0.3em]">
                            Hardware de Processamento
                          </h3>
                          <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5">
                            <div>
                              <p className="text-white text-xs font-extrabold uppercase tracking-widest">
                                Qualidade de Saída
                              </p>
                              <p className="text-[9px] text-neutral-600 uppercase tracking-widest mt-1">
                                Resolução do motor de renderização.
                              </p>
                            </div>
                            <Dropdown
                              label="HD Standard"
                              value={quality}
                              onChange={setQuality}
                              options={[
                                { id: 'sd', label: 'FAST (SD)' },
                                { id: 'hd', label: 'HIGH (HD)' },
                                { id: '4k', label: 'ULTRA (4K)' },
                              ]}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      <BuyCreditsModal isOpen={isBuyModalOpen} onClose={() => setIsBuyModalOpen(false)} />
    </div>
  );
}
