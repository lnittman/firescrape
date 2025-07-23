import { atom, useAtom } from 'jotai';

import { mobileFeedbackOpenAtom, mobileUserMenuOpenAtom } from './menus';

// Modal state atoms - each modal has its own open/close state
export const avatarUploadModalOpenAtom = atom(false);
export const deleteAccountModalOpenAtom = atom(false);
export const clearDataModalOpenAtom = atom(false);

// Debug: Log when atoms are accessed
if (typeof window !== 'undefined') {
    console.log('Modal atoms initialized:', {
        avatarUpload: false,
        deleteAccount: false,
        clearData: false
    });
}

export const searchModalOpenAtom = atom(false);
export const quickActionsOpenAtom = atom(false);

// Scrape modals
export const scrapeOptionsModalOpenAtom = atom(false);
export const scrapeAgentModalOpenAtom = atom(false);
export const scrapeTabsModalOpenAtom = atom(false);
export const scrapeFormatsModalOpenAtom = atom(false);

// Debug logging for scrape modals
if (typeof window !== 'undefined') {
    console.log('Scrape modal atoms initialized:', {
        scrapeOptions: false,
        scrapeAgent: false,
        scrapeTabs: false,
        scrapeFormats: false
    });
}

// Scrape tabs callback
export const scrapeTabsCallbackAtom = atom<{
  onSelectUrl?: (url: string) => void;
  onSelectMultipleUrls?: (urls: string[]) => void;
} | null>(null);

// Global mobile menu session state - controls main page blur overlay
// Only set to false when user completely exits mobile menu system
export const isMobileMenuOpenAtom = atom(false);

// Avatar upload modal specific state
export const avatarUploadFileAtom = atom<File | null>(null);

/**
 * Custom hook for opening mobile menus with automatic user menu closing
 * Centralizes the logic of closing the mobile user menu when opening other mobile menus
 * for smooth transitions between overlays.
 * 
 * @param menuAtom - The atom for the mobile menu to open
 * @returns Function to open the menu (automatically closes user menu first)
 */
export function useMobileMenuTransition<T extends boolean>(menuAtom: any, preserveUserMenu = false) {
    const [, setMenuOpen] = useAtom(menuAtom);
    const [, setMobileUserMenuOpen] = useAtom(mobileUserMenuOpenAtom);

    const openMenu = () => {
        if (!preserveUserMenu) {
            setMobileUserMenuOpen(false);
        }
        setMenuOpen(true);
    };

    return openMenu;
}

export const shouldShowBlurOverlayAtom = atom((get) => {
    const isAvatarUploadOpen = get(avatarUploadModalOpenAtom);
    const isDeleteAccountOpen = get(deleteAccountModalOpenAtom);
    const isClearDataOpen = get(clearDataModalOpenAtom);
    const isSearchOpen = get(searchModalOpenAtom);
    
    // Mobile feedback overlay
    const isMobileFeedbackOpen = get(mobileFeedbackOpenAtom);
    
    // Show blur overlay if any modal is open (excluding mobile user menu and scrape modals)
    return isAvatarUploadOpen || isDeleteAccountOpen || 
           isClearDataOpen || isSearchOpen || 
           isMobileFeedbackOpen;
});

// Atom to track if we're in a modal transition state
export const isModalTransitionAtom = atom((get) => {
    const isAvatarUploadOpen = get(avatarUploadModalOpenAtom);
    const isDeleteAccountOpen = get(deleteAccountModalOpenAtom);
    const isClearDataOpen = get(clearDataModalOpenAtom);
    const isSearchOpen = get(searchModalOpenAtom);
    const isScrapeOptionsOpen = get(scrapeOptionsModalOpenAtom);
    const isScrapeAgentOpen = get(scrapeAgentModalOpenAtom);
    const isScrapeTabsOpen = get(scrapeTabsModalOpenAtom);
    const isScrapeFormatsOpen = get(scrapeFormatsModalOpenAtom);
    
    return isAvatarUploadOpen || isDeleteAccountOpen || 
           isClearDataOpen || isSearchOpen ||
           isScrapeOptionsOpen || isScrapeAgentOpen || isScrapeTabsOpen || isScrapeFormatsOpen;
}); 