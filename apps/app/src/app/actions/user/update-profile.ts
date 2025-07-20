'use server';

import { auth } from '@repo/auth/server';
import { profileService, type UpdateProfile } from '@repo/api';

export async function updateProfile(
  input: UpdateProfile
): Promise<
  | { success: true; data: any }
  | { error: string }
> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Not authenticated' };
    }

    const profile = await profileService.updateProfile(userId, input);
    return { success: true, data: profile };
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to update profile' };
  }
}
