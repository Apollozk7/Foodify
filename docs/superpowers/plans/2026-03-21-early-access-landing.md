# Early Access Landing Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-converting, minimal landing page to collect emails via Resend.com, enforcing a scarcity psychological trigger (only 5 spots) for the MVP launch.

**Architecture:** We will create a Next.js App Router page (`/early-access`) with a focused form. The form will post to a new API route (`/api/early-access`) which uses the official Resend Node SDK to either add the contact to an audience or send an internal notification. UI will use Framer Motion for success/loading states and Lucide icons for visual polish.

**Tech Stack:** Next.js (App Router), React, Tailwind CSS, Framer Motion, Resend Node SDK, Zod (validation).

---

### Task 1: Install Resend and Setup API Route

**Files:**
- Modify: `package.json`
- Create: `src/app/api/early-access/route.ts`
- Modify: `src/env.ts`

- [ ] **Step 1: Install Resend SDK**

Run: `npm install resend`
Expected: Resend added to package.json dependencies.

- [ ] **Step 2: Add Resend API Key to Environment Validation**

Modify `src/env.ts` to include `RESEND_API_KEY`:

```typescript
// Add inside server object in createEnv:
RESEND_API_KEY: z.string().min(1),

// Add inside runtimeEnv:
RESEND_API_KEY: process.env.RESEND_API_KEY,
```

- [ ] **Step 3: Create the Early Access API Route**

Create `src/app/api/early-access/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { env } from "@/env";
import { z } from "zod";

const resend = new Resend(env.RESEND_API_KEY);

const schema = z.object({
  email: z.string().email("E-mail inválido"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = schema.parse(body);

    // In a real scenario, you'd add to an audience: resend.contacts.create(...)
    // For MVP, sending an email to the admin or a welcome to the user works:
    const data = await resend.emails.send({
      from: "Estúdio IA Pro <onboarding@resend.dev>", // replace with verified domain if available
      to: [email],
      subject: "Acesso Antecipado Confirmado! 🎉",
      html: "<p>Você está na lista de espera exclusiva do Estúdio IA Pro. Avisaremos assim que liberarmos as 5 vagas.</p>",
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao processar e-mail." }, { status: 500 });
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/env.ts src/app/api/early-access/route.ts
git commit -m "feat: setup resend api route for early access"
```

### Task 2: Create the Early Access UI

**Files:**
- Create: `src/app/early-access/page.tsx`

- [ ] **Step 1: Create the Page Component with Form State**

Create `src/app/early-access/page.tsx`:

```tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import NeumorphButton from "@/components/ui/neumorph-button";
import Link from "next/link";

export default function EarlyAccessPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao inscrever");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#020617]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <Link href="/" className="inline-flex items-center gap-2 mb-12 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white italic">
            E
          </div>
          <span className="font-work-sans font-bold text-xl text-white tracking-tight">
            Estúdio IA Pro
          </span>
        </Link>

        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-12 backdrop-blur-xl shadow-2xl">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Apenas 5 vagas restantes
          </div>

          <h1 className="text-3xl md:text-4xl font-work-sans font-bold text-white leading-tight mb-4">
            Seja um dos primeiros a transformar seu cardápio com IA.
          </h1>
          
          <p className="text-slate-400 font-inter text-base mb-8">
            Inscreva-se para garantir acesso antecipado ao Estúdio IA Pro. Receba o convite em primeira mão e destaque seu delivery.
          </p>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center flex flex-col items-center gap-4"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                <div>
                  <h3 className="text-white font-bold text-lg">Inscrição confirmada!</h3>
                  <p className="text-slate-400 text-sm mt-1">Fique de olho na sua caixa de entrada.</p>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Seu melhor e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#020617] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-inter"
                  />
                </div>
                
                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <NeumorphButton 
                  intent="primary" 
                  size="large" 
                  fullWidth 
                  disabled={loading}
                  type="submit"
                  className="py-5"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Garantir meu acesso
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </NeumorphButton>
                
                <p className="text-xs text-slate-500 text-center font-inter mt-4">
                  Zero spam. Cancele quando quiser.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Check formatting and UI implementation**
Verify that the `src/app/early-access/page.tsx` renders without errors and looks accurate to the spec.

- [ ] **Step 3: Commit**

```bash
git add src/app/early-access/page.tsx
git commit -m "feat: build early access landing page UI"
```

### Task 3: Update Promo Banner to Link to Early Access

**Files:**
- Modify: `src/components/landing/promo-banner.tsx`

- [ ] **Step 1: Change PromoBanner CTA Link**

Change the `Link href="/sign-up"` to `Link href="/early-access"` inside the banner.

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/promo-banner.tsx
git commit -m "feat: redirect promo banner to early access page"
```
