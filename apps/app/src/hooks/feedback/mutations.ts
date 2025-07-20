import { mutate } from 'swr';
import { createFeedback, updateFeedbackStatus } from '@/app/actions/feedback';
import type { FeedbackInput, Feedback } from '@repo/api';
import type { FeedbackStatus } from '@repo/database';

export function useCreateFeedback() {
  const create = async (input: FeedbackInput): Promise<Feedback> => {
    const result = await createFeedback(input);
    
    if ('error' in result) {
      throw new Error(result.error);
    }
    
    // Revalidate feedback list
    mutate('/api/feedback');
    
    return result.data;
  };

  return {
    createFeedback: create,
  };
}

export function useUpdateFeedbackStatus() {
  const update = async (id: string, status: FeedbackStatus): Promise<void> => {
    const result = await updateFeedbackStatus(id, status);
    
    if ('error' in result) {
      throw new Error(result.error);
    }
    
    // Revalidate feedback list
    mutate('/api/feedback');
  };

  return {
    updateFeedbackStatus: update,
  };
} 