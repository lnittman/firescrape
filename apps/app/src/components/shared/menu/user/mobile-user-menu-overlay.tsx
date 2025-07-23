"use client";

import React, { useEffect, Suspense } from "react";

import {
    SignOut,
    ArrowUpRight,
    House,
    Gear,
    Plus,
} from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";

import { SignOutButton, useAuth, useUser } from "@repo/auth/client";

import { mobileUserMenuOpenAtom } from "@/atoms/menus";
import { searchModalOpenAtom } from "@/atoms/modals";
import { useAutoClose } from "@/hooks/use-auto-close";

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
        url: 'https://docs.firecrawl.dev/'
    },
    {
        id: '2',
        title: 'Changelog',
        description: 'Latest updates and releases',
        url: 'https://www.firecrawl.dev/changelog'
    },
];


// Main mobile user menu overlay content component
function MobileUserMenuOverlayContent() {
    const { isLoaded } = useAuth();
    const { user } = useUser();
    const router = useTransitionRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useAtom(mobileUserMenuOpenAtom);
    const [, setSearchModalOpen] = useAtom(searchModalOpenAtom);

    // Auto-close when transitioning to desktop
    useAutoClose(isOpen, () => setIsOpen(false));


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
        router.push('/settings');
    };

    // Navigate to Firecrawl dashboard
    const handleOpenDashboard = () => {
        setIsOpen(false);
        window.open('https://www.firecrawl.dev/app', '_blank', 'noopener,noreferrer');
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
        // Navigate to Firecrawl home page
        setIsOpen(false);
        window.open('https://firecrawl.dev', '_blank', 'noopener,noreferrer');
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
                    {/* Backdrop - fade the layout but keep header visible */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.23, 1, 0.32, 1]
                        }}
                        className="fixed inset-0 top-14 bg-background z-[40]"
                        onClick={handleBackdropClick}
                    />
                    
                    {/* Menu content - positioned from top for finger friendliness */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.23, 1, 0.32, 1]
                        }}
                        className="fixed left-4 right-4 top-14 bottom-4 z-[80] font-mono overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-full w-full overflow-y-auto overscroll-contain scrollbar-hide">
                            <div className="space-y-4 p-1 pt-3">
                                {/* Primary action buttons - made smaller */}
                                <div className="space-y-2">
                                    {/* Upgrade Plan */}
                                    <button 
                                        onClick={() => window.open('https://www.firecrawl.dev/pricing', '_blank', 'noopener,noreferrer')}
                                        className="w-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 rounded-xl px-4 py-3 text-sm font-medium select-none"
                                    >
                                        Upgrade Plan
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
                                            // Keep user menu open when launching the command menu
                                            setSearchModalOpen(true);
                                        }}
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 hover:bg-muted/30 text-sm group select-none"
                                    >
                                        <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">Command Menu</span>
                                        <kbd className="text-xs bg-background text-foreground border border-border px-2 py-1 rounded transition-all duration-200">⌘K</kbd>
                                    </button>


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
                                        <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">Home Page</span>
                                        <span className="text-base">🔥</span>
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