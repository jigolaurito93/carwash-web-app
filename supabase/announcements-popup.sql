-- Feature patch for an existing database. New projects should run schema.sql instead.
-- Popup / promo / closure announcements: extra columns + live-window RLS.
-- Run once in the Supabase SQL editor (or re-run; policies are replaced).

alter table public.site_announcements
  add column if not exists title text,
  add column if not exists kind text,
  add column if not exists show_in_banner boolean,
  add column if not exists show_as_modal boolean,
  add column if not exists starts_at timestamptz,
  add column if not exists expires_at timestamptz,
  add column if not exists closes_on date;

update public.site_announcements
set
  kind = coalesce(kind, 'notice'),
  show_in_banner = coalesce(show_in_banner, true),
  show_as_modal = coalesce(show_as_modal, false)
where kind is null
   or show_in_banner is null
   or show_as_modal is null;

alter table public.site_announcements
  alter column kind set default 'notice',
  alter column kind set not null,
  alter column show_in_banner set default true,
  alter column show_in_banner set not null,
  alter column show_as_modal set default false,
  alter column show_as_modal set not null;

alter table public.site_announcements
  drop constraint if exists site_announcements_kind_check;
alter table public.site_announcements
  add constraint site_announcements_kind_check
  check (kind in ('notice', 'promo', 'closure'));

drop policy if exists "Public can view active announcements" on public.site_announcements;
create policy "Public can view active announcements"
  on public.site_announcements
  for select
  to anon, authenticated
  using (
    is_active = true
    and (starts_at is null or starts_at <= now())
    and (expires_at is null or expires_at > now())
  );
