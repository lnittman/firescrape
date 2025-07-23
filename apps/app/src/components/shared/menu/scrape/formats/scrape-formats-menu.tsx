'use client';

import { useRef, useState } from 'react';

import { CaretDown, FileText, Code, CodeBlock, Camera, Database, Check, Square, Info } from '@phosphor-icons/react/dist/ssr';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';

import { Button } from '@repo/design/components/ui/button';
import { useClickAway } from '@repo/design/hooks/useClickAway';
import { cn } from '@repo/design/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/design/components/ui/tooltip';

import { scrapeFormatsModalOpenAtom } from '@/atoms/modals';
import { scrapeFormatsCallbackAtom } from '@/components/shared/menu/scrape/formats/scrape-formats-sheet';
import { agentOptionsAtom } from '@/atoms/scrape';

interface Format {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

const FORMATS: Format[] = [
  { id: 'markdown', label: 'Markdown', icon: FileText, description: 'Clean, formatted text' },
  { id: 'html', label: 'HTML', icon: Code, description: 'Cleaned HTML markup' },
  { id: 'rawHtml', label: 'Raw HTML', icon: CodeBlock, description: 'Original HTML source' },
  { id: 'screenshot', label: 'Screenshot', icon: Camera, description: 'Visual capture' },
  { id: 'json', label: 'JSON', icon: Database, description: 'Requires agent config' },
];

interface ScrapeFormatsMenuProps {
  formats: string[];
  onFormatsChange: (formats: string[]) => void;
  isMobile?: boolean;
}

export function ScrapeFormatsMenu({ formats, onFormatsChange, isMobile = false }: ScrapeFormatsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [, setIsMobileSheetOpen] = useAtom(scrapeFormatsModalOpenAtom);
  const [, setFormatsCallback] = useAtom(scrapeFormatsCallbackAtom);
  const [agentOptions] = useAtom(agentOptionsAtom);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const hasAgentConfig = !!(agentOptions.prompt || agentOptions.schema);
  
  useClickAway(dropdownRef, () => {
    if (!isMobile && isOpen) {
      setIsOpen(false);
    }
  });

  const handleFormatToggle = (formatId: string) => {
    // Don't allow JSON selection without agent config
    if (formatId === 'json' && !hasAgentConfig) {
      return;
    }
    
    if (formats.includes(formatId)) {
      onFormatsChange(formats.filter(f => f !== formatId));
    } else {
      onFormatsChange([...formats, formatId]);
    }
  };
  
  const openMobileSheet = () => {
    setFormatsCallback({ formats, onFormatsChange });
    setIsMobileSheetOpen(true);
  };

  const selectedCount = formats.length;
  const buttonLabel = selectedCount === 0 
    ? 'Select formats' 
    : `${selectedCount} format${selectedCount > 1 ? 's' : ''}`;

  const formatsList = (
    <div className="space-y-1">
      {FORMATS.map((format) => {
        const Icon = format.icon;
        const isSelected = formats.includes(format.id);
        
        return (
          <button
            key={format.id}
            type="button"
            onClick={() => handleFormatToggle(format.id)}
            disabled={format.id === 'json' && !hasAgentConfig}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
              "transition-colors duration-200",
              "hover:bg-muted",
              isSelected && "bg-muted",
              format.id === 'json' && !hasAgentConfig && "opacity-50 cursor-not-allowed"
            )}
          >
            {isSelected ? (
              <Check 
                size={16} 
                weight="duotone" 
                className="text-foreground transition-all duration-200"
              />
            ) : (
              <Square 
                size={16} 
                weight="duotone" 
                className="text-border transition-all duration-200"
              />
            )}
            <Icon 
              size={16} 
              weight={isSelected ? "fill" : "regular"} 
              className="text-muted-foreground transition-all duration-200"
            />
            <div className="flex-1 text-left">
              <div className="flex items-center gap-1.5">
                <p className="font-medium text-sm">{format.label}</p>
                {format.id === 'json' && !hasAgentConfig && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={12} className="text-amber-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Configure agent options to use JSON extraction</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{format.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={openMobileSheet}
          className={cn(
            "gap-2 h-8 ml-2",
            selectedCount > 0 && "border-fire-orange/50 bg-fire-orange/5"
          )}
        >
          <FileText size={14} />
          <span>{buttonLabel}</span>
          <CaretDown size={14} />
        </Button>

        {/* Sheet is now rendered in client-layout */}
      </>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "gap-2 h-8 transition-all duration-200",
          selectedCount > 0 && "border-fire-orange/50 bg-fire-orange/5",
          isOpen && "bg-accent border-accent-foreground/20"
        )}
      >
        <FileText size={14} />
        <span>{buttonLabel}</span>
        <CaretDown 
          size={14} 
          className={cn(
            "transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute top-full left-0 mt-2 z-50",
              "min-w-[280px] p-2",
              "bg-background/95 backdrop-blur-md rounded-lg shadow-lg",
              "border border-border"
            )}
          >
            {formatsList}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}