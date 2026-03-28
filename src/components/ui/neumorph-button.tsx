"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface NeumorphButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: "default" | "primary" | "secondary" | "danger" | "white"
  size?: "small" | "medium" | "large"
  fullWidth?: boolean
  loading?: boolean
}

const NeumorphButton = React.forwardRef<HTMLButtonElement, NeumorphButtonProps>(
  ({ className, intent = "default", size = "medium", fullWidth, loading, disabled, children, ...props }, ref) => {

    const variants = {
      default: "bg-white/5 text-slate-300 border-white/5 hover:text-white shadow-[4px_4px_10px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.02)] active:shadow-inner",
      primary: "bg-blue-600/90 text-white border-blue-500/50 shadow-[4px_4px_12px_rgba(0,0,0,0.4),-2px_-2px_8px_rgba(59,130,246,0.2)] hover:bg-blue-600",
      secondary: "bg-indigo-600/90 text-white border-indigo-500/50 shadow-[4px_4px_12px_rgba(0,0,0,0.4),-2px_-2px_8px_rgba(79,70,229,0.2)] hover:bg-indigo-600",
      danger: "bg-red-600/90 text-white border-red-500/50 shadow-[4px_4px_12px_rgba(0,0,0,0.4),-2px_-2px_8px_rgba(239,68,68,0.2)] hover:bg-red-600",
      white: "bg-white text-slate-950 border-white shadow-[4px_4px_12px_rgba(0,0,0,0.2)] hover:bg-slate-50",
    }

    const sizes = {
      small: "h-9 px-4 text-xs rounded-xl",
      medium: "h-11 px-6 text-sm rounded-2xl",
      large: "h-14 px-10 text-base rounded-[24px]",
    }

    return (
      <motion.button
        ref={ref}
        whileHover={!disabled && !loading ? { scale: 1.01, y: -1 } : {}}
        whileTap={!disabled && !loading ? { scale: 0.98, y: 0 } : {}}
        disabled={disabled || loading}
        className={cn(
          "relative inline-flex items-center justify-center font-bold tracking-tight transition-all duration-200 border backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group",
          variants[intent],
          sizes[size],
          fullWidth ? "w-full" : "w-auto",
          className
        )}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
      >
        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        {/* Loading Spinner */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute flex items-center justify-center"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    )
  }
)

NeumorphButton.displayName = "NeumorphButton"

export default NeumorphButton
