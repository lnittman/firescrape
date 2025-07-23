'use client';

import useSWR from 'swr';
import { scrapeListFetcher } from './fetchers';

interface UseScrapeListOptions {
  status?: string;
  dateRange?: string;
  sortBy?: string;
  limit?: number;
  offset?: number;
}

export function useScrapeList(options: UseScrapeListOptions = {}) {
  const params = new URLSearchParams();
  
  if (options.status) params.append('status', options.status);
  if (options.dateRange) params.append('dateRange', options.dateRange);
  if (options.sortBy) params.append('sortBy', options.sortBy);
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.offset) params.append('offset', options.offset.toString());
  
  const queryString = params.toString();
  const url = `/api/scrape-runs${queryString ? `?${queryString}` : ''}`;
  
  const { data, error, mutate } = useSWR(
    url,
    scrapeListFetcher,
    {
      refreshInterval: 5000, // Poll every 5 seconds for list updates
      revalidateOnFocus: true,
    }
  );

  return {
    scrapes: data?.runs || [],
    total: data?.total || 0,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}