"use client";

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@repo/design/components/ui/dropdown-menu";
import { Button } from "@repo/design/components/ui/button";
import { Switch } from "@repo/design/components/ui/switch";
import { Label } from "@repo/design/components/ui/label";
import { 
  FileText, 
  Code, 
  Image, 
  Database,
  FunnelSimple,
  Check
} from "@phosphor-icons/react";
import { cn } from "@repo/design/lib/utils";
import { AnimatedNumber } from '@repo/design/components/motion';
import { TextLoop } from '@repo/design/components/motion';

interface ScrapeOptionsToolbarProps {
  formats: string[];
  onFormatsChange: (formats: string[]) => void;
  onlyMainContent: boolean;
  onOnlyMainContentChange: (value: boolean) => void;
}

const formatOptions = [
  { value: 'markdown', label: 'Markdown', icon: FileText },
  { value: 'html', label: 'HTML', icon: Code },
  { value: 'rawHtml', label: 'Raw HTML', icon: Code },
  { value: 'screenshot', label: 'Screenshot', icon: Image },
  { value: 'json', label: 'JSON', icon: Database },
];

export function ScrapeOptionsToolbar({
  formats,
  onFormatsChange,
  onlyMainContent,
  onOnlyMainContentChange,
}: ScrapeOptionsToolbarProps) {
  const hasActiveFilters = formats.length !== 1 || !onlyMainContent;

  const handleFormatToggle = (format: string) => {
    if (formats.includes(format)) {
      // Don't allow removing all formats
      if (formats.length > 1) {
        onFormatsChange(formats.filter(f => f !== format));
      }
    } else {
      onFormatsChange([...formats, format]);
    }
  };

  const handleClearAll = () => {
    onFormatsChange(['markdown']);
    onOnlyMainContentChange(true);
  };

  return (
    <div className="border-b bg-muted/30 px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Formats Menu */}
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={cn(
                    "h-8 font-mono text-xs uppercase tracking-wider",
                    formats.length > 1 && "text-primary"
                  )}
                >
                  <FunnelSimple 
                    size={14} 
                    weight={formats.length > 1 ? "fill" : "duotone"} 
                    className="mr-2"
                  />
                  <span>Formats (</span>
                  <AnimatedNumber 
                    value={formats.length} 
                    className="inline-block tabular-nums"
                  />
                  <span>)</span>
                </Button>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuLabel>Output Formats</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {formatOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = formats.includes(option.value);
                return (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={isSelected}
                    onCheckedChange={() => handleFormatToggle(option.value)}
                  >
                    <Icon 
                      size={16} 
                      weight={isSelected ? "fill" : "duotone"}
                      className="mr-2"
                    />
                    <span className="flex-1">{option.label}</span>
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
            </DropdownMenu>

          {/* Only Main Content Toggle */}
          <div className="flex items-center gap-2 px-3">
            <Switch
              id="main-content"
              checked={onlyMainContent}
              onCheckedChange={onOnlyMainContentChange}
              className="h-4 w-8"
            />
            <Label 
              htmlFor="main-content" 
              className="cursor-pointer text-xs font-mono uppercase tracking-wider"
            >
              Main Content Only
            </Label>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-8 text-xs"
            >
              <TextLoop interval={3} className="text-xs">
                <span>Clear Options</span>
                <span>Reset All</span>
              </TextLoop>
            </Button>
        )}
      </div>
    </div>
  );
}