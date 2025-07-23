import { z } from 'zod';

// Profile schema based on User model
export const profileSchema = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string().email(),
  username: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  lifetimeRuns: z.number().default(0),
  monthlyRunsUsed: z.number().default(0),
  lastActiveAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const updateProfileSchema = z.object({
  username: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

// AI settings schema
export const aiSettingsSchema = z.object({
  rules: z.string().optional(),
});

export const updateAISettingsSchema = aiSettingsSchema.partial();

// Export types
export type Profile = z.infer<typeof profileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type AISettings = z.infer<typeof aiSettingsSchema>;
export type UpdateAISettings = z.infer<typeof updateAISettingsSchema>;