"use client";

import React, { useState, useEffect, Suspense } from "react";
import { SignOutButton, useAuth, useUser } from "@repo/auth/client";
import {
    SignOut,
    ArrowUpRight,
    House,
    Gear,
    Plus,
} from "@phosphor-icons/react/dist/ssr";
import { useTransitionRouter } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useAtom } from "jotai";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@repo/design/lib/utils";
import { mobileUserMenuOpenAtom, mobileChatOpenAtom } from "@/atoms/menus";
import { searchModalOpenAtom, planTripModalOpenAtom } from "@/atoms/modals";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";

interface DocLink {
    id: string;
    title: string;
    description: string;
    url: string;
}

const docLinks: DocLink[] = [
    {
        id: '1',
        title: 'Documentation',
        description: 'Complete guide and API reference',
        url: 'https://docs.example.com'
    },
    {
        id: '2',
        title: 'Changelog',
        description: 'Latest updates and releases',
        url: 'https://changelog.example.com'
    },
    {
        id: '3',
        title: 'Help Center',
        description: 'Support articles and tutorials',
        url: 'https://help.example.com'
    }
];



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

// Main mobile user menu overlay content component
function MobileUserMenuOverlayContent() {
    const { isLoaded } = useAuth();
    const { user } = useUser();
    const router = useTransitionRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useAtom(mobileUserMenuOpenAtom);
    const [isMobileChatOpen, setIsMobileChatOpen] = useAtom(mobileChatOpenAtom);
    const [, setSearchModalOpen] = useAtom(searchModalOpenAtom);
    const [, setPlanTripModalOpen] = useAtom(planTripModalOpenAtom);

    // Auto-close when transitioning to desktop
    useAutoCloseOnDesktop(isOpen, setIsOpen.bind(null, false));


    // Close overlay when navigating to a new page
    useEffect(() => {
        if (isOpen) {
            setIsOpen(false);
        }
    }, [pathname]);

    // Get user initials for avatar fallback
    const initials = user?.fullName
        ? user.fullName
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
        : user?.emailAddresses?.[0]?.emailAddress?.charAt(0).toUpperCase() || "?";

    // Navigate to settings page
    const handleOpenSettings = () => {
        setIsOpen(false);
        router.push('/account/settings');
    };

    // Navigate to dashboard
    const handleOpenDashboard = () => {
        setIsOpen(false);
        router.push('/');
    };


    const handleClose = () => {
        setIsOpen(false);
    };

    const handleDocLinkClick = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
        setIsOpen(false);
    };

    const handleContactClick = () => {
        // Add contact functionality here
        setIsOpen(false);
    };

    const handleHomePageClick = () => {
        // Navigate to home page
        setIsOpen(false);
        router.push('/');
    };

    // Close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    if (!isLoaded) {
        return null;
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Full page solid overlay - positioned below header but covers tabs */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-x-0 bottom-0 top-14 z-[70] bg-background"
                        onClick={handleBackdropClick}
                    />

                    {/* Menu content - positioned from top for finger friendliness */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.23, 1, 0.32, 1],
                            delay: 0.1
                        }}
                        className="fixed left-4 right-4 top-14 bottom-4 z-[71] font-mono overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-full w-full overflow-y-auto overscroll-contain scrollbar-hide">
                            <div className="space-y-4 p-1 pt-3">
                                {/* Primary action buttons - made smaller */}
                                <div className="space-y-2">
                                    {/* Upgrade to Pro */}
                                    <button className="w-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 rounded-xl px-4 py-3 text-sm font-medium select-none">
                                        Upgrade to Pro
                                    </button>

                                    {/* Contact button */}
                                    <button
                                        onClick={handleContactClick}
                                        className="w-full flex items-center justify-center px-4 py-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl transition-all duration-200 hover:bg-background/90 hover:border-border text-sm font-medium select-none"
                                    >
                                        Contact
                                    </button>
                                </div>

                                {/* Menu list items - reduced padding */}
                                <div className="space-y-0.5">
                                    {/* User info - no border, single line format */}
                                    <div className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200">
                                        <span className="text-sm text-foreground truncate">
                                            {user?.emailAddresses?.[0]?.emailAddress}
                                        </span>
                                        <div className="h-4 w-4 bg-foreground text-background flex items-center justify-center text-xs font-medium rounded-full flex-shrink-0 ml-3 transition-all duration-200">
                                            {user?.imageUrl && user.imageUrl.trim() !== '' ? (
                                                <img
                                                    src={user.imageUrl}
                                                    alt="User avatar"
                                                    className="h-full w-full object-cover rounded-full transition-all duration-200"
                                                />
                                            ) : (
                                                <span className="text-[10px] font-medium">{initials}</span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleOpenDashboard}
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 hover:bg-muted/30 text-sm group select-none"
                                    >
                                        <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">Dashboard</span>
                                        <House className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" weight="duotone" />
                                    </button>

                                    <button
                                        onClick={handleOpenSettings}
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 hover:bg-muted/30 text-sm group select-none"
                                    >
                                        <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">Account Settings</span>
                                        <Gear className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" weight="duotone" />
                                    </button>

                                    <button
                                        onClick={() => {
                                            // Keep user menu open - plan trip modal will layer on top
                                            setPlanTripModalOpen(true);
                                        }}
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 hover:bg-muted/30 text-sm group select-none"
                                    >
                                        <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">Plan Trip</span>
                                        <Plus className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" weight="duotone" />
                                    </button>

                                    <button
                                        onClick={() => {
                                            // Keep user menu open when launching the command menu
                                            setSearchModalOpen(true);
                                        }}
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 hover:bg-muted/30 text-sm group select-none"
                                    >
                                        <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">Command Menu</span>
                                        <kbd className="text-xs bg-background text-foreground border border-border px-2 py-1 rounded transition-all duration-200">⌘K</kbd>
                                    </button>

                                    {/* Theme selector */}
                                    <div className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group">
                                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">Theme</span>
                                        <ThemeSwitcher />
                                    </div>

                                    {/* Sign out button */}
                                    <SignOutButton>
                                        <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 hover:bg-red-500/10 text-sm group select-none">
                                            <span className="text-red-500/70 group-hover:text-red-600 transition-colors duration-200">Log Out</span>
                                            <div className="ml-auto">
                                                <SignOut className="w-4 h-4 text-red-500/70 group-hover:text-red-600 transition-colors duration-200" weight="duotone" />
                                            </div>
                                        </button>
                                    </SignOutButton>
                                </div>

                                {/* Documentation links - no Resources header, reduced spacing */}
                                <div className="space-y-0.5 pt-2 border-t border-border/30">
                                    {docLinks.map((link) => (
                                        <button
                                            key={link.id}
                                            onClick={() => handleDocLinkClick(link.url)}
                                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 hover:bg-muted/30 text-sm group select-none"
                                        >
                                            <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">{link.title}</span>
                                            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" weight="duotone" />
                                        </button>
                                    ))}

                                    <button
                                        onClick={handleHomePageClick}
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 hover:bg-muted/30 text-sm group select-none"
                                    >
                                        <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">Home page</span>
                                        <House className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-all duration-200" weight="duotone" />
                                    </button>
                                </div>


                            </div>
                        </div>
                    </motion.div>

                </>
            )}
        </AnimatePresence>
    );
}

// Main exported component with Suspense wrapper
export function MobileUserMenuOverlay() {
    return (
        <Suspense fallback={null}>
            <MobileUserMenuOverlayContent />
        </Suspense>
    );
} 