import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@repo/auth/server';
import { getScrapeById, updateScrapeProcessing, updateScrapeSuccess, updateScrapeError, callFirecrawlAPI } from '@/lib/api/services/scrape';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const scrape = await getScrapeById(session.userId, id);
  
  if (!scrape) {
    return NextResponse.json({ error: 'Scrape not found' }, { status: 404 });
  }

  // Create a TransformStream for Server-Sent Events
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Send initial connection message
  writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'connected', id })}\n\n`));

  // Process the scrape asynchronously
  processScrape(id, scrape, writer, encoder);

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

async function processScrape(
  id: string,
  scrape: any,
  writer: WritableStreamDefaultWriter,
  encoder: TextEncoder
) {
  const startTime = Date.now();
  
  try {
    // Update status to processing
    await updateScrapeProcessing(id);
    await writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'status', status: 'processing' })}\n\n`));

    // Transform database fields to match CreateScrape interface
    const scrapeData: any = {
      url: scrape.url,
      formats: Array.isArray(scrape.formats) ? scrape.formats : ['markdown'],
      onlyMainContent: scrape.onlyMainContent ?? true,
      includeHtml: scrape.includeHtml || false,
      includeRawHtml: scrape.includeRawHtml || false,
      includeScreenshot: scrape.includeScreenshot || false,
      fullPage: scrape.fullPage || false,
    };

    // Add optional fields only if they exist
    if (scrape.waitFor) {
      scrapeData.waitFor = scrape.waitFor;
    }
    if (scrape.headers) {
      scrapeData.headers = typeof scrape.headers === 'string' ? JSON.parse(scrape.headers) : scrape.headers;
    }
    if (scrape.actions) {
      scrapeData.actions = typeof scrape.actions === 'string' ? JSON.parse(scrape.actions) : scrape.actions;
    }
    if (scrape.timeout) {
      scrapeData.timeout = scrape.timeout;
    }
    if (scrape.extractMainContent !== undefined) {
      scrapeData.extractMainContent = scrape.extractMainContent;
    }
    if (scrape.parsePDFs !== undefined) {
      scrapeData.parsePDFs = scrape.parsePDFs;
    }
    if (scrape.useStealthMode) {
      scrapeData.useStealthMode = scrape.useStealthMode;
    }
    if (scrape.includeLinks) {
      scrapeData.includeLinks = scrape.includeLinks;
    }
    if (scrape.maxAge) {
      scrapeData.maxAge = scrape.maxAge;
    }
    if (scrape.includeOnlyTags) {
      scrapeData.includeOnlyTags = scrape.includeOnlyTags;
    }
    if (scrape.excludeTags) {
      scrapeData.excludeTags = scrape.excludeTags;
    }
    if (scrape.agentPrompt) {
      scrapeData.agentPrompt = scrape.agentPrompt;
    }
    if (scrape.agentModel) {
      scrapeData.agentModel = scrape.agentModel;
    }
    if (scrape.agentSchema) {
      scrapeData.agentSchema = typeof scrape.agentSchema === 'string' ? JSON.parse(scrape.agentSchema) : scrape.agentSchema;
    }
    if (scrape.agentSystemPrompt) {
      scrapeData.agentSystemPrompt = scrape.agentSystemPrompt;
    }
    if (scrape.agentExample) {
      scrapeData.agentExample = scrape.agentExample;
    }

    // Send progress update
    await writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'progress', message: 'Calling Firecrawl API...' })}\n\n`));

    // Call Firecrawl API
    const result = await callFirecrawlAPI(scrapeData);

    if (result.ok) {
      // Update database with success
      await updateScrapeSuccess(id, result.data, startTime);
      
      // Send success message with data
      await writer.write(encoder.encode(`data: ${JSON.stringify({ 
        type: 'complete', 
        status: 'success',
        data: result.data
      })}\n\n`));
    } else {
      // Handle error
      let errorMessage = result.data?.error || 'Scraping failed';
      const errorCode = result.data?.error_code || 'UNKNOWN_ERROR';
      
      // If there are detailed errors, include them
      if (result.data?.details && Array.isArray(result.data.details)) {
        const detailMessages = result.data.details.map((d: any) => 
          typeof d === 'string' ? d : (d.message || JSON.stringify(d))
        ).join('; ');
        errorMessage = `${errorMessage}: ${detailMessages}`;
      }
      
      await updateScrapeError(id, errorMessage, errorCode, startTime);
      
      await writer.write(encoder.encode(`data: ${JSON.stringify({ 
        type: 'complete', 
        status: 'error',
        error: errorMessage,
        errorCode
      })}\n\n`));
    }
  } catch (error) {
    console.error('Scrape processing error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await updateScrapeError(id, errorMessage, 'PROCESSING_ERROR', startTime);
    
    await writer.write(encoder.encode(`data: ${JSON.stringify({ 
      type: 'complete', 
      status: 'error',
      error: errorMessage,
      errorCode: 'PROCESSING_ERROR'
    })}\n\n`));
  } finally {
    await writer.close();
  }
}