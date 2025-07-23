'use server';

import { auth } from '@repo/auth/server';
import { db } from '@repo/database';
import { revalidatePath } from 'next/cache';

export async function updateProfile(
  input: { displayName?: string; username?: string; phoneNumber?: string }
): Promise<
  | { success: true }
  | { error: string }
> {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return { error: 'Not authenticated' };
    }

    // Find the user by clerkId
    const user = await db.profile.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return { error: 'User not found' };
    }

    // Update user profile
    await db.profile.update({
      where: { id: user.id },
      data: {
        username: input.username,
        firstName: input.displayName,
      },
    });
    
    revalidatePath('/account');
    revalidatePath('/settings');

    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { error: 'Failed to update profile' };
  }
}