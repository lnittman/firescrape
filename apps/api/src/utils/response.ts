import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { ErrorType } from '../constants/error';
import { ApiError, handleZodError } from './error';

export class ApiResponse {
  /**
   * Create a successful API response
   * @param data - The data to include in the response
   * @param status - The HTTP status code (default: 200)
   * @returns A NextResponse object with the success flag and data
   */
  static success<T>(data: T, status = 200, cacheSeconds?: number) {
    const headers: HeadersInit = {};
    
    // Add cache headers if specified
    if (cacheSeconds) {
      headers['Cache-Control'] = `public, s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds * 2}`;
    } else {
      // Default cache for GET requests
      headers['Cache-Control'] = 'public, s-maxage=60, stale-while-revalidate=120';
    }
    
    return NextResponse.json(
      { success: true, data },
      { status, headers }
    );
  }

  /**
   * Create an error API response
   * @param error - The error to include in the response
   * @returns A NextResponse object with the error flag and error details
   */
  static error(error: ApiError) {
    return NextResponse.json(
      {
        success: false,
        ...error.toResponse()
      },
      { status: error.status }
    );
  }
}



/**
 * Wrapper for route handlers to simplify error handling
 * @param handler The route handler function
 * @returns A wrapped handler function with error handling
 */
export function withErrorHandling(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      // Log all errors for debugging
      console.error('[API Error]', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        handler: handler.name || 'anonymous',
        timestamp: new Date().toISOString()
      });
      
      if (error instanceof ApiError) {
        return ApiResponse.error(error);
      }
      
      if (error instanceof ZodError) {
        return ApiResponse.error(handleZodError(error));
      }
      
      return ApiResponse.error(new ApiError(ErrorType.SERVER_ERROR));
    }
  };
}


