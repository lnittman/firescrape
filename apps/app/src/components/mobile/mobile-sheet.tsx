"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import { isMobileMenuOpenAtom } from "@/atoms/modals";
import { useAutoCloseOnDesktop } from "@/hooks/use-auto-close-on-desktop";

interface MobileSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
  showCloseButton?: boolean;
}

export function MobileSheet({
  children,
  isOpen,
  onClose,
  title,
  className,
  showCloseButton = true,
}: MobileSheetProps) {
  const [, setIsMobileMenuOpen] = useAtom(isMobileMenuOpenAtom);
  
  // Auto-close when transitioning to desktop
  useAutoCloseOnDesktop(isOpen, onClose);

  // Manage mobile menu state for blur overlay
  useEffect(() => {
    if (isOpen) {
      setIsMobileMenuOpen(true);
    } else {
      setIsMobileMenuOpen(false);
    }
  }, [isOpen, setIsMobileMenuOpen]);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[250] md:hidden"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8,
            }}
            className={cn(
              "fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl shadow-xl z-[300] md:hidden",
              "max-h-[90vh] flex flex-col",
              className
            )}
          >
            {/* Handle bar */}
            <div className="flex justify-center py-2">
              <div className="w-12 h-1 bg-muted-foreground/20 rounded-full" />
            </div>

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
                <h2 className="text-lg font-display">{title || ""}</h2>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" weight="bold" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}