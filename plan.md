# Onyx Premium Carwash — Plan (v2)

**Last updated:** September 4, 2026  
**Previous plan:** [`docs/plans/2026-08-sellable-v1.md`](docs/plans/2026-08-sellable-v1.md)  
**Goal:** Productize (SEO, analytics, branding) so the site can be cloned for another shop. Public self-serve booking stays deferred.

---

## Overview

The public site, admin CMS, appointments, contact form, and deploy package are live. This file is remaining work only.

---

## Current state

### Shipped

| Area                  | Status                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------- |
| Public pages          | `/`, `/about`, `/services`, `/gallery`, `/contact`, `/privacy`, `/terms`                    |
| Catalog CMS           | `categories` + `services`; 4 layouts; `ServiceCard` + layout picker; sort-position field    |
| Shop info + hours     | `/admin/shop-info` (email validated; unused `address` column dropped); public hours grouped |
| Gallery / content CMS | Gallery, welcome, about, FAQ, announcements, legal                                          |
| Appointments (admin)  | CRUD + dashboard schedule                                                                   |
| Auth                  | Login, invite (master), set-password, onboarding; `proxy.ts`                                |
| Contact               | Zod + Resend; privacy consent; failed-send error                                            |
| Home hero CTA         | “Call to schedule an Appointment” — dials `shop_info.phone` and goes to `/contact`          |
| Deploy package        | `.env.example`, `supabase/schema.sql`, README first-admin / Vercel / handoff                |
| Admin UI              | Shared `AdminModal`; toasts on mutations                                                    |

### Still open

| Area               | Gap                                                                            |
| ------------------ | ------------------------------------------------------------------------------ |
| Public booking     | **Deferred.** Call or contact form only                                        |
| SEO                | Root metadata only; no per-page titles, OG image, `sitemap.ts`, or `robots.ts` |
| Analytics          | None                                                                           |
| Branding           | Name, logo, colors still in code / CSS                                         |
| Image optimization | No transforms/CDN beyond Next.js `Image`                                       |
| Client Loom        | Not recorded                                                                   |

---

## Phase A — Sellable v1

**Done**, except A.1.

### A.1 Public booking — deferred

Customers schedule by calling `shop_info.phone` (home hero) or using `/contact`. Do not build a public booking UI until this is pulled forward.

When resumed: public form (name, phone, service, date/time from `shop_hours`) → insert `appointment` → Resend to owner + customer → revisit hero CTA.

---

## Phase B — Productize

> **Target:** Sell or clone the same product for another car wash with less code change.

### B.2 SEO

**Priority:** High (next)

| Task              | Details                                                                     |
| ----------------- | --------------------------------------------------------------------------- |
| Per-page metadata | Unique `title` / `description` on public routes (not only `app/layout.tsx`) |
| Open Graph        | Default OG image + title                                                    |
| `app/sitemap.ts`  | Public URLs                                                                 |
| `app/robots.ts`   | Allow public; disallow `/admin`                                             |

**Acceptance criteria:**

- [ ] Each public page has its own title and description
- [ ] `/sitemap.xml` and `/robots.txt` exist

### B.3 Analytics

**Priority:** Medium

Env-gated Plausible or Google Analytics snippet. No tracking without the env var.

**Acceptance criteria:**

- [ ] Analytics can be enabled via env without a code fork

### B.1 Branding config

**Priority:** Later (second shop)

Business name, logo, tagline, colors in DB or one config — not scattered class names.

### B.4 Image optimization

**Priority:** Later

Supabase transforms or similar for gallery/hero WebP/resize.

### B.5 Client handoff

**Priority:** When handing off

Short Loom of the admin panel. Written checklist is already in the README.

**Acceptance criteria (phase):**

- [ ] Another shop can change name/logo/colors without a redesign pass
- [ ] Search engines get sitemap + unique titles/descriptions
- [ ] Analytics can be enabled via env without a code fork

---

## Quick wins

- [ ] Services page: attention / specials section
- [ ] `ServiceModal` layout 2: dynamic add-on rows instead of `Name=Value` textarea
- [ ] Dashboard: “recently modified” list (category toggles optional)

---

## Out of scope (already shipped)

Do not rebuild these unless something is broken:

- Shop contact, map, footer socials, grouped hours
- Gallery, hours editor, about/FAQ/legal/welcome CMS
- Admin appointments + dashboard schedule
- Privacy / terms, contact consent + error state
- Mobile admin nav, profile, invite/onboarding
- Catalog `categories` + `services`, layout picker, sort position
- Shared `AdminModal`
- Home hero call + contact CTA
- `.env.example`, `supabase/schema.sql`, README deploy / first admin / handoff

---

## Suggested order

```
1. B.2 SEO                          (next)
2. B.3 Analytics                    (env snippet)
3. Quick wins                       (anytime)
4. B.1 / B.4 / B.5                  (second shop / handoff)
5. A.1 Public booking               (deferred)
```

---

## How to use this plan

1. Start with **B.2**.
2. In Agent mode: _“Implement section B.2 from plan.md”_
3. Use Plan mode first for branding (B.1) or if public booking (A.1) is pulled forward.
4. Check off items here as they land. Do not append finished work back onto this file.
5. Historical context: [`docs/plans/2026-08-sellable-v1.md`](docs/plans/2026-08-sellable-v1.md)
