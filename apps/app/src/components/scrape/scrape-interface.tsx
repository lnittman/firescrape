"use client";

import { useState, useRef, useEffect } from 'react';
import { useTransitionRouter } from 'next-view-transitions';

import { motion, AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';
import { toast } from 'sonner';
import { Code, KeyReturn } from '@phosphor-icons/react/dist/ssr';

import { Input } from '@repo/design/components/ui/input';
import { Button } from '@repo/design/components/ui/button';
import { cn } from '@repo/design/lib/utils';
import { useIsMobile } from '@repo/design/hooks/useMobile';
import { Kbd } from '@repo/design/components/kibo/kbd';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/design/components/ui/tooltip';

import { scrapeUrl } from '@/actions/scrape';
import { advancedScrapeOptionsAtom, agentOptionsAtom } from '@/atoms/scrape';
import { ResultsViewer } from '@/components/run/results-viewer';
import { ScrapeFormatsMenu } from '@/components/shared/menu/scrape/formats/scrape-formats-menu';
import { ScrapeOptionsMenu } from '@/components/shared/menu/scrape/options/scrape-options-menu';
import { ScrapeAgentMenu } from '@/components/shared/menu/scrape/agent/scrape-agent-menu';

interface ScrapeInterfaceProps {
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onInputChange?: (value: string) => void;
  onStateChange?: (state: 'idle' | 'typing' | 'submitting') => void;
  onCodeClick?: () => void;
  onFormatsChange?: (formats: string[]) => void;
  initialUrl?: string;
}


export function ScrapeInterface({ 
  onStateChange, 
  onInputChange,
  inputRef: externalInputRef,
  onCodeClick,
  onFormatsChange,
  initialUrl = ''
}: ScrapeInterfaceProps) {
  const [results, setResults] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [formats, setFormats] = useState<string[]>(['markdown']);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState(initialUrl);
  const [advancedOptions] = useAtom(advancedScrapeOptionsAtom);
  const [agentOptions] = useAtom(agentOptionsAtom);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const inputRef = externalInputRef || internalInputRef;
  const isMobile = useIsMobile();
  const router = useTransitionRouter();

  // Update parent when formats change
  useEffect(() => {
    onFormatsChange?.(formats);
  }, [formats, onFormatsChange]);
  
  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };
  

  async function handleSubmit() {
    if (!url) return;
    
    // Prepend https:// if not present
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    
    // Validate URL
    if (!isValidUrl(fullUrl)) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    // Clear previous results when submitting new request
    setResults(null);
    setShowResults(false);
    
    setIsLoading(true);
    onStateChange?.('submitting');
    
    const result = await scrapeUrl(fullUrl, formats, {
      // Basic options
      onlyMainContent: advancedOptions.extractMainContent,
      // Additional Options
      extractMainContent: advancedOptions.extractMainContent,
      parsePDFs: advancedOptions.parsePDFs,
      useStealthMode: advancedOptions.useStealthMode,
      includeLinks: advancedOptions.includeLinks,
      timeout: advancedOptions.timeout,
      includeOnlyTags: advancedOptions.includeOnlyTags,
      excludeTags: advancedOptions.excludeTags,
      maxAge: advancedOptions.maxAge,
      // Agent Options
      agentPrompt: agentOptions.prompt,
      agentModel: agentOptions.model,
      agentSchema: agentOptions.schema,
      agentSystemPrompt: agentOptions.systemPrompt,
      agentExample: agentOptions.example,
    });
    
    setIsLoading(false);
    
    if (result.success) {
      toast.success('Scraping completed successfully!');
      // Redirect to the run detail page
      router.push(`/r/${result.scrapeId}`);
    } else {
      toast.error(result.error || 'Failed to scrape URL');
      onStateChange?.('idle');
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    onInputChange?.(value);
    
    if (value.trim()) {
      onStateChange?.('typing');
    } else {
      onStateChange?.('idle');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  return (
    <div className="w-full space-y-4">
      {/* Main Input Form and Controls */}
      <div className="relative z-40 space-y-3">
        {/* Input Row */}
        <div className="relative">
          <div className={cn(
            "flex items-center",
            "bg-background rounded-lg h-8 gap-2"
          )}>
            <Kbd className="bg-transparent border-border/30 text-muted-foreground h-full px-2 text-sm">
              https://
            </Kbd>
            <Input
              ref={inputRef}
              type="text"
              placeholder="example.com"
              className={cn(
                "flex-1 h-full text-base bg-transparent pl-3 pr-3",
                "placeholder:text-muted-foreground placeholder:tracking-wide placeholder:text-sm",
                "text-foreground",
                "border rounded-md transition-all duration-200",
                "border-border/50 hover:border-border/70",
                "focus:border-border focus-visible:ring-0 focus-visible:ring-offset-0"
              )}
              value={url}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={!url}
                    className={cn(
                      "h-8 w-8 transition-all duration-200",
                      "border",
                      !url 
                        ? "border-border/30 opacity-50 cursor-not-allowed"
                        : isValidUrl(url.startsWith('http') ? url : `https://${url}`)
                          ? "border-border/30 hover:border-border/70 border-fire-orange/50 bg-fire-orange/5 hover:bg-fire-orange/10"
                          : "border-border/30 hover:border-border/70"
                    )}
                    onClick={() => {
                      if (url && isValidUrl(url.startsWith('http') ? url : `https://${url}`)) {
                        onCodeClick?.();
                      }
                    }}
                  >
                    <Code weight="duotone" size={18} />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{url ? 'View API code' : 'Enter URL first'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Control Bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ScrapeOptionsMenu isMobile={isMobile} />
            <ScrapeAgentMenu isMobile={isMobile} />
            <ScrapeFormatsMenu
              formats={formats}
              onFormatsChange={setFormats}
              isMobile={isMobile}
            />
          </div>
          
          {/* Submit button */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            transition={{ 
              type: "spring",
              stiffness: 400,
              damping: 17
            }}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSubmit}
              disabled={isLoading || !url}
              className={cn(
                "gap-2 h-8 transition-all duration-200",
                isValidUrl(url.startsWith('http') ? url : `https://${url}`) && "border-fire-orange/50 bg-fire-orange/5 hover:bg-fire-orange/10"
              )}
            >
              <span className="text-sm">Run</span>
              <KeyReturn size={14} weight="duotone" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {showResults && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <ResultsViewer results={results} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}