'use client';

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        <button
          className={cn(
            'inline-flex items-center gap-2 bg-white/5 px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest text-white border border-white/10 focus:outline-none hover:bg-white/10 transition-all data-[state=open]:bg-white/10',
            className
          )}
        >
          {selectedOption ? selectedOption.label : label}
          <ChevronDown className="size-3 text-white/60" />
        </button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="start"
          sideOffset={5}
          className="w-52 bg-[#0A0A0A] border border-white/10 p-1 text-white z-50 shadow-2xl animate-in fade-in zoom-in-95 duration-100 rounded-none"
        >
          {options.map(option => (
            <DropdownMenuPrimitive.Item
              key={option.id}
              onClick={() => onChange(option.id)}
              className="group flex w-full items-center gap-3 px-3 py-2 outline-none cursor-pointer data-[highlighted]:bg-primary data-[highlighted]:text-black transition-colors"
            >
              {option.icon && (
                <option.icon className="size-3 text-white/30 group-data-[highlighted]:text-black/60" />
              )}
              <span className="flex-1 text-[10px] font-bold uppercase tracking-wider">
                {option.label}
              </span>
              {value === option.id && (
                <Check
                  className="size-3 text-white group-data-[highlighted]:text-black"
                  strokeWidth={3}
                />
              )}
            </DropdownMenuPrimitive.Item>
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
