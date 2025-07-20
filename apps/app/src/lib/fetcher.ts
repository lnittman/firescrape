// Default fetcher for SWR
export const fetcher = async (url: string) => {
  const res = await fetch(url);
  const json = await res.json();
  
  if (!res.ok) {
    throw new Error(json.message || json.error || 'Failed to fetch');
  }
  
  return json.data || json;
};

// Fetcher with credentials for authenticated requests
export const fetcherWithCredentials = async (url: string) => {
  const res = await fetch(url, {
    credentials: 'include',
  });
  const json = await res.json();
  
  if (!res.ok) {
    throw new Error(json.message || json.error || 'Failed to fetch');
  }
  
  return json.data || json;
};