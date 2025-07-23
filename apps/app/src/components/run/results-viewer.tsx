"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@repo/design/components/ui/button";
import { ScrollArea } from "@repo/design/components/ui/scroll-area";
import {
  Copy,
  Download,
  Check,
  FileText,
  Code,
  Image as ImageIcon,
  Database,
  Link,
  CaretDown,
  Spinner
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@repo/design/lib/utils";
import { toast } from "sonner";
import type { ScrapeResult } from "@/atoms/scrape";
import { TextEffect, TextScramble } from '@repo/design/components/motion';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/design/components/ui/dropdown-menu";
import { MarkdownWithGlimpse } from './markdown-with-glimpse';

interface ResultsViewerProps {
  results: ScrapeResult;
  className?: string;
  isLoading?: boolean;
  status?: string;
  scrapedUrl?: string;
  runId?: string;
}

export function ResultsViewer({ results, className, isLoading = false, status, scrapedUrl, runId }: ResultsViewerProps) {
  const [copied, setCopied] = useState(false);
  const [activeFormat, setActiveFormat] = useState(() => {
    // Set initial format based on available data
    if (results.markdown) return 'markdown';
    if (results.html) return 'html';
    if (results.metadata) return 'metadata';
    if (results.screenshotUrl) return 'screenshot';
    return 'markdown';
  });
  const [contentRevealed, setContentRevealed] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(status === 'COMPLETE' || status === 'FAILED');
  const contentRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const downloadContent = async () => {
    try {
      // Create a sanitized filename from the URL
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      
      // Get the original URL from the run data if available
      let siteName = 'scrape';
      const urlToUse = scrapedUrl;
      if (urlToUse) {
        try {
          const scrapeUrl = new URL(urlToUse);
          siteName = scrapeUrl.hostname.replace(/^www\./, '').replace(/\./g, '-');
        } catch {}
      }
      
      const folderName = `${siteName}-${timestamp}`;
      
      // Create a dynamic import for JSZip
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Add all available formats to the zip
      if (results.markdown) {
        zip.file(`${folderName}/content.md`, results.markdown);
      }
      if (results.html) {
        zip.file(`${folderName}/content.html`, results.html);
      }
      if (results.rawHtml) {
        zip.file(`${folderName}/raw.html`, results.rawHtml);
      }
      if (results.metadata) {
        zip.file(`${folderName}/metadata.json`, JSON.stringify(results.metadata, null, 2));
      }
      if (results.links && results.links.length > 0) {
        zip.file(`${folderName}/links.txt`, results.links.join('\n'));
      }
      if (results.json) {
        zip.file(`${folderName}/structured.json`, JSON.stringify(results.json, null, 2));
      }
      
      // Download and add screenshot if available
      if (results.screenshotUrl) {
        try {
          const response = await fetch(results.screenshotUrl);
          if (response.ok) {
            const blob = await response.blob();
            zip.file(`${folderName}/screenshot.png`, blob);
          }
        } catch (error) {
          console.error('Failed to download screenshot:', error);
        }
      }
      
      // Add a README file with scrape info
      const readme = `# Scrape Results
      
URL: ${urlToUse || 'Unknown'}
Date: ${new Date().toLocaleString()}
Run ID: ${runId || 'Unknown'}

## Files Included
${results.markdown ? '- content.md: Main content in Markdown format\n' : ''}${results.html ? '- content.html: Cleaned HTML content\n' : ''}${results.rawHtml ? '- raw.html: Original HTML content\n' : ''}${results.metadata ? '- metadata.json: Page metadata and details\n' : ''}${results.links ? '- links.txt: All links found on the page\n' : ''}${results.json ? '- structured.json: Structured data extraction\n' : ''}${results.screenshotUrl ? '- screenshot.png: Visual capture of the page\n' : ''}`;
      
      zip.file(`${folderName}/README.md`, readme);
      
      // Generate and download the zip
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${folderName}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success("Download started!");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to create download");
    }
  };

  const availableFormats = [
    results.markdown && { id: 'markdown', label: 'Markdown', icon: FileText },
    results.html && { id: 'html', label: 'HTML', icon: Code },
    results.rawHtml && { id: 'rawHtml', label: 'Raw HTML', icon: Code },
    results.metadata && { id: 'metadata', label: 'Metadata', icon: Database },
    results.links && results.links.length > 0 && { id: 'links', label: 'Links', icon: Link },
    results.screenshotUrl && { id: 'screenshot', label: 'Screenshot', icon: ImageIcon },
    results.json && { id: 'json', label: 'JSON', icon: Database },
  ].filter(Boolean) as Array<{ id: string; label: string; icon: any }>;

  const currentFormat = availableFormats.find(f => f.id === activeFormat);

  // Get content for copy operation
  const getContentForCopy = () => {
    switch (activeFormat) {
      case 'markdown':
        return results.markdown || '';
      case 'html':
        return results.html || '';
      case 'rawHtml':
        return results.rawHtml || '';
      case 'metadata':
        return JSON.stringify(results.metadata, null, 2);
      case 'links':
        return results.links?.join('\n') || '';
      case 'json':
        return JSON.stringify(results.json, null, 2);
      default:
        return '';
    }
  };

  // Trigger content reveal animation
  useEffect(() => {
    setContentRevealed(false);
    const timer = setTimeout(() => setContentRevealed(true), 100);
    return () => clearTimeout(timer);
  }, [activeFormat]);

  // Track when status changes to complete or failed
  useEffect(() => {
    if ((status === 'COMPLETE' || status === 'FAILED') && !hasCompleted) {
      setHasCompleted(true);
      setContentRevealed(false);
      const timer = setTimeout(() => setContentRevealed(true), 100);
      return () => clearTimeout(timer);
    }
  }, [status, hasCompleted]);

  // Force re-render when results change
  useEffect(() => {
    if (hasCompleted && results && Object.keys(results).some(key => results[key as keyof ScrapeResult])) {
      setContentRevealed(false);
      const timer = setTimeout(() => setContentRevealed(true), 50);
      return () => clearTimeout(timer);
    }
  }, [results, hasCompleted]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Sticky header that stays fixed while scrolling */}
      <div className="sticky top-0 z-10 bg-background pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-medium">Results</h1>
          
          <div className="flex items-center gap-2">
            {/* Format selector first to prevent layout shift */}
            {availableFormats.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 border border-border hover:border-primary/20"
                    disabled={isLoading || !hasCompleted}
                  >
                    {currentFormat && (
                      <>
                        <currentFormat.icon size={16} weight="duotone" />
                        <span className="text-sm">{currentFormat.label}</span>
                      </>
                    )}
                    <CaretDown size={14} weight="bold" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {availableFormats.map((format) => (
                    <DropdownMenuItem
                      key={format.id}
                      onClick={() => setActiveFormat(format.id)}
                      className="gap-2"
                    >
                      <format.icon size={16} weight="duotone" />
                      <span>{format.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {/* Copy & Download buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 border border-border hover:border-primary/20"
              onClick={() => copyToClipboard(getContentForCopy())}
              disabled={isLoading || !hasCompleted}
            >
              {copied ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <Copy size={16} />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 border border-border hover:border-primary/20"
              onClick={downloadContent}
              disabled={isLoading || !hasCompleted}
            >
              <Download size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Content area with clean borders */}
      <div className="border border-border rounded-lg overflow-hidden bg-background">
        {/* Loading state */}
        {(isLoading || !hasCompleted) && (
          <div className="p-6 text-center text-muted-foreground">
            <Spinner className="w-6 h-6 animate-spin mx-auto mb-2" />
            <p className="text-sm">Processing scrape...</p>
          </div>
        )}
        {/* Failed state */}
        {status === 'FAILED' && hasCompleted && (
          <div className="p-6 text-center text-muted-foreground">
            <p className="text-sm">Scrape failed. Check the error details above.</p>
          </div>
        )}
        {/* Markdown view */}
        {activeFormat === 'markdown' && results.markdown && hasCompleted && !isLoading && (
          <motion.div 
            className="p-6" 
            ref={contentRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: contentRevealed ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <MarkdownWithGlimpse 
              content={results.markdown}
              className="prose prose-sm dark:prose-invert max-w-none"
            />
          </motion.div>
        )}

        {/* HTML view */}
        {activeFormat === 'html' && results.html && hasCompleted && !isLoading && (
          <div className="p-6">
            <pre className="text-xs overflow-x-auto">
              <code>
                {contentRevealed ? (
                  <TextEffect
                    per="line"
                    preset="blur"
                    speedReveal={8}
                    speedSegment={5}
                  >
                    {results.html}
                  </TextEffect>
                ) : (
                  <span className="opacity-0">{results.html}</span>
                )}
              </code>
            </pre>
          </div>
        )}

        {/* Raw HTML view */}
        {activeFormat === 'rawHtml' && results.rawHtml && hasCompleted && !isLoading && (
          <div className="p-6">
            <pre className="text-xs overflow-x-auto">
              <code>
                {contentRevealed ? (
                  <TextEffect
                    per="line"
                    preset="blur"
                    speedReveal={8}
                    speedSegment={5}
                  >
                    {results.rawHtml}
                  </TextEffect>
                ) : (
                  <span className="opacity-0">{results.rawHtml}</span>
                )}
              </code>
            </pre>
          </div>
        )}

        {/* Metadata view */}
        {activeFormat === 'metadata' && results.metadata && hasCompleted && !isLoading && (
          <div className="p-6 space-y-4">
            {Object.entries(results.metadata).map(([key, value], index) => (
              <div 
                key={key} 
                className="space-y-1 pb-4 border-b border-border/50 last:border-0"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="text-sm font-medium text-muted-foreground">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </div>
                <div className="text-sm font-mono">
                  {typeof value === 'object' ? (
                    <pre className="text-xs overflow-x-auto">
                      {contentRevealed ? (
                        <TextScramble 
                          duration={0.8} 
                          speed={0.02}
                          trigger={true}
                        >
                          {JSON.stringify(value, null, 2)}
                        </TextScramble>
                      ) : (
                        <span className="opacity-20">{JSON.stringify(value, null, 2).replace(/./g, '█')}</span>
                      )}
                    </pre>
                  ) : (
                    contentRevealed ? (
                      <TextScramble 
                        duration={0.6} 
                        speed={0.02}
                        trigger={true}
                      >
                        {String(value)}
                      </TextScramble>
                    ) : (
                      <span className="opacity-20">{String(value).replace(/./g, '█')}</span>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Links view */}
        {activeFormat === 'links' && results.links && results.links.length > 0 && hasCompleted && !isLoading && (
          <div className="p-6 space-y-2">
            {results.links.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-primary hover:underline transition-colors duration-200"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {contentRevealed ? (
                  <TextEffect
                    per="char"
                    preset="fade"
                    speedReveal={10}
                    speedSegment={5}
                    delay={index * 0.03}
                  >
                    {link}
                  </TextEffect>
                ) : (
                  link
                )}
              </a>
            ))}
          </div>
        )}

        {/* Screenshot view */}
        {activeFormat === 'screenshot' && results.screenshotUrl && hasCompleted && !isLoading && (
          <motion.div 
            className="p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: contentRevealed ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={results.screenshotUrl}
              alt="Screenshot"
              className="w-full rounded-lg shadow-lg"
              loading="lazy"
            />
          </motion.div>
        )}

        {/* JSON view */}
        {activeFormat === 'json' && results.json && hasCompleted && !isLoading && (
          <div className="p-6">
            <pre className="text-sm overflow-x-auto">
              <code>
                {contentRevealed ? (
                  <TextEffect
                    per="line"
                    preset="blur"
                    speedReveal={8}
                    speedSegment={5}
                  >
                    {JSON.stringify(results.json, null, 2)}
                  </TextEffect>
                ) : (
                  <span className="opacity-0">{JSON.stringify(results.json, null, 2)}</span>
                )}
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}