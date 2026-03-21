# Clerk Redesign & Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign Clerk authentication to match the Estúdio IA Pro brand, localize to PT-BR, and implement a Split View auth layout.

**Architecture:** Global configuration in `ClerkProvider` (layout.tsx). Custom auth pages with a 50/50 split layout using Next.js App Router.

**Tech Stack:** Next.js 15, Clerk v5, Tailwind CSS, Framer Motion.

---

### Task 1: Global Localization & Theme

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Configure ClerkProvider**
  Import `ptBR` from `@clerk/localizations` and set it in `localization` prop. Add global `appearance` settings (colors, typography, radii).

- [ ] **Step 2: Commit**
```bash
git add src/app/layout.tsx
git commit -m "style: configure global Clerk localization and dark theme appearance"
```

### Task 2: Custom Split View Auth Pages

**Files:**
- Create: `src/app/sign-in/[[...sign-in]]/page.tsx`
- Create: `src/app/sign-up/[[...sign-up]]/page.tsx`

- [ ] **Step 1: Implement Sign-In Page**
  Create a grid with 2 columns. Left: Professional AI Food Image + Branding. Right: `<SignIn />` component centered. Use `MeshGradientBackground`.

- [ ] **Step 2: Implement Sign-Up Page**
  Replicate the layout for `<SignUp />`.

- [ ] **Step 3: Commit**
```bash
git add src/app/sign-in src/app/sign-up
git commit -m "feat: implement custom Split View pages for Sign-In and Sign-Up"
```

### Task 3: Middleware & Environment Alignment

**Files:**
- Modify: `src/env.ts`
- Modify: `src/proxy.ts`

- [ ] **Step 1: Update Clerk Environment Variables**
  Ensure `NEXT_PUBLIC_CLERK_SIGN_IN_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL` point to the new custom pages.

- [ ] **Step 2: Verify Middleware**
  Ensure the new auth routes are handled correctly by `clerkMiddleware`.

- [ ] **Step 3: Commit**
```bash
git add src/env.ts src/proxy.ts
git commit -m "config: align environment variables and middleware with custom auth pages"
```
