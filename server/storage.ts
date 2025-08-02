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
    const today = new Date();
    const getUnlockDate = (dayOffset: number) => {
      const date = new Date(today);
      date.setDate(today.getDate() + dayOffset);
      return date;
    };

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

    const studySpaceSteps: ChallengeStep[] = [
      { id: 1, title: "Your study sanctuary", description: "Show us your main study spot", emoji: "📖", duration: 5 },
      { id: 2, title: "Study snacks reveal", description: "What fuels your study sessions?", emoji: "🍿", duration: 4 },
      { id: 3, title: "Organization game", description: "How do you keep things organized (or not)?", emoji: "📝", duration: 5 },
      { id: 4, title: "Productivity tools", description: "Apps, planners, or just pure chaos?", emoji: "⚡", duration: 4 },
      { id: 5, title: "Study playlist", description: "What gets you in the zone?", emoji: "🎧", duration: 3 }
    ];

    const uniLifeSteps: ChallengeStep[] = [
      { id: 1, title: "Campus highlights", description: "Show us your favourite spots on campus", emoji: "🏫", duration: 6 },
      { id: 2, title: "Lecture hall vibes", description: "Where the magic (or boredom) happens", emoji: "🎓", duration: 5 },
      { id: 3, title: "Library life", description: "Your go-to study spaces and secret spots", emoji: "📚", duration: 5 },
      { id: 4, title: "Social societies", description: "Clubs, societies, or just hanging out", emoji: "🎉", duration: 6 },
      { id: 5, title: "Campus food tour", description: "Best (and worst) places to grab a bite", emoji: "🍔", duration: 5 }
    ];

    const friendsSteps: ChallengeStep[] = [
      { id: 1, title: "Squad introduction", description: "Introduce us to your uni crew", emoji: "👥", duration: 6 },
      { id: 2, title: "Flat/house mates", description: "The people you live with (chaos included)", emoji: "🏠", duration: 5 },
      { id: 3, title: "Study buddies", description: "Who keeps you motivated (or distracted)?", emoji: "📖", duration: 5 },
      { id: 4, title: "Weekend plans", description: "How you and your mates unwind", emoji: "🎊", duration: 6 },
      { id: 5, title: "Group dynamics", description: "The funny moments and inside jokes", emoji: "😂", duration: 5 }
    ];

    const challenges = [
      {
        id: "room-tour",
        name: "Room Tour Challenge",
        description: "Give us the honest tour of your uni accommodation!",
        steps: roomTourSteps,
        pointsPerStep: 25,
        dayNumber: 1,
        unlockDate: getUnlockDate(0),
        createdAt: new Date()
      },
      {
        id: "day-in-life",
        name: "A Day in My Uni Life",
        description: "Show us what a real day looks like as a UK student!",
        steps: dayInLifeSteps,
        pointsPerStep: 25,
        dayNumber: 2,
        unlockDate: getUnlockDate(1),
        createdAt: new Date()
      },
      {
        id: "study-space",
        name: "Study Space Secrets",
        description: "Reveal your study setup and productivity hacks!",
        steps: studySpaceSteps,
        pointsPerStep: 30,
        dayNumber: 3,
        unlockDate: getUnlockDate(2),
        createdAt: new Date()
      },
      {
        id: "uni-life",
        name: "Campus Life Tour",
        description: "Take us around your university campus!",
        steps: uniLifeSteps,
        pointsPerStep: 35,
        dayNumber: 4,
        unlockDate: getUnlockDate(3),
        createdAt: new Date()
      },
      {
        id: "friends-social",
        name: "Friends & Social Life",
        description: "Show us your uni social circle and good times!",
        steps: friendsSteps,
        pointsPerStep: 40,
        dayNumber: 5,
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
