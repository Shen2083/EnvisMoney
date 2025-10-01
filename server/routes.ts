import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

// Simple authentication middleware for admin endpoints
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.substring(7);
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || token !== adminPassword) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}

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

  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (!adminPassword || password !== adminPassword) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // Return the password as the token (simple auth for now)
      res.json({ 
        success: true,
        token: adminPassword
      });
    } catch (error) {
      console.error("Error during admin login:", error);
      res.status(500).json({ 
        error: "Login failed. Please try again." 
      });
    }
  });

  // Get all waitlist entries (for admin purposes) - protected
  app.get("/api/waitlist", requireAdminAuth, async (req, res) => {
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
