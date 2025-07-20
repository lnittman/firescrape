import { z } from 'zod';

export const feedbackTopicSchema = z.enum([
  'BUG',
  'FEATURE',
  'UI',
  'PERFORMANCE',
  'GENERAL'
]);

export const feedbackSentimentSchema = z.enum([
  'POSITIVE',
  'NEGATIVE'
]);

export const feedbackStatusSchema = z.enum([
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED'
]);

export const feedbackSchema = z.object({
  id: z.string(),
  topic: feedbackTopicSchema,
  message: z.string(),
  sentiment: feedbackSentimentSchema.optional(),
  userAgent: z.string().optional(),
  url: z.string().optional(),
  userId: z.string().optional(),
  status: feedbackStatusSchema.default('OPEN'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createFeedbackSchema = z.object({
  topic: feedbackTopicSchema,
  message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
  sentiment: feedbackSentimentSchema.optional(),
  userAgent: z.string().optional(),
  url: z.string().optional(),
});

export type FeedbackTopic = z.infer<typeof feedbackTopicSchema>;
export type FeedbackSentiment = z.infer<typeof feedbackSentimentSchema>;
export type FeedbackStatus = z.infer<typeof feedbackStatusSchema>;
export type Feedback = z.infer<typeof feedbackSchema>;
export type CreateFeedback = z.infer<typeof createFeedbackSchema>;
