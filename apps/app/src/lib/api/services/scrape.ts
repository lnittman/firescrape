import 'server-only';
import { db } from '@repo/database';
import type { CreateScrape } from '../schemas/scrape';

/**
 * Creates a new scrape run for a user
 * @param clerkId - The Clerk user ID
 * @param data - The scrape request data
 */
export async function createScrape(clerkId: string, data: CreateScrape) {
  // First find the profile by clerkId, or create it if needed
  let profile = await db.profile.findUnique({
    where: { clerkId },
  });
  
  if (!profile) {
    // Try to create a minimal profile - this handles users who signed up before webhook
    profile = await db.profile.create({
      data: {
        clerkId,
        email: '',
        username: `user_${clerkId.slice(-8)}`,
      },
    });
  }

  // Update lastActiveAt and increment monthlyRunsUsed
  await db.profile.update({
    where: { id: profile.id },
    data: {
      lastActiveAt: new Date(),
      monthlyRunsUsed: { increment: 1 },
      lifetimeRuns: { increment: 1 },
    },
  });

  return db.scrape.create({
    data: {
      userId: profile.id,
      url: data.url,
      status: 'PENDING',
      formats: data.formats,
      
      // Basic Options
      onlyMainContent: data.onlyMainContent,
      includeHtml: data.formats?.includes('html') || false,
      includeRawHtml: data.formats?.includes('rawHtml') || false,
      includeScreenshot: data.formats?.includes('screenshot') || false,
      fullPage: data.fullPage || false,
      waitFor: data.waitFor,
      headers: data.headers,
      actions: data.actions,
      
      // Additional Options
      extractMainContent: data.extractMainContent,
      parsePDFs: data.parsePDFs,
      useStealthMode: data.useStealthMode,
      includeLinks: data.includeLinks,
      timeout: data.timeout,
      includeOnlyTags: data.includeOnlyTags,
      excludeTags: data.excludeTags,
      maxAge: data.maxAge,
      
      // Agent Options
      agentPrompt: data.agentPrompt,
      agentModel: data.agentModel,
      agentSchema: data.agentSchema,
      agentSystemPrompt: data.agentSystemPrompt,
      agentExample: data.agentExample,
      
      startedAt: new Date(),
    },
  });
}

export async function updateScrapeProcessing(id: string) {
  return db.scrape.update({
    where: { id },
    data: { status: 'PROCESSING' },
  });
}

export async function updateScrapeSuccess(id: string, data: any, startTime: number) {
  const results = data.data || {};
  
  // Extract links from metadata if not provided directly
  let links = results.links;
  if (!links && results.metadata?.links) {
    links = results.metadata.links;
  }
  
  return db.scrape.update({
    where: { id },
    data: {
      status: 'COMPLETE',
      markdown: results.markdown,
      html: results.html,
      rawHtml: results.rawHtml,
      metadata: results.metadata,
      links: links,
      screenshotUrl: results.screenshot,
      json: results.json || results.llm_extraction, // Handle both possible field names
      completedAt: new Date(),
      duration: Date.now() - startTime,
    },
  });
}

export async function updateScrapeError(id: string, error: string, errorCode: string, startTime: number) {
  return db.scrape.update({
    where: { id },
    data: {
      status: 'FAILED',
      error,
      errorCode,
      completedAt: new Date(),
      duration: Date.now() - startTime,
    },
  });
}

