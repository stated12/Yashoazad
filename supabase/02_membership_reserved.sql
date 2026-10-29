-- RESERVED FOR THE RAZORPAY PHASE. Do not run yet.
-- Entitlement tables for exclusive articles, subscriptions and paid programmes.

create table if not exists members (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid unique references auth.users(id) on delete cascade,
  email      text not null unique,
  plan       text,                                 -- e.g. monthly, annual
  status     text not null default 'inactive' check (status in ('inactive','active','expired','cancelled','complimentary')),
  starts_at  timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id                   uuid primary key default gen_random_uuid(),
  member_id            uuid references members(id),
  purpose              text not null,              -- subscription, masterclass, consultation
  amount_paise         integer not null check (amount_paise > 0),
  razorpay_order_id    text unique,
  razorpay_payment_id  text unique,
  status               text not null default 'created' check (status in ('created','paid','failed','refunded')),
  created_at           timestamptz not null default now()
);

alter table members  enable row level security;
alter table payments enable row level security;
