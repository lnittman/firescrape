"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { AnimatePresence, motion } from "framer-motion";
import { SuggestionOffsetMarquee } from "./suggestion-offset-marquee";
import { LocationPickerDialog } from "./location-picker-dialog";
import { InterestPickerDialog } from "./interest-picker-dialog";
import { LocationPermissionPopup } from "./location-permission-popup";
import { MapPin, MagnifyingGlass } from "@phosphor-icons/react";
import { useIsMobile } from "@repo/design/hooks/use-mobile";
import {
  getSeededSuggestions,
  type TripSuggestion as LocalTripSuggestion,
} from "@/lib/trip-suggestions";
import type { Trip, OutdoorActivityType } from "@repo/database";
import type { LocationSuggestion, TripInterpretationOutput, TripSuggestion } from "@repo/api/schemas";
import { cn } from "@/lib/utils";
import { useTripInterpretationStream } from "@/hooks/use-trip-interpretation-stream";
import { useAtom } from "jotai";
import { locationPickerOpenAtom, interestPickerOpenAtom } from "@/atoms/modals";

// Animation delays in milliseconds
const TYPING_CHAR_DELAY = 20;
const DEBOUNCE_DELAY = 600; // Time before AI interpretation triggers
const FADE_DURATION = 0.3;
const LAYOUT_SPRING = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

const STAGGER_DELAY = 0.08; // Delay between each suggestion appearing

interface HomePageClientProps {
  initialTrips: Trip[];
  userContext?: {
    userId: string;
    fitnessLevel?: number;
    location?: string;
    interests: OutdoorActivityType[];
    recentTrips: any[];
  };
}

type FlowState = "idle" | "typing" | "interpreting" | "showing-suggestions" | "creating";

