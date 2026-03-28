"use client";

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropdownOption {
  id: string;
  label: string;
  icon?: React.ElementType;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Dropdown({ label, options, value, onChange, className }: DropdownProps) {
  const selectedOption = options.find(opt => opt.id === value);

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <button className={cn(
          "inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-inner border border-white/5 focus:outline-none hover:bg-white/10 transition-all data-[state=open]:bg-white/10",
          className
        )}>
          {selectedOption ? selectedOption.label : label}
          <ChevronDown className="size-4 text-white/60" />
        </button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="start"
          sideOffset={5}
          className="w-52 origin-top-right rounded-2xl border border-white/10 bg-[#0f172a] p-1 text-sm text-white z-50 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-100"
        >
          {options.map((option) => (
            <DropdownMenuPrimitive.Item
              key={option.id}
              onClick={() => onChange(option.id)}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 outline-none cursor-pointer data-[highlighted]:bg-white/10 transition-colors"
            >
              {option.icon && <option.icon className="size-4 text-white/30 group-data-[highlighted]:text-white/60" />}
              <span className="flex-1">{option.label}</span>
              {value === option.id && (
                <Check className="size-3.5 text-blue-500" strokeWidth={3} />
              )}
            </DropdownMenuPrimitive.Item>
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
