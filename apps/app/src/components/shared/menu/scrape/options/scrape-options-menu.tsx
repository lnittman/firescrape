'use client';

import { useState, useRef } from 'react';
import { cn } from '@repo/design/lib/utils';
import { Button } from '@repo/design/components/ui/button';
import { Gear, FileText, Shield, Clock, Tag } from '@phosphor-icons/react/dist/ssr';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickAway } from '@repo/design/hooks/useClickAway';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/design/components/ui/tooltip';
import { useAtom } from 'jotai';
import { scrapeOptionsModalOpenAtom } from '@/atoms/modals';
import { advancedScrapeOptionsAtom } from '@/atoms/scrape';
import { Switch } from '@repo/design/components/ui/switch';
import { Input } from '@repo/design/components/ui/input';
import { Label } from '@repo/design/components/ui/label';

interface ScrapeOptionsMenuProps {
  isMobile?: boolean;
}

export function ScrapeOptionsMenu({ isMobile = false }: ScrapeOptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [, setIsMobileSheetOpen] = useAtom(scrapeOptionsModalOpenAtom);
  const [options, setOptions] = useAtom(advancedScrapeOptionsAtom);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Check if options differ from defaults
  const hasModifiedOptions = 
    options.extractMainContent !== true ||
    options.parsePDFs !== false ||
    options.useStealthMode !== false ||
    options.includeLinks !== false ||
    options.timeout !== undefined ||
    options.includeOnlyTags !== undefined;
  
  useClickAway(dropdownRef, () => {
    if (!isMobile && isOpen) {
      setIsOpen(false);
    }
  });

  const openMobileSheet = () => {
    setIsMobileSheetOpen(true);
  };

  const optionsContent = (
    <div className="space-y-4 p-3">
      {/* Main Content Only */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Main content only</p>
            <p className="text-xs text-muted-foreground">Extract article content</p>
          </div>
        </div>
        <Switch
          checked={options.extractMainContent}
          onCheckedChange={(checked) => 
            setOptions({ ...options, extractMainContent: checked })
          }
        />
      </div>

      {/* Parse PDFs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Parse PDFs</p>
            <p className="text-xs text-muted-foreground">Extract PDF text</p>
          </div>
        </div>
        <Switch
          checked={options.parsePDFs}
          onCheckedChange={(checked) => 
            setOptions({ ...options, parsePDFs: checked })
          }
        />
      </div>

      {/* Stealth Mode */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Stealth Mode</p>
            <p className="text-xs text-muted-foreground">Bypass detection</p>
          </div>
        </div>
        <Switch
          checked={options.useStealthMode}
          onCheckedChange={(checked) => 
            setOptions({ ...options, useStealthMode: checked })
          }
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Timeout */}
      <div className="space-y-2">
        <Label className="text-xs font-medium flex items-center gap-2">
          <Clock size={14} />
          Timeout (ms)
        </Label>
        <Input
          type="number"
          placeholder="30000"
          value={options.timeout || ''}
          onChange={(e) => setOptions({ 
            ...options, 
            timeout: parseInt(e.target.value) || undefined 
          })}
          className="h-8 text-sm"
        />
      </div>

      {/* Include Only Tags */}
      <div className="space-y-2">
        <Label className="text-xs font-medium flex items-center gap-2">
          <Tag size={14} />
          Include Only Tags
        </Label>
        <Input
          placeholder="article, main, .content"
          value={options.includeOnlyTags || ''}
          onChange={(e) => setOptions({ 
            ...options, 
            includeOnlyTags: e.target.value 
          })}
          className="h-8 text-sm font-mono"
        />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={cn(
            "h-8 w-8 transition-all duration-200",
            "border border-border/30 hover:border-border/70",
            hasModifiedOptions && "border-fire-orange/50 bg-fire-orange/5 hover:bg-fire-orange/10"
          )}
          onClick={openMobileSheet}
          title="Scrape Options"
        >
          <Gear size={18} weight="duotone" />
        </Button>
      </>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={cn(
              "h-8 w-8 transition-all duration-200",
              "border border-border/30 hover:border-border/70",
              hasModifiedOptions && "border-fire-orange/50 bg-fire-orange/5 hover:bg-fire-orange/10",
              isOpen && "bg-accent border-border/90"
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            <Gear 
              size={18} 
              weight="duotone"
              className={cn(
                "transition-transform duration-200",
                isOpen && "rotate-90"
              )}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Options</p>
        </TooltipContent>
      </Tooltip>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute top-full left-0 mt-2 z-50",
              "w-[320px]",
              "bg-background/95 backdrop-blur-md rounded-lg shadow-lg",
              "border border-border"
            )}
          >
            {optionsContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}