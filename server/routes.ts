import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema, insertBlogPostSchema } from "@shared/schema";
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
      const { planId, priceId, email } = req.body;
      
      const stripe = getUncachableStripeClient();
      
      // Derive base URL from request origin or REPLIT_DOMAINS
      const replitDomain = process.env.REPLIT_DOMAINS?.split(',')[0];
      const origin = req.headers.origin || req.headers.referer;
      const baseUrl = replitDomain 
        ? `https://${replitDomain}` 
        : origin 
          ? origin.replace(/\/$/, '') 
          : `${req.protocol}://${req.get('host')}`;

      let checkoutPriceId = priceId;

      // Handle new billing frequency-based pricing by looking up from local synced data
      if (planId && !priceId) {
        // Query local database for synced product/price by billing metadata
        const result = await db.execute(
          sql`SELECT pr.id as price_id
              FROM stripe.products p
              JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
              WHERE p.active = true 
                AND p.metadata->>'billing' = ${planId}
              LIMIT 1`
        );
        
        if (!result.rows.length) {
          return res.status(400).json({ 
            error: "Plan not found. Please run the billing products seed script and restart the server." 
          });
        }
        
        checkoutPriceId = (result.rows[0] as any).price_id;
      }

      if (!checkoutPriceId) {
        return res.status(400).json({ error: "Plan ID or Price ID is required" });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: checkoutPriceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/pricing`,
        customer_email: email || undefined,
        metadata: {
          source: 'pre-order',
          plan: planId || 'legacy',
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

  // Public blog endpoints
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts(true);
      res.json({ posts });
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || !post.published) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json({ post });
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // Admin blog endpoints
  app.get("/api/admin/blog", requireAdminAuth, async (req, res) => {
    try {
      const posts = await storage.getBlogPosts(false);
      res.json({ posts });
    } catch (error) {
      console.error("Error fetching admin blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/admin/blog/:id", requireAdminAuth, async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json({ post });
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.post("/api/admin/blog", requireAdminAuth, async (req, res) => {
    try {
      const result = insertBlogPostSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ error: validationError.message });
      }

      const existing = await storage.getBlogPostBySlug(result.data.slug);
      if (existing) {
        return res.status(409).json({ error: "A post with this URL slug already exists" });
      }

      const post = await storage.createBlogPost(result.data);
      res.status(201).json({ post });
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  app.patch("/api/admin/blog/:id", requireAdminAuth, async (req, res) => {
    try {
      const existing = await storage.getBlogPost(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Post not found" });
      }

      const partialSchema = insertBlogPostSchema.partial();
      const result = partialSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ error: validationError.message });
      }

      if (result.data.slug && result.data.slug !== existing.slug) {
        const slugTaken = await storage.getBlogPostBySlug(result.data.slug);
        if (slugTaken) {
          return res.status(409).json({ error: "A post with this URL slug already exists" });
        }
      }

      const post = await storage.updateBlogPost(req.params.id, result.data);
      res.json({ post });
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/:id", requireAdminAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteBlogPost(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
