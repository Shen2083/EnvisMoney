# Envis Landing Page Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from leading UK fintech challengers (Monzo, Starling, Revolut) combined with Stripe's clean, trust-building aesthetic and Linear's refined typography. This creates a modern, professional, and distinctly British fintech identity that builds immediate credibility.

## Core Design Principles
1. **Trust Through Clarity**: Clean layouts, transparent messaging, and clear hierarchy to build confidence in a financial product
2. **Family-First Visual Language**: Warm, approachable, yet professional tone that speaks to families rather than individual investors
3. **Progressive Disclosure**: Lead with emotional value, support with credibility indicators, close with clear action

## Color Palette

### Primary Colors
- **Brand Primary**: 220 85% 35% (Deep trustworthy blue - financial stability)
- **Brand Secondary**: 220 80% 45% (Lighter blue for interactive elements)

### Accent & Support
- **Success Green**: 145 70% 45% (Positive outcomes, savings indicators)
- **Warning Amber**: 35 85% 55% (Attention items, used sparingly)
- **Neutral Gray**: 220 10% 50% (Supporting text, borders)

### Backgrounds
- **Light Mode Primary**: 0 0% 100% (Pure white)
- **Light Mode Secondary**: 220 15% 98% (Subtle blue-gray for sections)
- **Dark Mode Primary**: 220 25% 10% (Deep blue-black)
- **Dark Mode Secondary**: 220 20% 15% (Elevated surfaces)

## Typography

### Font Families
- **Headings**: Inter (600-700 weights) - Modern, professional, excellent readability
- **Body**: Inter (400-500 weights) - Consistent family for cohesion
- **Accent/Stats**: SF Mono or Roboto Mono (500 weight) - For numerical emphasis

### Type Scale
- **Hero Headline**: text-5xl md:text-6xl lg:text-7xl, font-bold, tracking-tight
- **Section Headers**: text-3xl md:text-4xl, font-semibold
- **Subheadings**: text-xl md:text-2xl, font-medium
- **Body Large**: text-lg, font-normal, leading-relaxed
- **Body**: text-base, font-normal, leading-relaxed
- **Small/Caption**: text-sm, text-neutral-gray

## Layout System

### Spacing Primitives
Core spacing units: **4, 8, 12, 16, 24, 32** (Tailwind: p-4, p-8, p-12, p-16, p-24, p-32)
- Tight spacing: 4-8 units (within cards, between related elements)
- Medium spacing: 12-16 units (between sections on mobile, card padding)
- Generous spacing: 24-32 units (desktop section padding, hero spacing)

### Container Strategy
- **Max Width**: max-w-7xl (1280px) for main content
- **Content Width**: max-w-4xl for text-heavy sections
- **Full Bleed**: Strategic use for hero and alternating feature sections

### Grid System
- Mobile: Single column (grid-cols-1)
- Tablet: 2 columns for features/benefits (md:grid-cols-2)
- Desktop: 3 columns for feature cards, 2 for detailed sections (lg:grid-cols-3)

## Component Library

### Hero Section
- **Height**: min-h-screen on desktop, min-h-[85vh] on mobile
- **Layout**: Two-column split (60/40) - copy left, hero image/illustration right
- **Content**: Strong headline (family-focused value prop), supporting subheading, dual CTAs (primary + secondary), trust indicators below
- **Background**: Subtle gradient from brand primary to lighter blue, or clean white with colored accents
- **Image**: Modern family using tablet/phone in comfortable home setting, or abstract financial visualization

### Navigation
- **Style**: Fixed, translucent backdrop-blur header with border-bottom
- **Content**: Logo left, minimal nav items (About, How it Works, Pricing), CTA button right
- **Mobile**: Hamburger menu for mobile-first simplicity

### Feature Cards
- **Style**: Rounded-2xl, subtle shadow (shadow-sm), hover:shadow-lg transition
- **Layout**: Icon/illustration top, heading, description, optional "Learn more" link
- **Spacing**: p-8 internal padding, gap-8 between cards
- **Background**: White cards on light gray sections, elevated dark cards on dark sections

