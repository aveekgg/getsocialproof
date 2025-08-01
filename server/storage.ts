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
      { id: 1, title: "Show us your bed area", description: "Pan around your sleeping space", emoji: "🛏️", duration: 5 },
      { id: 2, title: "Your study/work space", description: "Show your desk setup", emoji: "📚", duration: 5 },
      { id: 3, title: "Kitchen/food area", description: "Open the fridge, show cooking space", emoji: "🍕", duration: 6 },
      { id: 4, title: "Bathroom facilities", description: "Quick tour of your bathroom", emoji: "🚿", duration: 4 },
      { id: 5, title: "Your favorite spot", description: "Show us where you love to hang out", emoji: "🌟", duration: 5 }
    ];

    const dayInLifeSteps: ChallengeStep[] = [
      { id: 1, title: "Morning routine", description: "Show us how you start your day", emoji: "🌅", duration: 6 },
      { id: 2, title: "Study session", description: "Capture yourself studying or in class", emoji: "📖", duration: 5 },
      { id: 3, title: "Meal time", description: "Show us what and where you eat", emoji: "🍽️", duration: 5 },
      { id: 4, title: "Social time", description: "Hanging out with friends or activities", emoji: "👥", duration: 6 },
      { id: 5, title: "Evening wind-down", description: "How you relax and end your day", emoji: "🌙", duration: 5 }
    ];

    const roomTourChallenge: Challenge = {
      id: "room-tour",
      name: "Show Your Room in 5 Clips",
      description: "Create awesome videos about your student housing experience and win amazing rewards!",
      steps: roomTourSteps,
      pointsPerStep: 25,
      createdAt: new Date()
    };

    const dayInLifeChallenge: Challenge = {
      id: "day-in-life",
      name: "Day in Life Challenge",
      description: "Document a typical day in your student life with 5 engaging clips!",
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
