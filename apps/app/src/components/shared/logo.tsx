"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@repo/design/lib/utils";
import { motion } from "framer-motion";

interface LogoProps {
  size?: "xs" | "tiny" | "small" | "medium" | "large";
  className?: string;
  onClick?: () => void;
  animate?: boolean;
  variant?: "text" | "fox" | "combined";
}

export function Logo({
  size = "medium",
  className,
  onClick,
  animate = true,
  variant = "combined",
}: LogoProps) {
  // Match the ASCII logo sizes for consistency
  const sizeClasses = {
    xs: "text-2xl", // ~24px
    tiny: "text-3xl", // ~30px
    small: "text-4xl", // ~36px
    medium: "text-6xl", // ~60px
    large: "text-8xl", // ~96px
  };

  // icon sizes
  const foxSizes = {
    xs: 20,
    tiny: 24,
    small: 28,
    medium: 40,
    large: 56,
  };

  const Component = onClick ? motion.button : motion.div;

  const animationProps = animate
    ? {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: "easeOut" as const },
      whileHover: onClick ? { scale: 1.05 } : undefined,
      whileTap: onClick ? { scale: 0.95 } : undefined,
    }
    : {};

  if (variant === "text") {
    return (
      <Component
        onClick={onClick}
        className={cn(
          "font-bold tracking-tight select-none leading-none",
          sizeClasses[size],
          onClick && "cursor-pointer transition-all duration-200",
          className,
        )}
        {...animationProps}
      >
        <span className="font-display text-foreground">Firescrape</span>
      </Component>
    );
  }

  if (variant === "fox") {
    return (
      <Component
        onClick={onClick}
        className={cn(
          "relative flex items-center justify-center",
          onClick && "cursor-pointer",
          className,
        )}
        {...animationProps}
      >
        <span
          className={cn(
            "absolute -top-2 -right-2 text-orange-500",
            size === "xs" && "text-xs",
            size === "tiny" && "text-sm",
            size === "small" && "text-base",
            size === "medium" && "text-lg",
            size === "large" && "text-2xl"
          )}
          aria-label="fire"
          role="img"
        >
          🔥
        </span>
      </Component>
    );
  }

  // Combined variant (default)
  return (
    <Component
      onClick={onClick}
      className={cn(
        "flex items-center gap-2",
        onClick && "cursor-pointer",
        className,
      )}
      {...animationProps}
    >
      <Image
        src="/fox/fox-leaf.png"
        alt="Yuba "
        width={foxSizes[size]}
        height={foxSizes[size]}
        className="object-contain"
        priority
      />
      <span className={cn(
        "font-display font-bold tracking-tight text-foreground",
        sizeClasses[size]
      )}>
        Yuba
      </span>
    </Component>
  );
}
