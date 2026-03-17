# Design Spec: FoodSnapAI "Modern & Clean" Redesign
**Date:** 2026-03-16
**Status:** Draft
**Topic:** Aesthetic and Structural Overhaul of FoodSnapAI SaaS

## 1. Vision & Goals
Transform FoodSnapAI from a "glassmorphism" experiment into a professional-grade "SaaS Premium" platform. The design should feel technical, efficient, and high-end, focusing on the quality of the AI-generated food photography.

## 2. Visual Identity (Modern & Clean)
### 2.1 Color Palette
- **Primary Background:** `#0a0a0b` (Deep Void)
- **Surface/Cards:** `#121214` (Solid Surface)
- **Elevated/Hover:** `#1a1a1e` (Slightly Lighter Gray)
- **Accent:** `#f59e0b` (Amber - used sparingly for CTAs, focus states, and success indicators)
- **Borders:** `rgba(255, 255, 255, 0.06)` (Subtle, sharp edges)

### 2.2 Typography
- **Font Families:**
  - **Headings:** **Work Sans** (Bold/Black weights 700-900). Modern, geometric, and professional.
  - **Body & UI:** **Inter** (Regular 400, Medium 500, SemiBold 600). High legibility for technical interfaces.
- **Headings:** Slightly tighter letter-spacing (-1.5px for large titles).
- **Body:** Increased tracking (+0.5px) for technical readability.

### 2.3 UI Components
- **Buttons:** Solid Amber backgrounds for primary actions, ghost/outline buttons for secondary.
- **Cards:** Move away from blur/glass effects. Use solid backgrounds with subtle 1px borders.
- **Inputs:** Clean, dark inputs with Amber focus rings.

## 3. Architecture & Layout
### 3.1 Dashboard (Workstation Layout)
- **Column 1 (Side Nav):** Narrow, icon-based navigation for Generate, Gallery, Credits, and Settings.
- **Column 2 (Editor):** The main control panel. Contains image upload, prompt textarea, and **Visual Style Presets**.
- **Column 3 (Preview/History):** Large central preview of the current generation with quick-access history below or in a scrollable tray.

### 3.2 Landing Page (High Conversion)
- **Hero Section:** Clean typography with a clear value proposition.
- **Interactive Component:** An **A/B Image Slider** (Swipe) to demonstrate the AI transformation from "Cell Phone Photo" to "Studio Quality".
- **Pricing:** Uniform cards (already implemented) with further visual refinement to match the new palette.

## 4. Key Interactions
- **Style Presets:** Visual cards with icons/thumbnails representing different lighting and compositions (Dramatic, Clean, Rustic, etc.).
- **Generation State:** Smooth loading states (shimmers) instead of standard spinners where possible.
- **Responsive:** Mobile-first approach for the landing page; desktop-optimized for the Dashboard workstation.

## 5. Technical Implementation Details
- **Styling:** Vanilla CSS (globals.css) and CSS Modules for component-specific isolation.
- **Framework:** Next.js 16+ (App Router).
- **Icons:** Standardized SVG icon set (e.g., Lucide or custom SVG paths).

---
*End of Specification*
