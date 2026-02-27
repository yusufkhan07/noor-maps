create extension if not exists postgis;

-- Create Mosques Table
create table mosques (
  id       text primary key check (id not like '%/%'),
  title    text not null,
  address  text not null,
  location geography(Point, 4326) not null,
  phone    text,
  email    text,
  website  text,
  method   integer,
  school   integer check (school in (0, 1))
);

-- Create Index on Mosques
create index mosques_location_idx on mosques using gist (location);

-- function mosques_all
create or replace function mosques_all()
returns table (
  id        text,
  title     text,
  address   text,
  longitude float,
  latitude  float,
  phone     text,
  email     text,
  website   text,
  method    integer,
  school    integer
)
language sql stable as $$
  select
    id,
    title,
    address,
    ST_X(location::geometry) as longitude,
    ST_Y(location::geometry) as latitude,
    phone,
    email,
    website,
    method,
    school
  from mosques;
$$;

-- function mosque_by_id
create or replace function mosque_by_id(p_id text)
returns table (
  id        text,
  title     text,
  address   text,
  longitude float,
  latitude  float,
  phone     text,
  email     text,
  website   text,
  method    integer,
  school    integer
)
language sql stable as $$
  select
    id,
    title,
    address,
    ST_X(location::geometry) as longitude,
    ST_Y(location::geometry) as latitude,
    phone,
    email,
    website,
    method,
    school
  from mosques
  where mosques.id = p_id;
$$;

-- function mosques_within_radius
create or replace function mosques_within_radius(lat float, lng float, radius_meters float)
returns table (
  id        text,
  title     text,
  address   text,
  longitude float,
  latitude  float,
  phone     text,
  email     text,
  website   text,
  method    integer,
  school    integer
)
language sql stable as $$
  select
    id,
    title,
    address,
    ST_X(location::geometry) as longitude,
    ST_Y(location::geometry) as latitude,
    phone,
    email,
    website,
    method,
    school
  from mosques
  where ST_DWithin(location, ST_Point(lng, lat)::geography, radius_meters);
$$;

-- Create Table Mosque Timings
create table mosque_timings (
  mosque_id  text primary key references mosques(id),
  fajr       text,
  dhuhr      text,
  asr        text,
  maghrib    text,
  isha       text,
  updated_at timestamptz not null default now(),
  schedule   jsonb not null default '[]'::jsonb
);
