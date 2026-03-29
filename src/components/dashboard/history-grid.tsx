'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader2, ImageIcon, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { createClient } from '@/lib/supabase/client';

interface Generation {
  id: string;
  input_image_url: string;
  output_image_url: string;
  status: string;
  created_at: string;
  category: string;
}

export function HistoryGrid() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchHistory() {
      try {
        const { data, error } = await supabase
          .from('generations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        if (data) {
          setGenerations(data as Generation[]);
        }
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (generations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-white/5 rounded-3xl border border-dashed border-white/10 backdrop-blur-sm">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-slate-500" />
        </div>
        <div className="space-y-1">
          <h4 className="text-lg font-semibold text-white">Nenhuma foto ainda</h4>
          <p className="text-sm text-slate-500 max-w-[240px]">
            Suas fotos geradas aparecerão aqui para você baixar quando quiser.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {generations.map(gen => (
        <div
          key={gen.id}
          className="group relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 transition-all hover:border-blue-500/50 hover:ring-1 hover:ring-blue-500/50 backdrop-blur-sm"
        >
          <Image
            src={gen.output_image_url || gen.input_image_url}
            alt={gen.category}
            fill
            className="object-cover transition-transform group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
            <p className="text-xs font-medium text-white capitalize">{gen.category}</p>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(gen.created_at), "dd 'de' MMM", { locale: ptBR })}
            </div>
          </div>
          {gen.status === 'processing' && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
