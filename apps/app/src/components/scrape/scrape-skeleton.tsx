'use client';

import { Skeleton } from '@repo/design/components/ui/skeleton';
import { Card } from '@repo/design/components/ui/card';
import { ProgressiveBlur } from '@repo/design/components/motion';
import { SpinningText } from '@repo/design/components/motion';

export function ScrapeSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <section className="relative flex flex-col items-center justify-center px-6 py-24 text-center">
        {/* Background animation */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <SpinningText
            radius={250}
            fontSize={20}
            duration={30}
            className="font-mono text-primary"
          >
            LOADING • FIRESCRAPE • LOADING • FIRESCRAPE •
          </SpinningText>
        </div>

        <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
          {/* Title skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-12 w-96 mx-auto" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
          </div>

          {/* Main interface skeleton */}
          <ProgressiveBlur className="mx-auto max-w-4xl pt-8">
            <Card className="relative overflow-hidden">
              <div className="p-6">
                <div className="flex gap-2">
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 w-12" />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </Card>
          </ProgressiveBlur>

          {/* Features skeleton */}
          <div className="grid gap-4 pt-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-12 w-12 mx-auto rounded-lg" />
                <Skeleton className="h-4 w-24 mx-auto" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}