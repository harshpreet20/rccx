-- Tournament configs
create table if not exists rcc_tournament_configs (
  id uuid primary key default gen_random_uuid(),
  config_name text unique not null,
  config jsonb not null,
  updated_at timestamptz default now()
);
alter table rcc_tournament_configs enable row level security;
create policy "Public read tournament config" on rcc_tournament_configs for select using (true);
create policy "Authenticated upsert tournament config" on rcc_tournament_configs for all using (auth.uid() is not null);

-- Organizers (admin role check)
create table if not exists rcc_organizers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id),
  name text not null,
  created_at timestamptz default now()
);
alter table rcc_organizers enable row level security;
create policy "Organizers can read own row" on rcc_organizers for select using (auth.uid() = user_id);

-- Forms
create table if not exists rcc_forms (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  fields jsonb not null default '[]',
  active boolean default true,
  created_at timestamptz default now()
);
alter table rcc_forms enable row level security;
create policy "Public read active forms" on rcc_forms for select using (active = true);
create policy "Authenticated manage forms" on rcc_forms for all using (auth.uid() is not null);

-- Instagram posts (manual fallback when API is unconfigured)
create table if not exists instagram_posts (
  id uuid primary key default gen_random_uuid(),
  caption text not null default '',
  image_url text not null,
  post_url text not null default 'https://www.instagram.com/racquetsclubcommunity/',
  likes integer not null default 0,
  posted_at timestamptz not null default now(),
  created_at timestamptz default now()
);
alter table instagram_posts enable row level security;
create policy "Public read instagram posts" on instagram_posts for select using (true);
create policy "Authenticated manage instagram posts" on instagram_posts for all using (auth.uid() is not null);

-- Site settings (for Instagram token, etc stored via admin panel)
create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text,
  updated_at timestamptz default now()
);
alter table site_settings enable row level security;
create policy "Public read site settings" on site_settings for select using (true);
create policy "Authenticated manage site settings" on site_settings for all using (auth.uid() is not null);

-- Form responses
create table if not exists rcc_form_responses (
  id uuid primary key default gen_random_uuid(),
  form_id uuid references rcc_forms(id) on delete cascade,
  data jsonb not null,
  submitted_at timestamptz default now()
);
alter table rcc_form_responses enable row level security;
create policy "Public insert responses" on rcc_form_responses for insert with check (true);
create policy "Authenticated read responses" on rcc_form_responses for select using (auth.uid() is not null);
