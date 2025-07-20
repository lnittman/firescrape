import { OutdoorActivityType } from '@repo/database';

// Map suggestion categories to database activity types
export const categoryToActivityType: Record<string, OutdoorActivityType[]> = {
  hiking: [OutdoorActivityType.HIKING],
  running: [OutdoorActivityType.TRAIL_RUNNING],
  biking: [OutdoorActivityType.MOUNTAIN_BIKING],
  swimming: [OutdoorActivityType.SWIMMING],
  paddling: [OutdoorActivityType.KAYAKING, OutdoorActivityType.PADDLEBOARDING],
  fishing: [OutdoorActivityType.FISHING],
  camping: [
    OutdoorActivityType.TENT_CAMPING,
    OutdoorActivityType.RV_CAMPING,
    OutdoorActivityType.BACKCOUNTRY_CAMPING,
    OutdoorActivityType.GLAMPING,
  ],
  backpacking: [OutdoorActivityType.BACKPACKING],
  winter: [
    OutdoorActivityType.SKIING,
    OutdoorActivityType.SNOWBOARDING,
    OutdoorActivityType.SNOWSHOEING,
    OutdoorActivityType.BACKCOUNTRY_SKIING,
  ],
  climbing: [OutdoorActivityType.ROCK_CLIMBING, OutdoorActivityType.ICE_CLIMBING],
  wildlife: [OutdoorActivityType.WILDLIFE_VIEWING, OutdoorActivityType.BIRDWATCHING],
  photography: [OutdoorActivityType.PHOTOGRAPHY],
  nature: [OutdoorActivityType.WILDLIFE_VIEWING, OutdoorActivityType.FORAGING],
  family: [OutdoorActivityType.HIKING, OutdoorActivityType.TENT_CAMPING], // Family-friendly defaults
  solo: [OutdoorActivityType.HIKING, OutdoorActivityType.TRAIL_RUNNING], // Solo-friendly defaults
  weekend: [OutdoorActivityType.HIKING, OutdoorActivityType.TENT_CAMPING, OutdoorActivityType.BACKPACKING],
};

// Activity type display names
export const activityTypeDisplayNames: Record<OutdoorActivityType, string> = {
  [OutdoorActivityType.HIKING]: 'Hiking',
  [OutdoorActivityType.TRAIL_RUNNING]: 'Trail Running',
  [OutdoorActivityType.BACKPACKING]: 'Backpacking',
  // Cycling
  [OutdoorActivityType.MOUNTAIN_BIKING]: 'Mountain Biking',
  [OutdoorActivityType.ROAD_BIKING]: 'Road Biking',
  [OutdoorActivityType.GRAVEL_BIKING]: 'Gravel Biking',
  // Climbing
  [OutdoorActivityType.ROCK_CLIMBING]: 'Rock Climbing',
  [OutdoorActivityType.BOULDERING]: 'Bouldering',
  [OutdoorActivityType.ICE_CLIMBING]: 'Ice Climbing',
  [OutdoorActivityType.MOUNTAINEERING]: 'Mountaineering',
  [OutdoorActivityType.VIA_FERRATA]: 'Via Ferrata',
  // Water sports
  [OutdoorActivityType.KAYAKING]: 'Kayaking',
  [OutdoorActivityType.CANOEING]: 'Canoeing',
  [OutdoorActivityType.PADDLEBOARDING]: 'Paddleboarding',
  [OutdoorActivityType.SWIMMING]: 'Swimming',
  [OutdoorActivityType.FISHING]: 'Fishing',
  [OutdoorActivityType.RAFTING]: 'Rafting',
  [OutdoorActivityType.SURFING]: 'Surfing',
  [OutdoorActivityType.KITEBOARDING]: 'Kiteboarding',
  // Winter sports
  [OutdoorActivityType.SKIING]: 'Skiing',
  [OutdoorActivityType.SNOWBOARDING]: 'Snowboarding',
  [OutdoorActivityType.BACKCOUNTRY_SKIING]: 'Backcountry Skiing',
  [OutdoorActivityType.CROSS_COUNTRY_SKIING]: 'Cross-Country Skiing',
  [OutdoorActivityType.SNOWSHOEING]: 'Snowshoeing',
  [OutdoorActivityType.ICE_SKATING]: 'Ice Skating',
  // Camping
  [OutdoorActivityType.TENT_CAMPING]: 'Tent Camping',
  [OutdoorActivityType.RV_CAMPING]: 'RV Camping',
  [OutdoorActivityType.BACKCOUNTRY_CAMPING]: 'Backcountry Camping',
  [OutdoorActivityType.GLAMPING]: 'Glamping',
  // Nature activities
  [OutdoorActivityType.WILDLIFE_VIEWING]: 'Wildlife Viewing',
  [OutdoorActivityType.BIRDWATCHING]: 'Birdwatching',
  [OutdoorActivityType.PHOTOGRAPHY]: 'Photography',
  [OutdoorActivityType.STARGAZING]: 'Stargazing',
  [OutdoorActivityType.FORAGING]: 'Foraging',
  [OutdoorActivityType.NATURE_WALKING]: 'Nature Walking',
  // Adventure sports
  [OutdoorActivityType.PARAGLIDING]: 'Paragliding',
  [OutdoorActivityType.HANG_GLIDING]: 'Hang Gliding',
  [OutdoorActivityType.BASE_JUMPING]: 'Base Jumping',
  [OutdoorActivityType.CANYONING]: 'Canyoning',
  [OutdoorActivityType.CAVING]: 'Caving',
  // Other
  [OutdoorActivityType.OFF_ROADING]: 'Off-Roading',
  [OutdoorActivityType.HORSEBACK_RIDING]: 'Horseback Riding',
  [OutdoorActivityType.OUTDOOR_FITNESS]: 'Outdoor Fitness',
  [OutdoorActivityType.ADVENTURE_RACING]: 'Adventure Racing',
  [OutdoorActivityType.GEOCACHING]: 'Geocaching',
};

