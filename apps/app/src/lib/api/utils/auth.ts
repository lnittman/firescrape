import 'server-only';

import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@repo/auth/server';

import { ErrorType } from '../constants/error';

import { ApiError } from './error';

/**
 * Define the type for your authenticated route handler
 */
type AuthenticatedRouteHandler<TParams = any> = (
  request: NextRequest,
  // Make context generic to accept specific params types
  context: { params: TParams; userId: string } 
) => Promise<NextResponse | Response>; // Allow streaming Response

/**
 * Higher-order function to handle authentication.
 * It fetches the Clerk user ID and passes it to the wrapped handler.
 *
 * @param handler The actual route handler function to wrap.
 * @returns A new route handler that includes the authenticated userId in its context.
 */
export function withAuthenticatedUser<TParams = any>(handler: AuthenticatedRouteHandler<TParams>) {
  // The returned handler needs to accept the potentially undefined context from Next.js
  return async (request: NextRequest, context: { params?: TParams }) => {
    console.log('[Auth] Starting authentication check...');
    
    try {
      const authObject = await auth();
      console.log('[Auth] Auth object received:', { 
        hasUserId: !!authObject.userId, 
        userId: authObject.userId ? `${authObject.userId.substring(0, 8)}...` : null 
      });
      
      const userId = authObject.userId;

      if (!userId) {
        console.error('[Auth] No userId found in auth object');
        // This error will be caught by withErrorHandling
        throw new ApiError(ErrorType.AUTHENTICATION, 'User not authenticated.');
      }

      console.log('[Auth] Authentication successful, calling handler...');
      // Pass the userId to the actual handler
      return handler(request, { ...context, userId } as { params: TParams; userId: string });
    } catch (error) {
      console.error('[Auth] Authentication error:', error);
      throw error;
    }
  };
} 