'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@repo/auth/server';
import { z } from 'zod';
import { createScrape } from '@/lib/api/services/scrape';
import { createScrapeSchema } from '@/lib/api/schemas/scrape';

// Response type
export type ScrapeActionResponse = 
  | { success: true; data: any; scrapeId: string }
  | { success: false; error: string };

export async function scrapeUrl(
  url: string,
  formats: string[],
  options: {
    onlyMainContent?: boolean;
    fullPage?: boolean;
    waitFor?: number;
    headers?: Record<string, string>;
    actions?: any[];
    // Additional Options
    extractMainContent?: boolean;
    parsePDFs?: boolean;
    useStealthMode?: boolean;
    includeLinks?: boolean;
    timeout?: number;
    includeOnlyTags?: string;
    excludeTags?: string;
    maxAge?: number;
    // Agent Options
    agentPrompt?: string;
    agentModel?: string;
    agentSchema?: any;
    agentSystemPrompt?: string;
    agentExample?: string;
  } = {}
): Promise<ScrapeActionResponse> {
  try {
    const session = await auth();
    
    if (!session?.userId) {
      return {
        success: false,
        error: 'You must be signed in to scrape URLs',
      };
    }

    // Validate input
    const validatedData = createScrapeSchema.parse({
      url,
      formats,
      onlyMainContent: options.onlyMainContent ?? true,
      fullPage: options.fullPage,
      waitFor: options.waitFor,
      headers: options.headers,
      actions: options.actions,
      // Additional Options
      extractMainContent: options.extractMainContent ?? true,
      parsePDFs: options.parsePDFs ?? false,
      useStealthMode: options.useStealthMode ?? false,
      includeLinks: options.includeLinks ?? false,
      timeout: options.timeout,
      includeOnlyTags: options.includeOnlyTags,
      excludeTags: options.excludeTags,
      maxAge: options.maxAge,
      // Agent Options
      agentPrompt: options.agentPrompt,
      agentModel: options.agentModel,
      agentSchema: options.agentSchema,
      agentSystemPrompt: options.agentSystemPrompt,
      agentExample: options.agentExample,
    });

    // Create scrape run record
    const scrape = await createScrape(session.userId, validatedData);
    
    // Revalidate the my-runs page to show new scrape
    revalidatePath('/my-runs');
    
    // Return immediately with the scrape ID
    // The actual scraping will be handled by the streaming endpoint
    return {
      success: true,
      data: null,
      scrapeId: scrape.id,
    };
  } catch (error) {
    console.error('Scrape error:', error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || 'Invalid input',
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to scrape URL',
    };
  }
}