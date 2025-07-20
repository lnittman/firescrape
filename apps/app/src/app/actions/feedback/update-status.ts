'use server';

import { auth } from '@repo/auth/server';
import { feedbackService } from '@repo/api';

export async function updateFeedbackStatus(
  id: string,
  status: string
): Promise<{ success: true } | { error: string }> {
  try {
    await auth();
    await feedbackService.updateFeedbackStatus(id, status as any);
    return { success: true };
  } catch (error) {
    console.error('Error updating feedback:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to update feedback' };
  }
}
