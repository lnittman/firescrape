"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "@phosphor-icons/react/dist/ssr";
import { useAtom } from "jotai";
import { cn } from "@repo/design/lib/utils";
import { isMobileMenuOpenAtom } from "@/atoms/modals";
import { ScrollGradient } from "../scroll-gradient";

interface MobileSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    showCloseButton?: boolean;
    position?: 'top' | 'bottom';
    spacing?: 'sm' | 'md' | 'lg'; // sm=16px, md=20px, lg=24px from all edges
    children: React.ReactNode;
    className?: string;
    contentHeight?: 'auto' | 'fill' | 'full' | 'default'; // 'auto' for feedback, 'fill' for notifications, 'full' for nearly fullscreen, 'default' for proper default height
    contentPadding?: boolean; // Whether to add default padding to content area (default: true)
    useScrollGradient?: boolean; // Whether to wrap content in scroll gradient (default: true)
}

// Hook to auto-close mobile overlays when transitioning to desktop
function useAutoCloseOnDesktop(isOpen: boolean, onClose: () => void) {
    useEffect(() => {
        if (!isOpen) return;

        const handleResize = () => {
            // Close immediately if screen becomes larger than mobile breakpoint (640px)
            if (window.innerWidth >= 640) {
                onClose();
            }
        };

        window.addEventListener('resize', handleResize);

        // Check immediately in case we're already on desktop
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen, onClose]);
}

export function MobileSheet({
    isOpen,
    onClose,
    title,
    showCloseButton = false,
    position = 'bottom',
    spacing = 'sm',
    children,
    className,
    contentHeight = 'auto',
    contentPadding = true,
    useScrollGradient = true
}: MobileSheetProps) {
    const [, setIsMobileMenuOpen] = useAtom(isMobileMenuOpenAtom);

    // Handle global mobile menu state changes
    useEffect(() => {
        if (isOpen) {
            // Modal is opening - set global state to show blur overlay
            setIsMobileMenuOpen(true);
        } else {
            // Modal is closing - close global state immediately so blur overlay fades out in sync
            setIsMobileMenuOpen(false);
        }
    }, [isOpen, setIsMobileMenuOpen]);

    // Auto-close when transitioning to desktop
    useAutoCloseOnDesktop(isOpen, onClose);

    // Enhanced close handler
    const handleClose = () => {
        onClose();
    };


    // Define spacing values
    const getSpacingClass = () => {
        const horizontalSpacing = spacing === 'sm' ? 'left-4 right-4' :
            spacing === 'md' ? 'left-5 right-5' : 'left-6 right-6';

        if (contentHeight === 'full') {
            if (spacing === 'sm') return `${horizontalSpacing} top-4 bottom-4`;
            if (spacing === 'md') return `${horizontalSpacing} top-5 bottom-5`;
            return `${horizontalSpacing} top-6 bottom-6`;
        }

        const verticalSpacing = position === 'top'
            ? spacing === 'sm'
                ? 'top-4'
                : spacing === 'md'
                    ? 'top-5'
                    : 'top-6'
            : spacing === 'sm'
                ? 'bottom-4'
                : spacing === 'md'
                    ? 'bottom-5'
                    : 'bottom-6';

        return `${horizontalSpacing} ${verticalSpacing}`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-[400]"
                    onClick={handleClose}
                >
                    {/* Sheet content - positioned from top or bottom */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: position === 'top' ? -50 : 50
                        }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                            opacity: 0,
                            y: position === 'top' ? -50 : 50
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            mass: 0.8
                        }}

                        className={cn(
                            "absolute",
                            getSpacingClass()
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={cn(
                            "bg-background border border-border rounded-2xl shadow-2xl font-mono overflow-hidden",
                            className
                        )}>
                            {/* Header */}
                            {(title || showCloseButton) && (
                                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                                    {title && (
                                        <h2 className="text-lg font-louize text-foreground lowercase">
                                            {title}
                                        </h2>
                                    )}
                                    {showCloseButton && (
                                        <button
                                            onClick={handleClose}
                                            className={cn(
                                                "h-8 w-8 flex items-center justify-center transition-all duration-200 rounded-md border select-none",
                                                "bg-accent/5 border-accent/50 text-muted-foreground",
                                                "hover:bg-accent/40 hover:text-accent-foreground hover:border-accent/50",
                                                "focus:outline-none"
                                            )}
                                            aria-label="Close"
                                        >
                                            <X className="w-4 h-4" weight="duotone" />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Content */}
                            <div
                                className={cn(
                                    contentHeight === 'full'
                                        ? 'h-full'
                                        : contentHeight === 'fill'
                                            ? 'h-[65vh]'
                                            : contentHeight === 'default'
                                                ? 'h-[50vh]'
                                                : 'max-h-[60vh]',
                                    !useScrollGradient && 'overflow-y-auto'
                                )}
                            >
                                {useScrollGradient ? (
                                    <ScrollGradient direction="vertical" className="h-full">
                                        <div className={cn(contentPadding && 'py-4')}>
                                            {children}
                                        </div>
                                    </ScrollGradient>
                                ) : (
                                    <div className={cn(contentPadding && 'py-4')}>
                                        {children}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
} 