# Onyx Premium Carwash — Plan (v2)

**Last updated:** September 3, 2026  
**Previous plan:** [`docs/plans/2026-08-sellable-v1.md`](docs/plans/2026-08-sellable-v1.md)  
**Goal:** Finish public booking, packaging, and productization so the site can be handed to a client or sold as a template.

---

## Overview

Phases 1–2 from the August plan are largely done. The public site and admin CMS are live. This file is remaining work only — do not implement archived tasks that already exist in the codebase.

---

## Current state

### Shipped

| Area                 | Status                                                                   |
| -------------------- | ------------------------------------------------------------------------ |
| Public pages         | `/`, `/about`, `/services`, `/gallery`, `/contact`, `/privacy`, `/terms` |
| Catalog CMS          | `categories` + `services` at `/admin/services` (4 card layouts)          |
| Shop info + hours    | Editable in `/admin/shop-info`; public pages read from DB                |
| Gallery              | Admin upload + public page from `gallery_images` / Storage               |
| Content CMS          | Welcome, about, FAQ, announcements, legal                                |
| Appointments (admin) | CRUD at `/admin/appointment`; dashboard schedule                         |
| Auth                 | Login, invite (master), set-password, onboarding; gate in `proxy.ts`     |
| Contact form         | Zod + Resend (`POST /api/contact`)                                       |
| README               | Stack, env names, routes, `pnpm gen:types`                               |

### Still open

| Area            | Gap                                                                               |
| --------------- | --------------------------------------------------------------------------------- |
| Public booking  | Hero CTA still goes to `/contact`; no customer booking flow                       |
| Contact consent | No privacy checkbox on the contact form                                           |
| Contact errors  | Failed send has no visible error state                                            |
| Deploy package  | No `.env.example`, no single schema SQL, README has no Vercel / first-admin steps |
| SEO             | Root metadata only; no `sitemap.xml` or `robots.txt`                              |
| Analytics       | None                                                                              |
| Branding        | Name, logo, colors still in code / CSS, not a tenant config                       |

---

## Phase A — Close the sellable v1 gaps

> **Target:** A new developer can set up the project, and a visitor can book without calling.  
> **Depends on:** nothing in the archived plan

### A.1 Public booking

**Priority:** High  
**Depends on:** admin appointments (done)

| Task                         | Details                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| Public booking page or modal | Name, phone, service, date/time (respect `shop_hours`)                                 |
| Server action or route       | Insert into `appointment`; default status `scheduled`                                  |
| Email                        | Resend confirmation to owner + customer                                                |
| Hero CTA                     | `components/Hero.tsx` — “Schedule an Appointment” should go to booking, not `/contact` |

**Acceptance criteria:**

- [ ] Customer can request an appointment from the public site
- [ ] Owner gets an email; row appears in `/admin/appointment`
- [ ] Hero button no longer dumps users on the contact form

### A.2 Contact form polish

**Priority:** Medium  
**Files:** `components/ContactForm.tsx`, `lib/validations/contact-schema.ts`, `app/api/contact/route.ts`

| Task             | Details                                                             |
| ---------------- | ------------------------------------------------------------------- |
| Consent checkbox | Required; links to `/privacy`                                       |
| Error state      | Show a message when Resend / the API fails (success already exists) |

**Acceptance criteria:**

- [ ] Form cannot submit without consent
- [ ] Failed send is visible to the user

### A.3 Deployment package

**Priority:** High

| Deliverable           | Description                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------- |
| `.env.example`        | Env **names** only, with comments (include `SUPABASE_SERVICE_ROLE_KEY`)                                         |
| `supabase/schema.sql` | One file (or documented order) to recreate live tables + RLS; keep existing `supabase/*.sql` as feature patches |
| README                | How to create the first admin user; deploy to Vercel; Supabase redirect URLs for production                     |
| Handoff checklist     | Photos, copy, domain, replace stock/Pexels images                                                               |

**Acceptance criteria:**

- [ ] Clone → env → `pnpm install` → `pnpm dev` works from the README
- [ ] Schema can be recreated without clicking through the Supabase dashboard blindly

---

## Phase B — Productize

> **Target:** Sell or clone the same product for another car wash with less code change.

| #   | Feature            | Notes                                                                                     |
| --- | ------------------ | ----------------------------------------------------------------------------------------- |
| B.1 | Branding config    | Business name, logo, tagline, colors in DB or a single config — not scattered class names |
| B.2 | SEO                | Per-page `metadata`, OG image, `app/sitemap.ts`, `app/robots.ts`                          |
| B.3 | Analytics          | Plausible or Google Analytics snippet, env-gated                                          |
| B.4 | Image optimization | Supabase transforms or similar for gallery/hero WebP/resize                               |
| B.5 | Client handoff     | Short Loom of the admin panel                                                             |

**Acceptance criteria:**

- [ ] Another shop can change name/logo/colors without a redesign pass
- [ ] Search engines get sitemap + unique titles/descriptions
- [ ] Analytics can be enabled via env without a code fork

---

## Quick wins

Do these between larger features:

- [ ] Services page: attention / specials section
- [ ] `ServiceModal`: dynamic rows for add-on line items
- [ ] Dashboard: “recently modified” list (category toggles optional)
- [ ] Confirm contact form and admin mutations all surface errors via toast or inline copy

---

## Out of scope (already shipped)

Do not rebuild these unless something is broken:

- Hardcoded shop contact / map / footer socials
- Gallery CMS, hours editor, about/FAQ/legal/welcome CMS
- Admin appointment CRUD and dashboard schedule
- Privacy and Terms pages
- Mobile admin nav, profile, invite/onboarding
- Catalog tables named `categories` + `services` (not `categories1` / `services1`)

---

## Suggested order

```
1. A.2 Contact form polish          (small)
2. A.3 Deployment package           (unblocks handoff)
3. A.1 Public booking               (largest remaining feature)
4. B.2 SEO                          (cheap, high value)
5. B.3 Analytics                    (env snippet)
6. B.1 / B.4 / B.5                  (when selling to a second shop)
```

---

## How to use this plan

1. Pick a section (start with **A.2** or **A.3**).
2. In Agent mode: _“Implement section A.1 from plan.md”_
3. Use Plan mode first for booking (A.1) or branding (B.1).
4. Check off items here as they land. Do not append finished work back onto this file — archive again when this milestone is done.
5. Historical context: [`docs/plans/2026-08-sellable-v1.md`](docs/plans/2026-08-sellable-v1.md)
