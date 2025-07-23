'use client';

import { useState, useEffect } from 'react';

import { 
  ArrowLeft, 
  Trash,
  Clock,
  Globe,
  CheckCircle,
  XCircle,
  Spinner,
  Info,
  Warning,
  Copy,
  Check
} from '@phosphor-icons/react/dist/ssr';
import { format } from 'date-fns';
import { Link, useTransitionRouter } from 'next-view-transitions';

import { Button } from '@repo/design/components/ui/button';
import { cn } from '@repo/design/lib/utils';
import { TextScramble } from '@repo/design/components/motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/design/components/ui/tooltip';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@repo/design/components/ui/hover-card';
import { toast } from 'sonner';

import { useScrapeDetail } from '@/hooks/swr/scrape/useScrapeDetail';

import { ResultsViewer } from './results-viewer';

interface RunDetailClientProps {
  run: any; // Using any to match the service return type
}

export function RunDetailClient({ run: initialRun }: RunDetailClientProps) {
  const router = useTransitionRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [contentRevealed, setContentRevealed] = useState(false);
  const [copiedError, setCopiedError] = useState(false);
  
  // Use SWR with streaming for real-time updates
  const { scrape, isStreaming, progress, mutate } = useScrapeDetail(initialRun.id, initialRun);
  
  // Use the latest data from SWR, falling back to initial data
  const run = scrape || initialRun;
  
  // Force re-render when streaming completes
  useEffect(() => {
    if (!isStreaming && run.status === 'COMPLETE') {
      mutate();
    }
  }, [isStreaming, run.status, mutate]);

  // Trigger content reveal animation
  useEffect(() => {
    const timer = setTimeout(() => setContentRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this run?')) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/runs/${run.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        router.push('/my-runs');
      }
    } catch (error) {
      console.error('Failed to delete run:', error);
      setIsDeleting(false);
    }
  };

  const copyErrorToClipboard = async () => {
    if (run.error) {
      try {
        await navigator.clipboard.writeText(run.error);
        setCopiedError(true);
        toast.success("Error copied to clipboard!");
        setTimeout(() => setCopiedError(false), 2000);
      } catch (error) {
        toast.error("Failed to copy error");
      }
    }
  };

  const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
    PENDING: { icon: Spinner, color: 'text-muted-foreground', label: 'Pending' },
    PROCESSING: { icon: Spinner, color: 'text-primary', label: 'Processing' },
    COMPLETE: { icon: CheckCircle, color: 'text-success', label: 'Complete' },
    FAILED: { icon: XCircle, color: 'text-destructive', label: 'Failed' }
  };

  const status = statusConfig[run.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;

  return (
    <div className="min-h-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32 space-y-6">
          {/* Header with URL and actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/my-runs">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 border border-border hover:border-primary/20"
                    >
                      <ArrowLeft size={16} weight="duotone" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Back</p>
                </TooltipContent>
              </Tooltip>
              
              <h1 className="text-2xl font-display font-medium truncate" style={{ fontFamily: "'Louize Display', system-ui, sans-serif" }}>
                {run.url}
              </h1>
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="h-8 w-8 gap-2 text-destructive hover:text-destructive hover:bg-red-500/10 border border-border hover:border-destructive/20 transition-all duration-200"
                >
                  <Trash size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Run details card */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            {/* Status first */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                    <Info size={14} weight="duotone" />
                    <span>Status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon 
                      size={16} 
                      weight="fill"
                      className={cn(
                        status.color,
                        run.status === 'PENDING' || run.status === 'PROCESSING' 
                          ? "animate-spin" 
                          : ""
                      )}
                    />
                    <span className="text-sm font-medium text-foreground">
                      {contentRevealed ? (
                        <TextScramble duration={0.4} speed={0.02} trigger={true}>
                          {status.label}
                        </TextScramble>
                      ) : (
                        <span className="opacity-20">{status.label.replace(/./g, '█')}</span>
                      )}
                    </span>
                  </div>
                </div>
                
                {/* Error tile - right aligned */}
                {run.error && run.status === 'FAILED' && (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "h-7 px-2 gap-1.5 text-xs border-destructive/30 bg-destructive/5 hover:bg-destructive/10",
                              "transition-all duration-300",
                              contentRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                            )}
                            onClick={copyErrorToClipboard}
                          >
                            <Warning size={14} weight="duotone" className="text-destructive" />
                            {contentRevealed ? (
                              <TextScramble duration={0.6} speed={0.02} trigger={true}>
                                Error
                              </TextScramble>
                            ) : (
                              <span className="opacity-20">Error</span>
                            )}
                            {copiedError ? (
                              <Check size={12} className="text-green-500" />
                            ) : (
                              <Copy size={12} className="text-muted-foreground" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs break-words">
                            {copiedError ? 'Copied!' : run.error || 'Click to copy'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Warning size={16} className="text-destructive" />
                          <span className="font-medium text-sm">Error Details</span>
                        </div>
                        <div className="text-sm text-muted-foreground break-words">
                          {run.error}
                        </div>
                        {run.errorCode && (
                          <div className="text-xs text-muted-foreground">
                            Error Code: <span className="font-mono">{run.errorCode}</span>
                          </div>
                        )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                )}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock size={16} />
                    <span>Started</span>
                  </div>
                  <p className="text-sm font-medium">
                    {contentRevealed ? (
                      <TextScramble duration={0.6} speed={0.02} trigger={true}>
                        {format(new Date(run.createdAt), 'MMM d, yyyy • h:mm a')}
                      </TextScramble>
                    ) : (
                      <span className="opacity-20">{format(new Date(run.createdAt), 'MMM d, yyyy • h:mm a').replace(/./g, '█')}</span>
                    )}
                  </p>
                </div>
                
                {run.duration && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Clock size={16} />
                      <span>Duration</span>
                    </div>
                    <p className="text-sm font-medium">
                      {contentRevealed ? (
                        <TextScramble duration={0.4} speed={0.02} trigger={true}>
                          {`${(run.duration / 1000).toFixed(1)}s`}
                        </TextScramble>
                      ) : (
                        <span className="opacity-20">{`${(run.duration / 1000).toFixed(1)}s`.replace(/./g, '█')}</span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Formats */}
              {run.formats && run.formats.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground mb-2">Formats</div>
                  <div className="flex flex-wrap gap-2">
                    {run.formats.map((format: string, index: number) => (
                      <span
                        key={format}
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                      >
                        {contentRevealed ? (
                          <TextScramble duration={0.3} speed={0.02} trigger={true}>
                            {format}
                          </TextScramble>
                        ) : (
                          <span className="opacity-20">{format.replace(/./g, '█')}</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              
            </div>
          </div>

          {/* Results - always show viewer, handle loading state inside */}
          <ResultsViewer 
            key={`${run.id}-${run.status}-${run.completedAt || ''}`}
            results={{
              markdown: run.markdown || undefined,
              html: run.html || undefined,
              rawHtml: run.rawHtml || undefined,
              metadata: run.metadata as any || undefined,
              links: run.links as string[] || undefined,
              screenshotUrl: run.screenshotUrl || undefined,
              json: run.json || undefined,
            }}
            isLoading={run.status === 'PENDING' || run.status === 'PROCESSING'}
            status={run.status}
            scrapedUrl={run.url}
            runId={run.id}
          />
      </div>
    </div>
  );
}