# Database Migration Strategy: Trail → ActivityLocation

## Overview

This document outlines the migration from the trail-centric database schema to the activity-agnostic schema that properly supports Yuba's 27+ outdoor activities.

## Key Changes

### Model Renames
- `Trail` → `ActivityLocation`
- `SavedTrail` → `SavedLocation`
- `trailId` → `locationId` (in all references)
- `TrailDifficulty` → `LocationDifficulty`

### New Models & Fields
- Added `LocationType` enum to categorize locations
- Changed `allowedActivities` to `supportedActivities` 
- Renamed metrics to be activity-agnostic:
  - `distance` → `primaryMetric`
  - `elevationGain` → `secondaryMetric`
  - `estimatedTime` → `typicalDuration`
- Added `locationType` field to ActivityLocation

### Enhanced Enums
- Expanded `OutdoorActivityType` from 27 to 40+ activities
- Added more granular difficulty levels in `LocationDifficulty`
- Updated `ActivityType` to use `LOCATION_*` instead of `TRAIL_*`
- Changed `TRAIL_DATA` to `LOCATION_DATA` in FeedbackTopic

### Multi-Activity Support
- Changed Adventure from single `activityType` to array `activityTypes[]`
- Added more specific interest tracking in UserInterest

## Migration Steps

### Phase 1: Database Schema Update

```sql
-- 1. Rename tables
ALTER TABLE "Trail" RENAME TO "ActivityLocation";
ALTER TABLE "SavedTrail" RENAME TO "SavedLocation";

-- 2. Rename columns
ALTER TABLE "ActivityLocation" 
  RENAME COLUMN "distance" TO "primaryMetric";
ALTER TABLE "ActivityLocation" 
  RENAME COLUMN "elevationGain" TO "secondaryMetric";
ALTER TABLE "ActivityLocation" 
  RENAME COLUMN "estimatedTime" TO "typicalDuration";
ALTER TABLE "ActivityLocation" 
  RENAME COLUMN "allowedActivities" TO "supportedActivities";

-- 3. Add new columns
ALTER TABLE "ActivityLocation" 
  ADD COLUMN "locationType" "LocationType" NOT NULL DEFAULT 'TRAIL';

-- 4. Update foreign keys
ALTER TABLE "SavedLocation" 
  RENAME COLUMN "trailId" TO "locationId";
ALTER TABLE "Activity" 
  RENAME COLUMN "trailId" TO "locationId";
ALTER TABLE "AnalyticsEvent" 
  RENAME COLUMN "trailId" TO "locationId";

-- 5. Update enum values (requires custom migration)
-- This will need to be done programmatically
```

### Phase 2: Data Migration

```typescript
// Migrate existing trail difficulty to new location difficulty
const difficultyMap = {
  'EASY': 'EASY',
  'MODERATE': 'MODERATE',
  'HARD': 'CHALLENGING',
  'EXPERT': 'DIFFICULT'
};

// Set appropriate location types based on supported activities
async function setLocationTypes() {
  const locations = await db.activityLocation.findMany();
  
  for (const location of locations) {
    let locationType = 'TRAIL'; // default
    
    if (location.supportedActivities.includes('ROCK_CLIMBING')) {
      locationType = 'CLIMBING_AREA';
    } else if (location.supportedActivities.some(a => 
      ['KAYAKING', 'SWIMMING', 'FISHING'].includes(a))) {
      locationType = 'WATER_ACCESS';
    } else if (location.supportedActivities.includes('CAMPING')) {
      locationType = 'CAMPGROUND';
    }
    // ... etc
    
    await db.activityLocation.update({
      where: { id: location.id },
      data: { locationType }
    });
  }
}
```

### Phase 3: Code Updates

1. **Update imports**: Search and replace all references
   ```typescript
   // Old
   import { Trail, SavedTrail } from '@repo/database';
   
   // New
   import { ActivityLocation, SavedLocation } from '@repo/database';
   ```

2. **Update service methods**: Rename trail-specific methods
   ```typescript
   // Old
   findTrails() → findLocations()
   saveTrail() → saveLocation()
   getTrailById() → getLocationById()
   ```

3. **Update API endpoints**: While keeping backward compatibility
   ```typescript
   // Support both old and new
   router.get('/trails', redirectTo('/locations'));
   router.get('/locations', locationController.search);
   ```

## Backward Compatibility

To maintain compatibility during transition:

1. **Database Views**: Create views with old names
   ```sql
   CREATE VIEW "Trail" AS SELECT * FROM "ActivityLocation";
   CREATE VIEW "SavedTrail" AS SELECT * FROM "SavedLocation";
   ```

2. **Type Aliases**: In TypeScript
   ```typescript
   // In database package
   export type Trail = ActivityLocation;
   export type SavedTrail = SavedLocation;
   ```

3. **API Compatibility Layer**: Support both old and new endpoints
   ```typescript
   // Map old endpoints to new ones
   app.use('/api/trails/*', (req, res, next) => {
     req.url = req.url.replace('/trails', '/locations');
     next();
   });
   ```

## Rollback Plan

If issues arise:

1. Keep backup of original schema
2. Database views can be converted back to tables
3. Code changes can be reverted via git
4. API compatibility layer ensures no client breakage

## Timeline

- **Week 1**: Update schema and create migrations
- **Week 2**: Update backend services and APIs
- **Week 3**: Test thoroughly with existing client
- **Week 4**: Deploy with monitoring

## Validation

After migration, verify:

- [ ] All existing data is preserved
- [ ] Client app continues to function
- [ ] New activity types can be added
- [ ] Search works across all location types
- [ ] Performance is not degraded

## Notes

- The schema is now truly activity-agnostic
- Supports 40+ outdoor activities with room for more
- Better reflects Yuba's vision as a comprehensive outdoor companion
- Sets foundation for future features like activity-specific data models