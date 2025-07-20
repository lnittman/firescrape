'use client';

import { Button } from '@repo/design/components/ui/button';
import { useEffect } from 'react';
import { parseError } from '@repo/observability/error';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error (parseError will capture it to Sentry)
    parseError(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Something went wrong</h1>
          <p className="text-muted-foreground">
            We've encountered an unexpected error. Our team has been notified.
          </p>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 rounded-lg bg-muted p-4 text-left">
            <summary className="cursor-pointer text-sm font-medium">
              Error details (development only)
            </summary>
            <pre className="mt-2 text-xs text-muted-foreground overflow-auto">
              {error.message}
              {error.stack && '\n\n' + error.stack}
            </pre>
          </details>
        )}
        
        <div className="flex gap-4 justify-center pt-4">
          <Button
            onClick={reset}
            variant="default"
          >
            Try again
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
          >
            Go home
          </Button>
        </div>
        
        {error.digest && (
          <p className="text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}