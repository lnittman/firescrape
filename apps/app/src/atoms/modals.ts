import { atom } from 'jotai';
import { useAtom } from 'jotai';
import { mobileUserMenuOpenAtom } from './menus';
import type { Trail } from '@repo/api';

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
export const providerModelsModalOpenAtom = atom(false);
export const chatModalOpenAtom = atom(false);

// Trail-specific modal atoms
export const trailDetailsModalOpenAtom = atom(false);
export const activityLogModalOpenAtom = atom(false);
export const emergencyContactModalOpenAtom = atom(false);

// Global mobile menu session state - controls main page blur overlay
// Only set to false when user completely exits mobile menu system
export const isMobileMenuOpenAtom = atom(false);

// Avatar upload modal specific state
export const avatarUploadFileAtom = atom<File | null>(null);

// Provider models modal specific state
export const providerModelsModalDataAtom = atom<{
    provider: string;
    models: any[];
    enabled: string[];
    isVerified: boolean;
    onToggle: (id: string, value: boolean) => void;
} | null>(null);

// Trail modal specific state
export const selectedTrailAtom = atom<Trail | null>(null);

// Chat modal specific state
export const chatModalDataAtom = atom<Trail | null>(null);

// chat panel state (desktop)
export const foxChatOpenAtom = atom(false);

// Trail planning modal atoms
export const planTripModalOpenAtom = atom(false);
export const shareTrailModalOpenAtom = atom(false);
export const weatherAlertModalOpenAtom = atom(false);

// Location and Interest modal atoms
export const locationPickerOpenAtom = atom(false);
export const interestPickerOpenAtom = atom(false);

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