export function HomePageClientV2({ initialTrips, userContext }: HomePageClientProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number>(0);
  const [prompt, setPrompt] = useState("");
  const [flowState, setFlowState] = useState<FlowState>("idle");
  const [interpretationTime, setInterpretationTime] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useAtom(locationPickerOpenAtom);
  const [isInterestPickerOpen, setIsInterestPickerOpen] = useAtom(interestPickerOpenAtom);
  const [selectedInterests, setSelectedInterests] = useState<OutdoorActivityType[]>(
    userContext?.interests || []
  );
  const [lastInterpretedPrompt, setLastInterpretedPrompt] = useState("");
  const [showLocationPermission, setShowLocationPermission] = useState(false);
  const [hasAskedForLocation, setHasAskedForLocation] = useState(false);
  const isMobile = useIsMobile();

  // Use the streaming hook
  const {
    interpret,
    interpretation,
    partialInterpretation,
    isInterpreting,
    error: interpretError,
    stop
  } = useTripInterpretationStream({
    location: selectedLocation?.name,
    activity: selectedInterests[0],
    userContext: {
      currentLocation: selectedLocation?.name || userContext?.location,
      interests: selectedInterests,
      fitnessLevel: userContext?.fitnessLevel,
      previousTrips: userContext?.recentTrips,
    },
  });

  // Use a consistent seed based on the day to avoid hydration mismatches
  const [suggestions] = useState<LocalTripSuggestion[]>(() => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return getSeededSuggestions(16, seed);
  });

  // Debounced prompt for AI interpretation
  const debouncedPrompt = useDebounce(prompt, DEBOUNCE_DELAY);

  // Debug debounced prompt
  useEffect(() => {
    console.log("[home-page-v2] Debounced prompt changed:", debouncedPrompt);
  }, [debouncedPrompt]);

  // Track interpretation progress
  const hasPartialSuggestions = partialInterpretation?.suggestions && partialInterpretation.suggestions.length > 0;
  const hasCompleteSuggestions = interpretation?.suggestions && interpretation.suggestions.length > 0;

  // Auto-focus on mount and check if we should ask for location
  useEffect(() => {
    inputRef.current?.focus();
    
    // Check if we should ask for location permission on first use
    if (!selectedLocation && !hasAskedForLocation && 'geolocation' in navigator) {
      // We'll ask when user first starts typing
    }
  }, []);

  // Update interpretation time while loading
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isInterpreting && flowState === "interpreting") {
      interval = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        setInterpretationTime(elapsed);
      }, 10);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isInterpreting, flowState]);

  // Log interpretation errors
  useEffect(() => {
    if (interpretError) {
      console.error('[home-page-v2] Interpretation error:', interpretError);
      setFlowState("idle");
    }
  }, [interpretError]);

  // Trigger interpretation when debounced prompt changes
  useEffect(() => {
    // If input is empty, clear state and return to idle
    if (!debouncedPrompt.trim()) {
      if (flowState !== "idle") {
        setFlowState("idle");
        setLastInterpretedPrompt("");
        stop();
      }
      return;
    }

    // Only interpret if we have a new prompt
    if (debouncedPrompt.trim().length >= 3 &&
        debouncedPrompt.trim() !== lastInterpretedPrompt &&
        !isInterpreting) {
      setFlowState("interpreting");
      startTimeRef.current = Date.now();
      setInterpretationTime(0);
      setLastInterpretedPrompt(debouncedPrompt.trim());
      interpret(debouncedPrompt.trim());
    }
  }, [debouncedPrompt, lastInterpretedPrompt, isInterpreting, interpret, stop]);

  // Handle streaming interpretation updates
  useEffect(() => {
    // Only act when we have a complete interpretation with suggestions
    if (interpretation?.suggestions && interpretation.suggestions.length > 0 && flowState === "interpreting") {
      console.log('[home-page-v2] Interpretation complete:', interpretation);
      setFlowState("showing-suggestions");
      
      // If a location was interpreted and we don't have one set, update it based on first suggestion
      if (interpretation.interpretedCriteria?.location && !selectedLocation && interpretation.suggestions[0]) {
        const firstSuggestion = interpretation.suggestions[0];
        setSelectedLocation({
          name: interpretation.interpretedCriteria.location,
          type: "general_outdoor",
          coordinates: firstSuggestion.location.coordinates,
          confidence: 0.8
        });
      }
    }
  }, [interpretation, flowState, selectedLocation]); // Remove partialInterpretation to prevent infinite loops

  const handlePromptChange = (value: string) => {
    console.log("[home-page-v2] Prompt changed:", value, "Current flow state:", flowState);
    setPrompt(value);

    // Check if we should prompt for location on first typing
    if (value && !selectedLocation && !hasAskedForLocation && 'geolocation' in navigator) {
      setShowLocationPermission(true);
    }

    if (value) {
      // Only set to typing if we're not already creating or interpreting
      if (flowState !== "creating" && flowState !== "interpreting") {
        console.log("[home-page-v2] Setting flow state to typing");
        setFlowState("typing");
      }
    } else {
      // Only reset if we're not showing suggestions or creating
      if (flowState !== "showing-suggestions" && flowState !== "creating") {
        console.log("[home-page-v2] Setting flow state to idle");
        setFlowState("idle");
      }
    }
  };

  const handleSuggestionSelect = async (suggestion: LocalTripSuggestion) => {
    // Smooth autofill animation
    const targetText = suggestion.title;
    const chars = targetText.split("");
    setPrompt("");

    // Focus the input first
    inputRef.current?.focus();

    // Animate typing effect
    for (let i = 0; i < chars.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, TYPING_CHAR_DELAY));
      setPrompt((prev) => prev + chars[i]);
    }
  };

  const handleTripSelect = async (suggestion: TripSuggestion) => {
    setFlowState("creating");

    try {
      // Import the server action
      const { parseAndCreateTrip } = await import("@/actions/trip-actions");

      // Create trip with the selected trip suggestion
      const result = await parseAndCreateTrip({
        prompt: suggestion.title,
        location: suggestion.location ? {
          name: suggestion.location.name,
          coordinates: suggestion.location.coordinates,
          type: "general_outdoor", // Map to location type
        } : undefined,
        selectedInterests: [suggestion.primaryActivity] as OutdoorActivityType[],
        tripDetails: suggestion, // Pass the full suggestion for rich trip creation
      });

      if (result.success && result.tripId) {
        // Redirect to the specific trip page
        router.push(`/my-trips/${result.tripId}`);
      } else {
        console.error("Failed to create trip:", result.error);
        setFlowState("showing-suggestions");
      }
    } catch (error) {
      console.error("Error creating trip:", error);
      setFlowState("showing-suggestions");
    }
  };

  const handleInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If we're already interpreting or have no prompt, do nothing
    if (isInterpreting || !prompt.trim()) {
      return;
    }

    // Let the debounced handler trigger interpretation instead
    // This prevents Enter from immediately opening modals
    if (interpretation?.suggestions && interpretation.suggestions.length > 0) {
      handleTripSelect(interpretation.suggestions[0]);
    } else if (prompt.trim().length >= 3) {
      // Manual trigger if debounce hasn't happened yet
      console.log('[home-page-v2] Manual interpretation trigger');
      setFlowState("interpreting");
      startTimeRef.current = Date.now();
      setInterpretationTime(0);
      setLastInterpretedPrompt(prompt.trim());
      interpret(prompt.trim());
    }
  };

  // Check if we should show the input in a raised position
  const isInputActive = flowState !== "idle";
  const hasInput = prompt.trim().length > 0;
  const showForm = flowState === "interpreting" || flowState === "showing-suggestions";

  // Debug flow state
  useEffect(() => {
    console.log("Flow state changed to:", flowState);
  }, [flowState]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="flex flex-col h-full items-center justify-center px-4 sm:px-6">
        <div className="max-w-3xl w-full mx-auto">
          <motion.div
            className="flex flex-col items-center gap-6 text-center"
            animate={{
              y: showForm ? -200 : hasInput ? -20 : 0
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut"
            }}
          >
            {/* Hero section with fade animation */}
            <motion.div
              animate={{
                opacity: hasInput || showForm ? 0 : 1,
              }}
              transition={{
                duration: 0.3,
                delay: !hasInput && !showForm ? 0.4 : 0
              }}
              className="flex flex-col items-center gap-3"
            >
              <h1 className="text-3xl md:text-4xl font-display font-medium">
                What's your next adventure?
              </h1>
            </motion.div>

            {/* Prompt input with location button */}
            <div className="w-full">
              {/* Input field with location button */}
              <form
                onSubmit={handleInputSubmit}
                onKeyDown={(e) => {
                  // Prevent Enter from triggering button clicks
                  if (e.key === 'Enter' && !interpretation) {
                    e.preventDefault();
                    if (prompt.trim().length >= 3) {
                      setFlowState("interpreting");
                      startTimeRef.current = Date.now();
                      setLastInterpretedPrompt(prompt.trim());
                      interpret(prompt.trim());
                    }
                  }
                }}
                className="relative w-full flex items-center gap-3"
              >
                {/* Location button - enhanced with green active state */}
                <motion.button
                  type="button"
                  onClick={() => setIsLocationPickerOpen(true)}
                  animate={{
                    opacity: showForm ? 0 : 1,
                    scale: showForm ? 0.95 : 1
                  }}
                  transition={{ 
                    duration: FADE_DURATION
                  }}
                  className={cn(
                    "h-14 w-14 flex items-center justify-center rounded-xl transition-all duration-300 flex-shrink-0",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2",
                    selectedLocation 
                      ? "bg-nature-green/10 text-nature-green border-2 border-nature-green/30 hover:bg-nature-green/20 hover:border-nature-green/50 focus:ring-nature-green/50"
                      : "bg-transparent text-muted-foreground border-2 border-border hover:bg-accent hover:text-foreground hover:border-foreground/20 focus:ring-primary/50"
                  )}
                  title={selectedLocation ? selectedLocation.name : "Set location"}
                >
                  <motion.div
                    animate={{
                      scale: selectedLocation ? 1.1 : 1,
                      rotate: selectedLocation ? [0, -10, 10, -10, 0] : 0
                    }}
                    transition={{
                      scale: { duration: 0.3 },
                      rotate: { duration: 0.5, ease: "easeInOut" }
                    }}
                  >
                    <MapPin 
                      className="h-6 w-6" 
                      weight={selectedLocation ? "fill" : "duotone"} 
                    />
                  </motion.div>
                </motion.button>

                <input
                  ref={inputRef}
                  type="text"
                  value={prompt}
                  onChange={(e) => handlePromptChange(e.target.value)}
                  placeholder="e.g., Find a moderate 5-mile hike near Lake Tahoe with great views"
                  className={cn(
                    "flex-1 py-4 pr-14 pl-5 bg-card/50 border border-border rounded-xl",
                    isInputActive ? "shadow-lg" : "shadow-sm",
                    isInterpreting && "ring-2 ring-primary/30 animate-pulse",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300",
                    flowState === "creating" && "opacity-50"
                  )}
                  disabled={flowState === "creating"}
                  style={{ paddingLeft: isInputActive ? '20px' : '20px' }}
                />
                <button
                  type="submit"
                  disabled={!interpretation || flowState === "creating"}
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2",
                    "w-9 h-9 rounded-lg transition-all duration-200",
                    "flex items-center justify-center",
                    interpretation && flowState === "showing-suggestions"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <MagnifyingGlass className="w-4 h-4" weight="duotone" />
                </button>
              </form>
            </div>

            {/* Animated suggestion marquee - fade out when active */}
            <motion.div
              animate={{
                opacity: !hasInput && !showForm && suggestions.length > 0 ? 1 : 0,
              }}
              transition={{
                duration: 0.3,
                delay: !hasInput && !showForm && suggestions.length > 0 ? 0.5 : 0
              }}
              className="w-full mt-4"
            >
              {suggestions.length > 0 && (
                <SuggestionOffsetMarquee
                  suggestions={suggestions}
                  onSelect={handleSuggestionSelect}
                />
              )}
            </motion.div>
          </motion.div>

          {/* Streaming content - show interpreting state or suggestions */}
          <AnimatePresence mode="wait">
            {/* Interpreting state - show partial content */}
            {flowState === "interpreting" && (
              <motion.div
                key="interpreting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full mt-8 space-y-4"
              >
                <div className="text-center text-sm text-muted-foreground">
                  <span className="font-mono">{(interpretationTime / 1000).toFixed(2)}s</span>
                  {hasPartialSuggestions && (
                    <span className="ml-2">• Finding trips...</span>
                  )}
                </div>

                {/* Show partial suggestions as they stream in */}
                {partialInterpretation?.suggestions && partialInterpretation.suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 0.7, y: 0 }}
                    transition={{
                      delay: index * STAGGER_DELAY,
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                  >
                    <TripSuggestionCard
                      suggestion={suggestion}
                      onSelect={() => { }}
                      isLoading={true}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Complete suggestions */}
            {(flowState === "showing-suggestions" || flowState === "creating") && interpretation?.suggestions && interpretation.suggestions.length > 0 && (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut"
                }}
                className="w-full mt-6 space-y-4"
              >
                {interpretation.suggestions?.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * STAGGER_DELAY,
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                  >
                    <TripSuggestionCard
                      suggestion={suggestion}
                      onSelect={() => handleTripSelect(suggestion)}
                      isLoading={flowState === "creating"}
                    />
                  </motion.div>
                ))}

                {/* Show personalization factors */}
                {interpretation.personalizationFactors && interpretation.personalizationFactors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xs text-muted-foreground text-center mt-4"
                  >
                    Personalized based on: {interpretation.personalizationFactors.join(", ")}
                  </motion.div>
                )}

                {/* Start over button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center mt-6"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setFlowState("idle");
                      setPrompt("");
                      setLastInterpretedPrompt("");
                      stop();
                      inputRef.current?.focus();
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Start over
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Location picker dialog */}
      <LocationPickerDialog
        isOpen={isLocationPickerOpen}
        onClose={() => {
          console.log('Location picker close triggered from HomePageClientV2');
          setIsLocationPickerOpen(false);
        }}
        onLocationSelect={(location) => {
          setSelectedLocation(location);
          setIsLocationPickerOpen(false);
        }}
        selectedLocation={selectedLocation}
        currentPrompt={prompt}
      />

      {/* Interest picker dialog */}
      <InterestPickerDialog
        isOpen={isInterestPickerOpen}
        onClose={() => setIsInterestPickerOpen(false)}
        onInterestsSelected={(interests) => {
          setSelectedInterests(interests as OutdoorActivityType[]);
        }}
        selectedInterests={selectedInterests as string[]}
      />

      {/* Location permission popup */}
      <LocationPermissionPopup
        isOpen={showLocationPermission}
        onClose={() => setShowLocationPermission(false)}
        onLocationGranted={async (coords) => {
          // Convert coordinates to a location name using reverse geocoding
          // For now, just set a placeholder
          setSelectedLocation({
            name: "Current location",
            type: "general_outdoor",
            coordinates: coords,
            confidence: 1
          });
          setHasAskedForLocation(true);
        }}
        onLocationDenied={() => {
          setHasAskedForLocation(true);
        }}
      />
    </div>
  );
}

