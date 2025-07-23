"use client";

import { Lightning, Fire } from '@phosphor-icons/react/dist/ssr';
import { motion } from 'framer-motion';
import { Button } from '@repo/design/components/ui/button';
import { cn } from '@repo/design/lib/utils';

interface SubmitButtonProps {
  isLoading: boolean;
  isValid?: boolean;
  onClick: () => void;
}

export function SubmitButton({ onClick, isLoading, isValid = false }: SubmitButtonProps) {
  return (
    <Button 
      type="button" 
      size="icon"
      className={cn(
        "h-12 w-12 relative overflow-hidden",
        "transition-all duration-300",
        "shadow-sm hover:shadow-md",
        "group",
        // Base state - subtle slate background
        "bg-slate-900/50 hover:bg-slate-900/70",
        // Valid URL state - subtle orange tint
        isValid && "bg-gradient-to-br from-slate-900/50 to-orange-950/30 hover:from-slate-900/70 hover:to-orange-950/40",
        // Border styling
        "border-0"
      )}
      disabled={isLoading}
      onClick={onClick}
    >
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-700" />
      
      {/* Glow effect for valid state */}
      {isValid && (
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-radial from-orange-500/20 to-transparent blur-xl" />
        </div>
      )}
      
      {/* Icon */}
      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="relative z-10"
        >
          <Fire weight="fill" size={20} className={cn(
            "text-white/90",
            isValid && "text-orange-200/90"
          )} />
        </motion.div>
      ) : (
        <Lightning weight="fill" size={20} className={cn(
          "relative z-10 text-white/80 group-hover:text-white/90 transition-colors",
          isValid && "text-orange-200/80 group-hover:text-orange-200/90"
        )} />
      )}
    </Button>
  );
}