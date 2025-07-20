'use server';

import { auth } from '@repo/auth/server';
import { feedbackService, type Feedback } from '@repo/api';
import type { FeedbackTopic, FeedbackStatus } from '@repo/database';

interface ListParams {
  topic?: FeedbackTopic;
  status?: FeedbackStatus;
  limit?: number;
  offset?: number;
}

export async function listFeedback(
  params: ListParams = {}
): Promise<
  | { success: true; data: { feedback: Feedback[]; total: number } }
  | { error: string }
> {
  try {
    await auth();
    const result = await feedbackService.listFeedback(params);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error listing feedback:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to list feedback' };
  }
}
