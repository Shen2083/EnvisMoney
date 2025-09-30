import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Waitlist signup endpoint
  app.post("/api/waitlist", async (req, res) => {
    try {
      // Validate request body
      const result = insertWaitlistSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          error: validationError.message 
        });
      }

      // Check if email already exists
      const existingEntry = await storage.getWaitlistEntryByEmail(result.data.email);
      if (existingEntry) {
        return res.status(409).json({ 
          error: "This email is already on the waitlist" 
        });
      }

      // Create waitlist entry
      const entry = await storage.createWaitlistEntry(result.data);
      
      res.status(201).json({ 
        success: true,
        message: "Successfully added to waitlist",
        entry: {
          id: entry.id,
          email: entry.email,
          name: entry.name
        }
      });
    } catch (error) {
      console.error("Error creating waitlist entry:", error);
      res.status(500).json({ 
        error: "Failed to add to waitlist. Please try again." 
      });
    }
  });

  // Get all waitlist entries (for admin purposes)
  app.get("/api/waitlist", async (req, res) => {
    try {
      const entries = await storage.getWaitlistEntries();
      res.json({ entries });
    } catch (error) {
      console.error("Error fetching waitlist entries:", error);
      res.status(500).json({ 
        error: "Failed to fetch waitlist entries" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
