"use client";

import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@repo/design/components/ui/dialog';
import type { ReactNode } from 'react';

interface AnimatedModalWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper component that ensures Dialog animations work properly
 * by delaying the unmount to allow exit animations to complete
 */
export function AnimatedModalWrapper({ 
  open, 
  onOpenChange, 
  children, 
  className 
}: AnimatedModalWrapperProps) {
  const [shouldRender, setShouldRender] = useState(open);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
    } else {
      // Delay unmount to allow exit animation
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200); // Match the animation duration
      
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!shouldRender) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        {children}
      </DialogContent>
    </Dialog>
  );
}