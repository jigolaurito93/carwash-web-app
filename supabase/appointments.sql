-- Feature patch for an existing database. New projects should run schema.sql instead.
-- Feature patch for an existing database. New projects: run schema.sql instead.
-- Appointments: extend existing table + authenticated-only RLS
-- Run once in the Supabase SQL editor (or re-run; policies are replaced).

create table if not exists public.appointment (
  id bigint generated always as identity primary key,
  customer_name text,
  phone_number text,
  service text not null,
  appointment_date timestamptz not null,
  notes text,
  status text not null default 'scheduled',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.appointment
  add column if not exists first_name text;

alter table public.appointment
  add column if not exists last_name text;

alter table public.appointment
  add column if not exists service_id bigint;

alter table public.appointment
  add column if not exists email text;

update public.appointment
set first_name = coalesce(
  nullif(trim(split_part(coalesce(customer_name, ''), ' ', 1)), ''),
  'Unknown'
)
where first_name is null or btrim(first_name) = '';

update public.appointment
set last_name = nullif(
  trim(substring(customer_name from position(' ' in customer_name) + 1)),
  ''
)
where last_name is null
  and customer_name is not null
  and position(' ' in btrim(customer_name)) > 0;

alter table public.appointment
  alter column first_name set not null;

alter table public.appointment
  alter column status set default 'scheduled';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'appointment_service_id_fkey'
  ) then
    alter table public.appointment
      add constraint appointment_service_id_fkey
      foreign key (service_id)
      references public.services (id)
      on delete set null;
  end if;
end $$;

create index if not exists appointment_appointment_date_idx
  on public.appointment (appointment_date);

create index if not exists appointment_status_date_idx
  on public.appointment (status, appointment_date);

alter table public.appointment enable row level security;

drop policy if exists "Authenticated can view appointments" on public.appointment;
create policy "Authenticated can view appointments"
  on public.appointment
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can insert appointments" on public.appointment;
create policy "Authenticated can insert appointments"
  on public.appointment
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update appointments" on public.appointment;
create policy "Authenticated can update appointments"
  on public.appointment
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete appointments" on public.appointment;
create policy "Authenticated can delete appointments"
  on public.appointment
  for delete
  to authenticated
  using (true);

revoke all on table public.appointment from anon;
grant select, insert, update, delete on table public.appointment to authenticated;
