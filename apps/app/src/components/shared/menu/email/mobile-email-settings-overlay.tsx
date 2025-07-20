"use client";

import React from "react";
import { useAtom } from "jotai";
import { motion } from "framer-motion";
import { Star, Trash } from "@phosphor-icons/react/dist/ssr";
import { useAuth } from "@repo/auth/client";
import { cn } from "@repo/design/lib/utils";
import { MobileSheet } from "@/components/shared/ui/mobile-sheet";
import {
    mobileEmailSettingsOpenAtom,
    mobileEmailSettingsDataAtom,
    mobileEmailSettingsCallbackAtom
} from "@/atoms/menus";

function MobileEmailSettingsOverlayContent() {
    const { isLoaded } = useAuth();
    const [isOpen, setOpen] = useAtom(mobileEmailSettingsOpenAtom);
    const [data] = useAtom(mobileEmailSettingsDataAtom);
    const [callback] = useAtom(mobileEmailSettingsCallbackAtom);

    const handleClose = () => {
        setOpen(false);
        // MobileSheet will handle closing global mobile menu when animation completes
    };

    const handleSetAsPrimary = () => {
        if (data && callback?.onSetAsPrimary && !data.isPrimary && data.isVerified) {
            callback.onSetAsPrimary(data.emailId);
        }
        setOpen(false);
    };

    const handleDelete = () => {
        if (data && callback?.onDelete && !data.isPrimary) {
            callback.onDelete(data.emailId);
        }
        setOpen(false);
    };

    if (!isLoaded) return null;

    return (
        <MobileSheet
            isOpen={isOpen}
            onClose={handleClose}
            title="Email Actions"
            showCloseButton
            position="bottom"
            spacing="sm"
        >
            <div className="p-6 space-y-2">
                {data && (
                    <p className="text-sm text-muted-foreground font-mono">
                        {data.emailAddress}
                    </p>
                )}
                <div className="pt-2 space-y-2">
                    <motion.button
                        onClick={handleSetAsPrimary}
                        disabled={
                            !data ||
                            !callback?.onSetAsPrimary ||
                            data.isPrimary ||
                            !data.isVerified
                        }
                        className={cn(
                            "w-full flex items-center gap-2 p-3 rounded-lg text-sm font-mono transition-all duration-200",
                            "hover:bg-muted/40",
                            (!data ||
                                !callback?.onSetAsPrimary ||
                                data.isPrimary ||
                                !data.isVerified) &&
                                "opacity-50 cursor-not-allowed"
                        )}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Star className="w-4 h-4" weight="duotone" />
                        <span>Set as primary</span>
                    </motion.button>
                    <motion.button
                        onClick={handleDelete}
                        disabled={!data || !callback?.onDelete || data.isPrimary}
                        className={cn(
                            "w-full flex items-center gap-2 p-3 rounded-lg text-sm font-mono transition-all duration-200 text-destructive hover:bg-destructive/10",
                            (!data || !callback?.onDelete || data.isPrimary) &&
                                "opacity-50 cursor-not-allowed"
                        )}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Trash className="w-4 h-4" weight="duotone" />
                        <span>Delete</span>
                    </motion.button>
                </div>
            </div>
        </MobileSheet>
    );
}

export function MobileEmailSettingsOverlay() {
    return (
        <React.Suspense fallback={null}>
            <MobileEmailSettingsOverlayContent />
        </React.Suspense>
    );
}
