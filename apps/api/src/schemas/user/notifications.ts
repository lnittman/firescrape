import { z } from 'zod';

// Notification Settings schema
export const notificationSettingsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  notifyProcessingComplete: z.boolean(),
  notifyProcessingFailed: z.boolean(),
  notifyWeeklySummary: z.boolean(),
  notifyFeatureUpdates: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Update notification settings schema
export const updateNotificationSettingsSchema = z.object({
  notifyProcessingComplete: z.boolean().optional(),
  notifyProcessingFailed: z.boolean().optional(),
  notifyWeeklySummary: z.boolean().optional(),
  notifyFeatureUpdates: z.boolean().optional(),
});

// Export types
export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;
export type UpdateNotificationSettings = z.infer<typeof updateNotificationSettingsSchema>;
