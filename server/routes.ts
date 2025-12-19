import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";
import { db } from "./db";
import { sql } from "drizzle-orm";

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

  // Get Stripe publishable key for frontend
  app.get("/api/stripe/config", async (req, res) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error) {
      console.error("Error getting Stripe config:", error);
      res.status(500).json({ error: "Failed to get Stripe config" });
    }
  });

  // Get available subscription products/prices
  app.get("/api/products", async (req, res) => {
    try {
      // Get only the most recent product for each tier to avoid duplicates
      const result = await db.execute(
        sql`WITH ranked_products AS (
          SELECT 
            p.id as product_id,
            p.name as product_name,
            p.description as product_description,
            p.metadata as product_metadata,
            p.created as product_created,
            pr.id as price_id,
            pr.unit_amount,
            pr.currency,
            pr.recurring,
            ROW_NUMBER() OVER (
              PARTITION BY p.metadata->>'tier' 
              ORDER BY p.created DESC
            ) as rn
          FROM stripe.products p
          LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
          WHERE p.active = true AND p.metadata->>'tier' IS NOT NULL
        )
        SELECT * FROM ranked_products WHERE rn = 1
        ORDER BY unit_amount ASC`
      );
      
      // Group by product
      const productsMap = new Map();
      for (const row of result.rows as any[]) {
        if (!productsMap.has(row.product_id)) {
          productsMap.set(row.product_id, {
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            metadata: row.product_metadata,
            prices: []
          });
        }
        if (row.price_id) {
          productsMap.get(row.product_id).prices.push({
            id: row.price_id,
            unit_amount: row.unit_amount,
            currency: row.currency,
            recurring: row.recurring,
          });
        }
      }

      res.json({ products: Array.from(productsMap.values()) });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Create checkout session for pre-order
  app.post("/api/checkout", async (req, res) => {
    try {
      const { priceId, email } = req.body;
      
      if (!priceId) {
        return res.status(400).json({ error: "Price ID is required" });
      }

      const stripe = await getUncachableStripeClient();
      
      // Derive base URL from request origin or REPLIT_DOMAINS
      const replitDomain = process.env.REPLIT_DOMAINS?.split(',')[0];
      const origin = req.headers.origin || req.headers.referer;
      const baseUrl = replitDomain 
        ? `https://${replitDomain}` 
        : origin 
          ? origin.replace(/\/$/, '') 
          : `${req.protocol}://${req.get('host')}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/pricing`,
        customer_email: email || undefined,
        metadata: {
          source: 'pre-order',
        },
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Error creating checkout session:", error?.message || error);
      res.status(500).json({ 
        error: "Failed to create checkout session",
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
