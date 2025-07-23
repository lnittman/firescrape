'use server';

import { auth } from '@repo/auth/server';
import { db } from '@repo/database';

export async function exportUserData(): Promise<
  | { success: true; data: any }
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

    // Get all user data for export
    const [scrapes, feedback] = await Promise.all([
      db.scrape.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      }),
      db.feedback.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Create export data structure
    const exportData = {
      userId: user.id,
      clerkId,
      exportedAt: new Date().toISOString(),
      data: {
        scrapes: {
          total: scrapes.length,
          items: scrapes,
        },
        preferences: {
          theme: user.theme,
          fontFamily: user.fontFamily,
        },
        feedback: {
          total: feedback.length,
          items: feedback,
        },
      },
    };

    return { success: true, data: exportData };
  } catch (error) {
    console.error('Error exporting user data:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to export user data' };
  }
}
