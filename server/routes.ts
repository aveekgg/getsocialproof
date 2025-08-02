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

  // Get rewards preview for homepage
  app.get("/api/rewards/preview", async (_req, res) => {
    try {
      const rewardPreviews = [
        { icon: "☕", name: "Costa Cards", rarity: "common" },
        { icon: "🎵", name: "Spotify Premium", rarity: "rare" },
        { icon: "🍕", name: "Food Vouchers", rarity: "common" },
        { icon: "💰", name: "PayPal Cash", rarity: "epic" },
        { icon: "🛍️", name: "ASOS Vouchers", rarity: "epic" },
        { icon: "🎮", name: "Gaming Credit", rarity: "rare" }
      ];
      res.json(rewardPreviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reward previews" });
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
      
      // Generate random reward with weighted distribution
      const rewards = [
        // Common rewards (70% chance)
        { type: "gift-card", value: "£3 Costa Coffee", weight: 15 },
        { type: "voucher", value: "£5 Subway Voucher", weight: 15 },
        { type: "credit", value: "£5 Amazon Credit", weight: 15 },
        { type: "voucher", value: "Free McDonald's Meal", weight: 10 },
        { type: "gift-card", value: "£4 Greggs Card", weight: 10 },
        { type: "bundle", value: "Study Snacks Box", weight: 5 },
        
        // Rare rewards (25% chance)
        { type: "subscription", value: "Spotify Premium (3 Months)", weight: 8 },
        { type: "voucher", value: "£15 Domino's Voucher", weight: 7 },
        { type: "subscription", value: "Netflix (1 Month)", weight: 5 },
        { type: "credit", value: "£20 Amazon Voucher", weight: 5 },
        
        // Epic rewards (5% chance)
        { type: "cash", value: "£50 PayPal Cash", weight: 2 },
        { type: "voucher", value: "£100 ASOS Voucher", weight: 2 },
        { type: "mystery", value: "Epic Student Bundle", weight: 1 }
      ];
      
      // Weighted random selection
      const totalWeight = rewards.reduce((sum, reward) => sum + reward.weight, 0);
      let random = Math.random() * totalWeight;
      let selectedReward = rewards[0];
      
      for (const reward of rewards) {
        random -= reward.weight;
        if (random <= 0) {
          selectedReward = reward;
          break;
        }
      }
      
      const reward = await storage.createReward({
        submissionId: submission.id,
        rewardType: selectedReward.type,
        rewardValue: selectedReward.value,
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
