import 'server-only';

import { PrismaClient } from './generated/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Create Prisma client with simplified configuration - no adapter
export const database = globalForPrisma.prisma || new PrismaClient({ 
  log: process.env.NODE_ENV === 'development' 
    ? ['error', 'warn'] 
    : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = database;
}

// Export db alias for convenience
export const db = database;

// Server-only exports - includes database instances
export * from './generated/client';
