# Humble Halal — Backlog

## IMPORTANT
These are future ideas. Do NOT implement anything from this list unless it's been moved to `current-sprint.md`.

---

## Features

### Search & Discovery
- AI natural language search ("best biryani under $15 near Bugis")
- Typesense integration for faster full-text search (upgrade from pg_trgm)
- Business comparison tool (side-by-side)
- "Near me" location-based search using PostGIS + browser geolocation
- MRT-variant SEO pages: `/halal-[category]-near-[mrt]-mrt/`

### Business Owner Tools
- Business analytics dashboard (view counts, lead stats, review trends)
- Special offers / deals system (limited-time promotions)
- WhatsApp Business API integration (click-to-chat on listing)
- Response to reviews (owner reply inline)
- Multi-image gallery upload for business listings
- Automated MUIS certificate expiry reminder emails

### Events
- Event registration with QR code tickets
- Event check-in scanner (organizer dashboard)
- Recurring events support
- Add to Calendar (Google / Apple / .ics)

### Community
- Blog / content hub for Halal lifestyle articles (already has `blog_posts` table)
- Push notifications (web push — new leads, reviews)
- Review image upload (max 3 per review)
- Gamification (points for reviews, badges — `profiles.points` column seeded)
- Multi-vendor quote requests ("Get quotes from 5 caterers")

### Monetization
- Stripe subscription management (Premium / Enterprise listing tiers)
- HitPay PayNow integration (Singapore-native payment)
- Sponsored listings (boosted positions in search)
- Banner ad management (home page + category pages)
- Affiliate partnerships

### Internationalisation
- Multi-language support: Malay (ms), Chinese (zh), Tamil (ta)
- Currency display: always SGD (S$)

---

## Technical Debt / Improvements
- Typesense for production-scale search
- Cloudinary / Imgix for image CDN
- Rate limiting on Supabase Edge Functions
- E2E tests with Playwright
- GitHub Actions CI/CD pipeline
- Automated DB backups (Supabase point-in-time recovery)
- Error tracking: Sentry
- Analytics: PostHog (page views, searches, lead clicks)
- SEO: `generateMetadata()` equivalent — add `<meta>` tags per page via Helmet or Vite plugin
- Sitemap XML auto-generation
- robots.txt: allow public, disallow /dashboard /admin
- Mobile app (React Native / Expo)

---

## Post-Launch Growth
- Data seeding scripts: bulk import 1,000+ businesses from CSV
- MUIS certified establishments auto-import
- Review moderation AI (Supabase Edge Function → Claude API)
- Storybook component library documentation