// Activity icons (emoji)
export const activityTypeIcons: Record<OutdoorActivityType, string> = {
  [OutdoorActivityType.HIKING]: '🥾',
  [OutdoorActivityType.TRAIL_RUNNING]: '🏃',
  [OutdoorActivityType.BACKPACKING]: '🎒',
  // Cycling
  [OutdoorActivityType.MOUNTAIN_BIKING]: '🚵',
  [OutdoorActivityType.ROAD_BIKING]: '🚴',
  [OutdoorActivityType.GRAVEL_BIKING]: '🚴',
  // Climbing
  [OutdoorActivityType.ROCK_CLIMBING]: '🧗',
  [OutdoorActivityType.BOULDERING]: '🪨',
  [OutdoorActivityType.ICE_CLIMBING]: '🧊',
  [OutdoorActivityType.MOUNTAINEERING]: '⛰️',
  [OutdoorActivityType.VIA_FERRATA]: '🧗',
  // Water sports
  [OutdoorActivityType.KAYAKING]: '🛶',
  [OutdoorActivityType.CANOEING]: '🛶',
  [OutdoorActivityType.PADDLEBOARDING]: '🏄',
  [OutdoorActivityType.SWIMMING]: '🏊',
  [OutdoorActivityType.FISHING]: '🎣',
  [OutdoorActivityType.RAFTING]: '🚣',
  [OutdoorActivityType.SURFING]: '🏄',
  [OutdoorActivityType.KITEBOARDING]: '🪁',
  // Winter sports
  [OutdoorActivityType.SKIING]: '⛷️',
  [OutdoorActivityType.SNOWBOARDING]: '🏂',
  [OutdoorActivityType.BACKCOUNTRY_SKIING]: '⛷️',
  [OutdoorActivityType.CROSS_COUNTRY_SKIING]: '🎿',
  [OutdoorActivityType.SNOWSHOEING]: '❄️',
  [OutdoorActivityType.ICE_SKATING]: '⛸️',
  // Camping
  [OutdoorActivityType.TENT_CAMPING]: '🏕️',
  [OutdoorActivityType.RV_CAMPING]: '🚐',
  [OutdoorActivityType.BACKCOUNTRY_CAMPING]: '⛺',
  [OutdoorActivityType.GLAMPING]: '🏕️',
  // Nature activities
  [OutdoorActivityType.WILDLIFE_VIEWING]: '🦌',
  [OutdoorActivityType.BIRDWATCHING]: '🦅',
  [OutdoorActivityType.PHOTOGRAPHY]: '📸',
  [OutdoorActivityType.STARGAZING]: '🌌',
  [OutdoorActivityType.FORAGING]: '🍄',
  [OutdoorActivityType.NATURE_WALKING]: '🚶',
  // Adventure sports
  [OutdoorActivityType.PARAGLIDING]: '🪂',
  [OutdoorActivityType.HANG_GLIDING]: '🪂',
  [OutdoorActivityType.BASE_JUMPING]: '🪂',
  [OutdoorActivityType.CANYONING]: '🏞️',
  [OutdoorActivityType.CAVING]: '🦇',
  // Other
  [OutdoorActivityType.OFF_ROADING]: '🚙',
  [OutdoorActivityType.HORSEBACK_RIDING]: '🐎',
  [OutdoorActivityType.OUTDOOR_FITNESS]: '💪',
  [OutdoorActivityType.ADVENTURE_RACING]: '🏃',
  [OutdoorActivityType.GEOCACHING]: '🗺️',
};

// Get activity types from suggestion IDs
export function getActivityTypesFromSuggestions(
  suggestionIds: string[],
  suggestions: Array<{ id: string; category?: string }>
): OutdoorActivityType[] {
  const activityTypes = new Set<OutdoorActivityType>();
  
  suggestionIds.forEach(id => {
    const suggestion = suggestions.find(s => s.id === id);
    if (suggestion?.category) {
      const types = categoryToActivityType[suggestion.category] || [];
      types.forEach(type => activityTypes.add(type));
    }
  });
  
  return Array.from(activityTypes);
}