### Waiting List Form
- **Position**: Dedicated section mid-page AND repeated in final CTA
- **Fields**: Name, Email, Family Size (dropdown: 2, 3, 4, 5+), Optional interest note
- **Style**: Large, clear inputs with focus states, prominent submit button
- **Confirmation**: Inline success message with animation, not modal

### Trust Indicators Section
- **Content**: Logos (Open Banking, FCA mention), user metrics ("Join 500+ families"), security badges
- **Style**: Grayscale logos with hover color transition, clean horizontal layout
- **Position**: Below hero and above footer

### Footer
- **Style**: Multi-column layout (Product, Company, Legal, Contact)
- **Content**: Newsletter signup, social links (LinkedIn, Twitter), copyright, compliance links
- **Background**: Deep background color with lighter text

## Section Layout Strategy

### Recommended Sections (in order)
1. **Hero**: Bold value proposition + visual + dual CTAs
2. **Social Proof**: "Join UK families managing £XX together" with key metrics
3. **Problem Statement**: Cost-of-living crisis context, financial stress stats
4. **Solution Overview**: "How Envis Works" - 3-4 key features with icons
5. **Benefits Grid**: 6 specific outcomes (reduce stress, avoid fees, save together, etc.)
6. **Open Banking Explanation**: Trust-building technical section
7. **Waiting List Form**: Primary conversion point
8. **FAQ**: Address common concerns (security, pricing, launch date)
9. **Final CTA**: Strong close with urgency ("Be first to launch")

### Vertical Rhythm
- **Section Padding**: py-16 (mobile), py-24 (tablet), py-32 (desktop)
- **Alternating Backgrounds**: White → Light gray → White pattern for visual interest
- **Breathing Room**: Generous whitespace between sections, never cramped

## Images

### Hero Image
Large, prominent right-side image showing a diverse UK family (multi-generational ideal) looking at a tablet/phone together in a comfortable home setting. Image should feel aspirational yet relatable - not stock-photo generic. Natural lighting, warm tones. Alternative: Clean, modern 3D illustration of financial dashboard with family iconography.

### Feature Section Images
Smaller supporting images/illustrations for each major feature:
- AI coach visualization (abstract, friendly AI interface)
- Family budget overview (clean dashboard mockup)
- Mobile phone mockup showing app notifications
- Connection graphic for Open Banking integration

### Placement Strategy
- Hero: Right column on desktop, above fold on mobile
- Features: Left-right alternating layout (image-text-image-text pattern)
- All images should have subtle shadow-lg and rounded-xl treatment

## Accessibility & Dark Mode

### Dark Mode
- Implement comprehensive dark mode toggle (top-right navigation)
- Ensure all form inputs, text fields maintain consistent dark styling
- Reduce image brightness slightly in dark mode (opacity-90)
- Maintain WCAG AA contrast ratios throughout

### Focus States
- Clear blue ring (ring-2 ring-brand-primary) on all interactive elements
- Visible skip-to-content link for keyboard navigation

## Animation Guidelines

Use animations sparingly for polish, not distraction:
- **Fade-in on scroll**: For section reveals (opacity transition only)
- **Hover states**: Subtle scale (hover:scale-105) for cards, color transitions for buttons
- **Form submission**: Success checkmark animation on signup
- **Avoid**: Parallax scrolling, continuous animations, complex scroll-triggered effects

## Critical Implementation Notes

1. **Mobile-First Responsive**: Stack all multi-column layouts to single column below md breakpoint
2. **Performance**: Optimize hero image (<200KB), lazy-load below-fold content
3. **Forms**: Client-side validation, clear error states, loading states during submission
4. **CTAs**: Primary button should be bold, high-contrast (bg-brand-primary text-white), secondary should be outline variant
5. **UK Context**: All copy should reference UK-specific elements (FCA, Open Banking, £ currency, British spelling)

This design creates a professional, trustworthy fintech landing page that balances innovation with stability - perfect for capturing waiting list signups from UK families seeking financial peace of mind.