"use client";

import { cn } from "@/lib/utils";
import { 
  Pizza, 
  Beef, 
  Coffee, 
  UtensilsCrossed, 
  IceCream, 
  Sandwich 
} from "lucide-react";

const categories = [
  { id: "lanches", name: "Lanches", icon: Sandwich },
  { id: "pizzas", name: "Pizzas", icon: Pizza },
  { id: "churrasco", name: "Churrasco", icon: Beef },
  { id: "cafeteria", name: "Café", icon: Coffee },
  { id: "sobremesas", name: "Doces", icon: IceCream },
  { id: "marmitas", name: "Refeições", icon: UtensilsCrossed },
];

interface CategorySelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function CategorySelector({ selectedId, onSelect }: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = selectedId === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 group",
              isActive
                ? "bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/[0.08] hover:border-white/10 hover:text-slate-300"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
              isActive ? "bg-blue-600 text-white" : "bg-white/5 text-slate-500 group-hover:text-slate-300"
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
