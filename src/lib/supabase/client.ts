import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/env";

export const createClient = () => {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  // Se as chaves não existirem, retornamos um cliente "dummy" ou lidamos com o erro graciosamente
  // para evitar que o Next.js quebre no boot.
  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials missing. Some features will be disabled.");
    // Retornamos o cliente mesmo assim, o SDK lidará com os erros de request individualmente
    return createBrowserClient(
      supabaseUrl || "https://placeholder.supabase.co",
      supabaseKey || "placeholder"
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
};
