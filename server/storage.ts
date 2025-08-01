import { type User, type InsertUser, type Challenge, type InsertChallenge, type Submission, type InsertSubmission, type Reward, type InsertReward, type ChallengeStep } from "@shared/schema";
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
    const roomTourSteps: ChallengeStep[] = [
      { id: 1, title: "Your bedroom vibe", description: "Give us the full tour of where you sleep and chill", emoji: "🛏️", duration: 6 },
      { id: 2, title: "Study setup reveal", description: "Show off your workspace - messy or clean, we love it all", emoji: "💻", duration: 5 },
      { id: 3, title: "Kitchen chaos", description: "What's in your fridge? Cooking space? The real uni life", emoji: "🍜", duration: 6 },
      { id: 4, title: "The essentials", description: "Quick bathroom tour - keeping it real", emoji: "🚿", duration: 4 },
      { id: 5, title: "Your happy place", description: "That one spot where you actually feel at home", emoji: "✨", duration: 5 }
    ];

    const dayInLifeSteps: ChallengeStep[] = [
      { id: 1, title: "Morning reality check", description: "How do you actually start your day? Coffee first?", emoji: "☕", duration: 6 },
      { id: 2, title: "Uni grind", description: "Lecture halls, library sessions, or cramming at home", emoji: "📚", duration: 5 },
      { id: 3, title: "Food situation", description: "Meal deal? Cooking? Takeaway? Show us the real deal", emoji: "🥪", duration: 5 },
      { id: 4, title: "Social moments", description: "Hanging with mates, society events, or just good vibes", emoji: "👯", duration: 6 },
      { id: 5, title: "Night mode", description: "How you unwind - Netflix, gaming, or early bedtime?", emoji: "🌙", duration: 5 }
    ];

    const roomTourChallenge: Challenge = {
      id: "room-tour",
      name: "Room Tour Challenge",
      description: "Give us the honest tour of your uni accommodation and win some proper rewards!",
      steps: roomTourSteps,
      pointsPerStep: 25,
      createdAt: new Date()
    };

    const dayInLifeChallenge: Challenge = {
      id: "day-in-life",
      name: "A Day in My Uni Life",
      description: "Show us what a real day looks like as a UK student - the good, bad, and caffeinated!",
      steps: dayInLifeSteps,
      pointsPerStep: 25,
      createdAt: new Date()
    };

    this.challenges.set(roomTourChallenge.id, roomTourChallenge);
    this.challenges.set(dayInLifeChallenge.id, dayInLifeChallenge);
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
    };
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
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async createReward(insertReward: InsertReward): Promise<Reward> {
    const id = randomUUID();
    const reward: Reward = { 
      ...insertReward, 
      id, 
      createdAt: new Date() 
    };
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
