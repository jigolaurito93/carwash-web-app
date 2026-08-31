-- Rename live catalog tables to standard names.
-- The leftover `categories` table (used by services_packages) is moved aside first.
-- Run against the linked project: pnpm exec supabase db query --linked -f supabase/rename-catalog.sql

alter table public.categories rename to categories_legacy;

do $$
begin
  if exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'categories_pkey'
  ) then
    alter index public.categories_pkey rename to categories_legacy_pkey;
  end if;
end $$;

alter table public.categories1 rename to categories;
alter table public.services1 rename to services;

do $$
begin
  if exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'categories1_pkey'
  ) and not exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'categories_pkey'
  ) then
    alter index public.categories1_pkey rename to categories_pkey;
  end if;

  if exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'categories1_slug_key'
  ) and not exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'categories_slug_key'
  ) then
    alter index public.categories1_slug_key rename to categories_slug_key;
  end if;

  if exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'services1_pkey'
  ) and not exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'services_pkey'
  ) then
    alter index public.services1_pkey rename to services_pkey;
  end if;
end $$;

alter table public.services
  rename constraint services1_category_id_fkey to services_category_id_fkey;

notify pgrst, 'reload schema';
