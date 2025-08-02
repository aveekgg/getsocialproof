import { type User, type InsertUser, type Challenge, type InsertChallenge, type Submission, type InsertSubmission, type Reward, type InsertReward, type ChallengeStep, type ChallengePrompt } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getChallenge(id: string): Promise<Challenge | undefined>;
  getChallenges(): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  
  getSubmission(id: string): Promise<Submission | undefined>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  
  createReward(reward: InsertReward): Promise<Reward>;
  getRewardBySubmission(submissionId: string): Promise<Reward | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private challenges: Map<string, Challenge>;
  private submissions: Map<string, Submission>;
  private rewards: Map<string, Reward>;

  constructor() {
    this.users = new Map();
    this.challenges = new Map();
    this.submissions = new Map();
    this.rewards = new Map();
    
    // Initialize with default challenges
    this.initializeChallenges();
  }

  private initializeChallenges() {
    const today = new Date();
    const getUnlockDate = (dayOffset: number) => {
      const date = new Date(today);
      date.setDate(today.getDate() - dayOffset); // Make all challenges available now
      return date;
    };

    // "My Room, My Vibe" challenge prompts from changes.md
    const myRoomPrompts: ChallengePrompt[] = [
      { id: "favorite-corner", text: "Show your favorite corner in the room", emoji: "🏩", duration: 5 },
      { id: "study-setup", text: "What's your study setup like?", emoji: "🎧", duration: 5 },
      { id: "kitchen-tour", text: "Take us to your kitchen – what do you cook most?", emoji: "🍜", duration: 6 },
      { id: "window-view", text: "What's your view like from the window?", emoji: "🌇", duration: 4 },
      { id: "love-most", text: "Say one thing you love most about living here", emoji: "❤️", duration: 4 },
      { id: "fridge-tour", text: "What's in your fridge?", emoji: "🧃", duration: 4 },
      { id: "roommate-shoutout", text: "A roommate shoutout", emoji: "👋", duration: 5 },
      { id: "chill-zone", text: "Your chill-out zone", emoji: "🧘", duration: 5 }
    ];

    // "A Day in the Life" challenge prompts
    const dayInLifePrompts: ChallengePrompt[] = [
      { id: "morning-routine", text: "Your morning routine", emoji: "🚱", duration: 5 },
      { id: "uni-commute", text: "Uni walk or commute", emoji: "🏃‍♂️", duration: 6 },
      { id: "lunch-time", text: "What's for lunch?", emoji: "🍱", duration: 4 },
      { id: "post-class-hangout", text: "Where do you hang out post-classes?", emoji: "🧳", duration: 5 },
      { id: "study-grind", text: "Study grind moment", emoji: "💻", duration: 5 },
      { id: "evening-chill", text: "Chill time in the evening", emoji: "🌯", duration: 5 },
      { id: "unexpected-moment", text: "Something unexpected today!", emoji: "🎉", duration: 4 },
      { id: "night-view", text: "Night-time view", emoji: "🌙", duration: 4 }
    ];

    // "Flatmates Say..." challenge prompts
    const flatmatesPrompts: ChallengePrompt[] = [
      { id: "introductions", text: "Everyone introduce themselves", emoji: "👋", duration: 6 },
      { id: "one-word", text: "One word to describe this flat", emoji: "🤭", duration: 3 },
      { id: "messy-one", text: "Who's the messy one?", emoji: "🦜", duration: 4 },
      { id: "best-moment", text: "What's the best shared moment?", emoji: "📸", duration: 5 },
      { id: "kitchen-tour", text: "Group tour of kitchen/dining", emoji: "🥣", duration: 6 },
      { id: "recommend", text: "Would you recommend this place?", emoji: "💯", duration: 4 }
    ];

    // "Neighborhood Hacks" challenge prompts
    const neighborhoodPrompts: ChallengePrompt[] = [
      { id: "cheapest-grocery", text: "Cheapest grocery?", emoji: "🛒", duration: 4 },
      { id: "favorite-hangout", text: "Favorite nearby hangout?", emoji: "🎮", duration: 5 },
      { id: "coffee-spot", text: "Coffee or breakfast spot?", emoji: "☕", duration: 4 },
      { id: "study-spot", text: "Study spot outside your room?", emoji: "📚", duration: 5 },
      { id: "hidden-gems", text: "Hidden gems?", emoji: "🗺️", duration: 5 },
      { id: "safe-route", text: "Safest route back home?", emoji: "🚶", duration: 5 },
      { id: "wish-knew", text: "One thing you wish you knew earlier", emoji: "🎯", duration: 4 }
    ];

    // "What I Wish I Knew" challenge prompts
    const wishIKnewPrompts: ChallengePrompt[] = [
      { id: "surprised-most", text: "What surprised you the most here?", emoji: "😮", duration: 5 },
      { id: "hard-to-adjust", text: "What was hard to get used to?", emoji: "😵", duration: 5 },
      { id: "weird-rule", text: "A weird rule or policy here", emoji: "🗒️", duration: 4 },
      { id: "useful-thing", text: "Most useful thing you packed", emoji: "🎒", duration: 4 },
      { id: "useless-thing", text: "Most useless thing you brought", emoji: "🛫", duration: 4 },
      { id: "big-tip", text: "One big tip for a new resident", emoji: "🔑", duration: 5 }
    ];

    const challenges = [
      {
        id: "my-room-my-vibe",
        name: "My Room, My Vibe",
        tagline: "Show what makes your space feel like home",
        description: "Help the next student imagine living here — we'll guide you with quick clips.",
        steps: [], // Legacy field, keeping for compatibility
        promptPool: myRoomPrompts,
        pointsPerStep: 25,
        dayNumber: 1,
        durationDays: 5,
        maxPrompts: 5,
        unlockDate: getUnlockDate(0),
        createdAt: new Date()
      },
      {
        id: "a-day-in-the-life",
        name: "A Day in the Life",
        tagline: "What's your student life really like?",
        description: "Show us what a real day looks like as a UK student!",
        steps: [], // Legacy field
        promptPool: dayInLifePrompts,
        pointsPerStep: 25,
        dayNumber: 2,
        durationDays: 5,
        maxPrompts: 5,
        unlockDate: getUnlockDate(1),
        createdAt: new Date()
      },
      {
        id: "flatmates-say",
        name: "Flatmates Say...",
        tagline: "What do your flatmates love (or roast) about living here?",
        description: "Get your flatmates involved and show the real dynamics!",
        steps: [], // Legacy field
        promptPool: flatmatesPrompts,
        pointsPerStep: 30,
        dayNumber: 3,
        durationDays: 5,
        maxPrompts: 5,
        unlockDate: getUnlockDate(2),
        createdAt: new Date()
      },
      {
        id: "neighborhood-hacks",
        name: "Neighborhood Hacks",
        tagline: "Tips for surviving (and thriving) in your student city",
        description: "Share your local knowledge and help others navigate!",
        steps: [], // Legacy field
        promptPool: neighborhoodPrompts,
        pointsPerStep: 35,
        dayNumber: 4,
        durationDays: 5,
        maxPrompts: 5,
        unlockDate: getUnlockDate(3),
        createdAt: new Date()
      },
      {
        id: "what-i-wish-i-knew",
        name: "What I Wish I Knew",
        tagline: "Reflect, rant, or review — it all helps someone else",
        description: "Share your wisdom and help future students!",
        steps: [], // Legacy field
        promptPool: wishIKnewPrompts,
        pointsPerStep: 40,
        dayNumber: 5,
        durationDays: 5,
        maxPrompts: 5,
        unlockDate: getUnlockDate(4),
        createdAt: new Date()
      }
    ];

    challenges.forEach(challenge => {
      this.challenges.set(challenge.id, challenge as Challenge);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getChallenge(id: string): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async getChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values());
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const id = randomUUID();
    const challenge: Challenge = { 
      ...insertChallenge, 
      id, 
      createdAt: new Date() 
    } as Challenge;
    this.challenges.set(id, challenge);
    return challenge;
  }

  async getSubmission(id: string): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = randomUUID();
    const submission: Submission = { 
      ...insertSubmission, 
      id, 
      completedAt: new Date() 
    } as Submission;
    this.submissions.set(id, submission);
    return submission;
  }

  async createReward(insertReward: InsertReward): Promise<Reward> {
    const id = randomUUID();
    const reward: Reward = { 
      ...insertReward, 
      id, 
      createdAt: new Date() 
    } as Reward;
    this.rewards.set(id, reward);
    return reward;
  }

  async getRewardBySubmission(submissionId: string): Promise<Reward | undefined> {
    return Array.from(this.rewards.values()).find(
      (reward) => reward.submissionId === submissionId,
    );
  }
}

export const storage = new MemStorage();
