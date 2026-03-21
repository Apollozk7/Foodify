# Landing Page UX & Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix navigation friction and improve conversion rates by adding anchor links, wrapping CTAs in Next.js Links, and adding a micro-trust badge to the Hero section.

**Architecture:** Use standard HTML `id` attributes on main sections. Use Next.js `<Link>` for all authentication routing to ensure SPA-like transitions. Add an avatar-group micro-component to the Hero for social proof.

**Tech Stack:** Next.js 15, Tailwind CSS, Lucide React.

---

### Task 1: Navigation Anchors & Smooth Scrolling

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/landing/hero.tsx`
- Modify: `src/components/landing/community-showcase.tsx`
- Modify: `src/components/landing/pricing.tsx`
- Modify: `src/components/landing/faq.tsx`

- [ ] **Step 1: Add IDs to sections**
  In `page.tsx`, ensure or add `id="hero"`, `id="gallery"`, `id="pricing"`, and `id="faq"` to the respective wrapper elements (or inside the components themselves). Let's do it inside the components to keep `page.tsx` clean.
  - `Hero`: `<section id="hero" ...>`
  - `CommunityShowcase`: `<section id="gallery" ...>`
  - `Pricing`: `<section id="pricing" ...>`
  - `FAQ`: `<section id="faq" ...>`

- [ ] **Step 2: Update Navbar Links**
  In `src/app/page.tsx`, update the navigation links to point to the new IDs:
  - `href="#hero"` for Início
  - `href="#pricing"` for Preços
  - `href="#gallery"` for Galeria

- [ ] **Step 3: Update Footer Links**
  In `src/app/page.tsx`, update the footer links similarly to point to the anchor IDs where applicable.

- [ ] **Step 4: Commit**
```bash
git add src/app/page.tsx src/components/landing/hero.tsx src/components/landing/community-showcase.tsx src/components/landing/pricing.tsx src/components/landing/faq.tsx
git commit -m "feat: add section anchors and connect navbar/footer links"
```

### Task 2: CTA Routing Integration

**Files:**
- Modify: `src/components/landing/hero.tsx`
- Modify: `src/components/landing/pricing.tsx`

- [ ] **Step 1: Update Hero CTAs**
  Import `Link` from `next/link`. Wrap the primary button ("Começar agora") in `<Link href="/sign-up">`. Change the secondary button ("Ver galeria") to an anchor `href="#gallery"` or wrap it in a Link. Since it's a NeumorphButton, if it doesn't support `href` directly, wrap it in an `<a>` or `<Link href="#gallery">`.

- [ ] **Step 2: Update Pricing CTAs**
  Import `Link` from `next/link`. Wrap the `NeumorphButton` inside the mapping loop with `<Link href="/sign-up" className="w-full">`.

- [ ] **Step 3: Commit**
```bash
git add src/components/landing/hero.tsx src/components/landing/pricing.tsx
git commit -m "feat: wire up all landing page CTAs to authentication flows"
```

### Task 3: Social Proof Micro-Badge

**Files:**
- Modify: `src/components/landing/hero.tsx`

- [ ] **Step 1: Add Trust Badge**
  Below the CTA buttons in the `Hero` component, add a small div containing 3-4 overlapping avatar circles (using generic Unsplash faces or simple colored circles with initials) and a text like "Mais de 500 restaurantes já usam". Use Tailwind's `-space-x-2` for the overlapping effect.

- [ ] **Step 2: Commit**
```bash
git add src/components/landing/hero.tsx
git commit -m "style: add social proof trust badge to hero section"
```
