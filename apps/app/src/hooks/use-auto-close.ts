"use client";

import { useEffect } from "react";
import { useIsMobile } from "@repo/design/hooks/useMobile";

/**
 * Automatically closes a mobile-only component when the viewport
 * transitions from mobile to desktop size.
 * 
 * @param isOpen - Whether the component is currently open
 * @param onClose - Function to call to close the component
 */
export function useAutoClose(isOpen: boolean, onClose: () => void) {
  const isMobile = useIsMobile();

  useEffect(() => {
    // If component is open and we're no longer on mobile, close it
    if (isOpen && !isMobile) {
      onClose();
    }
  }, [isOpen, isMobile, onClose]);
}