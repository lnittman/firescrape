"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, MagnifyingGlass, X, Spinner } from "@phosphor-icons/react";
import { MobileSheet } from "@/components/shared/ui/mobile-sheet";
import { cn } from "@repo/design/lib/utils";
import type { LocationSuggestion } from "@repo/api/schemas";

interface MobileLocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: LocationSuggestion | null) => void;
  selectedLocation: LocationSuggestion | null;
  currentPrompt?: string;
}

export function MobileLocationPicker({
  isOpen,
  onClose,
  onLocationSelect,
  selectedLocation,
  currentPrompt = "",
}: MobileLocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);

  // Parse location when sheet opens with current prompt
  useEffect(() => {
    if (isOpen && currentPrompt && !searchQuery) {
      handleSearchChange(currentPrompt);
    }
  }, [isOpen, currentPrompt]);

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/location/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: query }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error("Failed to parse location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location: LocationSuggestion) => {
    onLocationSelect(location);
    onClose();
  };

  const clearLocation = () => {
    onLocationSelect(null);
    setSearchQuery("");
    setSuggestions([]);
  };

  const getLocationTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      mountain: "🏔️",
      trail: "🥾",
      lake: "💧",
      beach: "🏖️",
      forest: "🌲",
      park: "🏞️",
      campground: "🏕️",
      ski_resort: "⛷️",
      climbing_area: "🧗",
      outdoor: "🌄",
      city: "🏙️",
      region: "📍",
    };
    return icons[type] || "📍";
  };

  return (
    <MobileSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Set Location"
      showCloseButton={true}
      contentHeight="default"
    >
      <div className="flex flex-col h-full">
        {/* Search input */}
        <div className="px-4 pt-2 pb-2">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" weight="duotone" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search for a location..."
              className="w-full pl-10 pr-10 py-3 bg-muted/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              autoFocus
            />
            {isLoading && (
              <Spinner className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-2">
          <div className="space-y-3">
            {/* Current location */}
            {selectedLocation && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-primary/10 rounded-lg border border-primary/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">
                      {getLocationTypeIcon(selectedLocation.type)}
                    </span>
                    <div>
                      <div className="font-medium">Current: {selectedLocation.name}</div>
                      {selectedLocation.city && (
                        <div className="text-sm text-muted-foreground">
                          {selectedLocation.city}
                          {selectedLocation.state && `, ${selectedLocation.state}`}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={clearLocation}
                    className="p-1 hover:bg-background/50 rounded"
                  >
                    <X className="h-4 w-4" weight="bold" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Suggestions */}
            <AnimatePresence mode="popLayout">
              {suggestions.map((location, idx) => (
                <motion.button
                  key={`${location.name}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleLocationSelect(location)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-all",
                    "hover:bg-muted/50 hover:border-primary/50 active:scale-[0.98]",
                    selectedLocation?.name === location.name
                      ? "bg-primary/5 border-primary/50"
                      : "border-border"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">
                      {getLocationTypeIcon(location.type)}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{location.name}</div>
                        {location.confidence && location.confidence > 0.8 && (
                          <span className="text-xs text-green-600 dark:text-green-400">
                            Best match
                          </span>
                        )}
                      </div>
                      {location.city && (
                        <div className="text-sm text-muted-foreground">
                          {location.city}
                          {location.state && `, ${location.state}`}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>

            {!isLoading && suggestions.length === 0 && searchQuery && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-muted-foreground"
              >
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" weight="duotone" />
                <p className="text-sm">No locations found</p>
                <p className="text-xs mt-1">Try searching for a city, park, or trail name</p>
              </motion.div>
            )}

            {/* Quick suggestions */}
            {!searchQuery && suggestions.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Popular locations:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Yosemite",
                    "Rocky Mountains",
                    "Lake Tahoe",
                    "Grand Canyon",
                    "Zion",
                  ].map((name) => (
                    <button
                      key={name}
                      onClick={() => handleSearchChange(name)}
                      className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/70 rounded-full transition-colors active:scale-95"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileSheet>
  );
}