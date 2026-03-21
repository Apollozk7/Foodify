import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";

/**
 * Public Supabase client for client-side operations.
 * Uses the anonymous key and is restricted by RLS.
 */
export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);
