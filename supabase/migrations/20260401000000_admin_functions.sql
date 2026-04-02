-- Migration: 20260401000000_admin_functions.sql
-- Provides secure functions for administrative tasks

CREATE OR REPLACE FUNCTION admin_adjust_credits(
  p_clerk_id TEXT, 
  p_amount INTEGER, 
  p_reason TEXT
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles 
  SET credits = credits + p_amount 
  WHERE clerk_id = p_clerk_id;
  
  -- Record the adjustment in transactions
  -- Note: user_id lookup is done internally for security
  INSERT INTO public.transactions (user_id, stripe_session_id, credits_added, amount_brl)
  SELECT id, 'admin_adj_' || gen_random_uuid(), p_amount, 0
  FROM public.profiles
  WHERE clerk_id = p_clerk_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
