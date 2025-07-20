'use client';

import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Button } from '@repo/design/components/ui/button';
import { parseError } from '@repo/observability/error';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function DefaultErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Oops! Something went wrong</h2>
          <p className="text-sm text-muted-foreground">
            We've encountered an error. Please try again.
          </p>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 rounded-lg bg-muted p-4 text-left">
            <summary className="cursor-pointer text-sm font-medium">
              Error details
            </summary>
            <pre className="mt-2 text-xs text-muted-foreground overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
        
        <Button
          onClick={resetErrorBoundary}
          variant="default"
          size="sm"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKeys?: Array<unknown>;
}

export function ErrorBoundary({
  children,
  fallback,
  onError,
  resetKeys,
}: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={fallback || DefaultErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Error boundary caught:', error);
        parseError(error);
        onError?.(error, errorInfo);
      }}
      resetKeys={resetKeys}
    >
      {children}
    </ReactErrorBoundary>
  );
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}