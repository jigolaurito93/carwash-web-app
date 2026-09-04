# Onyx Premium Carwash — Plan (v2)

**Last updated:** September 3, 2026  
**Previous plan:** [`docs/plans/2026-08-sellable-v1.md`](docs/plans/2026-08-sellable-v1.md)  
**Goal:** Finish packaging and productization so the site can be handed to a client or sold as a template. Public self-serve booking is deferred.

---

## Overview

Phases 1–2 from the August plan are largely done. The public site and admin CMS are live. This file is remaining work only — do not implement archived tasks that already exist in the codebase.

---

## Current state

### Shipped

| Area                 | Status                                                                             |
| -------------------- | ---------------------------------------------------------------------------------- |
| Public pages         | `/`, `/about`, `/services`, `/gallery`, `/contact`, `/privacy`, `/terms`           |
| Catalog CMS          | `categories` + `services` at `/admin/services` (4 card layouts)                    |
| Shop info + hours    | Editable in `/admin/shop-info`; public pages read from DB                          |
| Gallery              | Admin upload + public page from `gallery_images` / Storage                         |
| Content CMS          | Welcome, about, FAQ, announcements, legal                                          |
| Appointments (admin) | CRUD at `/admin/appointment`; dashboard schedule                                   |
| Auth                 | Login, invite (master), set-password, onboarding; gate in `proxy.ts`               |
| Contact form         | Zod + Resend (`POST /api/contact`); privacy consent; failed-send error             |
| README               | Stack, env, first admin, Vercel, `pnpm gen:types`, handoff checklist |
| Home hero CTA        | “Call to schedule an Appointment” — dials `shop_info.phone` and goes to `/contact` |
| Deploy package       | `.env.example`, `supabase/schema.sql`, README first-admin / Vercel / handoff |

### Still open

| Area           | Gap                                                                               |
| -------------- | --------------------------------------------------------------------------------- |
| Public booking | **Deferred.** Customers call or use the contact form; no public booking UI        |
| SEO            | Root metadata only; no `sitemap.xml` or `robots.txt`                              |
| Analytics      | None                                                                              |
| Branding       | Name, logo, colors still in code / CSS, not a tenant config                       |

---

## Phase A — Close the sellable v1 gaps

> **Target:** A new developer can set up the project; visitors schedule by calling or contacting the shop.  
> **Depends on:** nothing in the archived plan

### A.1 Public booking — deferred

**Priority:** Later (not in this milestone)  
**Depends on:** admin appointments (done)

Customers schedule by calling `shop_info.phone` (home hero CTA) or using `/contact`. Do not build a public booking page until this is pulled forward again.

When resumed:

| Task                         | Details                                                   |
| ---------------------------- | --------------------------------------------------------- |
| Public booking page or modal | Name, phone, service, date/time (respect `shop_hours`)    |
| Server action or route       | Insert into `appointment`; default status `scheduled`     |
| Email                        | Resend confirmation to owner + customer                   |
| Hero CTA                     | Revisit if booking should replace the call + contact flow |

**Acceptance criteria (when resumed):**

- [ ] Customer can request an appointment from the public site
- [ ] Owner gets an email; row appears in `/admin/appointment`

### A.2 Contact form polish

**Priority:** Medium  
**Files:** `components/ContactForm.tsx`, `lib/validations/contact-schema.ts`, `app/api/contact/route.ts`

| Task             | Details                                                             |
| ---------------- | ------------------------------------------------------------------- |
| Consent checkbox | Required; links to `/privacy`                                       |
| Error state      | Show a message when Resend / the API fails (success already exists) |

**Acceptance criteria:**

- [x] Form cannot submit without consent
- [x] Failed send is visible to the user

### A.3 Deployment package

**Priority:** High

| Deliverable           | Description                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------- |
| `.env.example`        | Env **names** only, with comments (include `SUPABASE_SERVICE_ROLE_KEY`)                                         |
| `supabase/schema.sql` | One file (or documented order) to recreate live tables + RLS; keep existing `supabase/*.sql` as feature patches |
| README                | How to create the first admin user; deploy to Vercel; Supabase redirect URLs for production                     |
| Handoff checklist     | Photos, copy, domain, replace stock/Pexels images                                                               |

**Acceptance criteria:**

- [x] Clone → env → `pnpm install` → `pnpm dev` works from the README
- [x] Schema can be recreated without clicking through the Supabase dashboard blindly

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
- Home hero CTA: call `shop_info.phone` and navigate to `/contact`

---

## Suggested order

```
1. A.2 Contact form polish          (done)
2. A.3 Deployment package           (done)
3. B.2 SEO                          (cheap, high value)
4. B.3 Analytics                    (env snippet)
5. B.1 / B.4 / B.5                  (when selling to a second shop)
6. A.1 Public booking               (deferred — pull forward when needed)
```

---

## How to use this plan

1. Pick a section (start with **A.2** or **A.3**).
2. In Agent mode: _“Implement section A.2 from plan.md”_
3. Use Plan mode first for branding (B.1) or if public booking (A.1) is pulled forward.
4. Check off items here as they land. Do not append finished work back onto this file — archive again when this milestone is done.
5. Historical context: [`docs/plans/2026-08-sellable-v1.md`](docs/plans/2026-08-sellable-v1.md)
