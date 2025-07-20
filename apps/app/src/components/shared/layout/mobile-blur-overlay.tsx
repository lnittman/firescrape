"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { isMobileMenuOpenAtom } from "@/atoms/modals";
import {
  mobileEmojiPickerOpenAtom,
  mobileFeedbackOpenAtom,
  mobileNotificationsOpenAtom,
  mobileDocsOpenAtom,
  mobileUserMenuOpenAtom,
  mobileCountryPickerOpenAtom,
  mobileEmailSettingsOpenAtom,
  mobileFeedbackTypeOpenAtom
} from "@/atoms/menus";

export function MobileBlurOverlay() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useAtom(isMobileMenuOpenAtom);
  const [, setMobileEmojiPickerOpen] = useAtom(mobileEmojiPickerOpenAtom);
  const [, setMobileFeedbackOpen] = useAtom(mobileFeedbackOpenAtom);
  const [, setMobileNotificationsOpen] = useAtom(mobileNotificationsOpenAtom);
  const [, setMobileDocsOpen] = useAtom(mobileDocsOpenAtom);
  const [, setMobileUserMenuOpen] = useAtom(mobileUserMenuOpenAtom);
  const [, setMobileCountryPickerOpen] = useAtom(mobileCountryPickerOpenAtom);
  const [, setMobileEmailSettingsOpen] = useAtom(mobileEmailSettingsOpenAtom);
  const [, setMobileFeedbackTypeOpen] = useAtom(mobileFeedbackTypeOpenAtom);

  // Close all mobile modals when backdrop is clicked (let them handle global state)
  const handleBackdropClick = () => {
    // Close all individual modals - they will handle closing global state when animations complete
    setMobileEmojiPickerOpen(false);
    setMobileFeedbackOpen(false);
    setMobileNotificationsOpen(false);
    setMobileDocsOpen(false);
    setMobileUserMenuOpen(false);
    setMobileCountryPickerOpen(false);
    setMobileEmailSettingsOpen(false);
    setMobileFeedbackTypeOpen(false);

    // Don't immediately close global state - let modals handle this after animation
  };

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8
          }}
          className="fixed inset-0 z-[75] bg-background/80 backdrop-blur-md"
          onClick={handleBackdropClick}
        />
      )}
    </AnimatePresence>
  );
} 
