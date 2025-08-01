import { Challenge } from "@shared/schema";

export const defaultChallenges: Challenge[] = [
  {
    id: "room-tour",
    name: "Show Your Room in 5 Clips",
    description: "Create awesome videos about your student housing experience and win amazing rewards!",
    steps: [
      { id: 1, title: "Show us your bed area", description: "Pan around your sleeping space", emoji: "🛏️", duration: 5 },
      { id: 2, title: "Your study/work space", description: "Show your desk setup", emoji: "📚", duration: 5 },
      { id: 3, title: "Kitchen/food area", description: "Open the fridge, show cooking space", emoji: "🍕", duration: 6 },
      { id: 4, title: "Bathroom facilities", description: "Quick tour of your bathroom", emoji: "🚿", duration: 4 },
      { id: 5, title: "Your favorite spot", description: "Show us where you love to hang out", emoji: "🌟", duration: 5 }
    ],
    pointsPerStep: 25,
    createdAt: new Date()
  },
  {
    id: "day-in-life",
    name: "Day in Life Challenge",
    description: "Document a typical day in your student life with 5 engaging clips!",
    steps: [
      { id: 1, title: "Morning routine", description: "Show us how you start your day", emoji: "🌅", duration: 6 },
      { id: 2, title: "Study session", description: "Capture yourself studying or in class", emoji: "📖", duration: 5 },
      { id: 3, title: "Meal time", description: "Show us what and where you eat", emoji: "🍽️", duration: 5 },
      { id: 4, title: "Social time", description: "Hanging out with friends or activities", emoji: "👥", duration: 6 },
      { id: 5, title: "Evening wind-down", description: "How you relax and end your day", emoji: "🌙", duration: 5 }
    ],
    pointsPerStep: 25,
    createdAt: new Date()
  }
];

export const rewardOptions = [
  { type: "gift-card", value: "$5 Starbucks Gift Card" },
  { type: "subscription", value: "Spotify Premium Month" },
  { type: "voucher", value: "$10 Pizza Voucher" },
  { type: "subscription", value: "Netflix Month Free" },
  { type: "credit", value: "$15 Amazon Credit" },
  { type: "bundle", value: "Study Guide Bundle" },
  { type: "cash", value: "$20 Cash Prize" },
  { type: "mystery", value: "Mystery Box" }
];
