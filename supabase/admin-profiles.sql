-- Feature patch for an existing database. New projects should run schema.sql instead.
-- Feature patch for an existing database. New projects: run schema.sql instead.
-- Admin staff profiles: table + RLS
-- Run once in the Supabase SQL editor (or re-run; policies are replaced).

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  phone text not null,
  job_title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_profiles
  add column if not exists role text;

-- Existing rows were created before roles existed; treat them as masters.
update public.admin_profiles
set role = 'master'
where role is null;

alter table public.admin_profiles
  alter column role set default 'admin';

alter table public.admin_profiles
  alter column role set not null;

alter table public.admin_profiles
  drop constraint if exists admin_profiles_role_check;

alter table public.admin_profiles
  add constraint admin_profiles_role_check
  check (role in ('admin', 'master'));

create or replace function public.set_admin_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists admin_profiles_set_updated_at on public.admin_profiles;
create trigger admin_profiles_set_updated_at
  before update on public.admin_profiles
  for each row
  execute function public.set_admin_profiles_updated_at();

-- Users cannot promote themselves. First profile becomes master; later
-- inserts default to admin. Only the service role can change role.
create or replace function public.admin_profiles_protect_role()
returns trigger
language plpgsql
as $$
begin
  if auth.role() is distinct from 'authenticated' then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if exists (
      select 1 from public.admin_profiles where role = 'master'
    ) then
      new.role := 'admin';
    else
      new.role := 'master';
    end if;
  elsif tg_op = 'UPDATE' then
    new.role := old.role;
  end if;

  return new;
end;
$$;

drop trigger if exists admin_profiles_protect_role on public.admin_profiles;
create trigger admin_profiles_protect_role
  before insert or update on public.admin_profiles
  for each row
  execute function public.admin_profiles_protect_role();

alter table public.admin_profiles enable row level security;

drop policy if exists "Admins can view own profile" on public.admin_profiles;
create policy "Admins can view own profile"
  on public.admin_profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Admins can insert own profile" on public.admin_profiles;
create policy "Admins can insert own profile"
  on public.admin_profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Admins can update own profile" on public.admin_profiles;
create policy "Admins can update own profile"
  on public.admin_profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

grant select, insert, update on table public.admin_profiles to authenticated;
