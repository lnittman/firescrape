'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@repo/design/lib/utils';
import { X } from '@phosphor-icons/react';
import { useAtom } from 'jotai';
import { atom } from 'jotai';
import { useIsMobile } from '@repo/design/hooks/useMobile';

// Global atom to manage blur overlay
export const isMobileSheetOpenAtom = atom(false);

interface MobileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  height?: 'auto' | 'fill' | 'full';
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MobileSheet({
  isOpen,
  onClose,
  title,
  children,
  position = 'bottom',
  height = 'auto',
  spacing = 'md',
  className,
}: MobileSheetProps) {
  const [, setIsSheetOpen] = useAtom(isMobileSheetOpenAtom);
  const sheetRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Update global state
  useEffect(() => {
    setIsSheetOpen(isOpen);
  }, [isOpen, setIsSheetOpen]);

  // Close on desktop resize
  useEffect(() => {
    if (!isMobile && isOpen) {
      onClose();
    }
  }, [isMobile, isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [isOpen]);

  const getSpacing = () => {
    switch (spacing) {
      case 'sm':
        return 'p-2';
      case 'lg':
        return 'p-6';
      default:
        return 'p-4';
    }
  };

  const getHeight = () => {
    switch (height) {
      case 'full':
        return 'h-[100dvh]';
      case 'fill':
        return 'h-[85dvh]';
      default:
        return 'max-h-[85dvh]';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{
              [position === 'bottom' ? 'y' : 'y']: position === 'bottom' ? '100%' : '-100%',
            }}
            animate={{
              [position === 'bottom' ? 'y' : 'y']: 0,
            }}
            exit={{
              [position === 'bottom' ? 'y' : 'y']: position === 'bottom' ? '100%' : '-100%',
            }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
            }}
            className={cn(
              'fixed left-0 right-0 z-[300]',
              'bg-background shadow-xl',
              position === 'bottom' ? 'bottom-0 rounded-t-2xl' : 'top-0 rounded-b-2xl',
              getHeight(),
              getSpacing(),
              className
            )}
          >
            {/* Handle for bottom sheets */}
            {position === 'bottom' && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
            )}

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button
                  onClick={onClose}
                  className={cn(
                    "h-8 w-8 flex items-center justify-center",
                    "rounded-lg hover:bg-muted transition-colors"
                  )}
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Content */}
            <div
              className={cn(
                'overflow-y-auto',
                height === 'auto' && 'max-h-[70dvh]'
              )}
            >
              {children}
            </div>

            {/* Safe area for bottom sheets */}
            {position === 'bottom' && (
              <div className="h-[env(safe-area-inset-bottom)]" />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}