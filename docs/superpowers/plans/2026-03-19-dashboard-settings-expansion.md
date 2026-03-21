# Dashboard Settings Sub-tabs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a sub-navigation system inside the "Settings" tab with "Account", "Plan", and "AI & Studio" sections. Include a modular credit purchase modal.

**Architecture:** Internal state for `activeSettingsTab`. Use a horizontal/vertical sub-sidebar for settings categories. Buy Credits modal will calculate price based on the Avulso plan (R$ 1,99 per credit).

**Tech Stack:** Next.js 15, Framer Motion, Lucide React, Clerk.

---

### Task 1: Settings Sub-navigation Layout

**Files:**
- Modify: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Add activeSettingsTab state**
  `const [activeSettingsTab, setActiveSettingsTab] = useState<'account' | 'plan' | 'ai'>('account');`

- [ ] **Step 2: Implement Settings Sidebar Layout**
  Inside the `activeTab === 'settings'` block, create a flex container with a left sidebar (icons + labels) and a right content area. Use a subtle border between them.

- [ ] **Step 3: Commit**
```bash
git add src/app/dashboard/page.tsx
git commit -m "style: add sub-navigation layout to settings tab"
```

### Task 2: Account and AI Sub-tabs

**Files:**
- Modify: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Account View**
  Show User name, email (from Clerk) and a "Sair da Conta" button.

- [ ] **Step 2: AI & Studio View**
  Add toggles for "Auto-download" and select for "Idioma de Resposta" (PT/EN).

- [ ] **Step 3: Commit**
```bash
git add src/app/dashboard/page.tsx
git commit -m "feat: implement Account and AI sub-tabs in settings"
```

### Task 3: Plan Sub-tab & Buy Credits Modal

**Files:**
- Create: `src/components/dashboard/buy-credits-modal.tsx`
- Modify: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Create BuyCreditsModal component**
  Input field for "Quantidade de Créditos". Minimum 10 (based on Avulso). Price = amount * 1.99. "Continuar" button triggers a placeholder redirect alert.

- [ ] **Step 2: Integrate Modal in Plan View**
  Add "Adicionar Créditos" button in the Plan sub-tab that opens the modal. Display current credits (placeholder).

- [ ] **Step 3: Commit**
```bash
git add src/components/dashboard/buy-credits-modal.tsx src/app/dashboard/page.tsx
git commit -m "feat: implement plan sub-tab and modular buy credits modal"
```
