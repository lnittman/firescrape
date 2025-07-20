import { mutate } from 'swr';
import { createMessage, addMessageToThread, saveMessagesForThread, deleteMessagesForThread } from '@/app/actions/messages';
import type { Message, CreateMessageInput, CreateMessagesInput } from '@repo/api';

export function useCreateMessage() {
  const create = async (input: CreateMessageInput): Promise<Message> => {
    const result = await createMessage(input);
    
    if ('error' in result) {
      throw new Error(result.error);
    }
    
    // Revalidate messages for this thread
    mutate(`/api/threads/${input.threadId}/messages`);
    
    return result.data;
  };

  return {
    createMessage: create,
  };
}

export function useAddMessageToThread() {
  const add = async (threadId: string, input: CreateMessageInput): Promise<Message> => {
    const result = await addMessageToThread(threadId, input);
    
    if ('error' in result) {
      throw new Error(result.error);
    }
    
    // Revalidate messages for this thread
    mutate(`/api/threads/${threadId}/messages`);
    
    return result.data;
  };

  return {
    addMessageToThread: add,
  };
}

export function useSaveMessagesForThread() {
  const save = async (threadId: string, messages: CreateMessagesInput): Promise<Message[]> => {
    const result = await saveMessagesForThread(threadId, messages);
    
    if ('error' in result) {
      throw new Error(result.error);
    }
    
    // Revalidate messages for this thread
    mutate(`/api/threads/${threadId}/messages`);
    
    return result.data;
  };

  return {
    saveMessagesForThread: save,
  };
}

export function useDeleteMessagesForThread() {
  const deleteMessages = async (threadId: string): Promise<void> => {
    const result = await deleteMessagesForThread(threadId);
    
    if ('error' in result) {
      throw new Error(result.error);
    }
    
    // Revalidate messages for this thread
    mutate(`/api/threads/${threadId}/messages`);
  };

  return {
    deleteMessagesForThread: deleteMessages,
  };
} 