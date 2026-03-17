# FoodSnapAI Modern & Clean Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul FoodSnapAI with a "Modern & Clean" SaaS Premium aesthetic, featuring a 3-column Dashboard layout and an interactive Landing Page.

**Architecture:** Systematic replacement of "glassmorphism" with solid surfaces and sharp borders. Transition to a 3-column workstation layout for the Dashboard to improve productivity.

**Tech Stack:** Next.js 16+, TypeScript, Vanilla CSS, Work Sans (Headers), Inter (Body).

---

## Chunk 1: Global Foundation & Typography

### Task 1: Setup Fonts and Global CSS Variables

**Files:**
- Modify: `app/layout.tsx` (Add Work Sans & Inter imports)
- Modify: `app/globals.css` (Update CSS variables and base typography)

- [ ] **Step 1: Update Font Imports in Layout**
  Update the Google Fonts import to include Work Sans and ensure Inter is correctly weighted.
  
  ```tsx
  // app/layout.tsx
  // Update the font import link or use next/font/google
  import { Inter, Work_Sans } from "next/font/google";

  const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
  const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans" });

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="pt-BR" className={`${inter.variable} ${workSans.variable}`}>
        <body>{children}</body>
      </html>
    );
  }
  ```

- [ ] **Step 2: Update CSS Variables in globals.css**
  Replace glassmorphism variables with solid surface variables.
  
  ```css
  /* app/globals.css */
  :root {
    --bg-void: #0a0a0b;
    --bg-surface: #121214;
    --bg-elevated: #1a1a1e;
    --bg-card: #121214; /* Solid, not glass */
    --border: rgba(255, 255, 255, 0.06);
    --font-header: var(--font-work-sans), sans-serif;
    --font-body: var(--font-inter), sans-serif;
  }
  
  h1, h2, h3, h4, .font-header {
    font-family: var(--font-header);
    letter-spacing: -0.02em;
  }
  
  body {
    font-family: var(--font-body);
    background: var(--bg-void);
  }
  ```

- [ ] **Step 3: Commit Changes**
  ```bash
  git add app/layout.tsx app/globals.css
  git commit -m "style: update global fonts and surface variables"
  ```

### Task 2: Refine Global Components (Buttons & Cards)

**Files:**
- Modify: `app/globals.css` (Update .btn and .glass-card classes)

- [ ] **Step 1: Remove Blur from Cards**
  Update `.glass-card` (or rename to `.card`) to use solid background and sharp 1px border.
  
  ```css
  /* app/globals.css */
  .glass-card {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    backdrop-filter: none; /* Remove blur */
    border-radius: 12px;
  }
  ```

- [ ] **Step 2: Update Button Styling**
  Ensure primary buttons are solid Amber and secondary are sharp outlines.
  
  ```css
  .btn-primary {
    background: var(--accent);
    color: #000;
    border-radius: 8px; /* Sharper */
    font-weight: 600;
  }
  ```

- [ ] **Step 3: Commit Changes**
  ```bash
  git add app/globals.css
  git commit -m "style: sharpen button and card components"
  ```

---

## Chunk 2: Landing Page Overhaul

### Task 3: Implement A/B Image Slider Component

**Files:**
- Create: `components/ImageSlider.tsx`
- Modify: `components/Hero.tsx` (Integrate slider)

- [ ] **Step 1: Create the Slider Component**
  Implement a classic swipe slider for Before/After comparison.
  
- [ ] **Step 2: Update Hero Section**
  Replace static cards with the new Slider and Work Sans typography.

- [ ] **Step 3: Commit Changes**
  ```bash
  git add components/ImageSlider.tsx components/Hero.tsx
  git commit -m "feat: add interactive before/after slider to hero"
  ```

---

## Chunk 3: Dashboard Workstation (3-Column Layout)

### Task 4: Restructure Dashboard Layout

**Files:**
- Modify: `app/dashboard/page.tsx`

- [ ] **Step 1: Implement 3-Column Grid**
  Column 1 (Side Nav), Column 2 (Editor Controls), Column 3 (Preview Area).
  
- [ ] **Step 2: Update Style Presets to Visual Cards**
  Replace text buttons with cards featuring icons/thumbnails.

- [ ] **Step 3: Final Polishing and Verification**
  Ensure all responsive breakpoints work and typography is consistent.

- [ ] **Step 4: Commit Changes**
  ```bash
  git add app/dashboard/page.tsx
  git commit -m "feat: restructure dashboard to 3-column workstation"
  ```
