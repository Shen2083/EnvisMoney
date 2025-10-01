# Envis - AI-Powered Family Financial Coach

## Overview

Envis is a pre-launch landing page for an AI-powered financial coaching service targeting UK families. The project aims to gauge market interest by capturing email sign-ups for an early access waitlist. The application presents a compelling value proposition centered around reducing financial stress, avoiding late fees, and helping families achieve financial goals through intelligent automation and Open Banking integration.

The landing page is designed as a multi-page application built with React, featuring a homepage with multiple sections that progressively disclose the product's benefits, build trust through social proof, and drive conversions through strategic call-to-action placements. Additional legal pages (Privacy Policy and Terms of Service) provide comprehensive UK fintech-compliant documentation.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Updates & User Feedback (October 2025)

### Messaging Clarifications:
- **Read-Only Access Clarification:** Updated homepage to clearly explain that Envis operates with read-only access by default for insights and recommendations. Money movement features (like automated transfers to savings) require separate explicit permission for Payment Initiation Services (PIS). This resolves the apparent contradiction between "read-only access" and "sweeping surplus cash to savings."
- **Reduced "AI" Buzzword:** Softened AI language throughout the site, changing "AI-powered" to "intelligent" and removing unnecessary "AI" mentions. Focus is now on what the product does, not the underlying technology.

### User Insights:
- Demo mode preferred over free trial - users want to interact with the product before connecting real accounts
- User interested in participating in interviews for product development
- Cost and feature flexibility/customization are key decision factors
- Need for clear MVP that demonstrates value before users connect all accounts

### Admin Dashboard:
- Password-protected admin portal implemented at /admin-login and /admin
- Waitlist data protected with Bearer token authentication
- CSV export functionality for waitlist management
- Security note: Current implementation uses password-as-token (functional but requires upgrade to proper session management for production)

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, chosen for its fast HMR and optimized production builds
- Wouter for lightweight client-side routing (minimal bundle size compared to React Router)

**Page Structure:**
- Homepage (/) - Main landing page with hero, features, benefits, FAQ, and waitlist form
- Privacy Policy (/privacy) - Comprehensive UK GDPR-compliant privacy policy with 14 sections covering data collection, Open Banking, user rights, ICO complaints, and security
- Terms of Service (/terms) - Pre-launch/beta terms with 14 sections covering eligibility, Open Banking read-only access, no financial advice disclaimer, liability limitations, and governing law (England & Wales)

**Component Design System:**
- Shadcn UI component library (Radix UI primitives) for accessible, composable UI components
- Tailwind CSS for utility-first styling with custom design tokens
- Component structure follows the "New York" style variant from Shadcn
- Custom color palette based on fintech design principles (trust-building blues, success greens)

**State Management:**
- React Hook Form with Zod schema validation for form handling
- TanStack Query (React Query) for potential future API data fetching
- Local component state using React hooks

**Design Approach:**
- Responsive-first design optimized for both mobile and desktop
- Design system inspired by UK fintech challengers (Monzo, Starling, Revolut) combined with Stripe's aesthetic
- Typography: Inter font family for consistency and readability
- Spacing system based on 4px grid (4, 8, 12, 16, 24, 32 units)
- Light/dark theme support with CSS custom properties

### Backend Architecture

**Server Framework:**
- Express.js server with TypeScript
- Modular route registration system (`registerRoutes` pattern)
- Custom logging middleware for request/response tracking
- Development/production environment handling

**Data Storage Strategy:**
- Initial in-memory storage implementation (`MemStorage` class) for rapid development
- Designed with interface abstraction (`IStorage`) to support future database integration
- Database schema prepared using Drizzle ORM with PostgreSQL dialect
- Schema includes user management foundation (users table with username/password)

**Development Environment:**
- Vite middleware integration for HMR in development
- Replit-specific plugins for enhanced development experience
- Separate build processes for client and server code

### Data Storage Solutions

**ORM & Schema Management:**
- Drizzle ORM chosen for type-safe database queries and schema management
- PostgreSQL as the target database (via Neon serverless driver)
- Schema validation using Drizzle-Zod for runtime type checking
- Migration system configured with `drizzle-kit`

**Current Schema:**
- Users table with UUID primary keys, username, and password fields
- Designed to expand for waitlist entries and user authentication

**Future Considerations:**
- Waitlist/email capture table structure needed
- Session management with `connect-pg-simple` for persistent sessions
- Open Banking data models for financial account aggregation

### Authentication and Authorization

**Current State:**
- Basic user schema foundation prepared
- No authentication implemented in pre-launch phase

**Planned Architecture:**
- Session-based authentication using Express sessions with PostgreSQL storage
- Password hashing required before production (bcrypt or argon2)
- Future OAuth integration for Open Banking providers

### External Dependencies

**UI Component Libraries:**
- @radix-ui/* primitives (accordion, dialog, dropdown, etc.) - v1.x for accessible component foundations
- Lucide React for consistent iconography
- Embla Carousel for testimonial/feature carousels if needed

**Development Tools:**
- TypeScript for type safety across the stack
- ESLint/Prettier configuration implied by Replit standards
- PostCSS with Autoprefixer for CSS processing

**Form Handling:**
- React Hook Form v7 for performant form management
- Zod for schema validation and type inference
- @hookform/resolvers for Zod integration

**Styling:**
- Tailwind CSS v3 with custom configuration
- Class Variance Authority for component variant management
- clsx and tailwind-merge for conditional class handling

**Future Integrations Required:**
- Open Banking API provider (TrueLayer, Plaid, or Yapily)
- Email service provider for waitlist management (SendGrid, Mailgun, or AWS SES)
- Analytics platform (Google Analytics, Mixpanel, or Segment)
- FCA-compliant data storage and encryption services

**Asset Management:**
- Static images stored in `attached_assets/generated_images/`
- Vite alias configured for asset imports (`@assets` path)
- Font loading via Google Fonts (Inter family)