-- ============================================================
-- Humble Halal – Initial Schema Migration
-- Project: pbnpuhxihoqrsctvnkte
-- ============================================================

-- Enable UUID extension (usually enabled by default on Supabase)
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

create type user_role as enum ('user', 'business_owner', 'admin');
create type subscription_plan as enum ('free', 'premium', 'corporate');
create type subscription_status as enum ('active', 'cancelled', 'expired');
create type submission_status as enum ('Approved', 'Pending Review', 'Rejected');
create type notification_type as enum ('info', 'success', 'warning');
create type price_range as enum ('$', '$$', '$$$');

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================

create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  name          text not null,
  avatar        text,
  role          user_role not null default 'user',
  phone         text,
  subscription  subscription_plan not null default 'free',
  subscription_status subscription_status,
  subscription_expiry timestamptz,
  created_at    timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- BUSINESSES
-- ============================================================

create table if not exists public.businesses (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  category        text not null,
  address         text not null,
  region          text not null,
  rating          numeric(3,1) not null default 0,
  review_count    integer not null default 0,
  image_url       text not null default '',
  description     text,
  opening_hours   text,
  phone           text,
  website         text,
  email           text,
  is_verified     boolean not null default false,
  is_featured     boolean not null default false,
  status          submission_status not null default 'Pending Review',
  owner_id        uuid references public.profiles(id) on delete set null,
  lat             double precision,
  lng             double precision,
  tags            text[] not null default '{}',
  price_range     price_range,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- EVENTS
-- ============================================================

create table if not exists public.events (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  type        text not null,
  date        text not null,
  time        text not null,
  location    text not null,
  image_url   text not null default '',
  description text not null,
  is_free     boolean not null default true,
  price       numeric(10,2),
  organizer   text,
  owner_id    uuid references public.profiles(id) on delete set null,
  status      submission_status not null default 'Pending Review',
  lat         double precision,
  lng         double precision,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- REVIEWS
-- ============================================================

create table if not exists public.reviews (
  id              uuid primary key default uuid_generate_v4(),
  business_id     uuid not null references public.businesses(id) on delete cascade,
  user_id         uuid references public.profiles(id) on delete set null,
  user_name       text not null,
  user_avatar     text,
  rating          integer not null check (rating between 1 and 5),
  comment         text not null,
  title           text,
  vibe_tags       text[] not null default '{}',
  helpful         integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Auto-update business rating and review_count when reviews change
create or replace function public.update_business_rating()
returns trigger as $$
declare
  avg_rating  numeric(3,1);
  total_count integer;
  target_id   uuid;
begin
  target_id := coalesce(new.business_id, old.business_id);

  select
    round(avg(rating)::numeric, 1),
    count(*)
  into avg_rating, total_count
  from public.reviews
  where business_id = target_id;

  update public.businesses
  set
    rating       = coalesce(avg_rating, 0),
    review_count = coalesce(total_count, 0),
    updated_at   = now()
  where id = target_id;

  return coalesce(new, old);
end;
$$ language plpgsql security definer;

drop trigger if exists on_review_change on public.reviews;
create trigger on_review_change
  after insert or update or delete on public.reviews
  for each row execute procedure public.update_business_rating();

-- ============================================================
-- BOOKMARKS (many-to-many: profiles <-> businesses)
-- ============================================================

create table if not exists public.bookmarks (
  user_id     uuid not null references public.profiles(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, business_id)
);

-- ============================================================
-- BLOG POSTS
-- ============================================================

create table if not exists public.blog_posts (
  id        uuid primary key default uuid_generate_v4(),
  title     text not null,
  category  text not null,
  author    text not null,
  image     text not null default '',
  excerpt   text not null,
  content   text,
  tags      text[] not null default '{}',
  published_at timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

create table if not exists public.notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  message     text not null,
  type        notification_type not null default 'info',
  read        boolean not null default false,
  link        text,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- updated_at auto-trigger helper
-- ============================================================

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_businesses_updated_at
  before update on public.businesses
  for each row execute procedure public.set_updated_at();

create trigger set_events_updated_at
  before update on public.events
  for each row execute procedure public.set_updated_at();

create trigger set_reviews_updated_at
  before update on public.reviews
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_businesses_category   on public.businesses(category);
create index if not exists idx_businesses_region     on public.businesses(region);
create index if not exists idx_businesses_status     on public.businesses(status);
create index if not exists idx_businesses_owner_id   on public.businesses(owner_id);
create index if not exists idx_businesses_is_featured on public.businesses(is_featured);
create index if not exists idx_businesses_rating     on public.businesses(rating desc);

create index if not exists idx_events_type      on public.events(type);
create index if not exists idx_events_status    on public.events(status);
create index if not exists idx_events_owner_id  on public.events(owner_id);

create index if not exists idx_reviews_business_id on public.reviews(business_id);
create index if not exists idx_reviews_user_id     on public.reviews(user_id);

create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_notifications_read    on public.notifications(user_id, read);

create index if not exists idx_bookmarks_user_id on public.bookmarks(user_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.events enable row level security;
alter table public.reviews enable row level security;
alter table public.bookmarks enable row level security;
alter table public.blog_posts enable row level security;
alter table public.notifications enable row level security;

-- PROFILES
create policy "Users can view any profile"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- BUSINESSES
create policy "Anyone can view approved businesses"
  on public.businesses for select
  using (status = 'Approved' or auth.uid() = owner_id);

create policy "Admins can view all businesses"
  on public.businesses for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Authenticated users can submit businesses"
  on public.businesses for insert
  with check (auth.uid() is not null);

create policy "Owners and admins can update businesses"
  on public.businesses for update
  using (
    auth.uid() = owner_id or
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete businesses"
  on public.businesses for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- EVENTS
create policy "Anyone can view approved events"
  on public.events for select
  using (status = 'Approved' or auth.uid() = owner_id);

create policy "Authenticated users can submit events"
  on public.events for insert
  with check (auth.uid() is not null);

create policy "Owners and admins can update events"
  on public.events for update
  using (
    auth.uid() = owner_id or
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- REVIEWS
create policy "Anyone can read reviews"
  on public.reviews for select using (true);

create policy "Authenticated users can post reviews"
  on public.reviews for insert
  with check (auth.uid() is not null);

create policy "Users can update own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

create policy "Users and admins can delete reviews"
  on public.reviews for delete
  using (
    auth.uid() = user_id or
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- BOOKMARKS
create policy "Users can manage own bookmarks"
  on public.bookmarks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- BLOG POSTS
create policy "Anyone can read blog posts"
  on public.blog_posts for select using (true);

create policy "Admins can manage blog posts"
  on public.blog_posts for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- NOTIFICATIONS
create policy "Users can manage own notifications"
  on public.notifications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
