'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { MobileSheet } from '@/components/shared/ui/mobile-sheet';
import { Badge } from '@repo/design/components/ui/badge';
import { cn } from '@repo/design/lib/utils';
import { 
    mobileFiltersOpenAtom,
    difficultyFilterAtom,
    distanceFilterAtom,
    featuresFilterAtom,
    activitiesFilterAtom,
    hasActiveFiltersAtom,
    activeFilterCountAtom,
    type DifficultyFilter
} from '@/atoms/filters';
import { Mountains, Path, Tree, Drop, Flower, PawPrint } from '@phosphor-icons/react/dist/ssr';

const difficultyOptions: { value: DifficultyFilter; label: string; color: string }[] = [
    { value: 'all', label: 'All Levels', color: 'text-gray-600' },
    { value: 'easy', label: 'Easy', color: 'text-green-600' },
    { value: 'moderate', label: 'Moderate', color: 'text-yellow-600' },
    { value: 'hard', label: 'Hard', color: 'text-orange-600' },
    { value: 'expert', label: 'Expert', color: 'text-red-600' },
];

const featureOptions = [
    { value: 'waterfall', label: 'Waterfall', icon: Drop },
    { value: 'lake', label: 'Lake', icon: Drop },
    { value: 'summit', label: 'Summit', icon: Mountains },
    { value: 'wildlife', label: 'Wildlife', icon: PawPrint },
    { value: 'wildflowers', label: 'Wildflowers', icon: Flower },
    { value: 'forest', label: 'Forest', icon: Tree },
];

const activityOptions = [
    { value: 'hiking', label: 'Hiking' },
    { value: 'biking', label: 'Mountain Biking' },
    { value: 'running', label: 'Trail Running' },
    { value: 'camping', label: 'Camping' },
    { value: 'climbing', label: 'Rock Climbing' },
    { value: 'photography', label: 'Photography' },
];

export function MobileFiltersSheet() {
    const [isOpen, setIsOpen] = useAtom(mobileFiltersOpenAtom);
    const [difficulty, setDifficulty] = useAtom(difficultyFilterAtom);
    const [maxDistance, setMaxDistance] = useAtom(distanceFilterAtom);
    const [features, setFeatures] = useAtom(featuresFilterAtom);
    const [activities, setActivities] = useAtom(activitiesFilterAtom);
    const [hasActiveFilters] = useAtom(hasActiveFiltersAtom);
    const [activeFilterCount] = useAtom(activeFilterCountAtom);

    const handleClearFilters = () => {
        setDifficulty('all');
        setMaxDistance(null);
        setFeatures([]);
        setActivities([]);
    };

    return (
        <MobileSheet
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Filter Trails"
        >
            <div className="p-6 space-y-6">
                {/* Active filters count */}
                {hasActiveFilters && (
                    <div className="flex items-center justify-between">
                        <Badge variant="secondary">
                            {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
                        </Badge>
                        <button
                            onClick={handleClearFilters}
                            className="text-sm text-primary hover:underline"
                        >
                            Clear all
                        </button>
                    </div>
                )}

                {/* Difficulty Filter */}
                <div>
                    <h3 className="text-sm font-medium mb-3">Difficulty Level</h3>
                    <div className="space-y-2">
                        {difficultyOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setDifficulty(option.value)}
                                className={cn(
                                    "w-full flex items-center justify-between p-3 rounded-lg border transition-colors",
                                    difficulty === option.value
                                        ? "bg-primary/5 border-primary"
                                        : "hover:bg-muted/50"
                                )}
                            >
                                <span className={cn("font-medium", option.color)}>
                                    {option.label}
                                </span>
                                {difficulty === option.value && (
                                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                        <div className="w-2 h-2 bg-background rounded-full" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Distance Filter */}
                <div>
                    <h3 className="text-sm font-medium mb-3">
                        Maximum Distance: {maxDistance || 'Any'} miles
                    </h3>
                    <input
                        type="range"
                        min="0"
                        max="20"
                        step="1"
                        value={maxDistance || 0}
                        onChange={(e) => setMaxDistance(Number(e.target.value) || null)}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Any</span>
                        <span>5mi</span>
                        <span>10mi</span>
                        <span>15mi</span>
                        <span>20mi</span>
                    </div>
                </div>

                {/* Features Filter */}
                <div>
                    <h3 className="text-sm font-medium mb-3">Trail Features</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {featureOptions.map((option) => {
                            const Icon = option.icon;
                            const isSelected = features.includes(option.value);
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setFeatures(
                                            isSelected
                                                ? features.filter(f => f !== option.value)
                                                : [...features, option.value]
                                        );
                                    }}
                                    className={cn(
                                        "flex items-center gap-2 p-2 rounded-lg border transition-colors",
                                        isSelected
                                            ? "bg-primary/5 border-primary"
                                            : "hover:bg-muted/50"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="text-sm">{option.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Activities Filter */}
                <div>
                    <h3 className="text-sm font-medium mb-3">Activities</h3>
                    <div className="flex flex-wrap gap-2">
                        {activityOptions.map((option) => {
                            const isSelected = activities.includes(option.value);
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setActivities(
                                            isSelected
                                                ? activities.filter(a => a !== option.value)
                                                : [...activities, option.value]
                                        );
                                    }}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-sm border transition-colors",
                                        isSelected
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted/50"
                                    )}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Apply button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium"
                >
                    Apply Filters
                </button>
            </div>
        </MobileSheet>
    );
}