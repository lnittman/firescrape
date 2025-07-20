'use server';

import { auth } from '@repo/auth/server';
import { appearanceSettingsService, type UpdateAppearanceSettings } from '@repo/api';

export async function updateAppearanceSettings(
  input: UpdateAppearanceSettings
): Promise<
  | { success: true; data: any }
  | { error: string }
> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Not authenticated' };
    }

    const settings = await appearanceSettingsService.updateAppearanceSettings(userId, input);
    return { success: true, data: settings };
  } catch (error) {
    console.error('Error updating appearance settings:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to update appearance settings' };
  }
}
