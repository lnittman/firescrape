"use client";

import { useSetAtom } from "jotai";
import { useIsMobile } from "@repo/design/hooks/useMobile";
import {
  searchModalOpenAtom,
  deleteAccountModalOpenAtom,
  clearDataModalOpenAtom,
  avatarUploadModalOpenAtom,
} from "@/atoms/modals";

/**
 * Unified hook for managing modals
 * Automatically handles desktop vs mobile rendering
 */
export function useModals() {
  const isMobile = useIsMobile();

  // Modal setters
  const setSearchModalOpen = useSetAtom(searchModalOpenAtom);
  const setDeleteAccountOpen = useSetAtom(deleteAccountModalOpenAtom);
  const setClearDataOpen = useSetAtom(clearDataModalOpenAtom);
  const setAvatarUploadOpen = useSetAtom(avatarUploadModalOpenAtom);

  return {
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

    // Utility to close all modals
    closeAll: () => {
      setSearchModalOpen(false);
      setDeleteAccountOpen(false);
      setClearDataOpen(false);
      setAvatarUploadOpen(false);
    },

    // Device info
    isMobile,
  };
}