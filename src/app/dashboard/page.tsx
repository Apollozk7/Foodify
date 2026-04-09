'use client';

import { useState } from 'react';
import { UserButton, useClerk } from '@clerk/nextjs';
import { ChatInterface } from '@/components/dashboard/chat-interface';
import { CreditBadge } from '@/components/dashboard/credit-badge';
import { HistoryGrid } from '@/components/dashboard/history-grid';
import { useGeneration } from '@/hooks/use-generation';
import { History, LayoutDashboard, Settings, LogOut, ShieldCheck, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { BuyCreditsModal } from '@/components/dashboard/buy-credits-modal';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState<'workspace' | 'history' | 'settings'>('workspace');
  const [activeSettingsTab, setActiveSettingsTab] = useState<'account' | 'plan' | 'ai'>('account');
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const { generate, messages, isLoading, error: genError } = useGeneration();
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

      const { error } = await supabase.storage.from('generations').upload(filePath, file);

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

  const NavigationItems = () => (
    <nav className="space-y-1">
      {[
        { id: 'workspace', label: 'Estúdio de Criação', icon: LayoutDashboard },
        { id: 'history', label: 'Arquivo Digital', icon: History },
        { id: 'settings', label: 'Configurações', icon: Settings },
      ].map(item => (
        <button
          key={item.id}
          onClick={() => {
            setActiveTab(item.id as 'workspace' | 'history' | 'settings');
            setIsMobileSidebarOpen(false);
          }}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-2.5 text-[9px] font-extrabold tracking-label rounded-full text-left transition-colors',
            activeTab === item.id ? 'bg-white/5 text-primary' : 'text-neutral-600 hover:text-white'
          )}
        >
          <item.icon
            className={cn(
              'w-3.5 h-3.5',
              activeTab === item.id ? 'text-primary' : 'text-neutral-700'
            )}
          />
          {item.label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background text-neutral-400 font-sans selection:bg-primary/20 selection:text-primary overflow-hidden flex">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-white/5 bg-[#050505] hidden lg:flex flex-col p-6 z-40">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center font-extrabold text-white font-heading">
            E
          </div>
          <span className="font-heading font-extrabold text-base tracking-tighter text-white">
            Estúdio IA Pro
          </span>
        </div>

        <div className="flex-1">
          <NavigationItems />
        </div>

        <div className="pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <UserButton
              appearance={{
                elements: { userButtonAvatarBox: 'w-8 h-8 rounded-full border border-white/10' },
              }}
            />
            <div className="flex flex-col">
              <span className="text-[9px] font-extrabold text-white tracking-wide font-sans">
                Identidade
              </span>
              <span className="text-[8px] text-primary font-bold tracking-wide leading-none mt-0.5 font-sans">
                Premium
              </span>
            </div>
          </div>

          <button
            onClick={() => signOut({ redirectUrl: '/early-access' })}
            className="w-full flex items-center gap-2 px-4 py-2 text-[8px] font-extrabold tracking-label text-neutral-700 transition-colors font-sans"
          >
            <LogOut className="w-3 h-3" />
            Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-[#050505] border-r border-white/5 p-6 z-[70] lg:hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center font-extrabold text-black font-heading">
                    E
                  </div>
                  <span className="font-heading font-extrabold text-base tracking-tighter text-white">
                    Estúdio IA Pro
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-2 text-neutral-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1">
                <NavigationItems />
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: 'w-10 h-10 rounded-full border border-white/10',
                      },
                    }}
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-extrabold text-white tracking-wide font-sans">
                      Identidade
                    </span>
                    <span className="text-[9px] text-primary font-bold tracking-wide leading-none mt-0.5 font-sans">
                      Premium Plan
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => signOut({ redirectUrl: '/early-access' })}
                  className="w-full flex items-center justify-start gap-2 text-neutral-700 bg-transparent border-none px-4 font-sans"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-[9px] font-black tracking-wide">Encerrar Sessão</span>
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 h-screen flex flex-col relative lg:ml-64 w-full min-w-0">
        {/* Top Header - Removed activeTab title */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-10 sticky top-0 bg-black/80 backdrop-blur-xl z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-neutral-400 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="lg:hidden w-7 h-7 bg-primary rounded flex items-center justify-center font-bold text-black italic font-sans">
              E
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <CreditBadge onClick={() => setIsBuyModalOpen(true)} />
            <div className="lg:hidden scale-90 origin-right">
              <UserButton />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 scrollbar-hide">
          <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
            {activeTab === 'workspace' && (
              <section className="flex-1 flex flex-col min-h-0 animate-fade-up h-full">
                <div className="flex-1 min-h-0">
                  <ChatInterface
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isLoading={isActionLoading}
                  />
                </div>

                {(genError || uploadError) && (
                  <div className="border border-red-500/20 bg-red-500/5 p-3 rounded-full flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <p className="text-red-400 text-[9px] font-extrabold tracking-wide font-sans">
                      {genError || uploadError}
                    </p>
                  </div>
                )}
              </section>
            )}

            {activeTab === 'history' && (
              <section className="space-y-8 animate-fade-up">
                <div className="space-y-1.5">
                  <h2 className="text-2xl font-heading font-extrabold text-white tracking-tighter">
                    Arquivo Digital.
                  </h2>
                  <p className="text-[9px] text-neutral-500 font-extrabold tracking-label font-sans">
                    Histórico completo de gerações profissionais.
                  </p>
                </div>
                <HistoryGrid />
              </section>
            )}

            {activeTab === 'settings' && (
              <section className="space-y-10 animate-fade-up">
                <div className="flex flex-col md:flex-row gap-10">
                  <aside className="w-full md:w-40 flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {[
                      { id: 'account', label: 'Conta' },
                      { id: 'plan', label: 'Plano' },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSettingsTab(item.id as 'ai' | 'account' | 'plan')}
                        className={cn(
                          'px-4 py-2 text-[9px] font-extrabold tracking-wide text-left transition-all rounded-full whitespace-nowrap font-sans',
                          activeSettingsTab === item.id
                            ? 'text-primary bg-primary/5'
                            : 'text-neutral-600'
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </aside>

                  <div className="flex-1 space-y-6">
                    {activeSettingsTab === 'account' && (
                      <div className="space-y-6">
                        <div className="hairline p-6 space-y-6 bg-[#050505] rounded-[24px]">
                          <h3 className="text-xs font-extrabold text-white tracking-label font-heading">
                            Perfil
                          </h3>
                          <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                            <UserButton
                              appearance={{
                                elements: { userButtonAvatarBox: 'w-10 h-10 rounded-full' },
                              }}
                            />
                            <div className="min-w-0">
                              <p className="text-white text-[11px] font-extrabold tracking-wide truncate font-sans">
                                Gerenciar Identidade
                              </p>
                              <p className="text-[9px] text-neutral-600 tracking-wide mt-0.5 truncate font-sans">
                                Configurações de acesso.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSettingsTab === 'plan' && (
                      <div className="space-y-6">
                        <div className="hairline p-6 space-y-6 bg-[#050505] rounded-[24px]">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-extrabold text-white tracking-label font-heading">
                              Status
                            </h3>
                            <div className="flex items-center gap-2 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-full">
                              <ShieldCheck className="w-3 h-3 text-primary" />
                              <span className="text-[8px] font-extrabold text-primary tracking-wide font-sans">
                                Ativo
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-6 bg-white/[0.02] border border-white/5 space-y-3 rounded-xl text-center sm:text-left">
                              <p className="text-neutral-600 text-[9px] font-extrabold tracking-wide font-sans">
                                Saldo
                              </p>
                              <div className="flex items-baseline justify-center sm:justify-start gap-1.5 text-white">
                                <span className="text-3xl font-extrabold tracking-tighter font-sans">
                                  124
                                </span>
                                <span className="text-[8px] font-bold tracking-wide text-primary font-sans">
                                  Fotos
                                </span>
                              </div>
                            </div>
                            <div className="p-6 bg-white/[0.02] border border-white/5 flex flex-col justify-center rounded-xl text-center sm:text-left">
                              <p className="text-neutral-600 text-[9px] font-extrabold mb-1 font-sans tracking-wide">
                                Próxima Renovação
                              </p>
                              <p className="text-[11px] font-extrabold text-white tracking-wide font-sans">
                                18 Abr 2026
                              </p>
                            </div>
                          </div>

                          <Button
                            variant="neumorph-primary"
                            className="w-full h-12 font-extrabold text-[10px] tracking-label rounded-full font-sans"
                            onClick={() => setIsBuyModalOpen(true)}
                          >
                            Adicionar Créditos
                          </Button>
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
