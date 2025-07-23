'use client';

import { useState } from 'react';
import { Link } from 'next-view-transitions';
import { format } from 'date-fns';
import { cn } from '@repo/design/lib/utils';
import { TextShimmer } from '@repo/design/components/motion';
import { AnimatedNumber } from '@repo/design/components/motion';
import { 
  LinkSimple,
  CalendarBlank,
  Timer,
  CheckCircle,
  WarningCircle,
  Spinner,
  Eye,
  Download
} from '@phosphor-icons/react/dist/ssr';

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

interface ScrapeCardProps {
  run: Scrape;
  onUpdate?: () => void;
}

export function ScrapeCard({ run, onUpdate }: ScrapeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const statusIcons: Record<string, React.ReactNode> = {
    PENDING: <Spinner className="w-4 h-4 animate-spin" />,
    PROCESSING: <Spinner className="w-4 h-4 animate-spin" />,
    COMPLETE: <CheckCircle className="w-4 h-4" weight="fill" />,
    FAILED: <WarningCircle className="w-4 h-4" weight="fill" />
  };

  const statusColors: Record<string, string> = {
    PENDING: 'text-muted-foreground',
    PROCESSING: 'text-primary',
    COMPLETE: 'text-success',
    FAILED: 'text-destructive'
  };

  const getDuration = () => {
    if (run.duration) {
      return `${(run.duration / 1000).toFixed(1)}s`;
    }
    return null;
  };

  const getResultCount = () => {
    return run.formats.length;
  };

  return (
    <div className="relative h-full">
      <Link 
          href={`/r/${run.id}`}
          className={cn(
            "group relative block h-full rounded-lg border border-border bg-card p-6",
            "transition-all duration-300",
            "hover:border-primary/20",
            "hover:bg-gradient-to-br hover:from-card hover:to-primary/5",
            "after:absolute after:inset-0 after:rounded-lg after:shadow-lg after:shadow-primary/5",
            "after:opacity-0 after:transition-opacity after:duration-300",
            "hover:after:opacity-100 after:-z-10"
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <div className={cn(
              "flex items-center gap-1.5 text-xs font-medium",
              statusColors[run.status]
            )}>
              {statusIcons[run.status]}
              <span>{run.status.charAt(0) + run.status.slice(1).toLowerCase()}</span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {/* URL with TextShimmer on hover */}
            <div className="pr-16">
              {isHovered ? (
                <TextShimmer 
                  className="text-sm font-medium text-foreground truncate"
                  duration={2}
                >
                  {run.url}
                </TextShimmer>
              ) : (
                <p className="text-sm font-medium text-foreground truncate">{run.url}</p>
              )}
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarBlank className="w-3.5 h-3.5" />
                <span>{format(new Date(run.createdAt), 'MMM d, HH:mm')}</span>
              </div>
              {getDuration() && (
                <div className="flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5" />
                  <span>{getDuration()}</span>
                </div>
              )}
            </div>

            {/* Formats */}
            <div className="flex flex-wrap gap-1.5">
              {run.formats.map((format) => (
                <span
                  key={format}
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
                    "bg-primary/10 text-primary border border-primary/20",
                    "transition-all duration-200",
                    isHovered && "bg-primary/20 border-primary/30"
                  )}
                >
                  {format}
                </span>
              ))}
            </div>

            {/* Results Count with AnimatedNumber */}
            {run.status === 'COMPLETE' && (
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Eye className="w-3.5 h-3.5" />
                  <span>
                    <AnimatedNumber 
                      value={getResultCount()} 
                      className="inline-block tabular-nums"
                    /> results
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-primary">
                  <Download className="w-3.5 h-3.5" />
                  <span>View</span>
                </div>
              </div>
            )}
          </div>

          {/* Hover effect gradient */}
          <div className={cn(
            "absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 transition-opacity duration-300",
            isHovered && "opacity-100"
          )} />
        </Link>
    </div>
  );
}