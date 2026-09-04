-- Feature patch for an existing database. New projects should run schema.sql instead.
-- Feature patch for an existing database. New projects: run schema.sql instead.
-- Gallery CMS: table, public storage bucket, RLS
-- Run once in the Supabase SQL editor (or re-run; policies are replaced).

create table if not exists public.gallery_images (
  id bigint generated always as identity primary key,
  storage_path text not null unique,
  image_url text not null,
  caption text,
  alt_text text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists gallery_images_sort_order_idx
  on public.gallery_images (sort_order, id);

alter table public.gallery_images enable row level security;

drop policy if exists "Public can view active gallery images" on public.gallery_images;
create policy "Public can view active gallery images"
  on public.gallery_images
  for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Authenticated can view all gallery images" on public.gallery_images;
create policy "Authenticated can view all gallery images"
  on public.gallery_images
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can insert gallery images" on public.gallery_images;
create policy "Authenticated can insert gallery images"
  on public.gallery_images
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update gallery images" on public.gallery_images;
create policy "Authenticated can update gallery images"
  on public.gallery_images
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete gallery images" on public.gallery_images;
create policy "Authenticated can delete gallery images"
  on public.gallery_images
  for delete
  to authenticated
  using (true);

grant select on table public.gallery_images to anon, authenticated;
grant insert, update, delete on table public.gallery_images to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery',
  'gallery',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public buckets serve files by URL without a SELECT policy.
-- A SELECT policy on storage.objects lets anyone list every file in the bucket.
drop policy if exists "Public can view gallery files" on storage.objects;

drop policy if exists "Authenticated can upload gallery files" on storage.objects;
create policy "Authenticated can upload gallery files"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'gallery');

drop policy if exists "Authenticated can update gallery files" on storage.objects;
create policy "Authenticated can update gallery files"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'gallery')
  with check (bucket_id = 'gallery');

drop policy if exists "Authenticated can delete gallery files" on storage.objects;
create policy "Authenticated can delete gallery files"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'gallery');
