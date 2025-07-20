import { atom } from 'jotai';
import { 
    avatarUploadModalOpenAtom,
    deleteAccountModalOpenAtom,
    clearDataModalOpenAtom,
    searchModalOpenAtom,
    providerModelsModalOpenAtom,
    isMobileMenuOpenAtom,
    chatModalOpenAtom,
    trailDetailsModalOpenAtom,
    activityLogModalOpenAtom,
    emergencyContactModalOpenAtom,
    locationPickerOpenAtom,
    interestPickerOpenAtom
} from './modals';
import { mobileFiltersOpenAtom, mobileSortOpenAtom } from './filters';
import { quickActionsOpenAtom } from './navigation';

// Derived atom that tracks if we should show the blur overlay
// Combines both desktop modals and mobile menu states
export const shouldShowBlurOverlayAtom = atom((get) => {
    const isAvatarUploadOpen = get(avatarUploadModalOpenAtom);
    const isDeleteAccountOpen = get(deleteAccountModalOpenAtom);
    const isClearDataOpen = get(clearDataModalOpenAtom);
    const isSearchOpen = get(searchModalOpenAtom);
    const isProviderModelsOpen = get(providerModelsModalOpenAtom);
    const isMobileMenuOpen = get(isMobileMenuOpenAtom);
    const isChatOpen = get(chatModalOpenAtom);
    const isQuickActionsOpen = get(quickActionsOpenAtom);
    
    // Trail-specific modals
    const isTrailDetailsOpen = get(trailDetailsModalOpenAtom);
    const isActivityLogOpen = get(activityLogModalOpenAtom);
    const isEmergencyContactOpen = get(emergencyContactModalOpenAtom);
    
    // Mobile filter/sort states
    const isMobileFiltersOpen = get(mobileFiltersOpenAtom);
    const isMobileSortOpen = get(mobileSortOpenAtom);
    
    // Location and interest picker states
    const isLocationPickerOpen = get(locationPickerOpenAtom);
    const isInterestPickerOpen = get(interestPickerOpenAtom);
    
    // Show blur overlay if any modal or mobile menu is open
    return isAvatarUploadOpen || isDeleteAccountOpen || 
           isClearDataOpen || isSearchOpen || isProviderModelsOpen || 
           isMobileMenuOpen || isChatOpen || isQuickActionsOpen ||
           isTrailDetailsOpen || isActivityLogOpen || isEmergencyContactOpen ||
           isMobileFiltersOpen || isMobileSortOpen ||
           isLocationPickerOpen || isInterestPickerOpen;
});

// Atom to track if we're in a modal transition state
export const isModalTransitionAtom = atom((get) => {
    const isAvatarUploadOpen = get(avatarUploadModalOpenAtom);
    const isDeleteAccountOpen = get(deleteAccountModalOpenAtom);
    const isClearDataOpen = get(clearDataModalOpenAtom);
    const isSearchOpen = get(searchModalOpenAtom);
    const isProviderModelsOpen = get(providerModelsModalOpenAtom);
    const isChatOpen = get(chatModalOpenAtom);
    const isTrailDetailsOpen = get(trailDetailsModalOpenAtom);
    const isActivityLogOpen = get(activityLogModalOpenAtom);
    const isEmergencyContactOpen = get(emergencyContactModalOpenAtom);
    
    return isAvatarUploadOpen || isDeleteAccountOpen || 
           isClearDataOpen || isSearchOpen || isProviderModelsOpen ||
           isChatOpen || isTrailDetailsOpen || isActivityLogOpen || 
           isEmergencyContactOpen;
}); 