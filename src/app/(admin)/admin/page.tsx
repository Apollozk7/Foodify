'use client';

import { useState } from 'react';
import { searchUser } from './actions';
import { UserManagementCard } from '@/components/admin/user-management-card';
import { Button } from '@/components/ui/button';
import { Search, ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface AdminUser {
  id: string;
  clerk_id: string;
  email: string;
  credits: number;
}

export default function AdminPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AdminUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const users = await searchUser(query);
      setResults(users);
    } catch (_e) {
      alert('Erro na busca');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#000103] py-12 px-6 md:py-20">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="space-y-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4"
            >
              <ArrowLeft className="w-3 h-3" /> Voltar ao Studio
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-red-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white tracking-tighter">
                Painel <span className="text-primary italic">Admin.</span>
              </h1>
            </div>
            <p className="text-neutral-500 text-sm font-medium">
              Gestão de identidades e auditoria de recursos.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-primary transition-colors" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Busque por email ou ID do Clerk..."
                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-neutral-700 focus:outline-none focus:border-primary/30 transition-all font-sans"
              />
            </div>
            <Button
              type="submit"
              disabled={isSearching}
              className="px-8 h-14 rounded-2xl bg-white text-black font-black hover:bg-primary hover:text-white"
            >
              {isSearching ? 'BUSCANDO...' : 'BUSCAR'}
            </Button>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {results.length > 0 ? (
            <div className="grid gap-4">
              <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest px-2">
                {results.length} RESULTADOS ENCONTRADOS
              </p>
              {results.map(user => (
                <UserManagementCard key={user.id} user={user} />
              ))}
            </div>
          ) : query && !isSearching ? (
            <div className="py-20 text-center space-y-4 bg-white/[0.01] border border-dashed border-white/5 rounded-[32px]">
              <p className="text-neutral-600 font-medium italic">
                Nenhum usuário encontrado para &quot;{query}&quot;
              </p>
            </div>
          ) : (
            !query && (
              <div className="py-20 text-center space-y-4">
                <p className="text-neutral-700 text-xs font-bold uppercase tracking-widest">
                  Inicie uma busca para gerenciar usuários
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}
