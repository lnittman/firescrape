export interface Logger {
  info(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
}

// Simple basename implementation that works in Edge Runtime
function getBasename(filepath: string): string {
  // Handle both forward and backward slashes
  const parts = filepath.split(/[\\/]/);
  return parts[parts.length - 1] || 'unknown';
}

export function createLogger(name?: string): Logger {
  const resolved =
    name ?? (() => {
      // In Edge Runtime, we can't use Error.stack reliably
      // So we'll use a simpler approach
      if (typeof window !== 'undefined' || (globalThis as any).EdgeRuntime) {
        return 'edge-logger';
      }
      
      const err = new Error()
      const line = err.stack?.split('\n')[2] ?? ''
      const match = line.match(/\(?(.+?):\d+:\d+\)?$/)
      const file = match ? getBasename(match[1]) : 'unknown'
      return file.replace(/\.[^./]+$/, '')
    })()

  const prefix = `[${resolved}]`
  
  return {
    info: (message: string, ...args: any[]) => {
      console.log(`${prefix} ${message}`, ...args);
    },
    error: (message: string, ...args: any[]) => {
      console.error(`${prefix} ${message}`, ...args);
    },
    warn: (message: string, ...args: any[]) => {
      console.warn(`${prefix} ${message}`, ...args);
    },
    debug: (message: string, ...args: any[]) => {
      console.debug(`${prefix} ${message}`, ...args);
    },
  };
} 