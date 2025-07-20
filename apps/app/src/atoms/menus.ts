import { atom } from 'jotai';
import type { Country } from '@/components/shared/ui/flag-picker-button';

export const mobileUserMenuOpenAtom = atom(false);
export const mobileNotificationsOpenAtom = atom(false);
export const mobileDocsOpenAtom = atom(false);
export const mobileFeedbackOpenAtom = atom(false);
export const mobileCountryPickerOpenAtom = atom(false);
export const mobileModelPickerOpenAtom = atom(false);
export const mobileProviderFilterOpenAtom = atom(false);
export const mobileProviderModelsOpenAtom = atom(false);

// Callback and state for mobile country picker
export interface CountryPickerCallback {
    onSelect?: (country: Country) => void;
}
export const mobileCountryPickerCallbackAtom = atom<CountryPickerCallback | null>(null);
export const mobileCountryPickerSelectedAtom = atom<Country | undefined>(undefined);

// State for mobile email settings menu
export const mobileEmailSettingsOpenAtom = atom(false);
export interface MobileEmailSettingsData {
    emailId: string;
    emailAddress: string;
    isPrimary: boolean;
    isVerified: boolean;
}
export const mobileEmailSettingsDataAtom = atom<MobileEmailSettingsData | null>(null);
export const mobileEmailSettingsCallbackAtom = atom<{
    onSetAsPrimary?: (emailId: string) => void;
    onDelete?: (emailId: string) => void;
} | null>(null);
export const mobileEmojiPickerOpenAtom = atom(false);
export const mobileEmojiPickerCallbackAtom = atom<((emoji: string) => void) | null>(null);


// State for mobile feedback type menu
export const mobileFeedbackTypeOpenAtom = atom(false);
export const mobileFeedbackTypeCallbackAtom = atom<((topic: string) => void) | null>(null);
export const mobileFeedbackTypeSelectedAtom = atom<string | undefined>(undefined);

// State for mobile provider models sheet
export const mobileProviderModelsDataAtom = atom<{
    provider: string;
    models: any[];
    enabled: string[];
    isVerified: boolean;
    onToggle: (id: string, value: boolean) => void;
} | null>(null);

// State for mobile chat overlay
export const mobileChatOpenAtom = atom(false);

