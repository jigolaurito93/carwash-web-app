> **Archived September 3, 2026.** This was the v1 “sellable product” plan (last updated August 29, 2026). Phases 1–2 are largely shipped. Current work lives in [`plan.md`](../../plan.md).

# Onyx Premium Carwash — Implementation Plan

**Last updated:** August 29, 2026  
**Source:** `ToDo.txt`  
**Goal:** Turn the project from a strong demo into a sellable website + CMS product for local car wash businesses.

---

## Overview

Onyx Premium Carwash is a Next.js 16 marketing site with a Supabase-backed admin panel. The public site and services CMS are largely complete. The remaining work focuses on:

1. Removing hardcoded business data
2. Finishing CMS features (gallery, hours, FAQ, about)
3. Delivering appointments/booking
4. Cleaning up technical debt
5. Packaging for deployment and client handoff

---

## Current State

### Working today

| Area                               | Status                                  | Key files                                                 |
| ---------------------------------- | --------------------------------------- | --------------------------------------------------------- |
| Public pages                       | Home, About, Services, Gallery, Contact | `app/page.tsx`, `app/services/page.tsx`, etc.             |
| Services CMS                       | Categories + 4 card layouts             | `app/(admin-protected)/admin/services1/`, `categories1/`  |
| Shop info (partial)                | Address, phone, social in DB            | `app/(admin-protected)/admin/shop-info/`                  |
| Contact form                       | Zod + Resend email                      | `components/ContactForm.tsx`, `app/api/contact/route.ts`  |
| Admin auth                         | Login + route protection                | `app/admin/login/page.tsx`, `proxy.ts`                    |
| Dynamic hours/contact (some pages) | From Supabase                           | `components/ShopInfoSection.tsx`, `components/Footer.tsx` |

### Not working / incomplete

