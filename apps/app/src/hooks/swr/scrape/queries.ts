import type { Scrape } from '@repo/database';

import type { ScrapesListParams } from '@/lib/api/services/scrape';

import { useSWRWithFallback } from '../use-swr-with-fallback';

interface ScrapesResponse {
  runs: Array<{
    id: string;
    url: string;
    status: string;
    formats: string[];
    createdAt: Date;
    completedAt: Date | null;
    duration: number | null;
    error: string | null;
    metadata: any;
    markdown: string | null;
  }>;
  total: number;
}

interface ScrapeRunStatsResponse {
  total: number;
  successful: number;
  failed: number;
  pending: number;
  averageDuration: number;
}

export function useScrapes(params?: ScrapesListParams) {
  const queryParams = new URLSearchParams();

  if (params?.status) queryParams.set('status', params.status);
  if (params?.dateRange) queryParams.set('dateRange', params.dateRange);
  if (params?.sortBy) queryParams.set('sortBy', params.sortBy);
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.offset) queryParams.set('offset', params.offset.toString());

  const queryString = queryParams.toString();
  const key = queryString ? `/api/scrape-runs?${queryString}` : '/api/scrape-runs';

  return useSWRWithFallback<ScrapesResponse>(key, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
}

export function useScrapeRun(id: string | null) {
  return useSWRWithFallback<Scrape | null>(
    id ? `/api/scrape-runs/${id}` : null,
    {
      revalidateOnFocus: false,
    }
  );
}

export function useScrapeRunStats() {
  return useSWRWithFallback<ScrapeRunStatsResponse>('/api/scrape-runs/stats', {
    revalidateOnFocus: false,
    refreshInterval: 30000, // Refresh every 30 seconds
  });
}