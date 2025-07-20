import { z } from "zod";

// Basic appearance settings schema - font handling is managed by the design system
export const appearanceSettingsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Update appearance settings schema - currently no user-configurable appearance options
// Font selection is handled by the design system's typography components
export const updateAppearanceSettingsSchema = z.object({
  // Future appearance settings can be added here that don't conflict with the design system
  // Examples: custom themes, layout preferences, etc.
  fontFamily: z.string().optional(),
});

// Export types
export type AppearanceSettings = z.infer<typeof appearanceSettingsSchema>;
export type UpdateAppearanceSettings = z.infer<
  typeof updateAppearanceSettingsSchema
>;
