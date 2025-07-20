-- Performance indexes for common query patterns

-- Compound index for user's webs ordered by creation date
CREATE INDEX "Web_userId_createdAt_idx" ON "Web"("userId", "createdAt" DESC);

-- Compound index for space's webs ordered by creation date
CREATE INDEX "Web_spaceId_createdAt_idx" ON "Web"("spaceId", "createdAt" DESC) WHERE "spaceId" IS NOT NULL;

-- Compound index for space's user and default status
CREATE INDEX "Space_userId_createdAt_idx" ON "Space"("userId", "createdAt" ASC);

-- Index for web analytics aggregations
CREATE INDEX "WebMetrics_webId_createdAt_idx" ON "WebMetrics"("webId", "createdAt" DESC);

-- Index for thread messages
CREATE INDEX "Message_threadId_createdAt_idx" ON "Message"("threadId", "createdAt" ASC);

-- Index for web entities lookup
CREATE INDEX "WebEntity_webId_type_idx" ON "WebEntity"("webId", "type");