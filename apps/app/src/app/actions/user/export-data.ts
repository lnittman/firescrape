'use server';

import { auth } from '@repo/auth/server';
import { userService } from '@repo/api';

export async function exportUserData(): Promise<
  | { success: true; data: any }
  | { error: string }
> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Not authenticated' };
    }

    // Get user data summary for export
    const dataSummary = await userService.getUserDataSummary(userId);

    // Create export data structure
    const exportData = {
      userId,
      exportedAt: new Date().toISOString(),
      summary: dataSummary,
      // Note: In a full implementation, you would export the actual data
      // For now, we're just providing a summary during cleanup
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
