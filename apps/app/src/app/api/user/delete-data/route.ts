import { NextResponse } from 'next/server';
import { auth } from '@repo/auth/server';
import { db } from '@repo/database';

export async function DELETE() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const profile = await db.profile.findUnique({
      where: { clerkId: userId },
    });

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete all scrapes for this user
    await db.scrape.deleteMany({
      where: { userId: profile.id },
    });

    // Note: We don't delete the profile itself as it's managed by Clerk
    // and needed for authentication. We only delete user-generated content.

    return NextResponse.json({ 
      success: true, 
      message: 'All scrape data has been deleted successfully' 
    });
  } catch (error) {
    console.error('Delete data error:', error);
    return NextResponse.json(
      { error: 'Failed to delete data' },
      { status: 500 }
    );
  }
}