import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export interface AuthMiddlewareConfig {
  /**
   * Routes that require authentication
   * @default ['(.*)'] - All routes protected by default
   */
  protectedRoutes?: string[];
  
  /**
   * Routes that are publicly accessible
   * @default ['/sign-in(.*)', '/sign-up(.*)']
   */
  publicRoutes?: string[];
  
  /**
   * Additional public routes specific to your app
   */
  additionalPublicRoutes?: string[];
  
  /**
   * Callback to run after auth checks
   */
  afterAuth?: (req: NextRequest) => NextResponse | void;
}

const defaultProtectedRoutes = ['(.*)'];
const defaultPublicRoutes = [
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/sso-callback(.*)',
  '/api/webhooks(.*)',
  '/_next(.*)',
  '/favicon.ico',
  '/images(.*)',
  '/home(.*)',
  '/manifest.webmanifest',
  '/offline.html',
  '/sw.js'
];

export function authMiddleware(config: AuthMiddlewareConfig = {}) {
  const {
    protectedRoutes = defaultProtectedRoutes,
    publicRoutes = defaultPublicRoutes,
    additionalPublicRoutes = [],
    afterAuth
  } = config;
  
  const allPublicRoutes = [...publicRoutes, ...additionalPublicRoutes];
  
  const isProtectedRoute = createRouteMatcher(protectedRoutes);
  const isPublicRoute = createRouteMatcher(allPublicRoutes);
  
  return clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();
    
    // Handle auth pages (sign-in/sign-up) - redirect to home if already authenticated
    const isAuthPage = req.nextUrl.pathname.startsWith('/sign-in') || 
                       req.nextUrl.pathname.startsWith('/sign-up');
    
    if (isAuthPage && userId) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    // Allow access to public routes without authentication
    if (isPublicRoute(req)) {
      return afterAuth?.(req) ?? NextResponse.next();
    }
    
    // Protect all other routes - require authentication
    if (!userId && isProtectedRoute(req)) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
    
    return afterAuth?.(req) ?? NextResponse.next();
  });
}