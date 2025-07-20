"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { TRIP_SUGGESTIONS, type TripSuggestion } from "@/lib/trip-suggestions";

interface InterestPickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInterestsSelected?: (interests: string[]) => void;
  selectedInterests?: string[];
}

// Group suggestions by category for better organization
const groupedSuggestions = TRIP_SUGGESTIONS.reduce((acc, suggestion) => {
  const category = suggestion.category || 'other';
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(suggestion);
  return acc;
}, {} as Record<string, TripSuggestion[]>);

// Define category display names and order
const categoryConfig = {
  hiking: { name: "Hiking & Walking", order: 1 },
  biking: { name: "Mountain Biking", order: 2 },
  climbing: { name: "Rock Climbing", order: 3 },
  camping: { name: "Camping & Backpacking", order: 4 },
  water: { name: "Water Activities", order: 5 },
  winter: { name: "Winter Sports", order: 6 },
  wildlife: { name: "Wildlife & Nature", order: 7 },
  photography: { name: "Photography", order: 8 },
  family: { name: "Family Adventures", order: 9 },
  other: { name: "More Activities", order: 10 },
};

export function InterestPickerDialog({
  isOpen,
  onClose,
  onInterestsSelected,
  selectedInterests = [],
}: InterestPickerDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedInterests));
  const [isSaving, setIsSaving] = useState(false);

  // Filter suggestions based on search query
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return groupedSuggestions;

    const query = searchQuery.toLowerCase();
    const filtered: Record<string, TripSuggestion[]> = {};

    Object.entries(groupedSuggestions).forEach(([category, suggestions]) => {
      const matchingSuggestions = suggestions.filter(
        suggestion => 
          suggestion.title.toLowerCase().includes(query) ||
          (suggestion.category?.toLowerCase().includes(query))
      );
      
      if (matchingSuggestions.length > 0) {
        filtered[category] = matchingSuggestions;
      }
    });

    return filtered;
  }, [searchQuery]);

  const handleToggleInterest = (suggestionId: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(suggestionId)) {
      newSelected.delete(suggestionId);
    } else {
      newSelected.add(suggestionId);
    }
    setSelected(newSelected);
  };

  const handleSave = async () => {
    if (selected.size === 0) return;
    
    setIsSaving(true);
    try {
      // Get the activity types from selected suggestion IDs
      const selectedActivities = Array.from(selected)
        .map(id => {
          // Find the suggestion across all categories
          for (const suggestions of Object.values(groupedSuggestions)) {
            const suggestion = suggestions.find(s => s.id === id);
            if (suggestion && suggestion.activityType) {
              return suggestion.activityType;
            }
          }
          return null;
        })
        .filter((activity): activity is string => activity !== null);

      // Save interests to the API
      const response = await fetch('/api/user/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests: selectedActivities }),
      });

      if (!response.ok) {
        throw new Error('Failed to save interests');
      }

      // Notify parent component
      onInterestsSelected?.(selectedActivities);
      onClose();
    } catch (error) {
      console.error('Error saving interests:', error);
      // You could add a toast notification here
    } finally {
      setIsSaving(false);
    }
  };

  // Sort categories by order
  const sortedCategories = Object.entries(filteredSuggestions).sort(
    ([a], [b]) => {
      const orderA = categoryConfig[a as keyof typeof categoryConfig]?.order || 999;
      const orderB = categoryConfig[b as keyof typeof categoryConfig]?.order || 999;
      return orderA - orderB;
    }
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[300]"
                onClick={onClose}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                    damping: 30,
                  }}
                  className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-3xl max-h-[85vh] bg-background rounded-lg shadow-lg z-[400] overflow-hidden flex flex-col"
                >
          {/* Header */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-display">
                What do you love doing outside?
              </Dialog.Title>
              <Dialog.Close className="p-2 hover:bg-accent rounded-lg transition-colors">
                <X className="h-5 w-5" weight="duotone" />
              </Dialog.Close>
            </div>

            {/* Search bar */}
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activities..."
                className={cn(
                  "w-full pl-10 pr-4 py-2 rounded-lg",
                  "bg-muted/50 border border-border",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "text-sm placeholder:text-muted-foreground"
                )}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <AnimatePresence mode="wait">
              {sortedCategories.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-muted-foreground py-12"
                >
                  No activities found matching "{searchQuery}"
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {sortedCategories.map(([category, suggestions]) => {
                    const categoryInfo = categoryConfig[category as keyof typeof categoryConfig];
                    return (
                      <div key={category}>
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">
                          {categoryInfo?.name || category}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {suggestions.map((suggestion) => {
                            const isSelected = selected.has(suggestion.id);
                            return (
                              <motion.button
                                key={suggestion.id}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleToggleInterest(suggestion.id)}
                                className={cn(
                                  "group flex items-center gap-2 px-3 py-2",
                                  "rounded-lg border transition-all duration-200",
                                  isSelected
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border hover:border-foreground/20 hover:bg-accent/50"
                                )}
                              >
                                <span className="text-lg">{suggestion.emoji}</span>
                                <span className="text-sm font-medium">
                                  {suggestion.title}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {selected.size} interest{selected.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelected(new Set(selectedInterests));
                  setSearchQuery("");
                  onClose();
                }}
                disabled={isSaving}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium",
                  "hover:bg-accent transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={selected.size === 0 || isSaving}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium",
                  "bg-primary text-primary-foreground",
                  "hover:bg-primary/90 transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "flex items-center gap-2"
                )}
              >
                {isSaving ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save interests'
                )}
              </button>
            </div>
          </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
}