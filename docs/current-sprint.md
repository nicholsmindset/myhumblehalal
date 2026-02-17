# Current Sprint — Foundation Integration

## Sprint Goal
Upgrade Humble Halal from a demo app into a production-grade directory by integrating the foundation spec's DB schema, categories, location taxonomy, halal certification tiers, SEO URLs, lead capture, and business claiming.

## Phases

### ✅ Phase 0 — Supabase Wiring (COMPLETE)
- Supabase project linked (pbnpuhxihoqrsctvnkte)
- `services/db.ts` and `services/auth.ts` fully rewritten to use Supabase
- `src/lib/supabase.ts` and `src/lib/database.types.ts` in place
- All pages building and deployed to Vercel

### ✅ Phase 1 — Governance (COMPLETE)
- `CLAUDE.md` created with design system, architecture rules, sprint management
- `docs/` folder structure created

### 🔄 Phase 2 — Database Schema Enhancement (IN PROGRESS)
Scope:
- [ ] Migration `20260217000002_foundation_enhancements.sql`
  - Extend `businesses`: slug, short_description, whatsapp, halal_certification, muis_cert_number, muis_cert_expiry, view_count, listing_tier, tier_expires_at, is_claimed, search_vector
  - Extend `reviews`: food_rating, service_rating, halal_confidence, owner_response, owner_responded_at, review_status
  - New table: `categories` (30 granular categories)
  - New table: `locations` (25 planning areas + 15 MRT stations)
  - New table: `business_categories` (many-to-many junction)
  - New table: `leads` (contact lead capture)
  - New table: `business_claims` (business claim verification)
  - New table: `event_registrations` (event ticket/QR)
  - pg_trgm extension + search_vector trigger + GIN indexes
- [ ] Run migration in Supabase SQL Editor
- [ ] `npm run gen:types` to regenerate database.types.ts

### 📋 Phase 3 — SEO Slug URLs
Scope:
- [ ] `services/db.ts` — add `businesses.getBySlug(slug)`
- [ ] `App.tsx` — route `/business/:id` → `/business/:slug`
- [ ] `pages/BusinessDetailPage.tsx` — fetch by slug
- [ ] Update all business links across pages to use `business.slug`
- [ ] `npm run build` passes

### 📋 Phase 4 — Halal Badges + Expanded Categories
Scope:
- [ ] `components/HalalBadge.tsx` — 3-tier badge component
- [ ] `services/db.ts` — `categories.list()` and `locations.list()`
- [ ] `pages/CategoryExplorerPage.tsx` — load from DB (30 categories)
- [ ] `pages/DirectoryPage.tsx` — location filter from DB, halal cert filter
- [ ] Update `BusinessDetailPage` and business cards to show HalalBadge
- [ ] `npm run build` passes

### 📋 Phase 5 — Lead Capture + Business Claiming
Scope:
- [ ] `components/LeadForm.tsx` — lead capture sidebar form
- [ ] `pages/ClaimBusinessPage.tsx` — claim business flow
- [ ] `services/db.ts` — leads.create, businessClaims.create/list, eventRegistrations.create
- [ ] `App.tsx` — add `/claim/:businessId` route
- [ ] `pages/BusinessDetailPage.tsx` — add LeadForm + Claim Business link
- [ ] `pages/AdminDashboardPage.tsx` — Claims queue + Leads tabs
- [ ] `npm run build` passes

## Definition of Done
- `npm run build` passes with 0 errors
- All new Supabase tables have RLS enabled
- Visual check in browser on all modified pages
- Deployed to Vercel