export async function callFirecrawlAPI(data: CreateScrape) {
  // Check for API key
  if (!process.env.FIRECRAWL_API_KEY) {
    console.error('FIRECRAWL_API_KEY is not set');
    return {
      ok: false,
      status: 500,
      data: {
        error: 'Firecrawl API key is not configured',
      },
    };
  }

  // Build formats array based on what was requested
  const formats: string[] = [];
  
  // Always include markdown if no formats specified
  if (!data.formats || data.formats.length === 0) {
    formats.push('markdown');
  } else {
    // Map our format flags to Firecrawl format strings
    if (data.formats.includes('markdown')) {
      formats.push('markdown');
    }
    if (data.includeHtml || data.formats.includes('html')) {
      formats.push('html');
    }
    if (data.includeRawHtml || data.formats.includes('rawHtml')) {
      formats.push('rawHtml');
    }
    if (data.includeScreenshot || data.formats.includes('screenshot')) {
      if (data.fullPage) {
        formats.push('screenshot@fullPage');
      } else {
        formats.push('screenshot');
      }
    }
    // Note: 'links' is not a valid format in Firecrawl v1 API
    // Links are included automatically with other formats
    // Only include json format if agent options are configured
    if (data.formats.includes('json') && (data.agentPrompt || data.agentSchema)) {
      formats.push('json');
    }
  }

  // Build Firecrawl API request body according to their spec
  const requestBody: any = {
    url: data.url,
    formats: formats,
    onlyMainContent: data.onlyMainContent ?? true,
  };
  
  // Add optional fields only if they have values
  if (data.waitFor && data.waitFor > 0) {
    requestBody.waitFor = data.waitFor;
  }
  if (data.headers && Object.keys(data.headers).length > 0) {
    requestBody.headers = data.headers;
  }
  if (data.actions && Array.isArray(data.actions) && data.actions.length > 0) {
    requestBody.actions = data.actions;
  }
  if (data.timeout && data.timeout > 0) {
    requestBody.timeout = data.timeout;
  }
  if (data.parsePDFs !== undefined) {
    requestBody.parsePDF = data.parsePDFs;
  }
  if (data.maxAge && data.maxAge > 0) {
    requestBody.maxAge = data.maxAge;
  }
  
  // Handle proxy/stealth mode
  if (data.useStealthMode) {
    requestBody.proxy = 'stealth';
  }
  
  // Add include/exclude tags
  if (data.includeOnlyTags) {
    const tags = data.includeOnlyTags.split(',').map(tag => tag.trim()).filter(Boolean);
    if (tags.length > 0) {
      requestBody.includeTags = tags;
    }
  }
  if (data.excludeTags) {
    const tags = data.excludeTags.split(',').map(tag => tag.trim()).filter(Boolean);
    if (tags.length > 0) {
      requestBody.excludeTags = tags;
    }
  }
  
  // Add LLM extraction options (jsonOptions in Firecrawl API)
  // Only add jsonOptions if we have actual agent configuration
  if (formats.includes('json') && (data.agentPrompt || data.agentSchema)) {
    requestBody.jsonOptions = {};
    if (data.agentPrompt) {
      requestBody.jsonOptions.prompt = data.agentPrompt;
    }
    if (data.agentSchema) {
      requestBody.jsonOptions.schema = data.agentSchema;
    }
    if (data.agentSystemPrompt) {
      requestBody.jsonOptions.systemPrompt = data.agentSystemPrompt;
    }
  }
  
  // Debug logging
  console.log('Firecrawl API Request:', JSON.stringify(requestBody, null, 2));
  console.log('Formats array:', formats);
  console.log('Original data formats:', data.formats);
  
  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  let responseData;
  
  if (contentType && contentType.includes('application/json')) {
    responseData = await response.json();
  } else {
    // If not JSON, read as text
    const text = await response.text();
    console.error('Non-JSON response from Firecrawl:', text);
    responseData = {
      error: 'Invalid response from Firecrawl API',
      details: text.substring(0, 200), // First 200 chars for debugging
    };
  }
  
  // Log error responses
  if (!response.ok) {
    console.error('Firecrawl API Error:', {
      status: response.status,
      statusText: response.statusText,
      data: responseData,
    });
    
    // Log detailed error if available
    if (responseData.details && Array.isArray(responseData.details)) {
      console.error('Error details:', JSON.stringify(responseData.details, null, 2));
    }
  }
  
  return {
    ok: response.ok,
    status: response.status,
    data: responseData,
  };
}

