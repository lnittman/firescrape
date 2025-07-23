'use client';

import { useState, useRef } from 'react';
import { cn } from '@repo/design/lib/utils';
import { Button } from '@repo/design/components/ui/button';
import { Robot, Sparkle, Question, CaretDown, CaretUp, Check } from '@phosphor-icons/react/dist/ssr';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickAway } from '@repo/design/hooks/useClickAway';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/design/components/ui/tooltip';
import { useAtom } from 'jotai';
import { scrapeAgentModalOpenAtom } from '@/atoms/modals';
import { agentOptionsAtom } from '@/atoms/scrape';
import { Textarea } from '@repo/design/components/ui/textarea';
import { Label } from '@repo/design/components/ui/label';

interface ScrapeAgentMenuProps {
  isMobile?: boolean;
}

const examples = [
  { value: 'none', label: 'None' },
  { value: 'ycombinator', label: 'YCombinator W24 companies' },
  { value: 'firecrawl-login', label: 'Firecrawl Login Example' },
];

const models = [
  { value: 'none', label: 'None' },
  { value: 'fire-1', label: 'FIRE-1 (150+ credits)' },
];

export function ScrapeAgentMenu({ isMobile = false }: ScrapeAgentMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [, setIsMobileSheetOpen] = useAtom(scrapeAgentModalOpenAtom);
  const [options, setOptions] = useAtom(agentOptionsAtom);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const exampleDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const maxPromptLength = 300;
  const remainingChars = maxPromptLength - (options.prompt?.length || 0);
  const [showExampleDropdown, setShowExampleDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  
  // Check if agent options are set
  const hasAgentOptions = 
    (options.prompt && options.prompt.trim() !== '') ||
    (options.model && options.model !== 'none') ||
    options.schema ||
    (options.systemPrompt && options.systemPrompt.trim() !== '') ||
    (options.example && options.example.trim() !== '');
  
  // Handle clicks outside subdropdowns
  useClickAway(exampleDropdownRef, () => {
    if (showExampleDropdown) {
      setShowExampleDropdown(false);
    }
  });
  
  useClickAway(modelDropdownRef, () => {
    if (showModelDropdown) {
      setShowModelDropdown(false);
    }
  });
  
  // Handle clicks outside main dropdown
  useClickAway(dropdownRef, () => {
    if (!isMobile && isOpen && !showExampleDropdown && !showModelDropdown) {
      setIsOpen(false);
    }
  });

  const openMobileSheet = () => {
    setIsMobileSheetOpen(true);
  };

  const agentContent = (
    <div className="space-y-4 p-4">

      {/* Example Selection */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Example</Label>
        <div className="relative" ref={exampleDropdownRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowExampleDropdown(!showExampleDropdown);
              setShowModelDropdown(false);
            }}
            className="w-full h-8 px-3 pr-8 bg-background border border-border rounded-md text-sm text-left flex items-center justify-between hover:border-foreground/20 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all duration-200 font-mono"
          >
            <span className={options.example && options.example !== 'none' ? 'text-foreground' : 'text-muted-foreground'}>
              {examples.find(e => e.value === options.example)?.label || 'None'}
            </span>
            <AnimatePresence mode="wait" initial={false}>
              {showExampleDropdown ? (
                <motion.div
                  key="up"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <CaretUp size={12} weight="duotone" className="text-muted-foreground" />
                </motion.div>
              ) : (
                <motion.div
                  key="down"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <CaretDown size={12} weight="duotone" className="text-muted-foreground" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <AnimatePresence>
            {showExampleDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 left-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 overflow-hidden"
              >
                <div className="py-1">
                  {examples.map((example) => (
                    <button
                      key={example.value}
                      type="button"
                      onClick={() => {
                        setOptions({ ...options, example: example.value });
                        setShowExampleDropdown(false);
                      }}
                      className="w-[calc(100%-8px)] mx-1 px-2 py-1.5 text-left text-sm hover:bg-accent transition-all duration-200 flex items-center justify-between font-mono group rounded-md"
                    >
                      <span className="transition-colors duration-200">{example.label}</span>
                      {options.example === example.value && (
                        <Check size={14} weight="duotone" className="text-green-600 transition-all duration-200" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Model Selection */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Model</Label>
        <div className="relative" ref={modelDropdownRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowModelDropdown(!showModelDropdown);
              setShowExampleDropdown(false);
            }}
            className="w-full h-8 px-3 pr-8 bg-background border border-border rounded-md text-sm text-left flex items-center justify-between hover:border-foreground/20 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all duration-200 font-mono"
          >
            <span className={options.model && options.model !== 'none' ? 'text-foreground' : 'text-muted-foreground'}>
              {models.find(m => m.value === options.model)?.label || 'None'}
            </span>
            <AnimatePresence mode="wait" initial={false}>
              {showModelDropdown ? (
                <motion.div
                  key="up"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <CaretUp size={12} weight="duotone" className="text-muted-foreground" />
                </motion.div>
              ) : (
                <motion.div
                  key="down"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <CaretDown size={12} weight="duotone" className="text-muted-foreground" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <AnimatePresence>
            {showModelDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 left-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 overflow-hidden"
              >
                <div className="py-1">
                  {models.map((model) => (
                    <button
                      key={model.value}
                      type="button"
                      onClick={() => {
                        setOptions({ ...options, model: model.value });
                        setShowModelDropdown(false);
                      }}
                      className="w-[calc(100%-8px)] mx-1 px-2 py-1.5 text-left text-sm hover:bg-accent transition-all duration-200 flex items-center justify-between font-mono group rounded-md"
                    >
                      <span className="transition-colors duration-200">{model.label}</span>
                      {options.model === model.value && (
                        <Check size={14} weight="duotone" className="text-green-600 transition-all duration-200" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Custom Prompt */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Custom Prompt</Label>
          <span className={cn(
            "text-xs",
            remainingChars < 50 
              ? "text-destructive" 
              : "text-muted-foreground"
          )}>
            {remainingChars} chars
          </span>
        </div>
        <Textarea
          placeholder="Find all pricing information on all pages on this site and extract as JSON"
          value={options.prompt || ''}
          onChange={(e) => {
            if (e.target.value.length <= maxPromptLength) {
              setOptions({ ...options, prompt: e.target.value });
            }
          }}
          className="min-h-[80px] text-sm resize-none"
        />
      </div>

      {/* Credits Info */}
      <div className="bg-accent/50 border border-accent rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkle size={16} className="text-fire-orange" />
          <p className="text-xs">
            <span className="font-medium">150 credits</span> will be used
          </p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-6 w-6 hover:bg-accent"
            >
              <Question size={14} weight="duotone" className="text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-[280px]">
            <p>Tell the agent the workflow and page(s) you need - it will come up with a plan and retrieve markdown.</p>
          </TooltipContent>
        </Tooltip>
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
            hasAgentOptions && "border-fire-orange/50 bg-fire-orange/5 hover:bg-fire-orange/10"
          )}
          onClick={openMobileSheet}
          title="Agent"
        >
          <Robot size={18} weight="duotone" />
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
              hasAgentOptions && "border-fire-orange/50 bg-fire-orange/5 hover:bg-fire-orange/10",
              isOpen && "bg-accent border-border/90"
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            <Robot 
              size={18} 
              weight="duotone"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Agent</p>
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
              "w-[360px]",
              "bg-background/95 backdrop-blur-md rounded-lg shadow-lg",
              "border border-border"
            )}
          >
            {agentContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}