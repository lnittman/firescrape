import { database } from '@repo/database';
import { createLogger } from '@repo/logger';

import { CronJob } from '@/src/constants/cron';

const log = createLogger('api-cron');

/**
 * Execute a cron job by name
 */
export async function executeCronJob(jobType: CronJob): Promise<void> {
  log.info(`Executing cron job: ${jobType}`);
  
  try {
    switch (jobType) {
      // TODO: Add cron job cases as needed
      default:
        throw new Error(`Unknown job: ${jobType}`);
    }
    
    log.info(`Completed cron job: ${jobType}`);
  } finally {
    await database.$disconnect();
  }
}

/**
 * Handle errors in cron jobs
 */
export async function handleCronError(error: unknown, jobType: CronJob): Promise<{ error: string; details?: unknown }> {
  log.error(`Error in cron job ${jobType}:`, error);
  
  // Format the error response
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorResponse = {
    error: `Failed to execute ${jobType}: ${errorMessage}`,
    details: error instanceof Error ? { 
      name: error.name,
      stack: error.stack
    } : undefined
  };
  
  // Ensure database connection is closed
  try {
    await database.$disconnect();
  } catch (e) {
    log.error('Error disconnecting from database:', e);
  }
  
  return errorResponse;
} 

/**
 * Validate a cron job secret token
 */
export function validateCronSecret(token?: string): boolean {
  if (!process.env.CRON_SECRET) {
    // If no secret is configured, allow all requests
    return true;
  }
  
  return token === process.env.CRON_SECRET;
}

