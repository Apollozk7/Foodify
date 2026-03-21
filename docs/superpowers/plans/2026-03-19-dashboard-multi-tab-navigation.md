# Dashboard Multi-Tab Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement state-based navigation for the dashboard, enabling "Workspace", "Minhas Fotos", and "Configurações" tabs within the fixed-viewport layout.

**Architecture:** Use a `useState` for `activeTab` in the Dashboard page. Create sub-components for each tab's content to keep the main page clean.

**Tech Stack:** Next.js 15, Tailwind CSS, Lucide React.

---

### Task 1: Navigation State & Sidebar Integration

**Files:**
- Modify: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Add activeTab state**
  Introduce `const [activeTab, setActiveTab] = useState<'workspace' | 'history' | 'settings'>('workspace');`.

- [ ] **Step 2: Update Sidebar buttons**
  Bind `setActiveTab` to the buttons and apply active styles (intent="primary" for the active one, intent="default" for others).

- [ ] **Step 3: Commit**
```bash
git add src/app/dashboard/page.tsx
git commit -m "feat: implement state-based navigation in dashboard sidebar"
```

### Task 2: History Tab ("Minhas Fotos")

**Files:**
- Modify: `src/app/dashboard/page.tsx`
- Ensure: `src/components/dashboard/history-grid.tsx` exists and is styled for fixed viewport.

- [ ] **Step 1: Create History view**
  Wrap the `HistoryGrid` in a scrollable container (`flex-1 overflow-y-auto`) that matches the height of the Workspace. Add a header "Minhas Fotos" with a "Ver Todas" or filter button.

- [ ] **Step 2: Conditional Rendering**
  Update the main area to render the History view when `activeTab === 'history'`.

- [ ] **Step 3: Commit**
```bash
git add src/app/dashboard/page.tsx
git commit -m "feat: implement Minhas Fotos tab with optimized history grid"
```

### Task 3: Settings Tab & Layout Polish

**Files:**
- Modify: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Implement Settings Placeholder**
  Create a clean settings view with profile info (Clerk) and plan details.

- [ ] **Step 2: Final Layout Synchronization**
  Ensure the header title (e.g., "Workspace", "Galeria", "Configurações") updates dynamically based on the `activeTab`.

- [ ] **Step 3: Commit**
```bash
git add src/app/dashboard/page.tsx
git commit -m "feat: implement Settings tab and dynamic header titles"
```
