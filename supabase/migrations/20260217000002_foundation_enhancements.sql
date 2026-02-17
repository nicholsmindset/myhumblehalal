-- ============================================================
-- Humble Halal — Foundation Enhancement Migration
-- Extends the initial schema with:
--   • Slug-based URLs for businesses
--   • 3-tier halal certification system
--   • Full-text search (pg_trgm + tsvector)
--   • 30-category taxonomy table
--   • 40 Singapore locations (planning areas + MRT)
--   • Leads, business claims, event registrations tables
--   • Enhanced reviews (sub-ratings, owner response)
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- EXTEND BUSINESSES TABLE (all additive — no column drops)
-- ============================================================

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS slug                TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS short_description   TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp            TEXT,
  ADD COLUMN IF NOT EXISTS halal_certification TEXT NOT NULL DEFAULT 'self_declared'
    CHECK (halal_certification IN ('muis_certified', 'muslim_owned', 'self_declared')),
  ADD COLUMN IF NOT EXISTS muis_cert_number    TEXT,
  ADD COLUMN IF NOT EXISTS muis_cert_expiry    DATE,
  ADD COLUMN IF NOT EXISTS view_count          INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS listing_tier        TEXT NOT NULL DEFAULT 'free'
    CHECK (listing_tier IN ('free', 'premium', 'enterprise')),
  ADD COLUMN IF NOT EXISTS tier_expires_at     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_claimed          BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS search_vector       TSVECTOR;

-- Backfill slugs from existing business names (name-id suffix for uniqueness)
UPDATE public.businesses
SET slug = lower(
  regexp_replace(
    regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  )
) || '-' || left(id::text, 8)
WHERE slug IS NULL;

-- Make slug NOT NULL after backfill
ALTER TABLE public.businesses ALTER COLUMN slug SET NOT NULL;

-- Full-text search vector trigger
CREATE OR REPLACE FUNCTION public.update_business_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.short_description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.address, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_business_search_vector ON public.businesses;
CREATE TRIGGER trg_business_search_vector
  BEFORE INSERT OR UPDATE OF name, short_description, description, address
  ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.update_business_search_vector();

-- Backfill search_vector for existing rows
UPDATE public.businesses SET
  search_vector =
    setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(description, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(address, '')), 'D');

