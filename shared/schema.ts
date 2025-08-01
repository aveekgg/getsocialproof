import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const challenges = pgTable("challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  steps: json("steps").$type<ChallengeStep[]>().notNull(),
  pointsPerStep: integer("points_per_step").notNull().default(25),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const submissions = pgTable("submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  challengeId: varchar("challenge_id").references(() => challenges.id).notNull(),
  videoClips: json("video_clips").$type<VideoClip[]>().notNull(),
  totalPoints: integer("total_points").notNull(),
  completedAt: timestamp("completed_at").default(sql`now()`).notNull(),
});

export const rewards = pgTable("rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  submissionId: varchar("submission_id").references(() => submissions.id).notNull(),
  rewardType: text("reward_type").notNull(),
  rewardValue: text("reward_value").notNull(),
  claimed: integer("claimed").notNull().default(0), // 0 = false, 1 = true
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

// Types
export interface ChallengeStep {
  id: number;
  title: string;
  description: string;
  emoji: string;
  duration: number; // seconds
}

export interface VideoClip {
  stepId: number;
  duration: number;
  size: number; // bytes
  timestamp: string;
}

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  createdAt: true,
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  completedAt: true,
});

export const insertRewardSchema = createInsertSchema(rewards).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;

export type InsertReward = z.infer<typeof insertRewardSchema>;
export type Reward = typeof rewards.$inferSelect;