// List/Query functions
export interface ScrapesListParams {
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETE' | 'FAILED';
  dateRange?: 'today' | 'week' | 'month' | 'all';
  sortBy?: 'newest' | 'oldest' | 'url';
  limit?: number;
  offset?: number;
}

export async function getScrapes(clerkId: string, params: ScrapesListParams = {}) {
  const profile = await db.profile.findUnique({
    where: { clerkId },
  });
  
  if (!profile) {
    return { runs: [], total: 0 };
  }

  const {
    status,
    dateRange = 'all',
    sortBy = 'newest',
    limit = 20,
    offset = 0
  } = params;

  const where: any = {
    userId: profile.id,
  };

  if (status) {
    where.status = status;
  }

  // Date range filter
  if (dateRange !== 'all') {
    const now = new Date();
    let startDate: Date;

    switch (dateRange) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        startDate = new Date(0);
    }

    where.createdAt = {
      gte: startDate,
    };
  }

  // Build order by
  let orderBy: any;
  switch (sortBy) {
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'url':
      orderBy = { url: 'asc' };
      break;
    case 'newest':
    default:
      orderBy = { createdAt: 'desc' };
      break;
  }

  // Execute queries
  const [runs, total] = await Promise.all([
    db.scrape.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
      select: {
        id: true,
        url: true,
        status: true,
        formats: true,
        createdAt: true,
        completedAt: true,
        duration: true,
        error: true,
        metadata: true,
        markdown: true,
      },
    }),
    db.scrape.count({ where }),
  ]);

  return { runs, total };
}

export async function getScrapeById(clerkId: string, id: string) {
  const profile = await db.profile.findUnique({
    where: { clerkId },
  });
  
  if (!profile) {
    return null;
  }

  const scrape = await db.scrape.findFirst({
    where: {
      id,
      userId: profile.id,
    },
  });

  return scrape;
}

export async function deleteScrape(clerkId: string, id: string) {
  const profile = await db.profile.findUnique({
    where: { clerkId },
  });
  
  if (!profile) {
    throw new Error('Profile not found');
  }

  const scrape = await db.scrape.deleteMany({
    where: {
      id,
      userId: profile.id,
    },
  });

  return scrape.count > 0;
}

export async function getScrapeStats(clerkId: string) {
  const profile = await db.profile.findUnique({
    where: { clerkId },
  });
  
  if (!profile) {
    return {
      total: 0,
      successful: 0,
      failed: 0,
      pending: 0,
      averageDuration: 0,
    };
  }

  const [total, successful, failed, pending, avgDuration] = await Promise.all([
    db.scrape.count({
      where: { userId: profile.id },
    }),
    db.scrape.count({
      where: { userId: profile.id, status: 'COMPLETE' },
    }),
    db.scrape.count({
      where: { userId: profile.id, status: 'FAILED' },
    }),
    db.scrape.count({
      where: { userId: profile.id, status: { in: ['PENDING', 'PROCESSING'] } },
    }),
    db.scrape.aggregate({
      where: { 
        userId: profile.id,
        status: 'COMPLETE',
        duration: { not: null },
      },
      _avg: {
        duration: true,
      },
    }),
  ]);

  return {
    total,
    successful,
    failed,
    pending,
    averageDuration: avgDuration._avg.duration || 0,
  };
}

// Client-side utility functions (not using db)
export function formatDuration(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }
  
  const seconds = Math.floor(milliseconds / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

export function estimateScrapeTime(_url: string, options: { formats: string[], fullPage?: boolean, actions?: any[], waitFor?: number }): number {
  let baseTime = 3000; // 3 seconds base

  // Add time for additional formats
  baseTime += options.formats.length * 1000;

  // Add time for screenshot
  if (options.formats.includes('screenshot')) {
    baseTime += options.fullPage ? 5000 : 2000;
  }

  // Add time for actions
  if (options.actions && options.actions.length > 0) {
    baseTime += options.actions.length * 1000;
  }

  // Add wait time
  if (options.waitFor) {
    baseTime += options.waitFor;
  }

  return baseTime;
}