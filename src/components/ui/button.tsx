import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-black tracking-action focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden group cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-white/10 bg-transparent text-white',
        secondary: 'bg-secondary text-secondary-foreground',
        ghost: 'bg-transparent text-current',
        link: 'text-primary underline-offset-4',
        neumorph:
          'bg-white/5 text-slate-300 border-white/5 shadow-[4px_4px_10px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.02)]',
        'neumorph-primary':
          'bg-primary text-white border-primary/50 shadow-[0_15px_30px_rgba(var(--primary-rgb),0.2)]',
        'neumorph-secondary':
          'bg-secondary text-white border-secondary/50 shadow-[0_10px_30px_rgba(62,98,89,0.2)]',
        'neumorph-danger':
          'bg-red-600/90 text-white border-red-500/50 shadow-[0_10px_30px_rgba(239,68,68,0.2)]',
        'neumorph-white':
          'bg-white text-slate-950 border-white shadow-[0_10px_30_rgba(255,255,255,0.1)]',
      },
      size: {
        default: 'h-11 px-8 py-2',
        sm: 'h-9 px-6',
        lg: 'h-16 px-12 text-base',
        icon: 'h-10 w-10',
        'neumorph-sm': 'h-9 px-6 text-[10px]',
        'neumorph-md': 'h-12 px-8 text-xs',
        'neumorph-lg': 'h-20 px-12 text-sm',
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
  (
    { className, variant, size, asChild: _asChild = false, loading, disabled, children, ...props },
    ref
  ) => {
    // Omit conflicting props from framer-motion
    const {
      onDrag: _onDrag,
      onDragStart: _onDragStart,
      onDragEnd: _onDragEnd,
      onAnimationStart: _onAnimationStart,
      onDragEnter: _onDragEnter,
      onDragLeave: _onDragLeave,
      onDragOver: _onDragOver,
      ...filteredProps
    } = props as Record<string, unknown>;

    // Variants for the button and shimmer
    const buttonMotion = {
      rest: { scale: 1, y: 0 },
      hover: {
        scale: 1.05,
        y: -2,
        boxShadow:
          variant === 'default' || variant === 'neumorph-primary'
            ? '0 20px 40px rgba(var(--primary-rgb), 0.4)'
            : '0 10px 25px rgba(255, 255, 255, 0.1)',
      },
      tap: { scale: 0.97, y: 0 },
    };

    const shimmerMotion = {
      rest: { x: '-150%' },
      hover: { x: '150%' },
    };

    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={disabled || loading}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        variants={buttonMotion}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={cn(buttonVariants({ variant, size, className }))}
        {...filteredProps}
      >
        {/* Glossy Shimmer - Now triggered by parent variants */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-full">
          <motion.div
            variants={shimmerMotion}
            transition={{ duration: 0.6, ease: 'circIn' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
          />
        </div>

        {/* Content */}
        <div className="relative flex items-center justify-center gap-2 z-10 font-black pointer-events-none">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {!loading && children}
          {loading && <span className="sr-only">Carregando...</span>}
        </div>
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
