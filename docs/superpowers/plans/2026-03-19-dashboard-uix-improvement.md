# Dashboard UIX Transformation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the dashboard into a fixed-viewport "App Interface" where the chat input is always visible and information density is optimized.

**Architecture:** Convert the main layout to a flex-column with a fixed height (`h-screen`), making the chat component flexible (`flex-1`) with internal scrolling.

**Tech Stack:** Next.js 15, Tailwind CSS, Lucide React.

---

### Task 1: Fixed Viewport Layout

**Files:**
- Modify: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Set fixed height and remove global scroll**
  Change the main container to `h-screen flex flex-col overflow-hidden`. Remove the history section from this view to avoid pushing the chat input down.

- [ ] **Step 2: Optimize Header and Main Paddings**
  Reduce header height from `h-20` to `h-16`. Change main content padding from `p-10` to `p-6`.

- [ ] **Step 3: Commit**
```bash
git add src/app/dashboard/page.tsx
git commit -m "style: transform dashboard to fixed viewport and optimize paddings"
```

### Task 2: Flexible Chat Interface

**Files:**
- Modify: `src/components/dashboard/chat-interface.tsx`

- [ ] **Step 1: Make chat container flexible**
  Remove the fixed `h-[650px]` and use `h-full flex-1`. Ensure the message area uses `overflow-y-auto`.

- [ ] **Step 2: Sticky Input Area with Glassmorphism**
  Ensure the input area is anchored at the bottom. Apply `backdrop-blur-md` and `bg-black/20` to the input container for better contrast over scrolling messages.

- [ ] **Step 3: Increase Information Density**
  Adjust gaps in chat bubbles and message list. Change `space-y-6` to `space-y-4`.

- [ ] **Step 4: Commit**
```bash
git add src/components/dashboard/chat-interface.tsx
git commit -m "style: refactor chat interface for flexible height and sticky input"
```

### Task 3: Visual Polish and Hierarchy

**Files:**
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/components/dashboard/chat-interface.tsx`

- [ ] **Step 1: Simplify Section Headers**
  Remove redundant descriptions like "Suas gerações recentes" to save vertical space. Focus on icons and bold titles.

- [ ] **Step 2: Verify on small viewports**
  Check that the input is visible on heights as low as 700px.

- [ ] **Step 3: Commit**
```bash
git add src/app/dashboard/page.tsx src/components/dashboard/chat-interface.tsx
git commit -m "style: final UI polish and hierarchy adjustments"
```
