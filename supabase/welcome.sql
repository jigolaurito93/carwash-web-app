-- Feature patch for an existing database. New projects should run schema.sql instead.
-- Feature patch for an existing database. New projects: run schema.sql instead.
-- Homepage Welcome CMS: singleton row + RLS
-- Run once in the Supabase SQL editor (or re-run; policies are replaced).

create table if not exists public.welcome_content (
  id bigint primary key default 1 check (id = 1),
  headline text not null,
  tagline text not null,
  intro text not null,
  subheading text not null,
  body_paragraphs text[] not null,
  cta_label text not null,
  cta_href text not null,
  image_path text not null,
  image_alt text not null,
  updated_at timestamptz not null default now(),
  constraint welcome_content_body_len check (cardinality(body_paragraphs) >= 1)
);

alter table public.welcome_content drop constraint if exists welcome_content_body_len;
alter table public.welcome_content
  add constraint welcome_content_body_len check (cardinality(body_paragraphs) >= 1);

alter table public.welcome_content enable row level security;

drop policy if exists "Public can view welcome content" on public.welcome_content;
create policy "Public can view welcome content"
  on public.welcome_content
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated can update welcome content" on public.welcome_content;
create policy "Authenticated can update welcome content"
  on public.welcome_content
  for update
  to authenticated
  using (true)
  with check (true);

grant select on table public.welcome_content to anon, authenticated;
grant update on table public.welcome_content to authenticated;

insert into public.welcome_content (
  id,
  headline,
  tagline,
  intro,
  subheading,
  body_paragraphs,
  cta_label,
  cta_href,
  image_path,
  image_alt
)
select
  1,
  'The Full Onyx Experience',
  'More Than Just a Wash. It''s a Restoration of Pride.',
  $intro$Discover why Onyx is the city's premier destination for 100% hand-car wash excellence. We don't just clean vehicles; we curate an experience designed around your lifestyle and your car's longevity.$intro$,
  'Uncompromising Care for Your Vehicle',
  array[
    $p1$Our signature process utilizes the finest equipment and ultra-premium, soft-touch materials—ensuring a showroom shine without the harsh friction of automated systems.$p1$,
    $p2$From high-gloss finishes to meticulous wheel detailing, our specialists treat every curve of your vehicle with the precision it deserves.$p2$
  ],
  'More About Onyx',
  '/about',
  '/images/carwash-2.jpg',
  'Photo of car'
where not exists (select 1 from public.welcome_content where id = 1);
