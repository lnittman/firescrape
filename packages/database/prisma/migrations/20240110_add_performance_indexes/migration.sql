-- AddPerformanceIndexes

-- Create compound index for user's webs sorted by creation date (most common query pattern)
CREATE INDEX "Web_userId_createdAt_idx" ON "Web"("userId", "createdAt" DESC);

-- Create compound index for space's webs
CREATE INDEX "Web_spaceId_createdAt_idx" ON "Web"("spaceId", "createdAt" DESC);

-- Create compound index for user's spaces
CREATE INDEX "Space_userId_createdAt_idx" ON "Space"("userId", "createdAt");

-- Create compound index for analytics queries
CREATE INDEX "AnalyticsEvent_userId_eventType_timestamp_idx" ON "AnalyticsEvent"("userId", "eventType", "timestamp");

-- Create compound index for space metrics queries
CREATE INDEX "SpaceMetrics_spaceId_date_idx" ON "SpaceMetrics"("spaceId", "date" DESC);

-- Create index for web status queries
CREATE INDEX "Web_status_createdAt_idx" ON "Web"("status", "createdAt" DESC);

-- Create index for threads by web
CREATE INDEX "Thread_webId_createdAt_idx" ON "Thread"("webId", "createdAt" DESC);

-- Create index for messages by thread
CREATE INDEX "Message_threadId_createdAt_idx" ON "Message"("threadId", "createdAt" DESC);