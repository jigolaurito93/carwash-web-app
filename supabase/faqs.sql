-- Feature patch for an existing database. New projects should run schema.sql instead.
-- Feature patch for an existing database. New projects: run schema.sql instead.
-- FAQ CMS: table + RLS
-- Run once in the Supabase SQL editor (or re-run; policies are replaced).

create table if not exists public.faqs (
  id bigint generated always as identity primary key,
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists faqs_sort_order_idx
  on public.faqs (sort_order, id);

alter table public.faqs enable row level security;

drop policy if exists "Public can view active faqs" on public.faqs;
create policy "Public can view active faqs"
  on public.faqs
  for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Authenticated can view all faqs" on public.faqs;
create policy "Authenticated can view all faqs"
  on public.faqs
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can insert faqs" on public.faqs;
create policy "Authenticated can insert faqs"
  on public.faqs
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update faqs" on public.faqs;
create policy "Authenticated can update faqs"
  on public.faqs
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete faqs" on public.faqs;
create policy "Authenticated can delete faqs"
  on public.faqs
  for delete
  to authenticated
  using (true);

grant select on table public.faqs to anon, authenticated;
grant insert, update, delete on table public.faqs to authenticated;

insert into public.faqs (question, answer, sort_order, is_active)
select *
from (
  values
    (
      'Do I need an appointment?',
      'Walk-ins are welcome, but we recommend scheduling an appointment to ensure minimal wait times and guaranteed availability.',
      1,
      true
    ),
    (
      'How long does a typical wash take?',
      'Most hand washes take between 20–40 minutes depending on the service level and current queue.',
      2,
      true
    ),
    (
      'What makes a hand wash better than an automatic wash?',
      'Hand washing is gentler on your paint, reduces the risk of scratches from hard brushes, and allows us to focus on details machines often miss.',
      3,
      true
    ),
    (
      'Do you offer interior detailing?',
      'Yes, we offer a range of interior services including vacuuming, interior wipe-down, and deep detailing packages.',
      4,
      true
    )
) as seed(question, answer, sort_order, is_active)
where not exists (select 1 from public.faqs);
