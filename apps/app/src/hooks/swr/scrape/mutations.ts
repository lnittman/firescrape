import { useSWRConfig } from 'swr';
import { toast } from 'sonner';

export function useScrapeMutations() {
  const { mutate } = useSWRConfig();

  const deleteScrape = async (id: string) => {
    try {
      const response = await fetch(`/api/scrape-runs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete scrape run');
      }

      // Invalidate related caches
      mutate(
        (key) => typeof key === 'string' && key.startsWith('/api/scrape-runs'),
        undefined,
        { revalidate: true }
      );

      toast.success('Scrape run deleted successfully');
      return true;
    } catch (error) {
      toast.error('Failed to delete scrape run');
      throw error;
    }
  };

  const rerunScrape = async (id: string) => {
    try {
      const response = await fetch(`/api/scrape-runs/${id}/rerun`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to rerun scrape');
      }

      const data = await response.json();

      // Invalidate related caches
      mutate(
        (key) => typeof key === 'string' && key.startsWith('/api/scrape-runs'),
        undefined,
        { revalidate: true }
      );

      toast.success('Scrape rerun initiated');
      return data;
    } catch (error) {
      toast.error('Failed to rerun scrape');
      throw error;
    }
  };

  return {
    deleteScrape,
    rerunScrape,
  };
}