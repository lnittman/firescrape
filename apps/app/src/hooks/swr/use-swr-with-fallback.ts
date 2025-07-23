import useSWR, { useSWRConfig } from 'swr';
import type { SWRConfiguration } from 'swr';
import { fetcher } from '@/lib/swr/config';

/**
 * Custom SWR hook that properly uses fallback data from SWRProvider
 * This ensures components without initial data can still access cached data
 */
export function useSWRWithFallback<T = any>(
  key: string | null,
  options?: SWRConfiguration<T> & { fallbackData?: T }
) {
  const { fallback } = useSWRConfig();
  
  // Get fallback data from provider if not provided in options
  const fallbackData = options?.fallbackData || (key && fallback?.[key]) || undefined;
  const hasFallbackData = !!fallbackData;
  
  return useSWR<T>(
    key,
    fetcher,
    {
      ...options,
      fallbackData,
      // Never revalidate on mount if we have fallback data
      revalidateOnMount: hasFallbackData ? false : options?.revalidateOnMount,
      // Don't revalidate if stale when we have fresh server data
      revalidateIfStale: hasFallbackData ? false : options?.revalidateIfStale,
    }
  );
}