-- Author Publishing System. Run once in the Supabase SQL editor, AFTER 01_schema.sql.
-- Safe to run more than once. Existing articles are untouched (they stay English-only).
-- Row Level Security stays ON with no public policies: only the server (service role) touches the table.

-- Hindi version + SEO + featured image
alter table articles add column if not exists title_hi            text;
alter table articles add column if not exists summary_hi          text;
alter table articles add column if not exists body_hi             text;
alter table articles add column if not exists seo_title           text;
alter table articles add column if not exists seo_description     text;
alter table articles add column if not exists seo_title_hi        text;
alter table articles add column if not exists seo_description_hi  text;
alter table articles add column if not exists featured_image_url  text;
alter table articles add column if not exists featured_image_alt  text;
alter table articles add column if not exists updated_at          timestamptz not null default now();

-- English no longer has to exist (a Hindi-only article is allowed)
alter table articles alter column title   drop not null;
alter table articles alter column summary drop not null;
alter table articles alter column body    drop not null;

-- A published article must have at least one language with a title and a body
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'articles_published_has_content') then
    alter table articles add constraint articles_published_has_content check (
      status <> 'published'
      or (nullif(btrim(coalesce(title,'')),'') is not null and nullif(btrim(coalesce(body,'')),'') is not null)
      or (nullif(btrim(coalesce(title_hi,'')),'') is not null and nullif(btrim(coalesce(body_hi,'')),'') is not null)
    );
  end if;
end $$;

-- Public bucket for article photos and short videos. Visitors can read files by URL;
-- nobody can upload except through the server (signed upload links given to the signed-in author).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('article-media', 'article-media', true, 52428800,
        array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
