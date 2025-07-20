import { atom } from 'jotai';
import type { Trail } from '@repo/api';

export type ViewMode = 'grid' | 'list' | 'map';
export type LayoutMode = 'wide' | 'desktop' | 'mobile';

// View mode atom
export const viewModeAtom = atom<ViewMode>('grid');

// Search state atoms
export const searchQueryAtom = atom<string>('');
export const searchResultsAtom = atom<Trail[]>([]);

// Layout state atoms
export const layoutModeAtom = atom<LayoutMode>('desktop');

// Activity tracking atoms
export const isTrackingAtom = atom<boolean>(false);
export const currentActivityIdAtom = atom<string | null>(null);

// Trail actions state atoms
export const savingTrailsAtom = atom<Set<string>>(new Set<string>());
export const loadingTrailsAtom = atom<Set<string>>(new Set<string>());

// User location atom
export const userLocationAtom = atom<{ lat: number; lng: number } | null>(null);

// Derived atoms for computed values
export const nearbyTrailsCountAtom = atom<number>(0);

// Write-only atoms for actions
export const addSavingTrailAtom = atom(
  null,
  (get, set, trailId: string) => {
    const current = get(savingTrailsAtom);
    set(savingTrailsAtom, new Set(current).add(trailId));
  }
);

export const removeSavingTrailAtom = atom(
  null,
  (get, set, trailId: string) => {
    const current = get(savingTrailsAtom);
    const newSet = new Set(current);
    newSet.delete(trailId);
    set(savingTrailsAtom, newSet);
  }
);

export const clearSearchAtom = atom(
  null,
  (get, set) => {
    set(searchQueryAtom, '');
    set(searchResultsAtom, []);
  }
);

// Atom to track if we have search results
export const hasSearchResultsAtom = atom((get) => {
  const query = get(searchQueryAtom);
  const results = get(searchResultsAtom);
  return query.trim().length > 0 && results.length > 0;
});

// Atom to track if search is active but has no results
export const hasEmptySearchAtom = atom((get) => {
  const query = get(searchQueryAtom);
  const results = get(searchResultsAtom);
  return query.trim().length > 0 && results.length === 0;
}); 