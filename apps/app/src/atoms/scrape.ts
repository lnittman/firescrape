import { atom } from 'jotai';

// Types for advanced scrape options
export interface AdvancedScrapeOptions {
  extractMainContent: boolean;
  parsePDFs: boolean;
  useStealthMode: boolean;
  formats: ScrapeFormat[];
  includeLinks: boolean;
  htmlTypes: {
    cleaned: boolean;
    raw: boolean;
  };
  screenshotTypes: {
    viewport: boolean;
    fullPage: boolean;
  };
  timeout?: number;
  headers?: Record<string, string>;
  includeOnlyTags?: string;
  excludeTags?: string;
  waitFor?: number;
  maxAge?: number;
}

// Agent options type
export interface AgentOptions {
  prompt?: string;
  model?: string;
  schema?: any;
  systemPrompt?: string;
  example?: string;
}

export type ScrapeFormat = 'markdown' | 'html' | 'rawHtml' | 'screenshot' | 'json';

export interface ScrapeOptions {
  url: string;
  formats: ScrapeFormat[];
  onlyMainContent: boolean;
  includeHtml?: boolean;
  includeRawHtml?: boolean;
  includeScreenshot?: boolean;
  fullPage?: boolean;
  waitFor?: number;
  headers?: Record<string, string>;
  actions?: any[];
}

export interface ScrapeResult {
  markdown?: string;
  html?: string;
  rawHtml?: string;
  metadata?: {
    title?: string;
    description?: string;
    language?: string;
    keywords?: string;
    robots?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogUrl?: string;
    ogImage?: string;
    ogSiteName?: string;
    sourceURL?: string;
    statusCode?: number;
  };
  links?: string[];
  screenshotUrl?: string;
  json?: any;
}

// Form state atoms
export const scrapeUrlAtom = atom('');
export const scrapeFormatsAtom = atom<ScrapeFormat[]>(['markdown']);
export const onlyMainContentAtom = atom(true);
export const includeHtmlAtom = atom(false);
export const includeRawHtmlAtom = atom(false);
export const includeScreenshotAtom = atom(false);
export const fullPageAtom = atom(false);
export const waitForAtom = atom<number | undefined>(undefined);
export const headersAtom = atom<Record<string, string>>({});
export const actionsAtom = atom<any[]>([]);

// Loading and results atoms
export const isScrapingAtom = atom(false);
export const scrapeResultAtom = atom<ScrapeResult | null>(null);
export const scrapeErrorAtom = atom<string | null>(null);

// Derived atoms
export const hasResultsAtom = atom((get) => get(scrapeResultAtom) !== null);
export const hasErrorAtom = atom((get) => get(scrapeErrorAtom) !== null);

// Write-only atoms for actions
export const clearResultsAtom = atom(
  null,
  (get, set) => {
    set(scrapeResultAtom, null);
    set(scrapeErrorAtom, null);
  }
);

export const resetFormAtom = atom(
  null,
  (get, set) => {
    set(scrapeUrlAtom, '');
    set(scrapeFormatsAtom, ['markdown']);
    set(onlyMainContentAtom, true);
    set(includeHtmlAtom, false);
    set(includeRawHtmlAtom, false);
    set(includeScreenshotAtom, false);
    set(fullPageAtom, false);
    set(waitForAtom, undefined);
    set(headersAtom, {});
    set(actionsAtom, []);
    set(scrapeResultAtom, null);
    set(scrapeErrorAtom, null);
  }
);

// Advanced scrape options
export const advancedScrapeOptionsAtom = atom<AdvancedScrapeOptions>({
  extractMainContent: true,
  parsePDFs: false,
  useStealthMode: false,
  formats: ['markdown'],
  includeLinks: false,
  htmlTypes: {
    cleaned: false,
    raw: false
  },
  screenshotTypes: {
    viewport: false,
    fullPage: false
  }
});

// Agent options
export const agentOptionsAtom = atom<AgentOptions>({});

export const scrapeStateAtom = atom<'idle' | 'typing' | 'submitting'>('idle');