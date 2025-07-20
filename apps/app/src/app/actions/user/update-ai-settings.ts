'use server';

import { auth } from '@repo/auth/server';
import { aiSettingsService, type UpdateAISettings } from '@repo/api';

export async function updateAISettings(
  input: UpdateAISettings
): Promise<
  | { success: true; data: any }
  | { error: string }
> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Not authenticated' };
    }

    const settings = await aiSettingsService.updateAISettings(userId, input);
    return { success: true, data: settings };
  } catch (error) {
    console.error('Error updating AI settings:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to update AI settings' };
  }
}
