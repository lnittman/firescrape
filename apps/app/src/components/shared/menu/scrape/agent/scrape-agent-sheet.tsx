'use client';

import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { scrapeAgentModalOpenAtom } from '@/atoms/modals';
import { agentOptionsAtom } from '@/atoms/scrape';
import { MobileSheet } from '@/components/shared/ui/mobile-sheet';
import { Label } from '@repo/design/components/ui/label';
import { Button } from '@repo/design/components/ui/button';
import { Textarea } from '@repo/design/components/ui/textarea';
import { Robot, Sparkle, Question } from '@phosphor-icons/react/dist/ssr';
import { cn } from '@repo/design/lib/utils';
import type { AgentOptions } from '@/atoms/scrape';
import { 
  mobileScrapeExampleOpenAtom,
  mobileScrapeExampleCallbackAtom,
  mobileScrapeExampleSelectedAtom,
  mobileScrapeModelOpenAtom,
  mobileScrapeModelCallbackAtom,
  mobileScrapeModelSelectedAtom
} from '@/atoms/menus';
import { useMobileMenuTransition } from '@/atoms/modals';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/design/components/ui/tooltip';

const examples = [
  { value: 'none', label: 'None' },
  { value: 'ycombinator', label: 'YCombinator W24 companies' },
  { value: 'firecrawl-login', label: 'Firecrawl Login Example' },
];

const models = [
  { value: 'none', label: 'None' },
  { value: 'fire-1', label: 'FIRE-1 (150+ credits)' },
];

export function ScrapeAgentSheet() {
  const [isOpen, setIsOpen] = useAtom(scrapeAgentModalOpenAtom);
  const [options, setOptions] = useAtom(agentOptionsAtom);
  const [localOptions, setLocalOptions] = useState<AgentOptions>(options);
  const maxPromptLength = 300;
  const remainingChars = maxPromptLength - (localOptions.prompt?.length || 0);
  const [, setExampleCallback] = useAtom(mobileScrapeExampleCallbackAtom);
  const [, setModelCallback] = useAtom(mobileScrapeModelCallbackAtom);
  const [selectedExample, setSelectedExample] = useAtom(mobileScrapeExampleSelectedAtom);
  const [selectedModel, setSelectedModel] = useAtom(mobileScrapeModelSelectedAtom);
  const openExampleMenu = useMobileMenuTransition(mobileScrapeExampleOpenAtom, true);
  const openModelMenu = useMobileMenuTransition(mobileScrapeModelOpenAtom, true);
  const [isExampleMenuOpen] = useAtom(mobileScrapeExampleOpenAtom);
  const [isModelMenuOpen] = useAtom(mobileScrapeModelOpenAtom);

  const handleSave = () => {
    setOptions(localOptions);
    setIsOpen(false);
  };

  React.useEffect(() => {
    if (isOpen) {
      setLocalOptions(options);
      setSelectedExample(options.example || 'none');
      setSelectedModel(options.model || 'none');
    }
  }, [isOpen, options]);

  return (
    <MobileSheet
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Agent"
      showCloseButton
      contentHeight="auto"
      hasSubsheetOpen={isExampleMenuOpen || isModelMenuOpen}
    >
      <div className="px-4 pb-4 space-y-4">
        {/* Example Selection */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Example</Label>
          <button
            type="button"
            onClick={() => {
              setExampleCallback((exampleValue: string) => {
                setLocalOptions({ ...localOptions, example: exampleValue });
                
                // Auto-fill prompt based on example
                if (exampleValue === 'ycombinator') {
                  setLocalOptions(prev => ({
                    ...prev,
                    example: exampleValue,
                    prompt: 'Get me all of the YCombinator W24 companies and their descriptions.'
                  }));
                } else if (exampleValue === 'firecrawl-login') {
                  setLocalOptions(prev => ({
                    ...prev,
                    example: exampleValue,
                    prompt: 'Navigate to the login page and extract the form fields required for authentication.'
                  }));
                }
              });
              openExampleMenu();
            }}
            className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm text-left flex items-center justify-between hover:border-foreground/20 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all duration-200 font-mono"
          >
            <span className={localOptions.example && localOptions.example !== 'none' ? 'text-foreground' : 'text-muted-foreground'}>
              {examples.find(e => e.value === localOptions.example)?.label || 'None'}
            </span>
          </button>
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Model</Label>
          <button
            type="button"
            onClick={() => {
              setModelCallback((modelValue: string) => {
                setLocalOptions({ ...localOptions, model: modelValue });
              });
              openModelMenu();
            }}
            className="w-full h-10 px-4 bg-background border border-border rounded-lg text-sm text-left flex items-center justify-between hover:border-foreground/20 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all duration-200 font-mono"
          >
            <span className={localOptions.model && localOptions.model !== 'none' ? 'text-foreground' : 'text-muted-foreground'}>
              {models.find(m => m.value === localOptions.model)?.label || 'None'}
            </span>
          </button>
        </div>

        {/* Agent Prompt */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="prompt" className="text-xs font-medium">Custom Prompt</Label>
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
            id="prompt"
            placeholder="Find all pricing information on all pages on this site and extract as JSON"
            value={localOptions.prompt || ''}
            onChange={(e) => {
              if (e.target.value.length <= maxPromptLength) {
                setLocalOptions({ ...localOptions, prompt: e.target.value });
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
              <span className="font-medium">150 credits</span> will be used for
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
            <TooltipContent side="left" className="max-w-[280px]">
              <p>Tell the agent the workflow and page(s) you need - it will come up with a plan and retrieve markdown.</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Enable Button */}
        <Button
          className="w-full bg-fire-orange/15 text-fire-orange hover:bg-fire-orange/25 border border-fire-orange/30"
          onClick={handleSave}
          disabled={localOptions.model === 'none' || !localOptions.prompt}
        >
          <Robot size={16} weight="duotone" className="mr-2" />
          Enable Agent
        </Button>
      </div>
    </MobileSheet>
  );
}