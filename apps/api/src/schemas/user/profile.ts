import { z } from 'zod';

// Profile schema
export const profileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  displayName: z.string().nullable(),
  username: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  tier: z.enum(['free', 'premium']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Update profile schema
export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens').optional(),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number').optional(),
  tier: z.enum(['free', 'premium']).optional(),
});

// Export types
export type Profile = z.infer<typeof profileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
