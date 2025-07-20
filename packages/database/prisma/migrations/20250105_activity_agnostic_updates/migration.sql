-- Activity-Agnostic Database Updates
-- This migration adds comments and new activity types to reflect Yuba's support for 27+ outdoor activities
-- No structural changes are made to maintain backward compatibility

-- Add comments to clarify that Trail model represents any outdoor activity location
COMMENT ON TABLE "Trail" IS 'Outdoor activity locations including trails, climbing areas, ski resorts, campgrounds, lakes, etc. Supports 27+ activity types.';
COMMENT ON COLUMN "Trail"."name" IS 'Name of the outdoor location (trail name, crag name, resort name, lake name, etc.)';
COMMENT ON COLUMN "Trail"."distance" IS 'Distance/size metric - miles for trails, acres for campgrounds, vertical feet for ski resorts';
COMMENT ON COLUMN "Trail"."elevationGain" IS 'Elevation metric - gain for trails, vertical drop for ski resorts, depth for lakes';
COMMENT ON COLUMN "Trail"."difficulty" IS 'Universal difficulty rating applicable to all activity types';
COMMENT ON COLUMN "Trail"."allowedActivities" IS 'Array of all activity types supported at this location';

-- Add comments to SavedTrail
COMMENT ON TABLE "SavedTrail" IS 'User saved outdoor locations - any activity location, not just hiking trails';

-- Note: The following activity types were added to OutdoorActivityType enum:
-- ROAD_BIKING, GRAVEL_BIKING, OFF_ROADING, BOULDERING, MOUNTAINEERING,
-- RV_CAMPING, CANOEING, SURFING, BACKCOUNTRY_SKIING

-- Note: New generic location activity types added to ActivityType enum:
-- LOCATION_VIEWED, LOCATION_SAVED, LOCATION_UNSAVED, LOCATION_COMPLETED
-- These can be used instead of TRAIL_* variants for new features