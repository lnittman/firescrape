"use client";

import { type ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface AnimatedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}

interface AnimatedDialogContentProps {
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export function AnimatedDialog({ open, onOpenChange, children, className }: AnimatedDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && children}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export function AnimatedDialogContent({ 
  children, 
  className, 
  showCloseButton = true,
  onClose 
}: AnimatedDialogContentProps) {
  return (
    <Dialog.Portal forceMount>
      <Dialog.Overlay asChild>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50"
        />
      </Dialog.Overlay>
      
      <Dialog.Content asChild>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={cn(
            'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-[90vw] max-w-lg max-h-[85vh]',
            'bg-background border border-border rounded-xl shadow-xl',
            'focus:outline-none z-50',
            className
          )}
        >
          {showCloseButton && (
            <Dialog.Close asChild>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 rounded-md hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </Dialog.Close>
          )}
          
          <div className="p-6">
            {children}
          </div>
        </motion.div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

// Export Dialog components for flexibility
export { Dialog };