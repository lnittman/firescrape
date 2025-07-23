'use client';

import { Link } from 'next-view-transitions';
import { cn } from '@repo/design/lib/utils';

interface EmptyStateProps {
  filter: 'active' | 'archived';
}

export function EmptyState({ filter }: EmptyStateProps) {
  return (
    <div 
      className="flex items-center justify-center"
      style={{ height: 'calc(100vh - 12rem)' }}
    >
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/50">
          <span className="text-4xl">🕸️</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            No {filter === 'active' ? 'active' : 'archived'} runs
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {filter === 'active' 
              ? "Start scraping to see your active runs here."
              : "Your archived runs will appear here."}
          </p>
        </div>
        <div className="flex justify-center">
          <Link href="/">
            <button
              className={cn(
                "flex h-9 items-center gap-2 px-4 py-2 text-sm font-medium font-mono text-muted-foreground hover:text-foreground transition-all duration-200 rounded-md border border-border hover:border-foreground/20 hover:bg-accent",
                "focus:outline-none select-none"
              )}
            >
              <span>Start scraping</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}