import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse } from 'next/server';

// Rotas públicas — não exigem sessão
const isPublicRoute = createRouteMatcher([
  '/',
  '/early-access',
  '/api/early-access(.*)',
  '/api/webhooks(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // Se o usuário já está autenticado e tenta ir para landing ou auth
  if (
    userId &&
    (pathname === '/' ||
      pathname === '/early-access' ||
      pathname === '/sign-in' ||
      pathname === '/sign-up')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Sem sessão e fora de rota pública → /
  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL('/', req.url));
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