// Trip suggestion card component
interface TripSuggestionCardProps {
  suggestion: TripSuggestion;
  onSelect: () => void;
  isLoading: boolean;
}

function TripSuggestionCard({ suggestion, onSelect, isLoading }: TripSuggestionCardProps) {
  return (
    <button
      onClick={onSelect}
      disabled={isLoading}
      className={cn(
        "w-full text-left p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-all",
        "hover:shadow-lg hover:-translate-y-0.5",
        isLoading && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">{suggestion.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{suggestion.description}</p>

        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <span className="text-muted-foreground">Distance:</span>
            <span className="font-medium">{suggestion.distance} mi</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-muted-foreground">Time:</span>
            <span className="font-medium">{Math.floor(suggestion.duration.typical / 60)}h {suggestion.duration.typical % 60}m</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-muted-foreground">Difficulty:</span>
            <span className={cn(
              "font-medium capitalize",
              suggestion.difficulty === "easy" && "text-green-600",
              suggestion.difficulty === "moderate" && "text-yellow-600",
              suggestion.difficulty === "hard" && "text-orange-600",
              suggestion.difficulty === "expert" && "text-red-600"
            )}>{suggestion.difficulty}</span>
          </span>
        </div>

        {suggestion.highlights.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestion.highlights.slice(0, 3).map((highlight, i) => (
              <span key={i} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                {highlight}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
