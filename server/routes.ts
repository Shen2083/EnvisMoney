import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import fs from "fs";
import path from "path";
import { storage } from "./storage";
import { insertWaitlistSchema, insertBlogPostSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";
import { db } from "./db";
import { sql } from "drizzle-orm";

const SITE_URL = "https://envis.money";

function escapeHtmlAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

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

  // Dynamic sitemap.xml
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts(true);
      const today = new Date().toISOString().split("T")[0];

      const staticPages = [
        { loc: "/", priority: "1.0", changefreq: "weekly" },
        { loc: "/blog", priority: "0.8", changefreq: "daily" },
        { loc: "/pricing", priority: "0.7", changefreq: "monthly" },
        { loc: "/privacy", priority: "0.3", changefreq: "yearly" },
        { loc: "/terms", priority: "0.3", changefreq: "yearly" },
      ];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      for (const page of staticPages) {
        xml += `  <url>\n`;
        xml += `    <loc>${SITE_URL}${page.loc}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += `  </url>\n`;
      }

      for (const post of posts) {
        const lastmod = new Date(post.updatedAt).toISOString().split("T")[0];
        xml += `  <url>\n`;
        xml += `    <loc>${SITE_URL}/blog/${post.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.6</priority>\n`;
        xml += `  </url>\n`;
      }

      xml += `</urlset>`;

      res.set("Content-Type", "application/xml");
      res.send(xml);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Blog post meta tag injection for SEO crawlers
  app.get("/blog/:slug", async (req, res, next) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || !post.published) {
        return next();
      }

      const postUrl = `${SITE_URL}/blog/${post.slug}`;
      const ogImage = `${SITE_URL}/og-image.png`;
      const safeTitle = escapeHtmlAttr(post.title);
      const safeExcerpt = escapeHtmlAttr(post.excerpt);
      const fullTitle = `${safeTitle} | Envis Blog`;

      let htmlPath: string;
      if (app.get("env") === "development") {
        htmlPath = path.resolve(import.meta.dirname, "..", "client", "index.html");
      } else {
        htmlPath = path.resolve(import.meta.dirname, "public", "index.html");
      }

      let html = await fs.promises.readFile(htmlPath, "utf-8");

      const replaceOrInsert = (src: string, pattern: RegExp, replacement: string): string => {
        if (pattern.test(src)) {
          return src.replace(pattern, replacement);
        }
        return src.replace("</head>", `    ${replacement}\n  </head>`);
      };

      html = html.replace(/<title>.*?<\/title>/, `<title>${fullTitle}</title>`);
      html = replaceOrInsert(html, /<meta name="description"[^>]*>/, `<meta name="description" content="${safeExcerpt}" />`);
      html = replaceOrInsert(html, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${postUrl}" />`);
      html = replaceOrInsert(html, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${safeTitle}" />`);
      html = replaceOrInsert(html, /<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${safeExcerpt}" />`);
      html = replaceOrInsert(html, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${postUrl}" />`);
      html = replaceOrInsert(html, /<meta property="og:type"[^>]*>/, `<meta property="og:type" content="article" />`);
      html = replaceOrInsert(html, /<meta property="og:image" content="[^"]*"[^>]*>/, `<meta property="og:image" content="${ogImage}" />`);
      html = replaceOrInsert(html, /<meta property="og:site_name"[^>]*>/, `<meta property="og:site_name" content="Envis" />`);
      html = replaceOrInsert(html, /<meta property="og:locale"[^>]*>/, `<meta property="og:locale" content="en_GB" />`);
      html = replaceOrInsert(html, /<meta name="twitter:card"[^>]*>/, `<meta name="twitter:card" content="summary_large_image" />`);
      html = replaceOrInsert(html, /<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${safeTitle}" />`);
      html = replaceOrInsert(html, /<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${safeExcerpt}" />`);
      html = replaceOrInsert(html, /<meta name="twitter:image" content="[^"]*"[^>]*>/, `<meta name="twitter:image" content="${ogImage}" />`);

      res.status(200).set({ "Content-Type": "text/html" }).send(html);
    } catch (error) {
      console.error("Error injecting blog meta tags:", error);
      next();
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
