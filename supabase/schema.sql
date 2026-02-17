-- ============================================================================
-- HalalBiz SG — Supabase/PostgreSQL Schema
--
-- Mirrors the TypeScript interfaces in types.ts.
-- Run this in the Supabase SQL editor to create all tables.
-- ============================================================================

-- ── Enums ──

CREATE TYPE user_role AS ENUM ('user', 'business_owner', 'admin');
CREATE TYPE subscription_plan AS ENUM ('free', 'premium', 'corporate');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired');
CREATE TYPE submission_status AS ENUM ('Approved', 'Pending Review', 'Rejected');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning');
CREATE TYPE price_range AS ENUM ('$', '$$', '$$$');

-- ── Category & Region as text (matches TS enum string values) ──

CREATE TYPE business_category AS ENUM (
    'Food & Beverage',
    'Retail & Shopping',
    'Health & Wellness',
    'Professional Services',
    'Education & Enrichment',
    'Travel & Hospitality',
    'Beauty & Personal Care',
    'Home Services'
);

CREATE TYPE business_region AS ENUM (
    'Central Region',
    'East Region',
    'West Region',
    'North Region'
);

-- ── Users ──

CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT UNIQUE NOT NULL,
    name          TEXT NOT NULL,
    avatar        TEXT,
    role          user_role NOT NULL DEFAULT 'user',
    phone         TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    bookmarks     TEXT[] NOT NULL DEFAULT '{}',
    subscription  subscription_plan NOT NULL DEFAULT 'free',
    subscription_status subscription_status,
    subscription_expiry TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role ON users (role);

-- ── Businesses ──

CREATE TABLE businesses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    category        business_category NOT NULL,
    address         TEXT NOT NULL,
    region          business_region NOT NULL,
    rating          NUMERIC(2,1) NOT NULL DEFAULT 0,
    review_count    INTEGER NOT NULL DEFAULT 0,
    image_url       TEXT NOT NULL,
    description     TEXT,
    opening_hours   TEXT,
    phone           TEXT,
    website         TEXT,
    email           TEXT,
    is_verified     BOOLEAN NOT NULL DEFAULT false,
    is_featured     BOOLEAN NOT NULL DEFAULT false,
    status          submission_status NOT NULL DEFAULT 'Pending Review',
    submission_date DATE,
    owner_id        UUID REFERENCES users(id) ON DELETE SET NULL,
    lat             DOUBLE PRECISION,
    lng             DOUBLE PRECISION,
    tags            TEXT[] DEFAULT '{}',
    price_range     price_range
);

CREATE INDEX idx_businesses_category ON businesses (category);
CREATE INDEX idx_businesses_region ON businesses (region);
CREATE INDEX idx_businesses_status ON businesses (status);
CREATE INDEX idx_businesses_owner ON businesses (owner_id);
CREATE INDEX idx_businesses_featured ON businesses (is_featured) WHERE is_featured = true;
CREATE INDEX idx_businesses_rating ON businesses (rating DESC);

-- ── Events ──

CREATE TABLE events (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title        TEXT NOT NULL,
    type         TEXT NOT NULL,
    date         TEXT NOT NULL,
    time         TEXT NOT NULL,
    location     TEXT NOT NULL,
    image_url    TEXT NOT NULL,
    description  TEXT NOT NULL,
    is_free      BOOLEAN DEFAULT true,
    price        NUMERIC(10,2),
    organizer    TEXT,
    owner_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    status       submission_status DEFAULT 'Pending Review',
    lat          DOUBLE PRECISION,
    lng          DOUBLE PRECISION
);

CREATE INDEX idx_events_type ON events (type);
CREATE INDEX idx_events_status ON events (status);

-- ── Reviews ──

CREATE TABLE reviews (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id    UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    business_name  TEXT NOT NULL,
    user_id        UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name      TEXT NOT NULL,
    user_avatar    TEXT,
    rating         INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment        TEXT NOT NULL,
    title          TEXT,
    date           DATE NOT NULL DEFAULT CURRENT_DATE,
    vibe_tags      TEXT[] DEFAULT '{}',
    helpful        INTEGER DEFAULT 0
);

CREATE INDEX idx_reviews_business ON reviews (business_id);
CREATE INDEX idx_reviews_user ON reviews (user_id);

-- ── Blog Posts ──

CREATE TABLE blog_posts (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title     TEXT NOT NULL,
    category  TEXT NOT NULL,
    date      TEXT NOT NULL,
    author    TEXT NOT NULL,
    image     TEXT NOT NULL,
    excerpt   TEXT NOT NULL,
    content   TEXT,
    tags      TEXT[] DEFAULT '{}'
);

-- ── Notifications ──

CREATE TABLE notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    message     TEXT NOT NULL,
    type        notification_type NOT NULL DEFAULT 'info',
    read        BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    link        TEXT
);

CREATE INDEX idx_notifications_user ON notifications (user_id);
CREATE INDEX idx_notifications_unread ON notifications (user_id, read) WHERE read = false;

-- ── Row Level Security (RLS) ──

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public read access for businesses, events, blogs
CREATE POLICY "Public can read approved businesses"
    ON businesses FOR SELECT
    USING (status = 'Approved');

CREATE POLICY "Owners can see their own businesses"
    ON businesses FOR SELECT
    USING (owner_id = auth.uid());

CREATE POLICY "Owners can insert businesses"
    ON businesses FOR INSERT
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update their own businesses"
    ON businesses FOR UPDATE
    USING (owner_id = auth.uid());

CREATE POLICY "Public can read events"
    ON events FOR SELECT
    USING (status = 'Approved');

CREATE POLICY "Public can read reviews"
    ON reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can insert reviews"
    ON reviews FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reviews"
    ON reviews FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own reviews"
    ON reviews FOR DELETE
    USING (user_id = auth.uid());

CREATE POLICY "Public can read blogs"
    ON blog_posts FOR SELECT
    USING (true);

CREATE POLICY "Users can read their own notifications"
    ON notifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can read their own profile"
    ON users FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (id = auth.uid());

-- ── Trigger: auto-recalculate business rating on review insert/update/delete ──

CREATE OR REPLACE FUNCTION recalc_business_rating()
RETURNS TRIGGER AS $$
DECLARE
    biz_id UUID;
BEGIN
    biz_id := COALESCE(NEW.business_id, OLD.business_id);
    UPDATE businesses
    SET rating = COALESCE((
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM reviews WHERE business_id = biz_id
    ), 0),
    review_count = (
        SELECT COUNT(*) FROM reviews WHERE business_id = biz_id
    )
    WHERE id = biz_id;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_review_rating
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION recalc_business_rating();
