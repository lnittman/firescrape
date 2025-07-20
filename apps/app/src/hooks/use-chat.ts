import useSWR from 'swr';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { isChatLoadingAtom, chatModelAtom } from '@/atoms/chat';
import type { Message } from '@repo/api';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const json = await res.json();
  
  if (!res.ok) {
    throw new Error(json.message || 'Failed to fetch');
  }
  
  return json.data || json;
};

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

interface UseChatOptions {
  webId: string;
  threadId?: string;
  onError?: (error: Error) => void;
}

export function useChat({ webId, threadId, onError }: UseChatOptions) {
  const { data: messages, mutate } = useSWR<ChatMessage[]>(
    webId ? `/api/webs/${webId}/chat` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const [isLoading, setIsLoading] = useAtom(isChatLoadingAtom);
  const [selectedModel] = useAtom(chatModelAtom);
  const [streamingMessage, setStreamingMessage] = useState<ChatMessage | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    setIsLoading(true);
    
    // Create user message
    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    
    // Optimistically add user message
    const currentMessages = messages || [];
    mutate([...currentMessages, userMessage], false);

    // Create assistant message placeholder
    const assistantMessage: ChatMessage = {
      id: `temp-assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
    };

    setStreamingMessage(assistantMessage);

    try {
      // Create abort controller for this request
      abortControllerRef.current = new AbortController();

      const response = await fetch(`/api/webs/${webId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...currentMessages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          model: selectedModel,
          threadId,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulatedContent += parsed.content;
                setStreamingMessage(prev => prev ? {
                  ...prev,
                  content: accumulatedContent,
                } : null);
              }
            } catch (e) {
              console.error('Failed to parse SSE data:', e);
            }
          }
        }
      }

      // Finalize the message
      const finalAssistantMessage: ChatMessage = {
        ...assistantMessage,
        content: accumulatedContent,
      };

      // Update messages with both user and assistant messages
      mutate([...currentMessages, userMessage, finalAssistantMessage], false);
      
      // Clear streaming message
      setStreamingMessage(null);
      
      // Revalidate to get persisted messages with real IDs
      setTimeout(() => mutate(), 1000);
      
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Chat request aborted');
      } else {
        console.error('Chat error:', error);
        // Remove optimistic update on error
        mutate(currentMessages, false);
        setStreamingMessage(null);
        onError?.(error as Error);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [webId, messages, mutate, isLoading, selectedModel, threadId, onError, setIsLoading]);

  const cancelStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setStreamingMessage(null);
      setIsLoading(false);
    }
  }, [setIsLoading]);

  // Combine persisted messages with streaming message
  const allMessages = [...(messages || [])];
  if (streamingMessage) {
    allMessages.push(streamingMessage);
  }

  return {
    messages: allMessages,
    sendMessage,
    isLoading,
    cancelStream,
    mutate,
  };
}