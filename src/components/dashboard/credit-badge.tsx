"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Coins, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function CreditBadge() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCredits() {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        setCredits(data.credits);
      } catch (err) {
        console.error("Failed to fetch credits:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCredits();
  }, []);

  if (loading) {
    return (
      <div className="h-9 w-24 bg-white/5 animate-pulse rounded-full border border-white/10" />
    );
  }

  const isLow = credits !== null && credits <= 2;

  return (
    <Link
      href="/#pricing"
      className={cn(
        "flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95",
        isLow 
          ? "bg-amber-500/10 border-amber-500/50 text-amber-400 hover:bg-amber-500/20" 
          : "bg-blue-500/10 border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
      )}
    >
      <Coins className="w-4 h-4" />
      <span className="font-semibold text-sm">
        {credits ?? 0} {credits === 1 ? "crédito" : "créditos"}
      </span>
      <div className={cn(
        "ml-1 p-0.5 rounded-full",
        isLow ? "bg-amber-400 text-amber-950" : "bg-blue-400 text-blue-950"
      )}>
        <Plus className="w-3 h-3 stroke-[3]" />
      </div>
    </Link>
  );
}
