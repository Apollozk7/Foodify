import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { updateSession } from "@/lib/supabase/middleware";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // 1. Protect all routes except public ones
  if (!isPublicRoute(req)) {
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
