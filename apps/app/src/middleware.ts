import { authMiddleware } from "@repo/auth/middleware";

// Export directly to avoid type inference issues with Next.js versions
export default authMiddleware({
  additionalPublicRoutes: [
    '/home(.*)',
    '/api/webhooks(.*)',
  ],
}) as any;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};