import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        // Neumorph variants integrated from previous NeumorphButton
        neumorph:
          'bg-white/5 text-slate-300 border-white/5 hover:text-white shadow-[4px_4px_10px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.02)] active:shadow-inner',
        'neumorph-primary':
          'bg-blue-600/90 text-white border-blue-500/50 shadow-[4px_4px_12px_rgba(0,0,0,0.4),-2px_-2px_8px_rgba(59,130,246,0.2)] hover:bg-blue-600',
        'neumorph-secondary':
          'bg-indigo-600/90 text-white border-indigo-500/50 shadow-[4px_4px_12px_rgba(0,0,0,0.4),-2px_-2px_8px_rgba(79,70,229,0.2)] hover:bg-indigo-600',
        'neumorph-danger':
          'bg-red-600/90 text-white border-red-500/50 shadow-[4px_4px_12px_rgba(0,0,0,0.4),-2px_-2px_8px_rgba(239,68,68,0.2)] hover:bg-red-600',
        'neumorph-white':
          'bg-white text-slate-950 border-white shadow-[4px_4px_12px_rgba(0,0,0,0.2)] hover:bg-slate-50',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
        // Neumorph sizes
        'neumorph-sm': 'h-9 px-4 text-xs rounded-xl',
        'neumorph-md': 'h-11 px-6 text-sm rounded-2xl',
        'neumorph-lg': 'h-14 px-10 text-base rounded-[24px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    const content = (
      <>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!loading && children}
        {loading && <span className="sr-only">Carregando...</span>}
      </>
    );

    // If it's a neumorph variant, we wrap it in a motion component for the nice scale effects
    if (variant?.toString().includes('neumorph')) {
      return (
        <motion.button
          whileHover={!disabled && !loading ? { scale: 1.01, y: -1 } : {}}
          whileTap={!disabled && !loading ? { scale: 0.98, y: 0 } : {}}
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref as React.Ref<HTMLButtonElement>}
          disabled={disabled || loading}
          {...(props as React.ComponentProps<typeof motion.button>)}
        >
          <div className="relative flex items-center justify-center gap-2 z-10">{content}</div>
        </motion.button>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
