"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { useTransitionRouter } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { CollaborationProvider } from "@repo/collaboration";
import { cn } from "@repo/design/lib/utils";

import { NavigationHeader } from "@/components/shared/layout/navigation-header";
import { NavigationTabs } from "@/components/shared/layout/navigation-tabs";
import { HeaderFadeGradient } from "@/components/shared/layout/header-fade-gradient";
import { FontLoader } from "@/components/shared/font-loader";
import { OfflineIndicator } from "@/components/shared/offline-indicator";
import { Dock } from "@/components/shared/dock";
import { ChatButton } from "@/components/shared/chat/chat-button";
import { useState } from "react";

import { UnifiedBlurOverlay } from "@/components/shared/layout/unified-blur-overlay";
import { MobileUserMenuOverlay } from "@/components/shared/menu/user/mobile-user-menu-overlay";
import { MobileNotificationsOverlay } from "@/components/shared/menu/notifications/mobile-notifications-overlay";
import { MobileDocsOverlay } from "@/components/shared/menu/docs/mobile-docs-overlay";
import { MobileFeedbackOverlay } from "@/components/shared/menu/feedback/mobile-feedback-overlay";
import { MobileFeedbackTypeMenu } from "@/components/shared/menu/feedback/mobile-feedback-type-menu";
import { MobileCountryPickerOverlay } from "@/components/shared/menu/mobile-country-picker-overlay";
import { MobileEmailSettingsOverlay } from "@/components/shared/menu/email/mobile-email-settings-overlay";

import { MobileEmojiPickerMenu } from "@/components/shared/menu/emoji/mobile-emoji-picker-menu";

// Import all modals
import { SearchModal } from "@/components/shared/modal/search-modal";
import { MobileSearchModal } from "@/components/shared/modal/mobile-search-modal";
import { QuickActionsModal } from "@/components/shared/modal/quick-actions-modal";
import { AvatarUploadModal } from "@/components/shared/modal/avatar-upload-modal";
import { MobileAvatarUploadModal } from "@/components/shared/modal/mobile-avatar-upload-modal";
import { DeleteAccountModal } from "@/components/shared/modal/delete-account-modal";
import { MobileDeleteAccountModal } from "@/components/shared/modal/mobile-delete-account-modal";
import { ClearDataModal } from "@/components/shared/modal/clear-data-modal";
import { MobileClearDataModal } from "@/components/shared/modal/mobile-clear-data-modal";
import { LocationPickerDialog } from "@/components/explore/location-picker-dialog";
import { InterestPickerDialog } from "@/components/explore/interest-picker-dialog";
import { MobileLocationPicker } from "@/components/explore/mobile-location-picker";
import { MobileInterestPicker } from "@/components/explore/mobile-interest-picker";

import { MobileFiltersSheet } from "@/components/shared/menu/filters/mobile-filters-sheet";
import { MobileSortSheet } from "@/components/shared/menu/sort/mobile-sort-sheet";

// Import modal atoms
import { searchModalOpenAtom } from "@/atoms/modals";
import { shouldShowBlurOverlayAtom } from "@/atoms/modal-overlay";
import { locationPickerOpenAtom } from "@/atoms/modals";
import { interestPickerOpenAtom } from "@/atoms/modals";

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const router = useTransitionRouter();
  const mainRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const [, setIsSearchModalOpen] = useAtom(searchModalOpenAtom);
  const [shouldShowBlur] = useAtom(shouldShowBlurOverlayAtom);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useAtom(locationPickerOpenAtom);
  const [isInterestPickerOpen, setIsInterestPickerOpen] = useAtom(interestPickerOpenAtom);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedInterests, setSelectedInterests] = useState<any[]>([]);

  // Check if navigation tabs are shown
  const showNavTabs = pathname.includes('/trails/') ||
    pathname.includes('/activities/') ||
    pathname.includes('/profile/');

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

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <CollaborationProvider
      url={process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:3011"}
      enabled={true}
    >
      <div className="min-h-screen bg-background antialiased font-mono flex flex-col">
        <FontLoader />

        {/* Fixed navigation header */}
        <NavigationHeader />

        {/* Fixed navigation tabs */}
        <NavigationTabs />

        {/* Header fade gradient - always visible */}
        <HeaderFadeGradient />

        <main
          ref={mainRef}
          className={cn(
            "flex-1 flex flex-col relative z-0 overflow-y-auto",
            showNavTabs ? "mt-[141px] lg:mt-[93px]" : "mt-[93px]"
          )}
        >
          {children}
        </main>


        {/* Dock - app-wide */}
        <Dock
          onInterestsClick={() => setIsInterestPickerOpen(true)}
        />

        {/* Chat Button - bottom left corner */}
        <ChatButton />

        {/* Global Unified Blur Overlay (Desktop + Mobile) - Must be behind all modals */}
        <UnifiedBlurOverlay />

        {/* Quick actions modal */}
        <QuickActionsModal />

        {/* Desktop Modals */}
        <div className="hidden md:block">
          <SearchModal />
          <DeleteAccountModal />
          <ClearDataModal />
          <AvatarUploadModal />
        </div>

        {/* Mobile Modals */}
        <div className="md:hidden">
          <MobileSearchModal />
          <MobileDeleteAccountModal />
          <MobileClearDataModal />
          <MobileAvatarUploadModal />
        </div>

        {/* Mobile Menu Overlays */}
        <MobileUserMenuOverlay />
        <MobileNotificationsOverlay onNavigate={handleNavigate} />
        <MobileDocsOverlay />
        <MobileFeedbackOverlay />
        <MobileFeedbackTypeMenu />
        <MobileCountryPickerOverlay />

        <MobileEmailSettingsOverlay />
        <MobileEmojiPickerMenu />

        <MobileFiltersSheet />
        <MobileSortSheet />

        {/* Offline Indicator */}
        <OfflineIndicator />

        {/* Location and Interest Dialogs - Desktop Only */}
        <div className="hidden md:block">
          <LocationPickerDialog
            isOpen={isLocationPickerOpen}
            onClose={() => setIsLocationPickerOpen(false)}
            onLocationSelect={setSelectedLocation}
            selectedLocation={selectedLocation}
          />
          <InterestPickerDialog
            isOpen={isInterestPickerOpen}
            onClose={() => setIsInterestPickerOpen(false)}
            onInterestsSelected={setSelectedInterests}
            selectedInterests={selectedInterests}
          />
        </div>

        {/* Location and Interest Sheets - Mobile */}
        <div className="md:hidden">
          <MobileLocationPicker
            isOpen={isLocationPickerOpen}
            onClose={() => setIsLocationPickerOpen(false)}
            onLocationSelect={setSelectedLocation}
            selectedLocation={selectedLocation}
          />
          <MobileInterestPicker
            isOpen={isInterestPickerOpen}
            onClose={() => setIsInterestPickerOpen(false)}
            onInterestsSelected={setSelectedInterests}
            selectedInterests={selectedInterests}
          />
        </div>
      </div>
    </CollaborationProvider>
  );
}
