/**
 * Global SWR configuration
 */

// Global fetcher that handles API responses
export const fetcher = async (url: string) => {
  const res = await fetch(url);
  const json = await res.json();
  
  if (!res.ok) {
    throw new Error(json.message || 'Failed to fetch');
  }
  
  // Handle paginated response format
  if (json.data && json.data.data && json.data.pagination) {
    return json.data.data;
  }
  
  return json.data || json;
};

// Global SWR configuration
export const swrConfig = {
  fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  revalidateIfStale: false,
  revalidateOnMount: false,
  dedupingInterval: 10000,
  keepPreviousData: true,
} as const;