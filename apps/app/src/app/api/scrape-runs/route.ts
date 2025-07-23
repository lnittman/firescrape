import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@repo/auth/server';
import { getScrapes } from '@/lib/api/services/scrape';
import type { ScrapesListParams } from '@/lib/api/services/scrape';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    const params: ScrapesListParams = {
      status: searchParams.get('status') as any,
      dateRange: searchParams.get('dateRange') as any,
      sortBy: searchParams.get('sortBy') as any,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
    };

    const result = await getScrapes(session.userId, params);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Get scrape runs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}