'use client';

import useSWR from 'swr';
import { scrapeFetcher } from './fetchers';
import { useStreamingScrape } from './useStreamingScrape';

export function useScrapeDetail(scrapeId: string, initialData?: any) {
  // Set up SWR with appropriate refresh interval based on status
  const { data, error, mutate } = useSWR(
    `/api/scrape-runs/${scrapeId}`,
    scrapeFetcher,
    {
      fallbackData: initialData,
      refreshInterval: (data) => {
        // Poll every 2 seconds if still processing
        if (data?.status === 'PENDING' || data?.status === 'PROCESSING') {
          return 2000;
        }
        // Stop polling once complete or failed
        return 0;
      },
      revalidateOnFocus: false,
    }
  );

  // Use streaming for real-time updates when processing
  const shouldStream = data?.status === 'PENDING' || data?.status === 'PROCESSING';
  
  const { isStreaming, progress, error: streamError } = useStreamingScrape(
    shouldStream ? scrapeId : null,
    {
      onComplete: () => {
        // Force revalidation when streaming completes
        mutate();
      },
      onError: (error) => {
        console.error('Stream error:', error);
        // Force revalidation on error too
        mutate();
      },
    }
  );

  return {
    scrape: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
    isStreaming,
    progress,
    streamError,
  };
}