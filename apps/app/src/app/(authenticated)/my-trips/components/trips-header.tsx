'use client';

import { useState } from 'react';
import { CheckCircle, CalendarCheck } from '@phosphor-icons/react/dist/ssr';
import { cn } from '@repo/design/lib/utils';

type TripsHeaderProps = {
  userId?: string;
  filter: 'planned' | 'completed';
  onFilterChange: (filter: 'planned' | 'completed') => void;
};

export default function TripsHeader({ userId, filter, onFilterChange }: TripsHeaderProps) {
  return (
    <div className="flex flex-col gap-2 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-medium">My trips</h1>
        </div>
        
        {/* Filter Toggle */}
        <div className="flex items-center bg-background border border-border rounded-lg p-1 gap-1">
          <button
            onClick={() => onFilterChange('planned')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
              filter === 'planned'
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <CalendarCheck className="w-4 h-4" weight="duotone" />
            <span>Planned</span>
          </button>
          <button
            onClick={() => onFilterChange('completed')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
              filter === 'completed'
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <CheckCircle className="w-4 h-4" weight="duotone" />
            <span>Completed</span>
          </button>
        </div>
      </div>
    </div>
  );
}