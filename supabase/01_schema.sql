-- Run once in the Supabase SQL editor of the NEW project for this website.
-- Safe to run more than once. Row Level Security is ON with no public policies:
-- the tables are reachable only from the server using the service role key.

create extension if not exists pgcrypto;

create table if not exists articles (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  summary      text not null,
  body         text not null,                      -- Markdown
  topic        text,                               -- one of the six topics on the Insights page
  access       text not null default 'free' check (access in ('free','exclusive')),
  status       text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz not null default now(),
  created_at   timestamptz not null default now()
);
create index if not exists articles_pub_idx on articles (status, published_at desc);

create table if not exists media_items (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  kind         text not null default 'Interview',  -- Interview, Talk, Speech, Podcast, Video
  source       text,
  url          text,
  summary      text,
  status       text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at   timestamptz not null default now()
);

create table if not exists enquiries (
  id         uuid primary key default gen_random_uuid(),
  type       text not null,                        -- contact, speaking, consult, exclusive, learning, newsletter
  name       text,
  email      text,
  details    jsonb not null default '{}'::jsonb,
  status     text not null default 'new' check (status in ('new','in_progress','done','spam')),
  ip_hash    text,
  created_at timestamptz not null default now()
);
create index if not exists enquiries_type_idx on enquiries (type, created_at desc);
create index if not exists enquiries_ip_idx on enquiries (ip_hash, created_at);

alter table articles    enable row level security;
alter table media_items enable row level security;
alter table enquiries   enable row level security;
