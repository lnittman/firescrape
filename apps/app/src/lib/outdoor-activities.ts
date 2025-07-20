export type OutdoorActivityType = 
  | "hiking"
  | "biking"
  | "camping"
  | "climbing"
  | "skiing"
  | "kayaking"
  | "fishing"
  | "backpacking"
  | "photography"
  | "wildlife"
  | "swimming"
  | "surfing";

export interface OutdoorActivity {
  id: OutdoorActivityType;
  name: string;
  icon: string;
  description: string;
}

export const OUTDOOR_ACTIVITIES: OutdoorActivity[] = [
  {
    id: "hiking",
    name: "Hiking",
    icon: "🥾",
    description: "Explore trails on foot"
  },
  {
    id: "biking",
    name: "Mountain Biking",
    icon: "🚵",
    description: "Ride trails and paths"
  },
  {
    id: "camping",
    name: "Camping",
    icon: "🏕️",
    description: "Sleep under the stars"
  },
  {
    id: "climbing",
    name: "Rock Climbing",
    icon: "🧗",
    description: "Scale rocks and walls"
  },
  {
    id: "skiing",
    name: "Skiing",
    icon: "⛷️",
    description: "Hit the slopes"
  },
  {
    id: "kayaking",
    name: "Kayaking",
    icon: "🛶",
    description: "Paddle on water"
  },
  {
    id: "fishing",
    name: "Fishing",
    icon: "🎣",
    description: "Cast a line"
  },
  {
    id: "backpacking",
    name: "Backpacking",
    icon: "🎒",
    description: "Multi-day adventures"
  },
  {
    id: "photography",
    name: "Photography",
    icon: "📸",
    description: "Capture nature"
  },
  {
    id: "wildlife",
    name: "Wildlife Viewing",
    icon: "🦌",
    description: "Observe animals"
  },
  {
    id: "swimming",
    name: "Swimming",
    icon: "🏊",
    description: "Take a dip"
  },
  {
    id: "surfing",
    name: "Surfing",
    icon: "🏄",
    description: "Ride the waves"
  }
];