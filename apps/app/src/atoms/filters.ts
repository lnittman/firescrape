import { atom } from 'jotai';

// Filter types for trails
export type DifficultyFilter = 'all' | 'easy' | 'moderate' | 'hard' | 'expert';
export type SortOrder = 'nearest' | 'easiest' | 'shortest' | 'alphabetical' | 'newest' | 'oldest' | 'alphabetical-desc' | 'updated';
export type DateRange = 'today' | 'week' | 'month' | 'all';
export type WebStatus = 'all' | 'active' | 'archived' | 'PENDING' | 'PROCESSING' | 'COMPLETE' | 'FAILED';

// Trail filter atoms
export const difficultyFilterAtom = atom<DifficultyFilter>('all');
export const distanceFilterAtom = atom<number | null>(null);
export const featuresFilterAtom = atom<string[]>([]);
export const activitiesFilterAtom = atom<string[]>([]);

// Sort atom
export const sortOrderAtom = atom<SortOrder>('nearest');

// Mobile sheet atoms
export const mobileFiltersOpenAtom = atom(false);
export const mobileSortOpenAtom = atom(false);

// Derived atom to check if any filters are active
export const hasActiveFiltersAtom = atom((get) => {
    const difficulty = get(difficultyFilterAtom);
    const distance = get(distanceFilterAtom);
    const features = get(featuresFilterAtom);
    const activities = get(activitiesFilterAtom);
    
    return (
        difficulty !== 'all' ||
        distance !== null ||
        features.length > 0 ||
        activities.length > 0
    );
});

// Derived atom to count active filters
export const activeFilterCountAtom = atom((get) => {
    let count = 0;
    
    if (get(difficultyFilterAtom) !== 'all') count++;
    if (get(distanceFilterAtom) !== null) count++;
    if (get(featuresFilterAtom).length > 0) count++;
    if (get(activitiesFilterAtom).length > 0) count++;
    
    return count;
});

// Additional atoms for compatibility
export const activeFiltersAtom = hasActiveFiltersAtom;
export const dateRangeFilterAtom = atom<DateRange>('all');
export const statusFilterAtom = atom<WebStatus>('all');

