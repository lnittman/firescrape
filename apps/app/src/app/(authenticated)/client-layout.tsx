"use client";

import { ReactNode, useEffect, useRef } from "react";

import { useAtom } from "jotai";
import { usePathname } from "next/navigation";

import { cn } from "@repo/design/lib/utils";

import { NavigationHeader } from "@/components/shared/layout/navigation-header";
import { NavigationTabs } from "@/components/shared/layout/navigation-tabs";
import { NavigationFooter } from "@/components/shared/layout/navigation-footer";
import { HeaderFadeGradient } from "@/components/shared/layout/header-fade-gradient";
import { OfflineIndicator } from "@/components/shared/offline-indicator";

import { UnifiedBlurOverlay } from "@/components/shared/layout/unified-blur-overlay";
import { MobileBlurOverlay } from "@/components/shared/layout/mobile-blur-overlay";
import { MobileUserMenuOverlay } from "@/components/shared/menu/user/mobile-user-menu-overlay";

import { SearchModal } from "@/components/shared/modal/search/search-modal";
import { MobileSearchModal } from "@/components/shared/modal/search/mobile-search-modal";
import { AvatarUploadModal } from "@/components/shared/modal/user/avatar/avatar-upload-modal";
import { MobileAvatarUploadModal } from "@/components/shared/modal/user/avatar/mobile-avatar-upload-modal";
import { DeleteAccountModal } from "@/components/shared/modal/user/delete-account/delete-account-modal";
import { MobileDeleteAccountModal } from "@/components/shared/modal/user/delete-account/mobile-delete-account-modal";
import { ClearDataModal } from "@/components/shared/modal/user/clear-data/clear-data-modal";
import { MobileClearDataModal } from "@/components/shared/modal/user/clear-data/mobile-clear-data-modal";

import { MobileFeedbackOverlay } from "@/components/shared/menu/feedback/mobile-feedback-overlay";
import { MobileFeedbackTypeMenu } from "@/components/shared/menu/feedback/mobile-feedback-type-menu";

import { ScrapeOptionsSheet } from "@/components/shared/menu/scrape/options/scrape-options-sheet";
import { ScrapeAgentSheet } from "@/components/shared/menu/scrape/agent/scrape-agent-sheet";
import { ScrapeFormatsSheet } from "@/components/shared/menu/scrape/formats/scrape-formats-sheet";
import { MobileScrapeExampleMenu } from "@/components/shared/menu/scrape/agent/scrape-agent-example-submenu";
import { MobileScrapeModelMenu } from "@/components/shared/menu/scrape/agent/scrape-agent-model-submenu";

import { searchModalOpenAtom, shouldShowBlurOverlayAtom } from "@/atoms/modals";

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const mainRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const [, setIsSearchModalOpen] = useAtom(searchModalOpenAtom);
  const [shouldShowBlur] = useAtom(shouldShowBlurOverlayAtom);

  // Check if navigation tabs are shown
  const showNavTabs = pathname.includes('/runs/') ||
    pathname.includes('/account/');

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command-K for search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setIsSearchModalOpen]);

  // Prevent body scroll when any modal or mobile menu is open
  useEffect(() => {
    if (shouldShowBlur) {
      const previousHtmlOverflow = document.documentElement.style.overflow;
      const previousBodyOverflow = document.body.style.overflow;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = previousHtmlOverflow;
        document.body.style.overflow = previousBodyOverflow;
      };
    }
  }, [shouldShowBlur]);

  return (
    <div className="min-h-screen bg-background antialiased font-mono flex flex-col">
      {/* Fixed navigation header */}
      <NavigationHeader />

      {/* Fixed navigation tabs - only show on detail pages */}
      {showNavTabs && <NavigationTabs />}

      {/* Header fade gradient - always visible */}
      <HeaderFadeGradient />

      <main
        ref={mainRef}
        className={cn(
          "flex-1 flex flex-col relative z-0 overflow-y-auto overflow-x-hidden",
          showNavTabs ? "mt-[141px] lg:mt-[93px]" : "mt-[93px]"
        )}
      >
        {children}
      </main>

      {/* Bottom fade gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none z-[45]" />

      {/* Navigation Footer - appears above gradient */}
      <NavigationFooter />

      {/* Global Unified Blur Overlay (Desktop + Mobile) - Must be behind all modals */}
      <UnifiedBlurOverlay />
      
      {/* Mobile-specific blur overlay for mobile sheets */}
      <MobileBlurOverlay />

      {/* Quick actions modal */}
      {/* <QuickActionsModal /> */}

      {/* Desktop Modals */}
      <div className="hidden sm:block">
        <SearchModal />
        <DeleteAccountModal />
        <ClearDataModal />
        <AvatarUploadModal />
      </div>

      {/* Mobile Modals */}
      <div className="sm:hidden">
        <MobileSearchModal />
        <MobileDeleteAccountModal />
        <MobileClearDataModal />
        <MobileAvatarUploadModal />
        <ScrapeOptionsSheet />
        <ScrapeAgentSheet />
        <ScrapeFormatsSheet />
      </div>

      {/* Mobile Menu Overlays */}
      <MobileUserMenuOverlay />
      <MobileFeedbackOverlay />
      <MobileFeedbackTypeMenu />

      {/* <MobileFiltersSheet /> */}
      {/* <MobileSortSheet /> */}
      
      {/* Mobile Scrape Submenus */}
      <MobileScrapeExampleMenu />
      <MobileScrapeModelMenu />

      {/* Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
}