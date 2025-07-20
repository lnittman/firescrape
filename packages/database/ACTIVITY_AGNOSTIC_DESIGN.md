# Activity-Agnostic Database Design

## Overview

While our database models use the term "Trail" for historical reasons, **the Yuba database is designed to support 27+ outdoor activity types**, not just hiking trails. This document explains the activity-agnostic design philosophy.

## Key Concepts

### The "Trail" Model = Any Outdoor Activity Location

The `Trail` model represents:
- 🥾 **Hiking trails** and walking paths
- 🧗 **Climbing areas** and bouldering spots
- ⛷️ **Ski resorts** and backcountry zones
- 🏕️ **Campgrounds** and RV parks
- 🛶 **Water access points** for kayaking, fishing, swimming
- 🚵 **Mountain bike trails** and bike parks
- 📸 **Photography viewpoints** and wildlife viewing areas
- And 20+ other outdoor activity locations

### How It Works

1. **Polymorphic Design**: The `allowedActivities` field on each Trail specifies which activities are supported
2. **Flexible Metrics**: Fields like `distance` and `elevationGain` are interpreted based on activity type
3. **Universal Difficulty**: The difficulty rating applies across all activities (see mapping below)
4. **Feature Tags**: The `features` array uses activity-agnostic tags like "beginner_friendly", "guided_tours", etc.

## Field Interpretations by Activity Type

| Field | Hiking | Climbing | Skiing | Camping | Water Sports |
|-------|---------|----------|---------|----------|--------------|
| `distance` | Trail miles | Approach distance | Resort acres | Campground size | River miles |
| `elevationGain` | Vertical gain | Route height | Vertical drop | Elevation | Put-in to take-out drop |
| `estimatedTime` | Hiking time | Climb duration | Full day | N/A | Float time |
| `difficulty` | Trail class | YDS/French grade | Run difficulty | Accessibility | Rapids class |

## Supported Activity Types

The `OutdoorActivityType` enum includes 30+ activities:

### Trail & Land Activities
- HIKING, TRAIL_RUNNING, BACKPACKING
- MOUNTAIN_BIKING, ROAD_BIKING, GRAVEL_BIKING
- OFF_ROADING

### Climbing Activities
- ROCK_CLIMBING, BOULDERING
- ICE_CLIMBING, MOUNTAINEERING

### Camping Activities
- CAMPING, RV_CAMPING, WINTER_CAMPING

### Water Activities
- KAYAKING, CANOEING, PADDLEBOARDING
- SWIMMING, FISHING, RAFTING, SURFING

### Winter Activities
- SKIING, SNOWBOARDING, BACKCOUNTRY_SKIING
- SNOWSHOEING

### Nature & Wildlife
- WILDLIFE_VIEWING, PHOTOGRAPHY
- STARGAZING, BIRDWATCHING, FORAGING

### Multi-Sport
- ADVENTURE_RACING, OUTDOOR_FITNESS

## Difficulty Mapping

The `TrailDifficulty` enum maps across activities:

| Level | Hiking | Climbing | Skiing | Mountain Biking |
|-------|---------|----------|---------|-----------------|
| EASY | Class 1-2 | 5.0-5.6 | Green | Green |
| MODERATE | Class 2-3 | 5.7-5.9 | Blue | Blue |
| HARD | Class 3-4 | 5.10-5.11 | Black | Black |
| EXPERT | Class 4-5 | 5.12+ | Double Black | Double Black |

## Migration Path

For backward compatibility:
1. The model is still named "Trail" to avoid breaking changes
2. Legacy `TRAIL_*` activity types are preserved
3. New `LOCATION_*` activity types provide generic alternatives
4. Future versions may introduce a `Location` model as an alias

## Best Practices

1. **Use `allowedActivities`**: Always populate this array to indicate supported activities
2. **Activity-Agnostic Features**: Use generic feature tags that work across activities
3. **Flexible Metadata**: Store activity-specific data in JSON fields
4. **Universal Search**: Query by activity type to find relevant locations

## Example Usage

```typescript
// Find all rock climbing locations
const climbingSpots = await db.trail.findMany({
  where: {
    allowedActivities: {
      has: 'ROCK_CLIMBING'
    }
  }
});

// Find multi-activity locations
const versatileSpots = await db.trail.findMany({
  where: {
    allowedActivities: {
      hasEvery: ['HIKING', 'ROCK_CLIMBING', 'CAMPING']
    }
  }
});
```

## Future Considerations

- Introduce `ActivityLocation` as a view or alias for `Trail`
- Add activity-specific tables for specialized data (e.g., `ClimbingRoute`, `SkiRun`)
- Implement GraphQL for more flexible activity-based queries
- Consider separate location types for radically different venues