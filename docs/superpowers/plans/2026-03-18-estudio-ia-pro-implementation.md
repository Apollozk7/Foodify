# Estúdio IA Pro — Implementation Plan (Revised)

> **Stack:** Next.js 15+ App Router · Clerk · Supabase (DB + Storage) · Upstash Redis · Fal.ai · Gemini Flash 2.0 · Stripe · Railway

---

## Phase 1: Setup and Infrastructure

### Task 1: Project Initialization

**Files:**
- `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`
- `.env.example`

- [ ] **Step 1: Create Next.js project with Tailwind**
Run: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`

- [ ] **Step 2: Install core dependencies**
Run: `npm install @clerk/nextjs @supabase/supabase-js @upstash/redis @fal-ai/client lucide-react clsx tailwind-merge svix @t3-oss/env-nextjs zod browser-image-compression @stripe/stripe-js stripe`

- [ ] **Step 3: Setup shadcn/ui**
Run: `npx shadcn@latest init`

- [ ] **Step 4: Populate `.env.example`**
```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Fal.ai
FAL_KEY=

# Google Gemini
GEMINI_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

- [ ] **Step 5: Setup env validation com t3-env**
Create `src/env.ts` using Zod to validate all environment variables at build time.

- [ ] **Step 6: Commit initial setup**

---

## Phase 2: Database and Schema

### Task 2: Supabase Schema e RLS

**Files:**
- `supabase/migrations/20260318000000_initial_schema.sql`

- [ ] **Step 1: Define tables (`profiles`, `generations`, `transactions`, `prompt_templates`)**
- [ ] **Step 2: Apply RLS policies for user isolation and data protection**
- [ ] **Step 3: Commit**

---

## Phase 3: Auth e Middleware

### Task 3: Middleware do Clerk

**Files:**
- `src/middleware.ts`

- [ ] **Step 1: Create middleware for route protection (Public: /, /sign-in, /sign-up, /api/webhooks/*)**
- [ ] **Step 2: Commit**

---

### Task 4: Clerk Webhook — Sync de Usuário

**Files:**
- `src/app/api/webhooks/clerk/route.ts`
- `src/lib/supabase/admin.ts`

- [ ] **Step 1: Create Supabase Admin client (server-side)**
- [ ] **Step 2: Implement Clerk Webhook to sync `user.created` to `profiles` table (5 free credits)**
- [ ] **Step 3: Test webhook locally with Clerk CLI**
- [ ] **Step 4: Commit**

---

## Phase 4: AI Engine (TDD)

### Task 5: Compressão de Imagem (Client-side)

**Files:**
- `src/lib/utils/compress-image.ts`

- [ ] **Step 1: Implement compression wrapper using `browser-image-compression`**
- [ ] **Step 2: Commit**

---

### Task 6: Prompt Refiner com Gemini Flash 2.0 (TDD)

**Files:**
- `src/lib/ai/refiner.ts`
- `src/lib/ai/refiner.test.ts`

- [ ] **Step 1: Write failing tests for prompt expansion**
- [ ] **Step 2: Implement Gemini 2.0 Flash refiner function with category templates**
- [ ] **Step 3: Verify tests pass**
- [ ] **Step 4: Commit**

---

### Task 7: Fal.ai Client Wrapper

**Files:**
- `src/lib/fal/client.ts`

- [ ] **Step 1: Create typed wrapper for Fal.ai queue submission and status checks**
- [ ] **Step 2: Commit**

---

### Task 8: Generation Pipeline (Polling Strategy)

**Files:**
- `src/app/api/generate/route.ts`
- `src/app/api/generate/[id]/route.ts`
- `src/hooks/use-generation.ts`

- [ ] **Step 1: POST `/api/generate` with Credit Guard (Upstash Redis)**
- [ ] **Step 2: GET `/api/generate/[id]` for status polling and DB updates**
- [ ] **Step 3: Create React Hook `useGeneration` for frontend polling and state**
- [ ] **Step 4: Commit**

---

## Phase 5: Payments e Credits

### Task 9: Stripe Integration

**Files:**
- `src/app/api/checkout/route.ts`
- `src/app/api/webhooks/stripe/route.ts`

- [ ] **Step 1: Define credit packages (Starter, Pro, Growth)**
- [ ] **Step 2: Implement POST `/api/checkout` to create Stripe Sessions**
- [ ] **Step 3: Implement Webhook to fulfill credits on `checkout.session.completed`**
- [ ] **Step 4: Commit**

---

## Phase 6: UI/UX

### Task 10: Landing Page (Apple/Resend Style)

**Files:**
- `src/app/page.tsx`
- `src/components/landing/hero.tsx`
- `src/components/landing/before-after.tsx`
- `src/components/landing/pricing.tsx`

- [ ] **Step 1: Build Hero with Work Sans typography and Before/After slider**
- [ ] **Step 2: Build Category Showcase and Pricing sections**
- [ ] **Step 3: Commit**

---

### Task 11: Dashboard — Workstation

**Files:**
- `src/app/dashboard/page.tsx`
- `src/components/dashboard/upload-zone.tsx`
- `src/components/dashboard/category-selector.tsx`
- `src/components/dashboard/generation-result.tsx`
- `src/components/dashboard/credit-badge.tsx`

- [ ] **Step 1: Build Bento Grid dashboard layout**
- [ ] **Step 2: Connect components with `useGeneration` hook and compression logic**
- [ ] **Step 3: Implement generation history and credit badges**
- [ ] **Step 4: Commit**

---

## Phase 7: Deploy

### Task 12: Railway Deploy

- [ ] **Step 1: Configure Railway project and environment variables**
- [ ] **Step 2: Apply Supabase migrations to production environment**
- [ ] **Step 3: Verify end-to-end flow in live environment**
- [ ] **Step 4: Final commit + tag release `v0.1.0`**
