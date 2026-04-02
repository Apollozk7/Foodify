'use client';

import { useEffect, useState } from 'react';
import Link from 'next/image';
import { Zap, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreditBadgeProps {
  onClick?: () => void;
}

export function CreditBadge({ onClick }: CreditBadgeProps) {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCredits() {
      try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();
        setCredits(data.credits);
      } catch (err) {
        console.error('Failed to fetch credits:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCredits();
  }, []);

  if (loading) {
    return <div className="h-8 w-28 bg-white/5 animate-pulse rounded-full border border-white/5" />;
  }

  const isLow = credits !== null && credits <= 2;

  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex items-center gap-2.5 px-4 py-1.5 rounded-full border bg-[#000103] transition-all',
        isLow
          ? 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
          : 'border-primary/30 shadow-[0_0_15px_rgba(244,93,1,0.1)]'
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center w-5 h-5 rounded-full',
          isLow ? 'bg-amber-500/20' : 'bg-primary/20'
        )}
      >
        <Zap
          className={cn(
            'w-3 h-3',
            isLow ? 'text-amber-400 fill-amber-400' : 'text-primary fill-primary'
          )}
        />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-white text-[11px] font-black tracking-tighter">{credits ?? 0}</span>
        <span className="text-neutral-500 text-[9px] font-bold uppercase tracking-wide">
          Créditos
        </span>
      </div>
      <div
        className={cn(
          'ml-1 flex items-center justify-center w-4 h-4 rounded-full transition-transform group-hover:scale-110',
          isLow ? 'bg-amber-500 text-amber-950' : 'bg-primary text-white'
        )}
      >
        <Plus className="w-2.5 h-2.5 stroke-[4]" />
      </div>
    </button>
  );
}
