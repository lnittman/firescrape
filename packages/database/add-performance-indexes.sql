-- Performance indexes for common query patterns
-- Run this SQL directly on your database to improve performance

-- Compound index for user's webs ordered by creation date
CREATE INDEX IF NOT EXISTS "Web_userId_createdAt_idx" ON "Web"("userId", "createdAt" DESC);

-- Compound index for space's webs ordered by creation date  
CREATE INDEX IF NOT EXISTS "Web_spaceId_createdAt_idx" ON "Web"("spaceId", "createdAt" DESC) WHERE "spaceId" IS NOT NULL;

-- Compound index for space's user and creation date
CREATE INDEX IF NOT EXISTS "Space_userId_createdAt_idx" ON "Space"("userId", "createdAt" ASC);

-- Index for web analytics aggregations (if WebMetrics table exists)
-- CREATE INDEX IF NOT EXISTS "WebMetrics_webId_createdAt_idx" ON "WebMetrics"("webId", "createdAt" DESC);

-- Index for thread messages
CREATE INDEX IF NOT EXISTS "Message_threadId_createdAt_idx" ON "Message"("threadId", "createdAt" ASC);

-- Index for web entities lookup
CREATE INDEX IF NOT EXISTS "WebEntity_webId_type_idx" ON "WebEntity"("webId", "type");

-- Analyze tables to update statistics
ANALYZE "Web";
ANALYZE "Space";
ANALYZE "Thread";
ANALYZE "Message";
ANALYZE "WebEntity";