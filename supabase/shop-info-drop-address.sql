-- Feature patch for an existing database. New projects should run schema.sql instead.
-- Drops the unused shop_info.address column. Keeps address1 and address2.

alter table public.shop_info
  drop column if exists address;
