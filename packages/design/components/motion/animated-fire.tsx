"use client";

import React from "react";
import { cn } from "@repo/design/lib/utils";
import { motion } from "framer-motion";

interface AnimatedFireProps {
  size?: "xs" | "tiny" | "small" | "medium" | "large";
  className?: string;
}

export function AnimatedFire({
  size = "medium",
  className,
}: AnimatedFireProps) {
  // Icon sizes
  const iconSizes = {
    xs: "text-2xl",
    tiny: "text-3xl",
    small: "text-4xl",
    medium: "text-6xl",
    large: "text-8xl",
  };

  return (
    <motion.span
      className={cn(
        iconSizes[size],
        "relative inline-block transition-all duration-300",
        "hover:filter hover:drop-shadow-[0_0_20px_rgba(255,140,66,0.8)]",
        className
      )}
      aria-label="fire"
      role="img"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1,
        scale: 1,
        filter: "drop-shadow(0 0 10px rgba(255, 107, 53, 0.5))"
      }}
      transition={{ 
        duration: 0.6,
        ease: "easeOut"
      }}
      whileHover={{
        filter: "drop-shadow(0 0 20px rgba(255, 140, 66, 0.8))"
      }}
    >
      🔥
    </motion.span>
  );
}