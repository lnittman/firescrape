"use client";

import React from "react";
import { cn } from "@repo/design/lib/utils";
import { motion } from "framer-motion";

interface FirescrapeLogoProps {
  size?: "xs" | "tiny" | "small" | "medium" | "large";
  className?: string;
  onClick?: () => void;
  animate?: boolean;
  variant?: "text" | "icon" | "combined";
}

export function FirescrapeLogo({
  size = "medium",
  className,
  onClick,
  animate = true,
  variant = "combined",
}: FirescrapeLogoProps) {
  // Text sizes
  const sizeClasses = {
    xs: "text-2xl", // ~24px
    tiny: "text-3xl", // ~30px
    small: "text-4xl", // ~36px
    medium: "text-6xl", // ~60px
    large: "text-8xl", // ~96px
  };

  // Icon sizes
  const iconSizes = {
    xs: "text-2xl",
    tiny: "text-3xl",
    small: "text-4xl",
    medium: "text-6xl",
    large: "text-8xl",
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
        <motion.span 
          className="font-display text-foreground"
          animate={{ 
            backgroundImage: [
              "linear-gradient(45deg, #ff6b35, #ff8c42)",
              "linear-gradient(45deg, #ff8c42, #ffa500)",
              "linear-gradient(45deg, #ffa500, #ff6b35)",
            ]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            backgroundImage: "linear-gradient(45deg, #ff6b35, #ff8c42)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent"
          }}
        >
          Firescrape
        </motion.span>
      </Component>
    );
  }

  if (variant === "icon") {
    return (
      <Component
        onClick={onClick}
        className={cn(
          "flex items-center justify-center",
          onClick && "cursor-pointer",
          className,
        )}
        {...animationProps}
      >
        <motion.span
          className={cn(
            iconSizes[size],
            "relative"
          )}
          aria-label="fire"
          role="img"
          animate={{ 
            filter: [
              "hue-rotate(0deg) brightness(1) drop-shadow(0 0 10px rgba(255, 107, 53, 0.5))",
              "hue-rotate(10deg) brightness(1.1) drop-shadow(0 0 15px rgba(255, 140, 66, 0.7))",
              "hue-rotate(-10deg) brightness(0.95) drop-shadow(0 0 12px rgba(255, 165, 0, 0.6))",
              "hue-rotate(0deg) brightness(1) drop-shadow(0 0 10px rgba(255, 107, 53, 0.5))"
            ] 
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🔥
        </motion.span>
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
      <motion.span
        className={cn(
          iconSizes[size],
          "relative"
        )}
        aria-label="fire"
        role="img"
        animate={{ 
          filter: [
            "hue-rotate(0deg) brightness(1) drop-shadow(0 0 10px rgba(255, 107, 53, 0.5))",
            "hue-rotate(10deg) brightness(1.1) drop-shadow(0 0 15px rgba(255, 140, 66, 0.7))",
            "hue-rotate(-10deg) brightness(0.95) drop-shadow(0 0 12px rgba(255, 165, 0, 0.6))",
            "hue-rotate(0deg) brightness(1) drop-shadow(0 0 10px rgba(255, 107, 53, 0.5))"
          ] 
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        🔥
      </motion.span>
      <motion.span 
        className={cn(
          "font-display font-bold tracking-tight",
          sizeClasses[size]
        )}
        animate={{ 
          backgroundImage: [
            "linear-gradient(45deg, #ff6b35, #ff8c42)",
            "linear-gradient(45deg, #ff8c42, #ffa500)",
            "linear-gradient(45deg, #ffa500, #ff6b35)",
          ]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          backgroundImage: "linear-gradient(45deg, #ff6b35, #ff8c42)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent"
        }}
      >
        Firescrape
      </motion.span>
    </Component>
  );
}