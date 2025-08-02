import { Challenge } from "@shared/schema";

export const defaultChallenges: Challenge[] = [
  {
    id: "room-tour",
    name: "🛏️ Room Tour in 5 Prompts",
    description: "Show us around your cozy corner of the world.",
    steps: [
      { id: 1, title: "Show us your cozy bed!", description: "Pan around your sleeping space and show us where the magic happens", emoji: "🛏️", duration: 5 },
      { id: 2, title: "Pan to your study corner", description: "Show your desk setup and study vibes", emoji: "📚", duration: 5 },
      { id: 3, title: "Open your fridge! What's inside?", description: "Quick peek at your food situation", emoji: "🧃", duration: 6 },
      { id: 4, title: "Your bathroom essentials", description: "Quick tour of your bathroom setup", emoji: "🚿", duration: 4 },
      { id: 5, title: "Your favorite chill spot", description: "Show us where you love to hang out and relax", emoji: "🌟", duration: 5 }
    ],
    pointsPerStep: 10,
    createdAt: new Date()
  },
  {
    id: "day-in-life",
    name: "🌇 Day in the Life",
    description: "Capture your daily vibes, from morning coffee to lights out.",
    steps: [
      { id: 1, title: "Morning coffee ritual", description: "Show us how you start your day", emoji: "☕", duration: 6 },
      { id: 2, title: "Study grind mode", description: "Capture yourself studying or in class", emoji: "📖", duration: 5 },
      { id: 3, title: "What's for lunch?", description: "Show us what and where you eat", emoji: "🍽️", duration: 5 },
      { id: 4, title: "Friend time!", description: "Hanging out with friends or activities", emoji: "👥", duration: 6 },
      { id: 5, title: "Lights out vibes", description: "How you wind down and end your day", emoji: "🌙", duration: 5 }
    ],
    pointsPerStep: 10,
    createdAt: new Date()
  },
  {
    id: "first-week",
    name: "📦 First Week Feels",
    description: "What's it like settling in? Let's see it raw and real.",
    steps: [
      { id: 1, title: "Unpacking chaos", description: "Show us your moving-in situation", emoji: "📦", duration: 6 },
      { id: 2, title: "First grocery run", description: "What did you buy for your new place?", emoji: "🛒", duration: 5 },
      { id: 3, title: "Meeting your flatmates", description: "Introduce us to your new housemates", emoji: "👋", duration: 5 },
      { id: 4, title: "Exploring the area", description: "Show us what's around your new place", emoji: "🗺️", duration: 6 },
      { id: 5, title: "First week reflection", description: "How are you feeling about the move?", emoji: "💭", duration: 5 }
    ],
    pointsPerStep: 10,
    createdAt: new Date()
  }
];

export const rewardOptions = [
  { type: "gift-card", value: "Starbucks voucher ☕", emoji: "☕" },
  { type: "discount", value: "Gym discount 💪", emoji: "💪" },
  { type: "badge", value: "Feature Me on IG Badge 🌟", emoji: "🌟" },
  { type: "subscription", value: "Netflix for a month 🍿", emoji: "🍿" },
  { type: "voucher", value: "Food delivery credit 🍕", emoji: "🍕" },
  { type: "cash", value: "PayPal cash 💰", emoji: "💰" },
  { type: "bundle", value: "Student essentials bundle 📚", emoji: "📚" },
  { type: "mystery", value: "Mystery surprise box 🎁", emoji: "🎁" }
];
