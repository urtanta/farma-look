create table if not exists pharmacies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  phone text,
  city text not null,
  city_slug text not null,
  created_at timestamptz default now(),
  unique(name, address)
);

create table if not exists duty_shifts (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid references pharmacies(id) on delete cascade,
  city_slug text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  source text,
  scraped_at timestamptz default now()
);

create index if not exists idx_pharmacies_city_slug
on pharmacies(city_slug);

create index if not exists idx_duty_shifts_city_slug
on duty_shifts(city_slug);

create index if not exists idx_duty_shifts_starts_at
on duty_shifts(starts_at);
