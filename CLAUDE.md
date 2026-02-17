# HUMBLE HALAL — Singapore's Halal Business Directory

## Project Overview
Humble Halal is Singapore's halal business directory covering food, services, events, and community. Built as a lead generation engine — monetized through premium listings, events, and advertising.

**Live:** https://myhumblehalal.vercel.app
**Supabase Project:** pbnpuhxihoqrsctvnkte

## Tech Stack
- **Framework:** Vite + React 19 (TypeScript strict)
- **Routing:** React Router DOM v7 (HashRouter)
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (PostgreSQL + pg_trgm + RLS)
- **Auth:** Supabase Auth (email/password)
- **Deployment:** Vercel

## Design System

### Colors (Source of Truth)
```
Primary:        #059669  (Emerald 600 — main brand, buttons, CTAs)
Primary Hover:  #047857  (Emerald 700 — hover states)
Primary Light:  #D1FAE5  (Emerald 100 — backgrounds, badges)
Primary Muted:  #ECFDF5  (Emerald 50 — subtle backgrounds)

Secondary:      #D97706  (Amber 600 — featured/premium accent, gold badges)
Secondary Light:#FEF3C7  (Amber 100 — premium card backgrounds)

Neutral 900:    #0F172A  (Slate 900 — headings, primary text)
Neutral 700:    #334155  (Slate 700 — body text)
Neutral 500:    #64748B  (Slate 500 — secondary text, placeholders)
Neutral 300:    #CBD5E1  (Slate 300 — borders)
Neutral 100:    #F1F5F9  (Slate 100 — page backgrounds, cards)
White:          #FFFFFF

Destructive:    #DC2626  (Red 600 — errors, delete actions)
Warning:        #F59E0B  (Amber 500 — warnings)
Info:           #0284C7  (Sky 600 — informational)
```

### Halal Certification Badges (3-Tier System)
```
MUIS Certified:  bg-emerald-600  text-white   (green  — highest trust)
Muslim-Owned:    bg-sky-600      text-white   (blue   — community verified)
Self-Declared:   bg-slate-500    text-white   (gray   — self-reported)
```

### Typography
```
Headings: Plus Jakarta Sans (font-bold / font-extrabold)
Body:     Inter (font-normal / font-medium)

Scale:
  h1: text-4xl md:text-5xl font-extrabold tracking-tight
  h2: text-3xl md:text-4xl font-bold tracking-tight
  h3: text-xl md:text-2xl font-bold
  h4: text-lg font-semibold
  body: text-base
  caption: text-xs
```

### Component Patterns
```
Card radius:     rounded-xl (0.75rem)
Button radius:   rounded-lg (0.5rem)
Input radius:    rounded-lg (0.5rem)
Badge radius:    rounded-full
Container:       max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
Section padding: py-12 md:py-16
Card hover:      hover:shadow-xl hover:border-amber-500 transition-all
```

## Singapore-Specific Constants
- **Currency:** SGD (S$)
- **Timezone:** Asia/Singapore (UTC+8)
- **Locale:** en-SG
- **Priority areas:** Kampong Glam, Geylang Serai, Tampines, Bedok, Woodlands, Jurong East
- **Halal authority:** MUIS (Majlis Ugama Islam Singapura)
- **Cert tiers:** MUIS Certified > Muslim-Owned > Self-Declared

## Project Structure
```
/                     Project root (Vite serves index.tsx)
├── App.tsx           Router + layout shell
├── index.tsx         Entry point
├── types.ts          Shared TypeScript types
├── constants.tsx     App-wide constants
├── pages/            All route-level page components
├── components/       Reusable UI components
├── services/
│   ├── db.ts         All Supabase data operations
│   ├── auth.ts       Supabase Auth wrapper
│   ├── api.ts        External API calls (Gemini)
│   └── seed-data.ts  Static assets (category images, seed businesses)
├── contexts/
│   └── AuthContext.tsx
├── src/lib/
│   ├── supabase.ts   Typed Supabase client
│   └── database.types.ts  Generated DB types
├── supabase/
│   └── migrations/   SQL migrations (never edit applied migrations)
└── docs/
    ├── current-sprint.md  ACTIVE sprint — only build what's here
    ├── backlog.md         Future features — do NOT implement
    └── progress.md        Track completed phases
```

## Architecture Rules
- **Read `services/db.ts` before any data change** — all Supabase operations go through this file
- **Never edit applied migrations** — create new migration files instead
- **Run `npm run gen:types` after every migration** to regenerate `src/lib/database.types.ts`
- **All new tables MUST have RLS enabled** with appropriate policies
- **`services/auth.ts` wraps all auth operations** — no direct `supabase.auth` calls in pages
- Keep page components under 200 lines. Extract sub-components if larger.
- TypeScript strict mode — no `any` types

## CLI Commands
```bash
npm run dev           # Start dev server (Vite)
npm run build         # Production build — MUST pass before deploy
npm run gen:types     # Regenerate DB types from live Supabase schema
vercel --prod --yes   # Deploy to Vercel
```

## Verification (Run After Every Phase)
1. `npm run build` — 0 TypeScript errors
2. `npm run dev` → navigate all affected pages visually
3. Check Supabase dashboard for new data/tables if migration was involved

## Sprint Management
- **ALWAYS read `docs/current-sprint.md` before writing code** — only implement what's listed
- Think of improvements? Add to `docs/backlog.md`, NOT to current sprint
- Mark phases complete in `docs/progress.md`

## Database Schema (Current State)
Core tables: `profiles`, `businesses`, `events`, `reviews`, `bookmarks`, `blog_posts`, `notifications`
Enhancement tables (Phase 2+): `categories`, `locations`, `business_categories`, `leads`, `business_claims`, `event_registrations`

Key fields added in Phase 2:
- `businesses.slug` — SEO URL identifier
- `businesses.halal_certification` — muis_certified | muslim_owned | self_declared
- `businesses.listing_tier` — free | premium | enterprise
- `businesses.search_vector` — full-text search tsvector
- `reviews.food_rating`, `service_rating`, `halal_confidence`, `owner_response`
