"use client";

import { useEffect } from "react";
import { useIsMobile } from "@repo/design/hooks/use-mobile";

/**
 * Hook that automatically closes mobile sheets when viewport transitions to desktop
 * Prevents UI conflicts between mobile and desktop modal systems
 */
export function useAutoCloseOnDesktop(
  isOpen: boolean,
  onClose: () => void
) {
  const isMobile = useIsMobile();

  useEffect(() => {
    // If sheet is open and we transition to desktop, close it
    if (isOpen && !isMobile) {
      onClose();
    }
  }, [isOpen, isMobile, onClose]);

  return isMobile;
}