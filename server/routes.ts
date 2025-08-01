import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubmissionSchema, insertRewardSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all challenges
  app.get("/api/challenges", async (_req, res) => {
    try {
      const challenges = await storage.getChallenges();
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  // Get specific challenge
  app.get("/api/challenges/:id", async (req, res) => {
    try {
      const challenge = await storage.getChallenge(req.params.id);
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenge" });
    }
  });

  // Submit completed challenge
  app.post("/api/submissions", async (req, res) => {
    try {
      const validatedData = insertSubmissionSchema.parse(req.body);
      const submission = await storage.createSubmission(validatedData);
      
      // Generate random reward
      const rewards = [
        { type: "gift-card", value: "£5 Costa Coffee Card" },
        { type: "subscription", value: "Spotify Premium (3 Months)" },
        { type: "voucher", value: "£10 Domino's Voucher" },
        { type: "subscription", value: "Netflix (1 Month)" },
        { type: "credit", value: "£15 Amazon Voucher" },
        { type: "bundle", value: "Study Essentials Kit" },
        { type: "cash", value: "£20 PayPal Credit" },
        { type: "mystery", value: "Surprise Student Bundle" }
      ];
      
      const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
      
      const reward = await storage.createReward({
        submissionId: submission.id,
        rewardType: randomReward.type,
        rewardValue: randomReward.value,
        claimed: 0
      });
      
      res.json({ submission, reward });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid submission data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create submission" });
    }
  });

  // Get submission details
  app.get("/api/submissions/:id", async (req, res) => {
    try {
      const submission = await storage.getSubmission(req.params.id);
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }
      
      const reward = await storage.getRewardBySubmission(submission.id);
      res.json({ submission, reward });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submission" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
