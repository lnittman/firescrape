"use client";

import React, { useState, Suspense, useEffect } from "react";

import {
  SignOut,
  Gear,
  House,
  User,
} from "@phosphor-icons/react/dist/ssr";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { useTransitionRouter } from "next-view-transitions";


import { SignOutButton, useUser } from "@repo/auth/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/design/components/ui/dropdown-menu";
import { Skeleton } from "@repo/design/components/ui/skeleton";
import { cn } from "@repo/design/lib/utils";

import { searchModalOpenAtom } from "@/atoms/modals";

// Skeleton component for the user menu button
function UserMenuSkeleton() {
  return (
    <div className="h-8 w-8 flex-shrink-0">
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
  );
}

// Main user menu content component
function UserMenuContent() {
  const { user } = useUser();

  const router = useTransitionRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [, setSearchModalOpen] = useAtom(searchModalOpenAtom);

  // Close menu when resizing to mobile to prevent UI issues
  useEffect(() => {
    const handleResize = () => {
      if (menuOpen && window.innerWidth < 640) { // Close on mobile breakpoint
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen]);

  // Get user initials for avatar fallback
  const initials = user?.fullName
    ? user.fullName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
    : user?.emailAddresses?.[0]?.emailAddress?.charAt(0).toUpperCase() || "?";

  // Check if user has a custom avatar
  const hasCustomAvatar = user?.imageUrl && user.imageUrl.trim() !== '';

  // Navigate to settings page
  const handleOpenSettings = () => {
    setMenuOpen(false);
    router.push('/settings');
  };

  // Navigate to dashboard
  const handleOpenDashboard = () => {
    setMenuOpen(false);
    router.push('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "h-8 w-8 bg-transparent text-foreground flex items-center justify-center text-xs font-medium flex-shrink-0 border border-border transition-all duration-200 rounded-lg overflow-hidden",
              "hover:bg-accent hover:border-foreground/20",
              "focus:outline-none select-none",
              menuOpen ? "bg-accent/80 border-foreground/30" : ""
            )}
          >
            {hasCustomAvatar ? (
              <img
                src={user.imageUrl}
                alt="User avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          side="bottom"
          sideOffset={8}
          className={cn(
            "w-[240px] p-0 bg-popover border-border/50 rounded-lg font-mono overflow-hidden z-[90]"
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 0.8
            }}
          >
            {/* User info section */}
            <div className="px-3 py-2.5">
              <p className="text-sm font-medium text-foreground truncate">{user?.fullName || user?.firstName || "User"}</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{user?.emailAddresses?.[0]?.emailAddress}</p>
            </div>

            {/* Main menu items */}
            <div className="py-1 space-y-1">
              <DropdownMenuItem
                onClick={handleOpenDashboard}
                className="rounded-md mx-1 px-2 py-1.5 text-sm cursor-pointer transition-all duration-200 hover:bg-muted/30 group flex items-center justify-between"
              >
                <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">Dashboard</span>
                <House className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" weight="duotone" />
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleOpenSettings}
                className="rounded-md mx-1 px-2 py-1.5 text-sm cursor-pointer transition-all duration-200 hover:bg-muted/30 group flex items-center justify-between"
              >
                <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">Account Settings</span>
                <User className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" weight="duotone" />
              </DropdownMenuItem>

            </div>

            <DropdownMenuSeparator className="my-0" />

            {/* Command menu and theme section */}
            <div className="py-1 space-y-1">
              <div
                onClick={() => {
                  setMenuOpen(false);
                  setSearchModalOpen(true);
                }}
                className="rounded-md mx-1 px-2 py-1.5 text-sm cursor-pointer transition-all duration-200 hover:bg-muted/30 group flex items-center justify-between"
              >
                <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">Command Menu</span>
                <kbd className="ml-auto text-xs bg-background text-foreground border border-border px-1.5 py-0.5 rounded transition-all duration-200">⌘K</kbd>
              </div>

            </div>

            <DropdownMenuSeparator className="my-0" />

            {/* Bottom section - home page and log out without divider */}
            <div className="py-1 space-y-1">
              <DropdownMenuItem
                onClick={() => router.push('/')}
                className="rounded-md mx-1 px-2 py-1.5 text-sm cursor-pointer transition-all duration-200 hover:bg-muted/30 group flex items-center justify-between"
              >
                <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">Home Page</span>
                <span className="text-base">🔥</span>
              </DropdownMenuItem>

              <SignOutButton>
                <DropdownMenuItem
                  className="rounded-md mx-1 px-2 py-1.5 text-sm cursor-pointer transition-all duration-200 hover:bg-red-500/10 group flex items-center justify-between"
                >
                  <span className="text-red-500/70 group-hover:text-red-600 transition-colors duration-200">Log Out</span>
                  <SignOut className="w-4 h-4 text-red-500/70 group-hover:text-red-600 transition-colors duration-200" weight="duotone" />
                </DropdownMenuItem>
              </SignOutButton>
            </div>

            <DropdownMenuSeparator className="my-0" />

            {/* Upgrade section */}
            <div className="p-4">
              <button className="w-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 rounded-md px-3 py-1.5 text-sm font-medium">
                Upgrade to Pro
              </button>
            </div>
          </motion.div>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}

// Main exported component with Suspense wrapper
export function UserMenu() {
  return (
    <Suspense fallback={<UserMenuSkeleton />}>
      <UserMenuContent />
    </Suspense>
  );
} 
