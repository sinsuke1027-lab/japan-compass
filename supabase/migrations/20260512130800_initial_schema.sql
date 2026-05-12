-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- ============================================================
-- categories
-- ============================================================
create table categories (
  id          uuid primary key default uuid_generate_v4(),
  slug        text not null unique,
  name_ja     text not null,
  name_en     text not null,
  icon        text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table categories enable row level security;
create policy "categories_public_read" on categories for select using (true);

-- ============================================================
-- manners
-- ============================================================
create table manners (
  id           uuid primary key default uuid_generate_v4(),
  category_id  uuid not null references categories(id) on delete restrict,
  title_ja     text not null,
  title_en     text not null,
  body_ja      text not null,
  body_en      text not null,
  severity     text not null check (severity in ('must', 'should', 'nice')),
  sort_order   int  not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index manners_category_id_idx on manners(category_id);

alter table manners enable row level security;
create policy "manners_public_read" on manners for select using (true);

-- ============================================================
-- shrine_steps
-- ============================================================
create table shrine_steps (
  id          uuid primary key default uuid_generate_v4(),
  step_number int  not null unique,
  title_ja    text not null,
  title_en    text not null,
  body_ja     text not null,
  body_en     text not null,
  image_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table shrine_steps enable row level security;
create policy "shrine_steps_public_read" on shrine_steps for select using (true);

-- ============================================================
-- phrase_categories
-- ============================================================
create table phrase_categories (
  id          uuid primary key default uuid_generate_v4(),
  slug        text not null unique,
  name_ja     text not null,
  name_en     text not null,
  icon        text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table phrase_categories enable row level security;
create policy "phrase_categories_public_read" on phrase_categories for select using (true);

-- ============================================================
-- phrases
-- ============================================================
create table phrases (
  id                  uuid primary key default uuid_generate_v4(),
  phrase_category_id  uuid not null references phrase_categories(id) on delete restrict,
  japanese            text not null,
  reading             text not null,
  english             text not null,
  audio_url           text,
  sort_order          int  not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index phrases_phrase_category_id_idx on phrases(phrase_category_id);

alter table phrases enable row level security;
create policy "phrases_public_read" on phrases for select using (true);

-- ============================================================
-- sustainable_spots
-- ============================================================
create table sustainable_spots (
  id           uuid primary key default uuid_generate_v4(),
  category_id  uuid not null references categories(id) on delete restrict,
  name_ja      text not null,
  name_en      text not null,
  description_ja text,
  description_en text,
  location     geography(point, 4326) not null,
  address_ja   text,
  address_en   text,
  tags         text[] not null default '{}',
  image_url    text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index sustainable_spots_location_idx on sustainable_spots using gist(location);
create index sustainable_spots_category_id_idx on sustainable_spots(category_id);

alter table sustainable_spots enable row level security;
create policy "sustainable_spots_public_read" on sustainable_spots for select using (true);

-- ============================================================
-- journal_entries
-- ============================================================
create table journal_entries (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  spot_id     uuid references sustainable_spots(id) on delete set null,
  title       text not null,
  body        text,
  image_urls  text[] not null default '{}',
  visited_at  date not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index journal_entries_user_id_idx on journal_entries(user_id);
create index journal_entries_visited_at_idx on journal_entries(visited_at desc);

alter table journal_entries enable row level security;

create policy "journal_owner_select" on journal_entries
  for select using (auth.uid() = user_id);

create policy "journal_owner_insert" on journal_entries
  for insert with check (auth.uid() = user_id);

create policy "journal_owner_update" on journal_entries
  for update using (auth.uid() = user_id);

create policy "journal_owner_delete" on journal_entries
  for delete using (auth.uid() = user_id);

-- ============================================================
-- RPC: spots_within_radius
-- Returns sustainable spots within <radius_km> of a lat/lng point.
-- ============================================================
create or replace function spots_within_radius(
  lat        double precision,
  lng        double precision,
  radius_km  double precision default 5.0
)
returns setof sustainable_spots
language sql
stable
as $$
  select *
  from sustainable_spots
  where st_dwithin(
    location::geography,
    st_point(lng, lat)::geography,
    radius_km * 1000
  )
  order by st_distance(location::geography, st_point(lng, lat)::geography);
$$;

-- ============================================================
-- RPC: trip_summary
-- Returns aggregated stats for the calling user.
-- Uses SECURITY DEFINER so it can read journal_entries regardless of
-- RLS, but scopes the query to auth.uid() explicitly.
-- ============================================================
create or replace function trip_summary()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  result json;
begin
  select json_build_object(
    'total_entries',   count(*),
    'spots_visited',   count(distinct spot_id),
    'first_visit',     min(visited_at),
    'last_visit',      max(visited_at)
  )
  into result
  from journal_entries
  where user_id = auth.uid();

  return result;
end;
$$;
