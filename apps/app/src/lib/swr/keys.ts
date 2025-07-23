/**
 * Centralized SWR cache keys to ensure consistency
 */
export const SWR_KEYS = {
  // List keys
  SCRAPE_RUNS: '/api/scrape-runs',
  
  // Detail keys
  scrape: (id: string) => `/api/scrape-runs/${id}`,
  
  // Complex keys with params
  scrapesByStatus: (status: string) => `/api/scrape-runs?status=${status}`,
  scrapesByDateRange: (range: string) => `/api/scrape-runs?dateRange=${range}`,
  scrapeStats: '/api/scrape-runs/stats',
  userSettings: (userId: string) => `/api/users/${userId}/settings`,
} as const;