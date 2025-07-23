'use client';

import { Link } from 'next-view-transitions';
import { format } from 'date-fns';
import { cn } from '@repo/design/lib/utils';
import { 
  CalendarBlank,
  Timer,
  CheckCircle,
  XCircle,
  Spinner
} from '@phosphor-icons/react/dist/ssr';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/design/components/ui/tooltip';

type Scrape = {
  id: string;
  url: string;
  status: string;
  formats: string[];
  createdAt: Date;
  completedAt: Date | null;
  duration: number | null;
  error: string | null;
  metadata: any;
  markdown: string | null;
};

interface ScrapeListItemProps {
  run: Scrape;
  isHovered?: boolean;
  isDimmed?: boolean;
  onHover?: (id: string | null) => void;
}

export function ScrapeListItem({ run, isHovered, isDimmed, onHover }: ScrapeListItemProps) {
  const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
    PENDING: { icon: Spinner, color: 'text-muted-foreground', label: 'Pending' },
    PROCESSING: { icon: Spinner, color: 'text-primary', label: 'Processing' },
    COMPLETE: { icon: CheckCircle, color: 'text-success', label: 'Complete' },
    FAILED: { icon: XCircle, color: 'text-destructive', label: 'Failed' }
  };

  const status = statusConfig[run.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;

  const getDuration = () => {
    if (run.duration) {
      return `${(run.duration / 1000).toFixed(1)}s`;
    }
    return null;
  };

  return (
    <Link 
      href={`/r/${run.id}`}
      className={cn(
        "group block transition-all duration-200",
        isDimmed && "opacity-40"
      )}
      onMouseEnter={() => onHover?.(run.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className={cn(
        "flex items-center gap-4 py-3",
        "transition-all duration-200"
      )}>
        {/* Status Icon */}
        <div className="flex-shrink-0">
          <StatusIcon 
            size={20} 
            weight="fill"
            className={cn(
              status.color,
              run.status === 'PENDING' || run.status === 'PROCESSING' 
                ? "animate-spin" 
                : ""
            )}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* URL with gradient fade */}
          <div className="relative overflow-hidden">
            <p className="text-sm font-medium text-foreground whitespace-nowrap pr-8">
              {run.url}
            </p>
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          </div>
          
          {/* Metadata */}
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarBlank size={12} />
              <span>{format(new Date(run.createdAt), 'MMM d, HH:mm')}</span>
            </div>
            {getDuration() && (
              <div className="flex items-center gap-1">
                <Timer size={12} />
                <span>{getDuration()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Formats */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {run.formats.length === 1 ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
              {run.formats[0]}
            </span>
          ) : run.formats.length > 1 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary cursor-help">
                  {run.formats.length} formats
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-0.5">
                  {run.formats.map((format) => (
                    <div key={format} className="text-xs">
                      {format}
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          ) : null}
        </div>
      </div>
    </Link>
  );
}