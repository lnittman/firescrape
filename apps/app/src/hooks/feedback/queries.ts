import useSWR from 'swr';
import type { Feedback } from '@repo/api';
import type { FeedbackTopic, FeedbackStatus } from '@repo/database';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const json = await res.json();
  
  if (!res.ok) {
    throw new Error(json.message || 'Failed to fetch');
  }
  
  // Extract data from the response envelope
  return json.data || json;
};

interface ListFeedbackParams {
  topic?: FeedbackTopic;
  status?: FeedbackStatus;
  limit?: number;
  offset?: number;
}

export function useFeedback(params: ListFeedbackParams = {}) {
  const searchParams = new URLSearchParams();
  
  if (params.topic) searchParams.set('topic', params.topic);
  if (params.status) searchParams.set('status', params.status);
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.offset) searchParams.set('offset', params.offset.toString());
  
  const url = `/api/feedback${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  const { data, error, mutate } = useSWR<{ feedback: Feedback[]; total: number }>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      dedupingInterval: 30000, // 30 seconds
    }
  );

  return {
    feedback: data?.feedback || [],
    total: data?.total || 0,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
} 