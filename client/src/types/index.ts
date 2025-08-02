// Client-only types for RoomReel Challenge

export interface ChallengeStep {
  id: number;
  title: string;
  description: string;
  emoji: string;
  duration: number; // seconds
}

export interface ChallengePrompt {
  id: string;
  text: string;
  emoji: string;
  duration: number; // seconds
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  tagline?: string;
  steps: ChallengeStep[];
  promptPool?: ChallengePrompt[];
  selectedPrompts?: string[];
  pointsPerStep: number;
  dayNumber: number;
  durationDays: number;
  maxPrompts: number;
  unlockDate: string;
  createdAt: string;
}

export interface VideoClip {
  stepId: number;
  duration: number;
  size: number; // bytes
  timestamp: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
}

export interface Submission {
  id: string;
  userId?: string;
  challengeId: string;
  videoClips: VideoClip[];
  totalPoints: number;
  completedAt: string;
}

export interface Reward {
  id: string;
  submissionId: string;
  rewardType: string;
  rewardValue: string;
  claimed: number;
  createdAt: string;
}