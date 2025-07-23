'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { mutate } from 'swr';

interface StreamEvent {
  type: 'connected' | 'status' | 'progress' | 'complete';
  id?: string;
  status?: string;
  message?: string;
  data?: any;
  error?: string;
  errorCode?: string;
}

interface UseStreamingScrapeOptions {
  onComplete?: (data: any) => void;
  onError?: (error: string, errorCode: string) => void;
  onProgress?: (message: string) => void;
}

export function useStreamingScrape(
  scrapeId: string | null,
  options: UseStreamingScrapeOptions = {}
) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState<string>('pending');
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to store callbacks to avoid dependency issues
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const startStreaming = useCallback(() => {
    if (!scrapeId) return;

    setIsStreaming(true);
    setError(null);
    setProgress('');

    const eventSource = new EventSource(`/api/scrape/${scrapeId}/stream`);

    eventSource.onmessage = (event) => {
      try {
        const data: StreamEvent = JSON.parse(event.data);

        switch (data.type) {
          case 'connected':
            console.log('Connected to stream for scrape:', data.id);
            break;

          case 'status':
            if (data.status) {
              setStatus(data.status);
            }
            break;

          case 'progress':
            if (data.message) {
              setProgress(data.message);
              optionsRef.current.onProgress?.(data.message);
            }
            break;

          case 'complete':
            setIsStreaming(false);
            
            if (data.status === 'success') {
              setStatus('complete');
              // Revalidate SWR cache for this specific scrape with the new data
              mutate(`/api/scrape-runs/${scrapeId}`, undefined, { revalidate: true });
              // Revalidate the list too
              mutate('/api/scrape-runs', undefined, { revalidate: true });
              optionsRef.current.onComplete?.(data.data);
            } else if (data.status === 'error') {
              setStatus('failed');
              setError(data.error || 'Unknown error');
              // Also revalidate on error to update status
              mutate(`/api/scrape-runs/${scrapeId}`, undefined, { revalidate: true });
              optionsRef.current.onError?.(data.error || 'Unknown error', data.errorCode || 'UNKNOWN');
            }
            
            eventSource.close();
            break;
        }
      } catch (err) {
        console.error('Error parsing stream event:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('EventSource error:', err);
      setIsStreaming(false);
      setError('Connection lost');
      eventSource.close();
    };

    // Cleanup function
    return () => {
      eventSource.close();
      setIsStreaming(false);
    };
  }, [scrapeId]);

  useEffect(() => {
    if (!scrapeId) return;
    
    const cleanup = startStreaming();
    return cleanup;
  }, [scrapeId, startStreaming]);

  return {
    isStreaming,
    status,
    progress,
    error,
    startStreaming,
  };
}