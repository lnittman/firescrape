import { z } from 'zod';

// Status enum matching Prisma schema
export const scrapeStatusSchema = z.enum(['PENDING', 'PROCESSING', 'COMPLETE', 'FAILED']);
export type ScrapeStatus = z.infer<typeof scrapeStatusSchema>;

// Format options
export const scrapeFormatSchema = z.enum(['markdown', 'html', 'rawHtml', 'screenshot', 'json']);
export type ScrapeFormat = z.infer<typeof scrapeFormatSchema>;

// Agent options schema
export const agentOptionsSchema = z.object({
  prompt: z.string().optional(),
  model: z.string().optional(),
  schema: z.any().optional(),
  systemPrompt: z.string().optional(),
  example: z.string().optional(),
});

export type AgentOptions = z.infer<typeof agentOptionsSchema>;

// Advanced scrape options schema
export const advancedScrapeOptionsSchema = z.object({
  extractMainContent: z.boolean().default(true),
  parsePDFs: z.boolean().default(false),
  useStealthMode: z.boolean().default(false),
  formats: z.array(scrapeFormatSchema).default(['markdown']),
  includeLinks: z.boolean().default(false),
  htmlTypes: z.object({
    cleaned: z.boolean().default(false),
    raw: z.boolean().default(false),
  }).default({ cleaned: false, raw: false }),
  screenshotTypes: z.object({
    viewport: z.boolean().default(false),
    fullPage: z.boolean().default(false),
  }).default({ viewport: false, fullPage: false }),
  timeout: z.number().optional(),
  headers: z.record(z.string()).optional(),
  includeOnlyTags: z.string().optional(),
  excludeTags: z.string().optional(),
  waitFor: z.number().optional(),
  maxAge: z.number().optional(),
});

export type AdvancedScrapeOptions = z.infer<typeof advancedScrapeOptionsSchema>;

// Main scrape schema
export const scrapeSchema = z.object({
  id: z.string(),
  userId: z.string(),
  url: z.string().url(),
  status: scrapeStatusSchema,
  formats: z.array(scrapeFormatSchema),
  
  // Options
  onlyMainContent: z.boolean(),
  includeHtml: z.boolean(),
  includeRawHtml: z.boolean(),
  includeScreenshot: z.boolean(),
  fullPage: z.boolean(),
  waitFor: z.number().optional(),
  headers: z.record(z.string()).optional(),
  actions: z.array(z.any()).optional(),
  
  // Additional Options
  extractMainContent: z.boolean(),
  parsePDFs: z.boolean(),
  useStealthMode: z.boolean(),
  includeLinks: z.boolean(),
  timeout: z.number().optional(),
  includeOnlyTags: z.string().optional(),
  excludeTags: z.string().optional(),
  maxAge: z.number().optional(),
  
  // Agent Options
  agentPrompt: z.string().optional(),
  agentModel: z.string().optional(),
  agentSchema: z.any().optional(),
  agentSystemPrompt: z.string().optional(),
  agentExample: z.string().optional(),
  
  // Results
  markdown: z.string().optional(),
  html: z.string().optional(),
  rawHtml: z.string().optional(),
  metadata: z.any().optional(),
  links: z.array(z.any()).optional(),
  screenshotUrl: z.string().optional(),
  json: z.any().optional(),
  
  // Error handling
  error: z.string().optional(),
  errorCode: z.string().optional(),
  
  // Timing
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
  duration: z.number().optional(),
  
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Scrape = z.infer<typeof scrapeSchema>;

// Create scrape input schema
export const createScrapeSchema = z.object({
  url: z.string().url(),
  formats: z.array(scrapeFormatSchema).min(1).default(['markdown']),
  onlyMainContent: z.boolean().default(true),
  includeHtml: z.boolean().default(false),
  includeRawHtml: z.boolean().default(false),
  includeScreenshot: z.boolean().default(false),
  fullPage: z.boolean().default(false),
  waitFor: z.number().optional(),
  headers: z.record(z.string()).optional(),
  actions: z.array(z.any()).optional(),
  
  // Additional Options
  extractMainContent: z.boolean().default(true),
  parsePDFs: z.boolean().default(false),
  useStealthMode: z.boolean().default(false),
  includeLinks: z.boolean().default(false),
  timeout: z.number().optional(),
  includeOnlyTags: z.string().optional(),
  excludeTags: z.string().optional(),
  maxAge: z.number().optional(),
  
  // Agent Options
  agentPrompt: z.string().optional(),
  agentModel: z.string().optional(),
  agentSchema: z.any().optional(),
  agentSystemPrompt: z.string().optional(),
  agentExample: z.string().optional(),
});

export type CreateScrape = z.infer<typeof createScrapeSchema>;

// Scrape request schema (combines URL with all options)
export const scrapeRequestSchema = z.object({
  url: z.string().url(),
  options: advancedScrapeOptionsSchema.optional(),
  agent: agentOptionsSchema.optional(),
});

export type ScrapeRequest = z.infer<typeof scrapeRequestSchema>;