'use server';

import { auth } from '@repo/auth/server';
import { feedbackService, feedbackSchema, type Feedback } from '@/lib/api/services/feedback';

export async function createFeedback(
  input: unknown
): Promise<
  | { success: true; data: Feedback }
  | { error: string }
> {
  try {
    const { userId } = await auth();
    const data = feedbackSchema.parse(input);

    const feedback = await feedbackService.createFeedback({ ...data, userId });
    return { success: true, data: feedback };
  } catch (error) {
    console.error('Error creating feedback:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to create feedback' };
  }
}
