'use client';

import { SWRConfig } from 'swr';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { swrConfig } from '@/lib/swr/config';

interface SWRProviderProps {
  children: ReactNode;
  fallback?: {
    [key: string]: any;
  };
}

// Track if we're in the initial mount with server data
let isInitialMount = true;

export function SWRProvider({ children, fallback = {} }: SWRProviderProps) {
  const hasFallbackData = useRef(Object.keys(fallback).length > 0);

  useEffect(() => {
    // After first client render, allow revalidation
    isInitialMount = false;
  }, []);

  return (
    <SWRConfig
      value={{
        ...swrConfig,
        fallback,
        // Only pause requests on initial mount when we have fallback data
        isPaused: () => {
          // Pause all requests on initial mount to prevent unnecessary fetches
          return isInitialMount;
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}