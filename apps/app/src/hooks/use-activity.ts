import { useEffect, useCallback, useRef } from 'react';
import useSWR from 'swr';
import type { Activity, ActivityFilters } from '@repo/api';
import { fetcher } from '@/lib/fetcher';
import type { ActivityType } from '@repo/database';

interface UseActivityOptions {
  filters?: ActivityFilters;
  limit?: number;
  cursor?: string;
  enableSSE?: boolean;
  onNewActivity?: (activity: Activity) => void;
}

interface UseActivityResult {
  activities: Activity[] | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isValidating: boolean;
  mutate: () => void;
  hasMore: boolean;
  loadMore: () => void;
}

/**
 * Hook for fetching activities with SWR
 * Supports filtering, pagination, and real-time updates via SSE
 */
export function useActivity(options: UseActivityOptions = {}): UseActivityResult {
  const { filters, limit = 50, cursor, enableSSE = false, onNewActivity } = options;
  
  // Build query string
  const queryParams = new URLSearchParams();
  if (limit) queryParams.append('limit', limit.toString());
  if (cursor) queryParams.append('cursor', cursor);
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
  }
  
  const url = `/api/activities?${queryParams.toString()}`;
  
  // Fetch activities using SWR
  const { data, error, isLoading, isValidating, mutate } = useSWR<Activity[]>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );
  
  // SSE connection ref
  const eventSourceRef = useRef<EventSource | null>(null);
  
  // Setup SSE connection for real-time updates
  const connectSSE = useCallback(() => {
    if (!enableSSE || eventSourceRef.current) return;
    
    try {
      const sseUrl = `/api/activities/stream?${queryParams.toString()}`;
      const eventSource = new EventSource(sseUrl);
      eventSourceRef.current = eventSource;
      
      eventSource.onopen = () => {
        console.log('[Activity SSE] Connection opened');
      };
      
      eventSource.onmessage = (event) => {
        try {
          const activity = JSON.parse(event.data) as Activity;
          console.log('[Activity SSE] New activity:', activity.activityType);
          
          // Update SWR cache with new activity
          mutate((current) => {
            if (!current) return [activity];
            
            // Check if activity already exists
            const exists = current.some(a => a.id === activity.id);
            if (exists) return current;
            
            // Add new activity at the beginning
            return [activity, ...current];
          }, false);
          
          // Call callback if provided
          onNewActivity?.(activity);
        } catch (error) {
          console.error('[Activity SSE] Error parsing message:', error);
        }
      };
      
      eventSource.onerror = (error) => {
        console.error('[Activity SSE] Connection error:', error);
        eventSource.close();
        eventSourceRef.current = null;
        
        // Attempt reconnection after 5 seconds
        setTimeout(() => {
          if (enableSSE) {
            connectSSE();
          }
        }, 5000);
      };
    } catch (error) {
      console.error('[Activity SSE] Failed to create connection:', error);
    }
  }, [enableSSE, queryParams.toString(), mutate, onNewActivity]);
  
  // Disconnect SSE
  const disconnectSSE = useCallback(() => {
    if (eventSourceRef.current) {
      console.log('[Activity SSE] Closing connection');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);
  
  // Manage SSE connection lifecycle
  useEffect(() => {
    if (enableSSE) {
      connectSSE();
    }
    
    return () => {
      disconnectSSE();
    };
  }, [enableSSE, connectSSE, disconnectSSE]);
  
  // Load more function for pagination
  const loadMore = useCallback(() => {
    if (!data || data.length === 0) return;
    
    // Get the oldest activity's createdAt as cursor
    const oldestActivity = data[data.length - 1];
    const newCursor = oldestActivity.createdAt;
    
    // Fetch more with cursor
    const moreUrl = `/api/activities?${new URLSearchParams({
      ...Object.fromEntries(queryParams),
      cursor: newCursor,
    }).toString()}`;
    
    fetcher(moreUrl).then((moreActivities: Activity[]) => {
      mutate((current) => {
        if (!current) return moreActivities;
        return [...current, ...moreActivities];
      }, false);
    });
  }, [data, queryParams, mutate]);
  
  // Check if there are more activities to load
  const hasMore = data ? data.length >= limit : false;
  
  return {
    activities: data,
    error,
    isLoading,
    isValidating,
    mutate,
    hasMore,
    loadMore,
  };
}

/**
 * Hook for fetching activities for a specific user
 */
export function useUserActivities(userId: string, options?: Omit<UseActivityOptions, 'filters'>) {
  return useActivity({
    ...options,
    filters: { userId },
  });
}

/**
 * Hook for fetching activities by type
 */
export function useActivitiesByType(
  activityType: ActivityType,
  options?: Omit<UseActivityOptions, 'filters'>
) {
  return useActivity({
    ...options,
    filters: { activityType },
  });
}