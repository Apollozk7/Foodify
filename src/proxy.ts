import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { updateSession } from "@/lib/supabase/middleware";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/api/generate(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // 1. Protect routes with Clerk
  if (isProtectedRoute(req)) {
    await auth.protect();
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
