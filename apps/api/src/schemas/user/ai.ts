import { z } from 'zod';

// AI Settings schema
export const aiSettingsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  defaultModel: z.string(),
  openaiKey: z.string().nullable(),
  anthropicKey: z.string().nullable(),
  googleKey: z.string().nullable(),
  openrouterKey: z.string().nullable(),
  enabledModels: z.record(z.array(z.string())),
  rules: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Update AI settings schema
export const updateAISettingsSchema = z.object({
  defaultModel: z.string().min(1).optional(),
  openaiKey: z.string().min(1).optional().or(z.literal('')),
  anthropicKey: z.string().min(1).optional().or(z.literal('')),
  googleKey: z.string().min(1).optional().or(z.literal('')),
  openrouterKey: z.string().min(1).optional().or(z.literal('')),
  enabledModels: z.record(z.array(z.string())).optional(),
  rules: z.string().max(2000, 'Rules must be less than 2000 characters').optional().or(z.literal('')),
});

// Export types
export type AISettings = z.infer<typeof aiSettingsSchema>;
export type UpdateAISettings = z.infer<typeof updateAISettingsSchema>;
