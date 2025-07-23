'use client';

import { Button } from '@repo/design/components/ui/button';

// Avoid shadowing the global Error object by renaming the component
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="font-bold text-4xl">Something went wrong</h1>
          <p className="font-bold text-muted-foreground">
            We've encountered an unexpected error. Please try again.
          </p>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button
            onClick={reset}
            variant="default"
          >
            Try again
          </Button>
          <Button
            onClick={() => { window.location.href = '/sign-in'; }}
            variant="outline"
          >
            Sign in
          </Button>
        </div>

        {error.digest && (
          <p className="text-muted-foreground text-xs">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}