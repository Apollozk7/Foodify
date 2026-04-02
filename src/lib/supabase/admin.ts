import { createClient } from '@supabase/supabase-js';
import { env } from '@/env';

// This client bypasses RLS and should ONLY be used in Server Components/Actions
// after strict authorization checks.
export const createAdminClient = () => {
  if (!env.SUPABASE_SECRET_KEY) {
    throw new Error('SUPABASE_SECRET_KEY is required for admin operations');
  }

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Convenience instance for legacy code
export const supabaseAdmin = createAdminClient();