-- Indexes for search performance
CREATE INDEX IF NOT EXISTS idx_businesses_search_vector ON public.businesses USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_businesses_name_trgm ON public.businesses USING GIN(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON public.businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_halal_cert ON public.businesses(halal_certification);
CREATE INDEX IF NOT EXISTS idx_businesses_listing_tier ON public.businesses(listing_tier);

-- ============================================================
-- EXTEND REVIEWS TABLE (additive)
-- ============================================================

ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS food_rating        INTEGER CHECK (food_rating BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS service_rating     INTEGER CHECK (service_rating BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS halal_confidence   INTEGER CHECK (halal_confidence BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS value_rating       INTEGER CHECK (value_rating BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS owner_response     TEXT,
  ADD COLUMN IF NOT EXISTS owner_responded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS review_status      TEXT NOT NULL DEFAULT 'published'
    CHECK (review_status IN ('pending', 'published', 'flagged', 'removed'));

-- ============================================================
-- CATEGORIES TABLE (30 granular categories)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.categories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL UNIQUE,
  slug          TEXT NOT NULL UNIQUE,
  icon          TEXT,
  parent_id     UUID REFERENCES public.categories(id),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.categories (name, slug, icon, display_order) VALUES
-- Food & Beverage
('Restaurants',          'restaurants',           'UtensilsCrossed',  1),
('Cafes',                'cafes',                 'Coffee',           2),
('Caterers',             'caterers',              'ChefHat',          3),
('Bakeries',             'bakeries',              'CakeSlice',        4),
('Fast Food',            'fast-food',             'Sandwich',         5),
('Buffets',              'buffets',               'Soup',             6),
('Hawker Stalls',        'hawker-stalls',         'Store',            7),
('Food Delivery',        'food-delivery',         'Truck',            8),
('Desserts',             'desserts',              'IceCream',         9),
('Grocery',              'grocery',               'ShoppingBasket',   10),
-- Wedding & Events
('Wedding Venues',       'wedding-venues',        'Heart',            11),
('Wedding Caterers',     'wedding-caterers',      'UtensilsCrossed',  12),
('Wedding Photographers','wedding-photographers', 'Camera',           13),
('Wedding Planners',     'wedding-planners',      'ClipboardList',    14),
('Bridal Services',      'bridal-services',       'Sparkles',         15),
('Event Spaces',         'event-spaces',          'Building',         16),
-- Professional Services
('Lawyers',              'lawyers',               'Scale',            17),
('Accountants',          'accountants',           'Calculator',       18),
('Real Estate',          'real-estate',           'Home',             19),
('Insurance',            'insurance',             'Shield',           20),
('Tuition',              'tuition',               'GraduationCap',    21),
('Clinics',              'clinics',               'Stethoscope',      22),
-- Lifestyle
('Gyms & Fitness',       'gyms-fitness',          'Dumbbell',         23),
('Salons',               'salons',                'Scissors',         24),
('Barbers',              'barbers',               'ScissorsLineDashed',25),
('Childcare',            'childcare',             'Baby',             26),
('Travel Agencies',      'travel-agencies',       'Plane',            27),
('Mosques',              'mosques',               'Building2',        28),
('Islamic Education',    'islamic-education',     'BookOpen',         29),
('Modest Fashion',       'modest-fashion',        'Shirt',            30)
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read categories"
  ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- LOCATIONS TABLE (25 planning areas + 15 MRT stations)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.locations (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  type       TEXT NOT NULL CHECK (type IN ('planning_area', 'mrt_station', 'region')),
  region     TEXT,
  lat        DOUBLE PRECISION,
  lng        DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.locations (name, slug, type, region, lat, lng) VALUES
-- Central Planning Areas
('Kampong Glam',    'kampong-glam',   'planning_area', 'Central', 1.3025,  103.8590),
('Geylang Serai',   'geylang-serai',  'planning_area', 'Central', 1.3165,  103.8985),
('Bugis',           'bugis',          'planning_area', 'Central', 1.3009,  103.8536),
('Orchard',         'orchard',        'planning_area', 'Central', 1.3048,  103.8318),
('Toa Payoh',       'toa-payoh',      'planning_area', 'Central', 1.3343,  103.8475),
('Bishan',          'bishan',         'planning_area', 'Central', 1.3526,  103.8352),
('Ang Mo Kio',      'ang-mo-kio',     'planning_area', 'Central', 1.3691,  103.8454),
-- East Planning Areas
('Tampines',        'tampines',       'planning_area', 'East',    1.3496,  103.9568),
('Bedok',           'bedok',          'planning_area', 'East',    1.3236,  103.9273),
('Pasir Ris',       'pasir-ris',      'planning_area', 'East',    1.3721,  103.9474),
('Changi',          'changi',         'planning_area', 'East',    1.3644,  103.9915),
('Eunos',           'eunos',          'planning_area', 'East',    1.3197,  103.9008),
('Simei',           'simei',          'planning_area', 'East',    1.3432,  103.9533),
-- North Planning Areas
('Woodlands',       'woodlands',      'planning_area', 'North',   1.4382,  103.7867),
('Yishun',          'yishun',         'planning_area', 'North',   1.4304,  103.8354),
('Sembawang',       'sembawang',      'planning_area', 'North',   1.4491,  103.8185),
('Marsiling',       'marsiling',      'planning_area', 'North',   1.4348,  103.7741),
-- West Planning Areas
('Jurong East',     'jurong-east',    'planning_area', 'West',    1.3329,  103.7436),
('Jurong West',     'jurong-west',    'planning_area', 'West',    1.3404,  103.7090),
('Boon Lay',        'boon-lay',       'planning_area', 'West',    1.3390,  103.7065),
('Clementi',        'clementi',       'planning_area', 'West',    1.3155,  103.7649),
('Bukit Batok',     'bukit-batok',    'planning_area', 'West',    1.3490,  103.7495),
('Choa Chu Kang',   'choa-chu-kang',  'planning_area', 'West',    1.3840,  103.7470),
('Punggol',         'punggol',        'planning_area', 'North',   1.4043,  103.9022),
('Sengkang',        'sengkang',       'planning_area', 'North',   1.3868,  103.8914),
-- Key MRT Stations
('City Hall MRT',   'city-hall-mrt',  'mrt_station',   'Central', 1.2931,  103.8520),
('Bugis MRT',       'bugis-mrt',      'mrt_station',   'Central', 1.3009,  103.8558),
('Lavender MRT',    'lavender-mrt',   'mrt_station',   'Central', 1.3073,  103.8631),
('Tampines MRT',    'tampines-mrt',   'mrt_station',   'East',    1.3530,  103.9454),
('Bedok MRT',       'bedok-mrt',      'mrt_station',   'East',    1.3240,  103.9302),
('Woodlands MRT',   'woodlands-mrt',  'mrt_station',   'North',   1.4369,  103.7863),
('Yishun MRT',      'yishun-mrt',     'mrt_station',   'North',   1.4296,  103.8350),
('Jurong East MRT', 'jurong-east-mrt','mrt_station',   'West',    1.3331,  103.7422),
('Boon Lay MRT',    'boon-lay-mrt',   'mrt_station',   'West',    1.3388,  103.7058),
('Punggol MRT',     'punggol-mrt',    'mrt_station',   'North',   1.4053,  103.9022),
('Sengkang MRT',    'sengkang-mrt',   'mrt_station',   'North',   1.3915,  103.8954),
('Geylang Bahru MRT','geylang-bahru-mrt','mrt_station','Central', 1.3213,  103.8714),
('Serangoon MRT',   'serangoon-mrt',  'mrt_station',   'Central', 1.3499,  103.8733),
('Hougang MRT',     'hougang-mrt',    'mrt_station',   'North',   1.3713,  103.8921),
('Ang Mo Kio MRT',  'ang-mo-kio-mrt', 'mrt_station',   'Central', 1.3700,  103.8494)
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read locations"
  ON public.locations FOR SELECT USING (true);

-- ============================================================
-- BUSINESS ↔ CATEGORY (many-to-many)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.business_categories (
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  is_primary  BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (business_id, category_id)
);

ALTER TABLE public.business_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read business_categories"
  ON public.business_categories FOR SELECT USING (true);
CREATE POLICY "Owners and admins can manage business_categories"
  ON public.business_categories FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- LEADS TABLE (contact/inquiry lead capture)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.leads (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  type        TEXT NOT NULL DEFAULT 'general'
    CHECK (type IN ('general', 'catering', 'event', 'quote', 'partnership')),
  message     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a lead"
  ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Business owners can view their leads"
  ON public.leads FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Business owners and admins can update leads"
  ON public.leads FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS idx_leads_business_id ON public.leads(business_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);

-- ============================================================
-- BUSINESS CLAIMS TABLE (claim verification workflow)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.business_claims (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  proof_url   TEXT,
  message     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.business_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can submit claims"
  ON public.business_claims FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own claims, admins can view all"
  ON public.business_claims FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can update claims"
  ON public.business_claims FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX IF NOT EXISTS idx_business_claims_business_id ON public.business_claims(business_id);
CREATE INDEX IF NOT EXISTS idx_business_claims_status ON public.business_claims(status);

-- ============================================================
-- EVENT REGISTRATIONS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id    UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  ticket_code TEXT NOT NULL DEFAULT upper(left(replace(gen_random_uuid()::text, '-', ''), 8)),
  checked_in  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, email)
);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can register for events"
  ON public.event_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own registrations"
  ON public.event_registrations FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.events WHERE id = event_id AND owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON public.event_registrations(user_id);
