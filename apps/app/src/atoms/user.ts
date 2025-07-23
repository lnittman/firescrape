import { atom } from 'jotai';
import type { Profile, AISettings } from '@/lib/api/schemas';

// Individual settings atoms
export const profileAtom = atom<Profile | null>(null);
export const aiSettingsAtom = atom<AISettings | null>(null);

// Loading states for each settings category
export const profileLoadingAtom = atom<boolean>(false);
export const aiSettingsLoadingAtom = atom<boolean>(false);

// Error states for each settings category
export const profileErrorAtom = atom<string | null>(null);
export const aiSettingsErrorAtom = atom<string | null>(null);



// Write-only atoms for updating state
export const setProfileAtom = atom(
  null,
  (get, set, profile: Profile | null) => {
    set(profileAtom, profile);
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

export const setAISettingsErrorAtom = atom(
  null,
  (get, set, error: string | null) => {
    set(aiSettingsErrorAtom, error);
  }
); 