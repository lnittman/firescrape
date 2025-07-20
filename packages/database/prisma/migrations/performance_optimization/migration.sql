-- Performance optimization indexes

-- Web model composite indexes for common queries
CREATE INDEX IF NOT EXISTS "Web_userId_createdAt_desc_idx" ON "Web"("userId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Web_spaceId_createdAt_desc_idx" ON "Web"("spaceId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Web_userId_spaceId_status_idx" ON "Web"("userId", "spaceId", "status");
CREATE INDEX IF NOT EXISTS "Web_userId_status_createdAt_idx" ON "Web"("userId", "status", "createdAt" DESC);

-- Message model indexes for chat performance
CREATE INDEX IF NOT EXISTS "Message_threadId_createdAt_idx" ON "Message"("threadId", "createdAt");

-- AnalyticsEvent composite indexes
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_userId_eventType_timestamp_idx" ON "AnalyticsEvent"("userId", "eventType", "timestamp" DESC);
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_spaceId_eventType_timestamp_idx" ON "AnalyticsEvent"("spaceId", "eventType", "timestamp" DESC);
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_timestamp_desc_idx" ON "AnalyticsEvent"("timestamp" DESC);

-- Thread model index
CREATE INDEX IF NOT EXISTS "Thread_webId_createdAt_idx" ON "Thread"("webId", "createdAt" DESC);

-- Profile model index for username lookups
CREATE INDEX IF NOT EXISTS "Profile_username_idx" ON "Profile"("username") WHERE "username" IS NOT NULL;

-- Partial indexes for better performance
CREATE INDEX IF NOT EXISTS "Web_userId_pending_idx" ON "Web"("userId") WHERE "status" = 'PENDING';
CREATE INDEX IF NOT EXISTS "Web_userId_processing_idx" ON "Web"("userId") WHERE "status" = 'PROCESSING';
CREATE INDEX IF NOT EXISTS "Feedback_status_open_idx" ON "Feedback"("status", "createdAt" DESC) WHERE "status" = 'OPEN';

-- Add GIN index for array fields if using PostgreSQL features
-- CREATE INDEX IF NOT EXISTS "Web_urls_gin_idx" ON "Web" USING GIN ("urls");
-- CREATE INDEX IF NOT EXISTS "Web_topics_gin_idx" ON "Web" USING GIN ("topics");