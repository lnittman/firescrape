import { useSWRConfig } from 'swr';
import type { Web } from '@repo/api';
import type { Space } from '@repo/api/schemas/space';

/**
 * Hook to access the fallback data from SWRConfig
 * Useful for components that need immediate access to cached data
 */
export function useSWRFallback() {
  const { fallback, cache } = useSWRConfig();
  
  return {
    // Direct access to fallback data
    webs: fallback?.['/api/webs'] as Web[] | undefined,
    spaces: fallback?.['/api/spaces'] as Space[] | undefined,
    
    // Helper to check if data exists in cache
    hasData: (key: string) => {
      return !!fallback?.[key] || cache.get(key) !== undefined;
    },
    
    // Get any fallback data by key
    getFallback: <T = any>(key: string): T | undefined => {
      return fallback?.[key] as T;
    },
  };
}