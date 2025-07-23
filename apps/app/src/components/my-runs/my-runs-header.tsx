'use client';

import { cn } from '@repo/design/lib/utils';
import { Button } from '@repo/design/components/ui/button';
import { CalendarCheck, CheckCircle } from '@phosphor-icons/react/dist/ssr';

interface RunsHeaderProps {
  filter: 'active' | 'archived';
  onFilterChange: (filter: 'active' | 'archived') => void;
}

export function RunsHeader({ filter, onFilterChange }: RunsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-display font-medium">My runs</h1>
      
      <div className="bg-background border border-border rounded-md h-8 p-0.5 flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-2 px-3 h-full text-sm font-medium rounded-sm transition-all duration-200",
            filter === 'active' 
              ? "bg-muted text-foreground" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
          onClick={() => onFilterChange('active')}
        >
          <CalendarCheck className="w-4 h-4" weight="duotone" />
          <span>Active</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-2 px-3 h-full text-sm font-medium rounded-sm transition-all duration-200",
            filter === 'archived' 
              ? "bg-muted text-foreground" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
          onClick={() => onFilterChange('archived')}
        >
          <CheckCircle className="w-4 h-4" weight="duotone" />
          <span>Archived</span>
        </Button>
      </div>
    </div>
  );
}