import { atom } from 'jotai';
import type { Profile, AppearanceSettings, NotificationSettings, AISettings } from '@repo/api';

// Individual settings atoms
export const profileAtom = atom<Profile | null>(null);
export const appearanceSettingsAtom = atom<AppearanceSettings | null>(null);
export const notificationSettingsAtom = atom<NotificationSettings | null>(null);
export const aiSettingsAtom = atom<AISettings | null>(null);

// Loading states for each settings category
export const profileLoadingAtom = atom<boolean>(false);
export const appearanceSettingsLoadingAtom = atom<boolean>(false);
export const notificationSettingsLoadingAtom = atom<boolean>(false);
export const aiSettingsLoadingAtom = atom<boolean>(false);

// Error states for each settings category
export const profileErrorAtom = atom<string | null>(null);
export const appearanceSettingsErrorAtom = atom<string | null>(null);
export const notificationSettingsErrorAtom = atom<string | null>(null);
export const aiSettingsErrorAtom = atom<string | null>(null);



// Write-only atoms for updating state
export const setProfileAtom = atom(
  null,
  (get, set, profile: Profile | null) => {
    set(profileAtom, profile);
  }
);

export const setAppearanceSettingsAtom = atom(
  null,
  (get, set, settings: AppearanceSettings | null) => {
    set(appearanceSettingsAtom, settings);
  }
);

export const setNotificationSettingsAtom = atom(
  null,
  (get, set, settings: NotificationSettings | null) => {
    set(notificationSettingsAtom, settings);
  }
);

export const setAISettingsAtom = atom(
  null,
  (get, set, settings: AISettings | null) => {
    set(aiSettingsAtom, settings);
  }
);

// Write-only atoms for loading states
export const setProfileLoadingAtom = atom(
  null,
  (get, set, loading: boolean) => {
    set(profileLoadingAtom, loading);
  }
);

export const setAppearanceSettingsLoadingAtom = atom(
  null,
  (get, set, loading: boolean) => {
    set(appearanceSettingsLoadingAtom, loading);
  }
);

export const setNotificationSettingsLoadingAtom = atom(
  null,
  (get, set, loading: boolean) => {
    set(notificationSettingsLoadingAtom, loading);
  }
);

export const setAISettingsLoadingAtom = atom(
  null,
  (get, set, loading: boolean) => {
    set(aiSettingsLoadingAtom, loading);
  }
);

// Write-only atoms for error states
export const setProfileErrorAtom = atom(
  null,
  (get, set, error: string | null) => {
    set(profileErrorAtom, error);
  }
);

export const setAppearanceSettingsErrorAtom = atom(
  null,
  (get, set, error: string | null) => {
    set(appearanceSettingsErrorAtom, error);
  }
);

export const setNotificationSettingsErrorAtom = atom(
  null,
  (get, set, error: string | null) => {
    set(notificationSettingsErrorAtom, error);
  }
);

export const setAISettingsErrorAtom = atom(
  null,
  (get, set, error: string | null) => {
    set(aiSettingsErrorAtom, error);
  }
); 