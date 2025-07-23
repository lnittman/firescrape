'use client';

import { 
  FunnelSimple, 
  CaretDown, 
  Check,
  SortAscending,
  SortDescending 
} from '@phosphor-icons/react/dist/ssr';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@repo/design/components/ui/dropdown-menu';
import { Button } from '@repo/design/components/ui/button';
import { cn } from '@repo/design/lib/utils';
import { SlidingNumber } from '@repo/design/components/motion';
import { TextRoll } from '@repo/design/components/motion';

interface ScrapesFilterProps {
  statusFilter: string;
  formatFilter: string;
  sortBy: 'newest' | 'oldest';
  onStatusChange: (status: string) => void;
  onFormatChange: (format: string) => void;
  onSortChange: (sort: 'newest' | 'oldest') => void;
  totalCount: number;
  filteredCount: number;
}

export function ScrapesFilter({
  statusFilter,
  formatFilter,
  sortBy,
  onStatusChange,
  onFormatChange,
  onSortChange,
  totalCount,
  filteredCount
}: ScrapesFilterProps) {
  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'FAILED', label: 'Failed' }
  ];

  const formats = [
    { value: 'all', label: 'All Formats' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'html', label: 'HTML' },
    { value: 'screenshot', label: 'Screenshot' },
    { value: 'json', label: 'JSON Data' }
  ];

  const activeFilters = (statusFilter !== 'all' ? 1 : 0) + (formatFilter !== 'all' ? 1 : 0);

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        {/* Status Filter */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <FunnelSimple className="w-4 h-4" />
                <TextRoll className="text-sm">
                  {statuses.find(s => s.value === statusFilter)?.label || 'All'}
                </TextRoll>
                <CaretDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {statuses.map((status) => (
                <DropdownMenuItem
                  key={status.value}
                  onClick={() => onStatusChange(status.value)}
                  className="gap-2"
                >
                  <div className={cn(
                    "w-4 h-4 flex items-center justify-center",
                    statusFilter === status.value ? "opacity-100" : "opacity-0"
                  )}>
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{status.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

        {/* Format Filter */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <FunnelSimple className="w-4 h-4" />
                <TextRoll className="text-sm">
                  {formats.find(f => f.value === formatFilter)?.label || 'All'}
                </TextRoll>
                <CaretDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              <DropdownMenuLabel>Filter by Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {formats.map((format) => (
                <DropdownMenuItem
                  key={format.value}
                  onClick={() => onFormatChange(format.value)}
                  className="gap-2"
                >
                  <div className={cn(
                    "w-4 h-4 flex items-center justify-center",
                    formatFilter === format.value ? "opacity-100" : "opacity-0"
                  )}>
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{format.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

        {/* Sort */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                {sortBy === 'newest' ? (
                  <SortDescending className="w-4 h-4" />
                ) : (
                  <SortAscending className="w-4 h-4" />
                )}
                <TextRoll className="text-sm">
                  {sortBy === 'newest' ? 'Newest First' : 'Oldest First'}
                </TextRoll>
                <CaretDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onSortChange('newest')}
                className="gap-2"
              >
                <div className={cn(
                  "w-4 h-4 flex items-center justify-center",
                  sortBy === 'newest' ? "opacity-100" : "opacity-0"
                )}>
                  <Check className="w-3 h-3" />
                </div>
                <span>Newest First</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSortChange('oldest')}
                className="gap-2"
              >
                <div className={cn(
                  "w-4 h-4 flex items-center justify-center",
                  sortBy === 'oldest' ? "opacity-100" : "opacity-0"
                )}>
                  <Check className="w-3 h-3" />
                </div>
                <span>Oldest First</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        {/* Active Filters Badge */}
        {activeFilters > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
            <FunnelSimple className="w-3 h-3" />
            <span className="tabular-nums">
              <SlidingNumber value={activeFilters} />
            </span>
            <span>active</span>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <span>Showing</span>
        <span className="font-medium text-foreground tabular-nums">
          <SlidingNumber value={filteredCount} />
        </span>
        <span>of</span>
        <span className="font-medium text-foreground tabular-nums">
          <SlidingNumber value={totalCount} />
        </span>
        <span>runs</span>
      </div>
    </div>
  );
}