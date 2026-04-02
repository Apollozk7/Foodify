'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { adjustCredits, deleteUserAccount } from '@/app/(admin)/admin/actions';
import { Trash2, Plus, Minus, UserCircle } from 'lucide-react';

interface AdminUser {
  clerk_id: string;
  email: string;
  credits: number;
}

export function UserManagementCard({ user }: { user: AdminUser }) {
  const [loading, setLoading] = useState(false);

  const handleAdjust = async (amount: number) => {
    if (!confirm(`Confirmar ajuste de ${amount} créditos para ${user.email}?`)) return;
    setLoading(true);
    try {
      await adjustCredits(user.clerk_id, amount, 'Manual adjustment');
      alert('Créditos ajustados com sucesso!');
    } catch (_e) {
      alert('Erro ao ajustar créditos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `⚠️ AVISO: Deletar permanentemente a conta de ${user.email}? Esta ação não pode ser desfeita.`
      )
    )
      return;
    setLoading(true);
    try {
      await deleteUserAccount(user.clerk_id);
      alert('Conta deletada.');
    } catch (_e) {
      alert('Erro ao deletar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[24px] space-y-6 hover:border-primary/20 transition-all">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
            <UserCircle className="w-6 h-6 text-neutral-500" />
          </div>
          <div>
            <p className="font-bold text-white tracking-tight">{user.email}</p>
            <p className="text-[10px] text-neutral-600 font-mono mt-0.5">{user.clerk_id}</p>
          </div>
        </div>
        <div className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
          <span className="text-xs font-black text-primary tracking-wide">
            {user.credits} CRÉDITOS
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button
          variant="neumorph"
          size="neumorph-sm"
          onClick={() => handleAdjust(10)}
          disabled={loading}
          className="bg-white/5"
        >
          <Plus className="w-3 h-3 mr-1" /> 10
        </Button>
        <Button
          variant="neumorph"
          size="neumorph-sm"
          onClick={() => handleAdjust(50)}
          disabled={loading}
          className="bg-white/5"
        >
          <Plus className="w-3 h-3 mr-1" /> 50
        </Button>
        <Button
          variant="neumorph"
          size="neumorph-sm"
          onClick={() => handleAdjust(-10)}
          disabled={loading}
          className="hover:text-red-400"
        >
          <Minus className="w-3 h-3 mr-1" /> 10
        </Button>

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={loading}
          className="text-neutral-700 hover:text-red-500 hover:bg-red-500/10 rounded-xl h-9 w-9"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
