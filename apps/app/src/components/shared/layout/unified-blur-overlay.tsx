"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom, useSetAtom } from "jotai";
import { shouldShowBlurOverlayAtom } from "@/atoms/modal-overlay";
import { 
    searchModalOpenAtom,
    locationPickerOpenAtom,
    interestPickerOpenAtom,
    deleteAccountModalOpenAtom,
    clearDataModalOpenAtom,
    avatarUploadModalOpenAtom
} from "@/atoms/modals";

export function UnifiedBlurOverlay() {
    const [shouldShowBlur] = useAtom(shouldShowBlurOverlayAtom);
    const [mounted, setMounted] = useState(false);

    // Ensure client-side only rendering
    useEffect(() => {
        setMounted(true);
    }, []);
    
    // Setters for closing modals
    const setSearchOpen = useSetAtom(searchModalOpenAtom);
    const setLocationPickerOpen = useSetAtom(locationPickerOpenAtom);
    const setInterestPickerOpen = useSetAtom(interestPickerOpenAtom);
    const setDeleteAccountOpen = useSetAtom(deleteAccountModalOpenAtom);
    const setClearDataOpen = useSetAtom(clearDataModalOpenAtom);
    const setAvatarUploadOpen = useSetAtom(avatarUploadModalOpenAtom);
    
    const handleOverlayClick = () => {
        // Close all modals when clicking the overlay
        setSearchOpen(false);
        setLocationPickerOpen(false);
        setInterestPickerOpen(false);
        setDeleteAccountOpen(false);
        setClearDataOpen(false);
        setAvatarUploadOpen(false);
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