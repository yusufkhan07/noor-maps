create table mosques (
  id        text primary key,
  title     text not null,
  address   text not null,
  latitude  double precision not null,
  longitude double precision not null,
  phone     text,
  email     text,
  website   text
);

create table mosque_timings (
  mosque_id  text primary key references mosques(id),
  fajr       text not null,
  dhuhr      text not null,
  asr        text not null,
  maghrib    text not null,
  isha       text not null,
  updated_at timestamptz not null default now(),
  schedule   jsonb not null default '[]'::jsonb
);
