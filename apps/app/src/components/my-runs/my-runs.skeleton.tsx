'use client';

import { Skeleton } from '@repo/design/components/ui/skeleton';
import { ProgressiveBlur } from '@repo/design/components/motion';

export function MyRunsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-12 space-y-3">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Filter Bar Skeleton */}
        <div className="mb-8">
          <div className="relative rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-32" />
              </div>
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </div>

        {/* Cards Grid Skeleton with ProgressiveBlur */}
        <ProgressiveBlur className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i} 
              className="rounded-lg border border-border bg-card p-6 space-y-4"
            >
              {/* Status badge */}
              <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-16" />
              </div>
              
              {/* Metadata */}
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>

              {/* Format badges */}
              <div className="flex gap-1.5">
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-6 w-14 rounded-md" />
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>

              {/* Results */}
              <div className="pt-4 border-t border-border/50">
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </ProgressiveBlur>
      </div>
    </div>
  );
}