'use server';

import { auth } from '@repo/auth/server';
import { notificationSettingsService, type UpdateNotificationSettings } from '@repo/api';

export async function updateNotificationSettings(
  input: UpdateNotificationSettings
): Promise<
  | { success: true; data: any }
  | { error: string }
> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Not authenticated' };
    }

    const settings = await notificationSettingsService.updateNotificationSettings(userId, input);
    return { success: true, data: settings };
  } catch (error) {
    console.error('Error updating notification settings:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to update notification settings' };
  }
}
