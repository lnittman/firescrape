import 'server-only';

// Import singleton instance
import prisma from './prisma-client';

// Export db aliases for convenience
export const database = prisma;
export const db = prisma;

// Server-only exports - includes database instances
export * from './generated/client';
export { default as prisma } from './prisma-client';
