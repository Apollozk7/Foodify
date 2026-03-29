import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse } from 'next/server';

// Rotas públicas — não exigem sessão
const isPublicRoute = createRouteMatcher([
  '/',
  '/early-access',
  '/api/early-access(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // Se o usuário já está autenticado e tenta ir para login/cadastro,
  // só redirecionamos se ele realmente já tiver uma sessão completa.
  if (
    userId &&
    (pathname === '/early-access' || pathname === '/sign-in' || pathname === '/sign-up')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Sem sessão e fora de rota pública → /early-access
  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL('/early-access', req.url));
  }

  // Atualiza sessão Supabase
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
