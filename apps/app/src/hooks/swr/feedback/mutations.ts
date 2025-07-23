import { mutate } from 'swr';

import type { CreateFeedback, Feedback } from '@/lib/api/schemas';
import { createFeedback } from '../../../actions/create-feedback';

export function useCreateFeedback() {
  const create = async (input: CreateFeedback) => {
    const result = await createFeedback(input);
    
    if ('error' in result) {
      throw new Error(result.error);
    }
    
    // Revalidate feedback list
    mutate('/api/feedback');
    
    // Return the feedback data with proper date conversion
    return {
      ...result.data,
      createdAt: new Date(result.data.createdAt),
      updatedAt: new Date(result.data.updatedAt),
    } as Feedback;
  };

  return {
    createFeedback: create,
  };
}
