import type { Trip } from '@repo/database';
import { useSWRWithFallback } from '@/hooks/use-swr-with-fallback';

export function useTrips(initialData?: Trip[]) {
  const { data, error, mutate, isValidating } = useSWRWithFallback<Trip[]>(
    '/api/my-trips',
    {
      fallbackData: initialData,
      // Don't revalidate on mount if we have initial data from server
      revalidateOnMount: !initialData,
      revalidateIfStale: !initialData,
    }
  );

  return {
    trips: data || [],
    isLoading: !error && !data && isValidating,
    isError: error,
    mutate,
  };
}
