import useSWR from 'swr';
import type { Message } from '@repo/api';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const json = await res.json();
  
  if (!res.ok) {
    throw new Error(json.message || 'Failed to fetch');
  }
  
  // Extract data from the response envelope
  return json.data || json;
};

export function useMessages(webId: string | null) {
  const { data, error, mutate } = useSWR<Message[]>(
    webId ? `/api/webs/${webId}/messages` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      dedupingInterval: 5000, // 5 seconds
    }
  );

  return {
    messages: data || [],
    isLoading: !error && !data && webId,
    isError: error,
    mutate,
  };
}

export function useThreadMessages(threadId: string | null) {
  const { data, error, mutate } = useSWR<Message[]>(
    threadId ? `/api/threads/${threadId}/messages` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      dedupingInterval: 5000, // 5 seconds
    }
  );

  return {
    messages: data || [],
    isLoading: !error && !data && threadId,
    isError: error,
    mutate,
  };
} 