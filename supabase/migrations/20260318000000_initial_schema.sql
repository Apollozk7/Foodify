-- Initial schema for Apetit
-- Migration: 20260318000000_initial_schema.sql

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create PROFILES table
-- Stores user information synced from Clerk and credit balance
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL UNIQUE,
    credits INTEGER NOT NULL DEFAULT 5 CHECK (credits >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create GENERATIONS table
-- Stores image generation requests and results
CREATE TABLE IF NOT EXISTS public.generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    fal_request_id TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'done', 'failed')),
    input_image_url TEXT,
    output_image_url TEXT,
    user_prompt TEXT NOT NULL,
    refined_prompt TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create TRANSACTIONS table
-- Stores credit purchase history via Stripe
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    stripe_session_id TEXT NOT NULL UNIQUE,
    credits_added INTEGER NOT NULL CHECK (credits_added > 0),
    amount_brl NUMERIC(10, 2) NOT NULL CHECK (amount_brl >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create PROMPT_TEMPLATES table
-- Stores pre-defined prompts for different categories and styles
CREATE TABLE IF NOT EXISTS public.prompt_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    style TEXT NOT NULL,
    base_prompt TEXT NOT NULL,
    negative_prompt TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Profiles: Users can see, update, and create their own profile
CREATE POLICY "user sees own profile" 
    ON public.profiles 
    FOR SELECT 
    USING (clerk_id = auth.uid()::text);

CREATE POLICY "user updates own profile" 
    ON public.profiles 
    FOR UPDATE 
    USING (clerk_id = auth.uid()::text);

CREATE POLICY "user can insert own profile" 
    ON public.profiles 
    FOR INSERT 
    WITH CHECK (clerk_id = auth.uid()::text);

-- Generations: Users can see and manage their own generations
CREATE POLICY "user sees own generations" 
    ON public.generations 
    FOR SELECT 
    USING (user_id = (SELECT id FROM public.profiles WHERE clerk_id = auth.uid()::text));

CREATE POLICY "user inserts own generations" 
    ON public.generations 
    FOR INSERT 
    WITH CHECK (user_id = (SELECT id FROM public.profiles WHERE clerk_id = auth.uid()::text));

CREATE POLICY "user updates own generations" 
    ON public.generations 
    FOR UPDATE 
    USING (user_id = (SELECT id FROM public.profiles WHERE clerk_id = auth.uid()::text));

CREATE POLICY "user deletes own generations" 
    ON public.generations 
    FOR DELETE 
    USING (user_id = (SELECT id FROM public.profiles WHERE clerk_id = auth.uid()::text));

-- Transactions: Users can see their own transactions
CREATE POLICY "user sees own transactions" 
    ON public.transactions 
    FOR SELECT 
    USING (user_id = (SELECT id FROM public.profiles WHERE clerk_id = auth.uid()::text));

-- Prompt Templates: Readable by all authenticated users, only writable by admins (not implemented yet, so public read)
CREATE POLICY "prompt templates are readable by all authenticated users" 
    ON public.prompt_templates 
    FOR SELECT 
    TO authenticated 
    USING (true);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON public.generations(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_category ON public.prompt_templates(category);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_active ON public.prompt_templates(active) WHERE active = true;

-- RPCs FOR ATOMIC CREDIT MANAGEMENT

-- 1. Consume user credits atomically
CREATE OR REPLACE FUNCTION consume_user_credits(p_clerk_id TEXT, p_amount INTEGER)
RETURNS TABLE (success BOOLEAN, remaining_credits INTEGER) AS $$
DECLARE
  v_current_credits INTEGER;
BEGIN
  -- Select for update to lock the row and prevent race conditions
  SELECT credits INTO v_current_credits FROM profiles WHERE clerk_id = p_clerk_id FOR UPDATE;
  
  IF v_current_credits >= p_amount THEN
    UPDATE profiles SET credits = credits - p_amount WHERE clerk_id = p_clerk_id
    RETURNING credits INTO v_current_credits;
    RETURN QUERY SELECT TRUE, v_current_credits;
  ELSE
    RETURN QUERY SELECT FALSE, v_current_credits;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Refund user credits atomically
CREATE OR REPLACE FUNCTION refund_user_credits(p_clerk_id TEXT, p_amount INTEGER)
RETURNS TABLE (success BOOLEAN, remaining_credits INTEGER) AS $$
DECLARE
  v_current_credits INTEGER;
BEGIN
  -- Select for update to lock the row
  SELECT credits INTO v_current_credits FROM profiles WHERE clerk_id = p_clerk_id FOR UPDATE;
  
  IF v_current_credits IS NOT NULL THEN
  UPDATE profiles SET credits = credits + p_amount WHERE clerk_id = p_clerk_id
  RETURNING credits INTO v_current_credits;
  RETURN QUERY SELECT TRUE, v_current_credits;
  ELSE
  RETURN QUERY SELECT FALSE, NULL;
  END IF;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  -- 3. Handle generation failure and refund atomically
  -- Sets the generation status to 'failed' ONLY IF it is currently 'pending' or 'processing'
  -- Refunds 1 credit to the user profile
  CREATE OR REPLACE FUNCTION handle_generation_failure(p_generation_id UUID, p_clerk_id TEXT)
  RETURNS TABLE (success BOOLEAN, remaining_credits INTEGER) AS $$
  DECLARE
  v_user_id UUID;
  v_current_status TEXT;
  v_current_credits INTEGER;
  BEGIN
  -- 1. Get user and lock row
  SELECT id, credits INTO v_user_id, v_current_credits 
  FROM profiles 
  WHERE clerk_id = p_clerk_id 
  FOR UPDATE;

  IF v_user_id IS NULL THEN
  RETURN QUERY SELECT FALSE, NULL;
  RETURN;
  END IF;

  -- 2. Check generation status and lock row
  SELECT status INTO v_current_status 
  FROM generations 
  WHERE id = p_generation_id AND user_id = v_user_id 
  FOR UPDATE;

  -- 3. Only proceed if status is 'pending' or 'processing'
  IF v_current_status IN ('pending', 'processing') THEN
  -- Update generation status
  UPDATE generations SET status = 'failed' WHERE id = p_generation_id;

  -- Refund credit
  UPDATE profiles SET credits = credits + 1 WHERE id = v_user_id
  RETURNING credits INTO v_current_credits;

  RETURN QUERY SELECT TRUE, v_current_credits;
  ELSE
  -- Already processed, failed, or in progress
  RETURN QUERY SELECT FALSE, v_current_credits;
  END IF;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Add user credits atomically (Top-up)
-- This RPC is idempotent: it checks if the stripe_session_id already exists in transactions
CREATE OR REPLACE FUNCTION add_user_credits(
  p_clerk_id TEXT, 
  p_stripe_session_id TEXT, 
  p_credits_added INTEGER, 
  p_amount_brl NUMERIC
)
RETURNS TABLE (success BOOLEAN, total_credits INTEGER) AS $$
DECLARE
  v_user_id UUID;
  v_new_credits INTEGER;
  v_transaction_exists BOOLEAN;
BEGIN
  -- 1. Check if transaction already exists (idempotency)
  SELECT EXISTS (
    SELECT 1 FROM public.transactions WHERE stripe_session_id = p_stripe_session_id
  ) INTO v_transaction_exists;

  IF v_transaction_exists THEN
    -- If transaction exists, we just return the current credits and FALSE for success (already fulfilled)
    SELECT credits INTO v_new_credits FROM public.profiles WHERE clerk_id = p_clerk_id;
    RETURN QUERY SELECT FALSE, v_new_credits;
    RETURN;
  END IF;

  -- 2. Lock the user profile row and get the internal ID
  SELECT id, credits INTO v_user_id, v_new_credits 
  FROM public.profiles 
  WHERE clerk_id = p_clerk_id 
  FOR UPDATE;

  IF v_user_id IS NULL THEN
    RETURN QUERY SELECT FALSE, NULL;
    RETURN;
  END IF;

  -- 3. Update user credits
  UPDATE public.profiles 
  SET credits = credits + p_credits_added 
  WHERE id = v_user_id
  RETURNING credits INTO v_new_credits;

  -- 4. Insert transaction record
  INSERT INTO public.transactions (user_id, stripe_session_id, credits_added, amount_brl)
  VALUES (v_user_id, p_stripe_session_id, p_credits_added, p_amount_brl);

  RETURN QUERY SELECT TRUE, v_new_credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

