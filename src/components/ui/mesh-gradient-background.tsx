"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface MeshGradientBackgroundProps {
  className?: string
  children?: React.ReactNode
  /** Gradient colors */
  colors?: string[]
  /** Animation speed multiplier */
  speed?: number
  /** Background color */
  backgroundColor?: string
}

export function MeshGradientBackground({
  className,
  children,
  colors = ["#7c3aed", "#2563eb", "#06b6d4", "#8b5cf6"],
  speed = 1,
  backgroundColor = "transparent",
}: MeshGradientBackgroundProps) {
  const duration1 = 60 / speed
  const duration2 = 80 / speed
  const duration3 = 90 / speed
  const duration4 = 70 / speed

  return (
    <div className={cn("fixed inset-0 overflow-hidden -z-10 pointer-events-none", className)} style={{ backgroundColor }}>
      {/* Gradient orbs */}
      <div className="absolute inset-0">
        {/* Orb 1 - Top left */}
        <div
          className="absolute h-[60%] w-[60%] rounded-full opacity-30"
          style={{
            left: "-10%",
            top: "-10%",
            background: `radial-gradient(circle, ${colors[0]} 0%, transparent 70%)`,
            filter: "blur(80px)",
            animation: `mesh-move-1 ${duration1}s ease-in-out infinite`,
          }}
        />

        {/* Orb 2 - Top right */}
        <div
          className="absolute h-[50%] w-[50%] rounded-full opacity-25"
          style={{
            right: "-5%",
            top: "10%",
            background: `radial-gradient(circle, ${colors[1]} 0%, transparent 70%)`,
            filter: "blur(100px)",
            animation: `mesh-move-2 ${duration2}s ease-in-out infinite`,
          }}
        />

        {/* Orb 3 - Bottom center */}
        <div
          className="absolute h-[55%] w-[70%] rounded-full opacity-20"
          style={{
            left: "20%",
            bottom: "-15%",
            background: `radial-gradient(circle, ${colors[2]} 0%, transparent 70%)`,
            filter: "blur(120px)",
            animation: `mesh-move-3 ${duration3}s ease-in-out infinite`,
          }}
        />

        {/* Orb 4 - Center accent */}
        <div
          className="absolute h-[40%] w-[40%] rounded-full opacity-15"
          style={{
            left: "40%",
            top: "30%",
            background: `radial-gradient(circle, ${colors[3] || colors[0]} 0%, transparent 70%)`,
            filter: "blur(90px)",
            animation: `mesh-move-4 ${duration4}s ease-in-out infinite`,
          }}
        />
      </div>

      {/* Subtle noise texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content layer */}
      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  )
}