| Area                | Issue                                                              |
| ------------------- | ------------------------------------------------------------------ |
| Contact page        | Hardcoded phone/email; `ShopInfoSection2` has static hours/address |
| Google Map          | Hardcoded Chicago coordinates and placeholder address              |
| Footer social links | Hardcoded `instagram.com` / `facebook.com`                         |
| Gallery             | Public page uses hardcoded array; admin page is empty              |
| Shop hours          | Displayed on some pages but no admin editor                        |
| Appointments        | Code commented out; dashboard shows placeholder data               |
| Legal pages         | `/privacy` and `/terms` linked in footer but missing               |
| Admin nav           | Duplicate/confusing links; no mobile sidebar                       |
| Deployment docs     | README outdated; no `.env.example` or schema SQL in repo           |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PUBLIC SITE (Next.js)                     │
│  Home │ Services │ Gallery │ Contact │ About                  │
└──────────────────────────┬──────────────────────────────────┘
                           │ reads / writes
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE (Postgres + Auth)               │
│  shop_info │ shop_hours │ services1 │ categories1           │
│  gallery_images │ site_announcements │ appointment (TBD)    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE STORAGE (gallery bucket)              │
│  Uploaded images → public URL → gallery_images.image_url    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    ADMIN PANEL (/admin/*)                   │
│  Dashboard │ Services │ Gallery │ Appointments │ Shop Info    │
└─────────────────────────────────────────────────────────────┘
```

**External services:** Resend (contact email), Google Maps API (map embed)

---

## Phase 1 — Get Ready to Sell

> **Target:** A business owner can run the site without touching code.  
> **Estimated effort:** 2–4 weeks

### 1.1 Fix hardcoded business data

**Priority:** High  
**Depends on:** `shop_info` table (already exists)

| Task                                                                                                      | Files to change                                           |
| --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Pull phone + email on contact hero CTAs                                                                   | `app/contact/page.tsx`                                    |
| Replace static `ShopInfoSection2` with DB-driven component (reuse `ShopInfoSection` or fetch server-side) | `components/ShopInfoSection2.tsx`, `app/contact/page.tsx` |
| Wire map to `shop_info` address + lat/lng                                                                 | `components/GoogleMapShop.tsx`                            |
| Add `latitude` / `longitude` columns to `shop_info` if missing                                            | Supabase migration                                        |
| Link footer social icons to DB                                                                            | `components/Footer.tsx`                                   |

**Acceptance criteria:**

- [ ] Changing phone/email in admin updates contact page, footer, and `tel:` / `mailto:` links
- [ ] Map pin and "Get Directions" use real shop address
- [ ] Footer Instagram/Facebook use values from `shop_info`

---

### 1.2 Shop hours editor (admin)

**Priority:** High  
**Depends on:** `shop_hours` table (already exists)

| Task              | Details                                                                          |
| ----------------- | -------------------------------------------------------------------------------- |
| Create admin page | `app/(admin-protected)/admin/shop-hours/page.tsx` (or section on shop-info page) |
| Build form        | One row per day: open time, close time, closed toggle                            |
| Server action     | Update `shop_hours` rows; `revalidatePath` for home, footer, contact             |
| Add nav link      | `app/(admin-protected)/admin/layout.tsx`                                         |

**Acceptance criteria:**

- [ ] Owner can edit hours without code changes
- [ ] Home, footer, and contact reflect updated hours after save

---

### 1.3 Gallery CMS

**Priority:** High  
**Depends on:** Supabase Storage + `gallery_images` table

| Step              | Work                                                                                    |
| ----------------- | --------------------------------------------------------------------------------------- |
| 1. Supabase setup | Create `gallery` bucket (public read); RLS: authenticated write                         |
| 2. Schema         | Confirm `gallery_images` has `image_url`, `caption`, `sort_order`                       |
| 3. Admin UI       | Upload, edit caption, reorder, delete in `app/(admin-protected)/admin/gallery/page.tsx` |
| 4. Public page    | Replace hardcoded array in `app/gallery/page.tsx` with Supabase fetch                   |
| 5. Types          | Update `lib/database.types.ts`                                                          |

**Image strategy:**

- Keep logo/SVG in `public/images/`
- Store gallery photos in Supabase Storage
- Pexels images OK for demo; replace with client photos at handoff

**Acceptance criteria:**

- [ ] Admin can upload and manage gallery images
- [ ] Public gallery reads from database
- [ ] Lightbox still works

---

### 1.4 Clean up codebase

**Priority:** Medium  
**Depends on:** Nothing

| Task                      | Action                                                                   |
| ------------------------- | ------------------------------------------------------------------------ |
| Remove test routes        | Delete or redirect: `services1test`, `all-services-test`, `all-services` |
| Remove dead services code | Audit `data/services.ts`, old `admin/services/`, commented actions       |
| Simplify admin nav        | Group: Dashboard, Appointments, Services, Gallery, Shop Info, Account    |
| Rename confusing labels   | "Edit Services" / "Display Services" → single "Services" entry           |

**Acceptance criteria:**

- [ ] No test routes accessible in production admin
- [ ] Admin sidebar has clear, non-duplicate links
- [ ] `categories1` + `services1` is the only services data model in use

---

### 1.5 Missing legal pages

**Priority:** Medium  
**Depends on:** Nothing

| Task            | Files                                                             |
| --------------- | ----------------------------------------------------------------- |
| Privacy page    | `app/privacy/page.tsx`                                            |
| Terms page      | `app/terms/page.tsx`                                              |
| Contact consent | `components/ContactForm.tsx`, `lib/validations/contact-schema.ts` |

**Acceptance criteria:**

- [ ] `/privacy` and `/terms` no longer 404
- [ ] Contact form requires consent checkbox with link to privacy policy

---

### 1.6 Deployment package

**Priority:** High (required before selling)  
**Depends on:** Phases 1.1–1.5 mostly complete

| Deliverable           | Description                                             |
| --------------------- | ------------------------------------------------------- |
| `.env.example`        | All required env vars with comments                     |
| `supabase/schema.sql` | Tables, RLS policies, seed data                         |
| `README.md`           | Install, env setup, create admin user, deploy to Vercel |
| Handoff checklist     | What the client needs to provide (photos, copy, domain) |

**Required env vars:**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
OWNER_EMAIL=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

**Acceptance criteria:**

- [ ] New developer can clone repo and run locally following README
- [ ] Supabase schema can be recreated from SQL file

---

### 1.7 Shop info polish

**Priority:** Low  
**Depends on:** 1.1

| Task                                 | File                                                                              |
| ------------------------------------ | --------------------------------------------------------------------------------- |
| Toast on successful save             | `app/(admin-protected)/admin/shop-info/page.tsx` (Sonner already in admin layout) |
| Fix page title                       | Change "Account Settings" → "Shop Info"                                           |
| Use server Supabase client in action | `app/(admin-protected)/admin/shop-info/actions.ts` → `lib/supabaseServer.ts`      |

---

## Phase 2 — Core Features

> **Target:** Deliver on "Schedule an Appointment" and full content management.  
> **Estimated effort:** 2–3 weeks

### 2.1 Appointments (admin)

**Priority:** High  
**Depends on:** `appointment` table in Supabase

| Task                               | Files                                                                                                                                             |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Uncomment/restore appointment CRUD | `app/(admin-protected)/admin/appointment/page.tsx`, `components/admin/AppointmentsClient.tsx`, `AppointmentFormModal.tsx`, `dashboard/actions.ts` |
| Wire dashboard stats               | `app/(admin-protected)/admin/dashboard/page.tsx`                                                                                                  |
| Phone formatting                   | Display `(123) 456-7890`, store `1234567890`                                                                                                      |
| Default status                     | `"scheduled"` when empty                                                                                                                          |

**Acceptance criteria:**

- [ ] Admin can create, view, edit, delete appointments
- [ ] Dashboard shows real appointment counts
- [ ] Appointments page is not empty

---

### 2.2 Customer booking (optional, high value)

**Priority:** Medium  
**Depends on:** 2.1

| Task                         | Details                                 |
| ---------------------------- | --------------------------------------- |
| Public booking page or modal | Name, phone, service, date/time         |
| API route or server action   | Insert into `appointment` table         |
| Email confirmation           | Resend to owner + customer              |
| Update hero CTA              | `components/Hero.tsx` → link to booking |

**Acceptance criteria:**

- [ ] Customer can request an appointment from the public site
- [ ] Owner receives email notification
- [ ] Appointment appears in admin panel

---

### 2.3 About page CMS

**Priority:** Medium  
**Depends on:** New `about_content` table or JSON column on `shop_info`

| Content to make editable | Current location                         |
| ------------------------ | ---------------------------------------- |
| Owner name               | `app/about/page.tsx` — "Marcus Reynolds" |
| Owner story              | Hardcoded paragraphs                     |
| Mission statement        | Hardcoded                                |
| Why choose us (4 blocks) | Hardcoded                                |

**Acceptance criteria:**

- [ ] Owner can edit about page copy from admin
- [ ] No code deploy needed to change business story

---

### 2.4 FAQ CMS

**Priority:** Medium  
**Depends on:** New `faqs` table

| Task                    | Files                                           |
| ----------------------- | ----------------------------------------------- |
| Create `faqs` table     | `question`, `answer`, `sort_order`, `is_active` |
| Admin CRUD page         | `app/(admin-protected)/admin/faq/page.tsx`      |
| Update public component | `components/FAQ.tsx` — fetch from DB            |

**Acceptance criteria:**

- [ ] FAQs editable in admin
- [ ] Contact page FAQ section uses database

---

### 2.5 Admin polish

**Priority:** Medium  
**Depends on:** Phase 1 cleanup

| Task                     | Details                                                                  |
| ------------------------ | ------------------------------------------------------------------------ |
| Mobile admin nav         | Hamburger menu or bottom nav for sidebar links                           |
| Profile page             | Restore commented code in `app/(admin-protected)/admin/profile/page.tsx` |
| Login page fixes         | Black navbar bg, error position, cursor-pointer on buttons               |
| Server client in actions | Audit all `"use server"` files for browser client usage                  |

---

## Phase 3 — Productize

> **Target:** Sell the same product to multiple car wash businesses.  
> **Estimated effort:** Ongoing

| #   | Feature            | Notes                                                     |
| --- | ------------------ | --------------------------------------------------------- |
| 13  | Branding config    | Business name, logo, tagline, colors in DB or config file |
| 14  | Image optimization | Cloudinary or Supabase image transforms for WebP/resizing |
| 15  | SEO                | Per-page metadata, OG images, `sitemap.xml`, `robots.txt` |
| 16  | Analytics          | Google Analytics or Plausible snippet                     |
| 17  | Error handling     | Contact form errors, consistent admin toasts              |
| 18  | Client handoff     | 5-min Loom walkthrough of admin panel                     |

---

## Quick Wins (anytime)

These are small tasks that can be done between larger features:

- [ ] Gallery page: add `pt-28` or margin-top so title clears fixed navbar
- [ ] Services page: add attention/specials section
- [ ] Homepage + contact: fix address/hours section positioning
- [ ] Seed a row in `site_announcements` for top banner (component already wired)
- [ ] ServiceModal: dynamic rows for add-on line items
- [ ] Dashboard: "Recently modified" list + quick category toggles

---

## Recommended Build Order

```
Week 1
├── 1.1 Fix hardcoded business data
├── 1.7 Shop info polish
└── 1.5 Privacy + Terms pages

Week 2
├── 1.2 Shop hours editor
└── 1.4 Codebase cleanup

Week 3
├── 1.3 Gallery CMS (Supabase Storage)
└── Quick wins (navbar spacing, social links)

Week 4
├── 1.6 Deployment package
└── 2.1 Appointments (admin)

Week 5+ (if selling booking)
├── 2.2 Customer booking
├── 2.4 FAQ CMS
└── 2.3 About page CMS
```

---

## Suggested Admin Nav (final state)

```
Onyx Admin
├── Dashboard
├── Appointments
├── Services          (categories1 + services1 — single entry)
├── Gallery
├── Shop Info         (address, phone, social)
├── Shop Hours        (or merged into Shop Info)
├── FAQ               (Phase 2)
├── About Content     (Phase 2)
└── Account Settings  (profile, password)

[Back to Site]  [Logout]
```

---

## Risk & Notes

| Risk                                | Mitigation                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------------- |
| `shop_info` missing lat/lng         | Add columns or geocode address on save                                          |
| Gallery upload size limits          | Validate file type/size; compress before upload                                 |
| Appointments code is stale          | Review commented code before uncommenting; test against current Supabase schema |
| Server actions using browser client | Switch to `createSupabaseServerClient()` for auth-aware updates                 |
| Pexels stock photos                 | Fine for demo; document sources; replace at client handoff                      |

---

## Definition of Done (v1 sellable product)

The project is ready to sell when:

- [ ] All business data (contact, hours, address, map, social) is editable in admin
- [ ] Gallery is CMS-managed via Supabase Storage
- [ ] Services, shop info, and hours work end-to-end
- [ ] Privacy and Terms pages exist
- [ ] `.env.example`, schema SQL, and README allow a clean setup
- [ ] No test routes or placeholder "John Doe" data in admin
- [ ] Appointments work in admin (booking optional but recommended)

---

## How to use this plan

1. Pick a phase and task (start with **1.1**)
2. Switch Cursor to **Agent mode** and say: _"Implement section 1.1 from plan.md"_
3. For large features (gallery, appointments), use **Plan mode** first to refine approach
4. Check off items in `ToDo.txt` as you complete them
5. Update this file when scope changes
