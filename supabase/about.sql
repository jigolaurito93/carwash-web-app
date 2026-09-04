-- Feature patch for an existing database. New projects should run schema.sql instead.
-- Feature patch for an existing database. New projects: run schema.sql instead.
-- About page CMS: singleton row + RLS
-- Run once in the Supabase SQL editor (or re-run; policies are replaced).

create table if not exists public.about_content (
  id bigint primary key default 1 check (id = 1),
  owner_name text not null,
  story_paragraphs text[] not null,
  mission text not null,
  why_choose_us jsonb not null,
  updated_at timestamptz not null default now(),
  constraint about_content_story_len check (cardinality(story_paragraphs) >= 1),
  constraint about_content_why_len check (jsonb_array_length(why_choose_us) = 4)
);

alter table public.about_content drop constraint if exists about_content_story_len;
alter table public.about_content
  add constraint about_content_story_len check (cardinality(story_paragraphs) >= 1);

alter table public.about_content enable row level security;

drop policy if exists "Public can view about content" on public.about_content;
create policy "Public can view about content"
  on public.about_content
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated can update about content" on public.about_content;
create policy "Authenticated can update about content"
  on public.about_content
  for update
  to authenticated
  using (true)
  with check (true);

grant select on table public.about_content to anon, authenticated;
grant update on table public.about_content to authenticated;

insert into public.about_content (
  id,
  owner_name,
  story_paragraphs,
  mission,
  why_choose_us
)
select
  1,
  'Marcus Reynolds',
  array[
    $p1$Hi, my name is Marcus Reynolds, founder of Onyx Hand Premium Wash. For us, it's not just about washing cars — it's about providing a service you can trust every time you pull in.$p1$,
    $p2$I started Onyx Hand Premium Wash because I saw how many vehicles were being rushed through automated car washes that left scratches, swirl marks, and missed details. As someone who takes pride in a clean vehicle, I believed there should be a better option. That's why I built Onyx Hand Premium Wash around one simple idea: every car deserves careful, premium treatment.$p2$,
    $p3$Instead of conveyor belts and spinning brushes, every vehicle is washed by hand using safe techniques, professional-grade products, and soft microfiber materials that protect your paint while delivering a deep, spotless clean.$p3$
  ],
  $mission$Our mission is to deliver a premium hand wash experience that protects your vehicle while providing unmatched attention to detail. We focus on quality, consistency, and customer satisfaction every time.$mission$,
  $why$[
    {
      "title": "Hand Washed Only",
      "description": "Every vehicle is washed by hand to prevent scratches and ensure a deeper clean.",
      "icon": "hand"
    },
    {
      "title": "Attention to Detail",
      "description": "We clean areas many automated washes miss — wheels, trim, and finishing touches.",
      "icon": "search"
    },
    {
      "title": "Paint-Safe Products",
      "description": "We use high-quality soaps and microfiber materials designed to protect your vehicle's finish.",
      "icon": "shield"
    },
    {
      "title": "Customer First Service",
      "description": "Your satisfaction is our priority, and we take pride in every vehicle we wash.",
      "icon": "handshake"
    }
  ]$why$::jsonb
where not exists (select 1 from public.about_content where id = 1);
