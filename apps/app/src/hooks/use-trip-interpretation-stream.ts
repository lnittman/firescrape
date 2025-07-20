"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { tripInterpretationOutputSchema } from "@repo/api/schemas/trip-interpret";
import type { OutdoorActivityType } from "@repo/database";
import { z } from "zod";
import { useEffect } from "react";

// Export the type for the interpretation output
export type TripInterpretationOutput = z.infer<typeof tripInterpretationOutputSchema>;

interface UseTripInterpretationStreamParams {
  location?: string;
  activity?: OutdoorActivityType;
  userContext?: {
    currentLocation?: string;
    interests: OutdoorActivityType[];
    fitnessLevel?: number;
    previousTrips?: any[];
  };
}

interface UseTripInterpretationStreamReturn {
  interpret: (prompt: string) => void;
  interpretation: TripInterpretationOutput | undefined;
  partialInterpretation: Partial<TripInterpretationOutput> | undefined;
  isInterpreting: boolean;
  error: Error | undefined;
  stop: () => void;
}

export function useTripInterpretationStream({
  location,
  activity,
  userContext,
}: UseTripInterpretationStreamParams = {}): UseTripInterpretationStreamReturn {
  // Use the experimental_useObject hook for streaming
  const { object, submit, isLoading, error, stop } = useObject({
    api: "/api/ai/trip-interpret-stream",
    schema: tripInterpretationOutputSchema,
  });
  
  // Log state changes
  useEffect(() => {
    console.log('[use-trip-interpretation-stream] State update:', {
      isLoading,
      hasObject: !!object,
      error: error?.message,
      objectType: object ? typeof object : 'undefined',
      objectKeys: object ? Object.keys(object) : []
    });
    
    // If there's an error, we need to ensure loading state is false
    if (error) {
      console.error('[use-trip-interpretation-stream] Error:', error);
    }
    
    // Log any partial object we have
    if (object) {
      console.log('[use-trip-interpretation-stream] Full object:', JSON.stringify(object, null, 2));
    }
  }, [isLoading, object, error]);

  const interpret = (prompt: string) => {
    console.log('[use-trip-interpretation-stream] Submitting prompt:', prompt);
    console.log('[use-trip-interpretation-stream] Context:', { location, activity, userContext });
    
    try {
      // Pass the full context to the API
      submit({
        prompt,
        location,
        activity,
        userContext,
      });
      console.log('[use-trip-interpretation-stream] Submit called successfully');
    } catch (submitError) {
      console.error('[use-trip-interpretation-stream] Error during submit:', submitError);
    }
  };

  return {
    interpret,
    interpretation: object as TripInterpretationOutput | undefined,
    partialInterpretation: object as Partial<TripInterpretationOutput> | undefined,
    isInterpreting: isLoading,
    error,
    stop,
  };
}