import 'server-only';
import { db } from '@repo/database';
import { z } from 'zod';
import type { FeedbackTopic, FeedbackStatus, FeedbackSentiment } from '@repo/database';

// Types
export interface Feedback {
  id: string;
  topic: FeedbackTopic;
  message: string;
  sentiment: FeedbackSentiment | null;
  userAgent: string | null;
  url: string | null;
  userId: string | null;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
}

// Input schema
export const feedbackSchema = z.object({
  topic: z.enum(['BUG', 'FEATURE', 'UI', 'PERFORMANCE', 'GENERAL']),
  message: z.string().min(1).max(5000),
  sentiment: z.enum(['POSITIVE', 'NEGATIVE']).nullable().optional(),
  userAgent: z.string().optional(),
  url: z.string().url().optional(),
  userId: z.string().optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;

// Service class
export class FeedbackService {
  /**
   * Create new feedback
   */
  async createFeedback(input: unknown): Promise<Feedback> {
    const data = feedbackSchema.parse(input);
    const feedback = await db.feedback.create({
      data: {
        ...data,
        status: data.status ?? 'OPEN',
      },
    });
    
    return this.serializeFeedback(feedback);
  }

  /**
   * Serialize feedback with proper date formatting
   */
  private serializeFeedback(feedback: any): Feedback {
    return {
      ...feedback,
      createdAt: feedback.createdAt.toISOString(),
      updatedAt: feedback.updatedAt.toISOString(),
    };
  }
}

// Export singleton instance
export const feedbackService = new FeedbackService();