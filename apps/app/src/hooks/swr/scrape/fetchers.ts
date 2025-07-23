export const scrapeFetcher = async (url: string) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch scrape');
  }
  
  return response.json();
};

export const scrapeListFetcher = async (url: string) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch scrapes');
  }
  
  return response.json();
};