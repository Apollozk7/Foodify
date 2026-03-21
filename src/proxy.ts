import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse } from "next/server";

const isEarlyAccessRoute = createRouteMatcher([
  "/early-access",
  "/api/early-access(.*)"
]);

// Apenas quem já está autenticado pode acessar rotas não protegidas pelo Early Access
export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Se o usuário não estiver logado E não estiver na rota de early access, redireciona para lá
  if (!userId && !isEarlyAccessRoute(req)) {
    const earlyAccessUrl = new URL("/early-access", req.url);
    return NextResponse.redirect(earlyAccessUrl);
  }

  // 2. Update Supabase session
  return await updateSession(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
