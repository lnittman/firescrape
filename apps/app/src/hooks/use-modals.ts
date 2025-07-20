"use client";

import { useSetAtom } from "jotai";
import { useIsMobile } from "@repo/design/hooks/use-mobile";
import {
  locationPickerOpenAtom,
  interestPickerOpenAtom,
  searchModalOpenAtom,
  deleteAccountModalOpenAtom,
  clearDataModalOpenAtom,
  avatarUploadModalOpenAtom,
  trailDetailsModalOpenAtom,
  selectedTrailAtom,
} from "@/atoms/modals";
import type { Trail } from "@repo/api";

/**
 * Unified hook for managing modals
 * Automatically handles desktop vs mobile rendering
 */
export function useModals() {
  const isMobile = useIsMobile();

  // Modal setters
  const setLocationPickerOpen = useSetAtom(locationPickerOpenAtom);
  const setInterestPickerOpen = useSetAtom(interestPickerOpenAtom);
  const setSearchModalOpen = useSetAtom(searchModalOpenAtom);
  const setDeleteAccountOpen = useSetAtom(deleteAccountModalOpenAtom);
  const setClearDataOpen = useSetAtom(clearDataModalOpenAtom);
  const setAvatarUploadOpen = useSetAtom(avatarUploadModalOpenAtom);
  const setTrailDetailsOpen = useSetAtom(trailDetailsModalOpenAtom);
  const setSelectedTrail = useSetAtom(selectedTrailAtom);

  return {
    // Location picker
    openLocationPicker: () => setLocationPickerOpen(true),
    closeLocationPicker: () => setLocationPickerOpen(false),

    // Interest picker
    openInterestPicker: () => setInterestPickerOpen(true),
    closeInterestPicker: () => setInterestPickerOpen(false),

    // Search modal
    openSearch: () => setSearchModalOpen(true),
    closeSearch: () => setSearchModalOpen(false),

    // Account modals
    openDeleteAccount: () => setDeleteAccountOpen(true),
    closeDeleteAccount: () => setDeleteAccountOpen(false),
    
    openClearData: () => setClearDataOpen(true),
    closeClearData: () => setClearDataOpen(false),
    
    openAvatarUpload: () => setAvatarUploadOpen(true),
    closeAvatarUpload: () => setAvatarUploadOpen(false),

    // Trail details
    openTrailDetails: (trail: Trail) => {
      setSelectedTrail(trail);
      setTrailDetailsOpen(true);
    },
    closeTrailDetails: () => {
      setTrailDetailsOpen(false);
      setSelectedTrail(null);
    },

    // Utility to close all modals
    closeAll: () => {
      setLocationPickerOpen(false);
      setInterestPickerOpen(false);
      setSearchModalOpen(false);
      setDeleteAccountOpen(false);
      setClearDataOpen(false);
      setAvatarUploadOpen(false);
      setTrailDetailsOpen(false);
    },

    // Device info
    isMobile,
  };
}