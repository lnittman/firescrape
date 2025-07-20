"use client";

import { cn } from "@repo/design/lib/utils";

interface ScrollGradientProps {
  children: React.ReactNode;
  direction?: "vertical" | "horizontal";
  className?: string;
  gradientSize?: "sm" | "md" | "lg";
}

export function ScrollGradient({ 
  children, 
  direction = "vertical", 
  className,
  gradientSize = "md"
}: ScrollGradientProps) {
  const gradientSizes = {
    sm: "8px",
    md: "16px", 
    lg: "24px"
  };

  const size = gradientSizes[gradientSize];

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Top/Left fade */}
      <div 
        className={cn(
          "absolute z-10 pointer-events-none",
          direction === "vertical" 
            ? "top-0 left-0 right-0" 
            : "top-0 left-0 bottom-0"
        )}
        style={{
          background: direction === "vertical" 
            ? `linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 100%)`
            : `linear-gradient(to right, hsl(var(--background)) 0%, transparent 100%)`,
          height: direction === "vertical" ? size : "100%",
          width: direction === "horizontal" ? size : "100%"
        }}
      />

      {/* Bottom/Right fade */}
      <div 
        className={cn(
          "absolute z-10 pointer-events-none",
          direction === "vertical" 
            ? "bottom-0 left-0 right-0" 
            : "top-0 right-0 bottom-0"
        )}
        style={{
          background: direction === "vertical" 
            ? `linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)`
            : `linear-gradient(to left, hsl(var(--background)) 0%, transparent 100%)`,
          height: direction === "vertical" ? size : "100%",
          width: direction === "horizontal" ? size : "100%"
        }}
      />

      {/* Scrollable content */}
      <div 
        className={cn(
          "overflow-auto scrollbar-thin",
          direction === "vertical" ? "h-full" : "w-full"
        )}
      >
        {children}
      </div>
    </div>
  );
}