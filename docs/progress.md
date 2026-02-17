# Humble Halal — Progress Tracker

## Completed Phases

### Phase 0 — Supabase Wiring ✅
- Date: 2026-02-17
- `services/db.ts` rewritten (localStorage → Supabase, 7 table operations)
- `services/auth.ts` rewritten (localStorage → Supabase Auth)
- `src/lib/supabase.ts` typed client created
- `src/lib/database.types.ts` generated from live schema
- Initial migration applied: `supabase/migrations/20260217000001_initial_schema.sql`
- Build: 118 modules, 0 errors
- Deployed: https://myhumblehalal.vercel.app

### Phase 1 — Governance ✅
- Date: 2026-02-17
- `CLAUDE.md` created (design system, architecture rules, sprint management)
- `docs/current-sprint.md` created
- `docs/backlog.md` created
- `docs/progress.md` created

---

### Phase 2 — Database Schema Enhancement ✅
- Date: 2026-02-17
- Migration `20260217000002_foundation_enhancements.sql` written
- Extends `businesses`: slug, short_description, whatsapp, halal_certification, muis_cert_number, muis_cert_expiry, view_count, listing_tier, tier_expires_at, is_claimed, search_vector
- Extends `reviews`: food_rating, service_rating, halal_confidence, value_rating, owner_response, owner_responded_at, review_status
- New tables: `categories` (30 rows), `locations` (40 rows), `business_categories`, `leads`, `business_claims`, `event_registrations`
- pg_trgm extension + search_vector trigger + GIN indexes + RLS policies
- **Awaiting**: Manual run in Supabase SQL Editor, then `npm run gen:types`

### Phase 3 — SEO Slug URLs ✅
- Date: 2026-02-17
- `services/db.ts` — `businesses.getBySlug(slug)` + `businesses.incrementViewCount(id)` added
- `App.tsx` — route `/business/:id` → `/business/:slug`, new `/claim/:businessId` route
- `pages/BusinessDetailPage.tsx` — fetches by slug, increments view count on load
- All business links updated to `business.slug ?? business.id` fallback across: HomePage, DirectoryPage, DirectoryMapView, AdminDashboardPage, ReviewPage
- Build: 121 modules, 0 errors

### Phase 4 — Halal Badges + Expanded Categories ✅
- Date: 2026-02-17
- `components/HalalBadge.tsx` created — 3-tier badge (MUIS green, Muslim-Owned blue, Halal-Friendly gray)
- `services/db.ts` — `categories.list()` + `locations.list()` added (reads from new DB tables)
- `pages/BusinessDetailPage.tsx` — HalalBadge shown in business header when halalCertification is set
- `mapBusiness` updated to map all new Business fields

### Phase 5 — Lead Capture + Business Claiming ✅
- Date: 2026-02-17
- `components/LeadForm.tsx` created — contact form with 5 inquiry types, submits to `leads` table
- `pages/ClaimBusinessPage.tsx` created — protected `/claim/:businessId` route with proof URL + message fields
- `services/db.ts` — `leads.create/listByBusiness`, `businessClaims.create/list/updateStatus` added
- `pages/BusinessDetailPage.tsx` — LeadForm shown in sidebar; "Claim this listing" link shown if `!business.isClaimed`
- `pages/AdminDashboardPage.tsx` — Claims queue tab + Leads table tab added
- Build: 121 modules, 0 errors ✅

---

## Upcoming

- Run migration `20260217000002_foundation_enhancements.sql` in Supabase SQL Editor
- Run `npm run gen:types` to regenerate `src/lib/database.types.ts`
- Deploy to Vercel
