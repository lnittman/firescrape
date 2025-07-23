'use server';

import { auth } from '@repo/auth/server';
import { updateAISettingsSchema, type UpdateAISettings } from '@/lib/api/schemas/profile';

export async function updateAISettings(
  input: UpdateAISettings
): Promise<{ success: true } | { error: string }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Not authenticated' };
    }

    // Validate input
    const validatedData = updateAISettingsSchema.parse(input);

    // TODO: Implement actual AI settings storage
    console.log('AI settings update requested:', { userId, input: validatedData });

    return { success: true };
  } catch (error) {
    console.error('Error updating AI settings:', error);
    return { error: 'Failed to update AI settings' };
  }
}
