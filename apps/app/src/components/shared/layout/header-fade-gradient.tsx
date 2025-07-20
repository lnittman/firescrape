'use client';

import { cn } from '@repo/design/lib/utils';

export function HeaderFadeGradient() {
  // Start gradient from the very top of the page
  // Navigation components have higher z-index (z-40, z-50) so they'll appear above
  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 h-32 pointer-events-none z-30",
        "bg-gradient-to-b from-background via-background/70 to-transparent"
      )}
    />
  );
}