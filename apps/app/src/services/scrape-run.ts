import { db } from '@repo/database';

// Type for the client components
type ClientScrape = {
  id: string;
  url: string;
  status: string;
  formats: string[];
  createdAt: Date;
  completedAt: Date | null;
  duration: number | null;
  error: string | null;
  metadata: any;
  markdown: string | null;
};

/**
 * Scrape run service for server actions in the app
 * Accepts clerkId and looks up internal user
 */
export const scrapeService = {
  async getUserRuns(clerkId: string): Promise<ClientScrape[]> {
    try {
      // First find the profile by clerkId
      const profile = await db.profile.findUnique({
        where: { clerkId },
      });
      
      if (!profile) {
        console.error('Profile not found for clerkId:', clerkId);
        return [];
      }

      const runs = await db.scrape.findMany({
        where: { userId: profile.id },
        orderBy: { createdAt: 'desc' },
        take: 50, // Limit for performance
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
        }
      });
      return runs as ClientScrape[];
    } catch (error) {
      console.error('Failed to fetch user runs:', error);
      return [];
    }
  },

  async getRunById(id: string, clerkId: string) {
    try {
      // First find the profile by clerkId
      const profile = await db.profile.findUnique({
        where: { clerkId },
      });
      
      if (!profile) {
        console.error('Profile not found for clerkId:', clerkId);
        return null;
      }

      const run = await db.scrape.findFirst({
        where: { id, userId: profile.id },
      });
      return run;
    } catch (error) {
      console.error('Failed to fetch run by id:', error);
      return null;
    }
  },

  async deleteRun(id: string, clerkId: string): Promise<boolean> {
    try {
      // First find the profile by clerkId
      const profile = await db.profile.findUnique({
        where: { clerkId },
      });
      
      if (!profile) {
        console.error('Profile not found for clerkId:', clerkId);
        return false;
      }

      const result = await db.scrape.deleteMany({
        where: { id, userId: profile.id },
      });
      return result.count > 0;
    } catch (error) {
      console.error('Failed to delete run:', error);
      return false;
    }
  },
};