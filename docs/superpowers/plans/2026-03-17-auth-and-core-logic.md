# FoodSnapAI Auth & Core Implementation Plan (17/03/2026)

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate real Authentication (Clerk), connect to Database (Supabase/Prisma), and implement the generation logic.

**Architecture:** Replace mocks with real service calls. Use Clerk for Auth sessions and Supabase (PostgreSQL) for image metadata and credit management.

**Tech Stack:** Next.js 16+, Clerk (Auth), Prisma (ORM), Supabase (DB), Fal.ai (AI).

---

## Task 1: Auth & User Onboarding
- [ ] **Step 1: Setup Clerk Middleware**
- [ ] **Step 2: Connect Login/Signup to Clerk UI**
- [ ] **Step 3: Database User Creation (Sync with Clerk Webhooks)**

## Task 2: Real Generation Logic
- [ ] **Step 1: Fal.ai FLUX API Integration**
- [ ] **Step 2: Save metadata and S3 URL (R2) in Database**
- [ ] **Step 3: Credit Deduction Flow**

## Task 3: Interactive Dashboard (Workstation v1.1)
- [ ] **Step 1: Live Gallery (Fetch from DB)**
- [ ] **Step 2: Real Credit Balance Display**
- [ ] **Step 3: File Upload Persistence**
