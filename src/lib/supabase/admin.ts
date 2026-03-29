import { createClient } from '@supabase/supabase-js';
import { env } from '@/env';

/**
 * Supabase client with administrative permissions using the new secret key.
 * Used for server-side operations that bypass Row Level Security (RLS).
 *
 * NEVER expose this key or use this client in the browser.
 */
export const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SECRET_KEY || 'placeholder',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
