"use client";

import { cn } from "@repo/design/lib/utils";
import { motion } from "framer-motion";
import "./marquee-styles.css";
import type { TripSuggestion } from "@/lib/trip-suggestions";

interface SuggestionOffsetMarqueeProps {
  suggestions: TripSuggestion[];
  onSelect: (suggestion: TripSuggestion) => void;
  className?: string;
}

export function SuggestionOffsetMarquee({
  suggestions,
  onSelect,
  className
}: SuggestionOffsetMarqueeProps) {
  // Create two rows with offset
  const halfLength = Math.ceil(suggestions.length / 2);
  const row1 = suggestions.slice(0, halfLength);
  const row2 = suggestions.slice(halfLength);

  // Duplicate for seamless loop
  const row1Duplicated = [...row1, ...row1];
  const row2Duplicated = [...row2, ...row2];

  const renderPill = (suggestion: TripSuggestion, index: number) => (
    <motion.button
      key={`${suggestion.id}-${index}`}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(suggestion)}
      className={cn(
        "group flex items-stretch overflow-hidden flex-shrink-0",
        "h-12 rounded-xl border border-border",
        "bg-background hover:bg-accent/50",
        "transition-all duration-200",
        "hover:shadow-sm hover:border-foreground/20",
        "mx-2"
      )}
    >
      {/* Emoji section */}
      <div className={cn(
        "flex items-center justify-center px-3",
        "bg-muted/50 border-r border-border",
        "group-hover:bg-muted transition-colors"
      )}>
        <span className="text-lg">
          {suggestion.emoji}
        </span>
      </div>

      {/* Text section */}
      <div className="flex items-center px-4">
        <span className="text-sm font-medium text-foreground/90 whitespace-nowrap">
          {suggestion.title}
        </span>
      </div>
    </motion.button>
  );

  return (
    <div className={cn("relative overflow-hidden max-h-32", className)}>
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Marquee content */}
      <div className="space-y-3 py-2">
        {/* Row 1 */}
        <div className="marquee-container">
          <div className="marquee-content marquee-scroll-1">
            {row1Duplicated.map((suggestion, index) => renderPill(suggestion, index))}
          </div>
        </div>

        {/* Row 2 with offset */}
        <div className="marquee-container">
          <div className="marquee-content marquee-scroll-2 ml-16">
            {row2Duplicated.map((suggestion, index) => renderPill(suggestion, index))}
          </div>
        </div>
      </div>
    </div>
  );
}