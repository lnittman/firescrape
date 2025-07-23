import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@repo/auth/server';
import { getScrapeById } from '@/lib/api/services/scrape';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const scrape = await getScrapeById(session.userId, id);
    
    if (!scrape) {
      return NextResponse.json(
        { error: 'Scrape not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(scrape);
  } catch (error) {
    console.error('Get scrape detail error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}