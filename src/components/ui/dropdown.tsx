"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

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
    <Menu as="div" className={cn("relative inline-block text-left", className)}>
      <MenuButton className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-inner border border-white/5 focus:outline-none hover:bg-white/10 transition-all data-[open]:bg-white/10">
        {selectedOption ? selectedOption.label : label}
        <ChevronDownIcon className="size-4 fill-white/60" />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom start"
        className="w-52 origin-top-right rounded-2xl border border-white/10 bg-[#0f172a] p-1 text-sm text-white transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 z-50 backdrop-blur-xl shadow-2xl"
      >
        {options.map((option) => (
          <MenuItem key={option.id}>
            <button
              onClick={() => onChange(option.id)}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 data-[focus]:bg-white/10 transition-colors"
            >
              {option.icon && <option.icon className="size-4 fill-white/30" />}
              {option.label}
              {value === option.id && (
                <div className="ml-auto size-1.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
              )}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
