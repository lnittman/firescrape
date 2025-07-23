"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom, useSetAtom } from "jotai";
import { 
    searchModalOpenAtom,
    shouldShowBlurOverlayAtom, 
    deleteAccountModalOpenAtom,
    clearDataModalOpenAtom,
    avatarUploadModalOpenAtom
} from "@/atoms/modals";
import { mobileFeedbackOpenAtom } from "@/atoms/menus";

export function UnifiedBlurOverlay() {
    const [shouldShowBlur] = useAtom(shouldShowBlurOverlayAtom);
    const [mounted, setMounted] = useState(false);

    // Ensure client-side only rendering
    useEffect(() => {
        setMounted(true);
    }, []);
    
    // Setters for closing modals
    const setSearchOpen = useSetAtom(searchModalOpenAtom);
    const setDeleteAccountOpen = useSetAtom(deleteAccountModalOpenAtom);
    const setClearDataOpen = useSetAtom(clearDataModalOpenAtom);
    const setAvatarUploadOpen = useSetAtom(avatarUploadModalOpenAtom);
    const setMobileFeedbackOpen = useSetAtom(mobileFeedbackOpenAtom);
    
    const handleOverlayClick = () => {
        // Close all modals when clicking the overlay (except scrape modals)
        setSearchOpen(false);
        setDeleteAccountOpen(false);
        setClearDataOpen(false);
        setAvatarUploadOpen(false);
        setMobileFeedbackOpen(false);
    };

    // Don't render on server
    if (!mounted) return null;

    return (
        <AnimatePresence>
            {shouldShowBlur && (
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
                    className="fixed inset-0 z-[250] bg-background/80 backdrop-blur-md"
                    onClick={handleOverlayClick}
                />
            )}
        </AnimatePresence>
    );
}