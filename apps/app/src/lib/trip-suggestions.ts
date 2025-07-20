export type TripSuggestion = {
  id: string;
  title: string;
  emoji: string;
  category?: string;
  activityType?: string;
};

// Trip-themed suggestions for Yuba
export const TRIP_SUGGESTIONS: TripSuggestion[] = [
  // Trail activities
  { id: "1", title: "Find a beginner-friendly hike", emoji: "🥾", category: "hiking", activityType: "HIKING" },
  { id: "2", title: "Challenging trail run routes", emoji: "🏃", category: "running", activityType: "TRAIL_RUNNING" },
  { id: "3", title: "Mountain biking single tracks", emoji: "🚵", category: "biking", activityType: "MOUNTAIN_BIKING" },
  { id: "4", title: "Scenic viewpoint hikes", emoji: "🏔️", category: "hiking", activityType: "HIKING" },
  
  // Water activities
  { id: "5", title: "Lakes with swimming spots", emoji: "🏊", category: "swimming", activityType: "SWIMMING" },
  { id: "6", title: "Kayaking and paddling routes", emoji: "🛶", category: "paddling", activityType: "KAYAKING" },
  { id: "7", title: "Waterfall hikes", emoji: "💦", category: "hiking", activityType: "HIKING" },
  { id: "8", title: "River fishing spots", emoji: "🎣", category: "fishing", activityType: "FISHING" },
  
  // Camping & backpacking
  { id: "9", title: "Dispersed camping areas", emoji: "🏕️", category: "camping", activityType: "CAMPING" },
  { id: "10", title: "Backpacking loops", emoji: "🎒", category: "backpacking", activityType: "BACKPACKING" },
  { id: "11", title: "Car camping with amenities", emoji: "⛺", category: "camping", activityType: "CAMPING" },
  { id: "12", title: "Dark sky stargazing spots", emoji: "🌌", category: "camping", activityType: "STARGAZING" },
  
  // Winter activities
  { id: "13", title: "Snowshoe trails", emoji: "❄️", category: "winter" },
  { id: "14", title: "Cross-country ski routes", emoji: "⛷️", category: "winter" },
  { id: "15", title: "Winter camping spots", emoji: "🏔️", category: "winter" },
  { id: "16", title: "Ice climbing locations", emoji: "🧗", category: "climbing" },
  
  // Rock climbing
  { id: "17", title: "Beginner climbing crags", emoji: "🪨", category: "climbing", activityType: "ROCK_CLIMBING" },
  { id: "18", title: "Bouldering areas", emoji: "🧗", category: "climbing", activityType: "ROCK_CLIMBING" },
  { id: "19", title: "Multi-pitch climbing routes", emoji: "⛰️", category: "climbing", activityType: "ROCK_CLIMBING" },
  
  // Wildlife & nature
  { id: "20", title: "Wildlife viewing trails", emoji: "🦌", category: "wildlife" },
  { id: "21", title: "Bird watching hotspots", emoji: "🦅", category: "wildlife" },
  { id: "22", title: "Photography locations", emoji: "📸", category: "photography" },
  { id: "23", title: "Wildflower hikes", emoji: "🌻", category: "nature" },
  
  // Trip planning
  { id: "24", title: "Sunrise hike spots", emoji: "🌅", category: "hiking" },
  { id: "25", title: "Dog-friendly trails", emoji: "🐕", category: "hiking" },
  { id: "26", title: "Family trip spots", emoji: "👨‍👩‍👧‍👦", category: "family" },
  { id: "27", title: "Solo trip ideas", emoji: "🚶", category: "solo" },
  { id: "28", title: "Weekend warrior trips", emoji: "🏃‍♂️", category: "weekend" },
];

// Get a random subset of suggestions for display
export function getRandomSuggestions(count: number = 12): TripSuggestion[] {
  const shuffled = [...TRIP_SUGGESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Get a deterministic subset of suggestions based on a seed (for SSR)
export function getSeededSuggestions(count: number = 12, seed: number = 0): TripSuggestion[] {
  // Use a simple deterministic shuffle based on the seed
  const shuffled = [...TRIP_SUGGESTIONS].sort((a, b) => {
    const hashA = simpleHash(a.id + seed);
    const hashB = simpleHash(b.id + seed);
    return hashA - hashB;
  });
  return shuffled.slice(0, count);
}

// Simple hash function for deterministic shuffling
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}