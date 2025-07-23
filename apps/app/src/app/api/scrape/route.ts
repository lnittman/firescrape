import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@repo/auth/server';
import { z } from 'zod';
import { createScrapeSchema } from '@/lib/api/schemas/scrape';
import {
  createScrape,
  updateScrapeProcessing,
  updateScrapeSuccess,
  updateScrapeError,
  callFirecrawlAPI,
} from '@/lib/api/services/scrape';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createScrapeSchema.parse(body);

    // Create scrape run record
    const scrape = await createScrape(session.userId, validatedData);
    const startTime = scrape.startedAt?.getTime() || Date.now();

    // Update status to processing
    await updateScrapeProcessing(scrape.id);

    // Call Firecrawl API
    const firecrawlResponse = await callFirecrawlAPI(validatedData);

    if (!firecrawlResponse.ok) {
      // Update scrape run with error
      await updateScrapeError(
        scrape.id,
        firecrawlResponse.data.error || 'Failed to scrape URL',
        firecrawlResponse.status.toString(),
        startTime
      );

      return NextResponse.json(
        { 
          error: firecrawlResponse.data.error || 'Failed to scrape URL',
          scrapeId: scrape.id,
        },
        { status: firecrawlResponse.status }
      );
    }

    // Update scrape run with results
    await updateScrapeSuccess(scrape.id, firecrawlResponse.data, startTime);


    return NextResponse.json({
      success: true,
      scrapeId: scrape.id,
      data: firecrawlResponse.data.data || {},
    });

  } catch (error) {
    console.error('Scrape error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}