# Onyx Premium Carwash

Marketing site and admin CMS for **Onyx Premium Carwash**. The public site is a dark, mobile-first experience for services, gallery, hours, and contact. Shop content lives in **Supabase** and is edited from `/admin`.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) with React Compiler |
| UI | React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4, shadcn/ui |
| Package manager | pnpm |
| Database / Auth | Supabase (Postgres + Auth) via `@supabase/ssr` |
| Forms | react-hook-form, Zod |
| Email | Resend (`POST /api/contact`) |
| Maps | `@react-google-maps/api` |
| Toasts | sonner |

Auth for `/admin/*` is gated in `proxy.ts` (Next.js 16). There is no `middleware.ts`.

---

## Features

**Public site**

- Home, About, Services, Gallery, Contact, Privacy, and Terms
- Sticky navbar with scroll-based background, rotating announcement banner, and footer
- Services catalog from `categories` + `services` (card layouts `layout1`–`layout4`)
- Shop hours, address, and Google Map from `shop_info` / `shop_hours`
- Gallery images from Supabase Storage
- Contact form validated with Zod and emailed via Resend
- FAQ on the contact page

**Admin CMS** (`/admin`)

- Email/password login, invite-only accounts, set-password and onboarding
- Dashboard schedule and appointments
- Catalog: categories and services
- Website: shop info, welcome, about, gallery, announcements, FAQ, legal pages
- Account settings; **Invite Admin** is master-role only

---

## Getting started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io)
- A [Supabase](https://supabase.com) project (linked locally for type generation)

### Install

```bash
git clone <your-repo-url> carwash-app
cd carwash-app
pnpm install
```

### Environment

Create `.env.local` in the repo root (never commit this file):

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
RESEND_API_KEY=
OWNER_EMAIL=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only (admin invites). Do not expose it to the client.

In Supabase → Authentication → URL Configuration, add the invite redirect:

`http://localhost:3000/auth/callback`

Schema helpers live in `supabase/*.sql`. After table or column changes, regenerate types:

```bash
pnpm gen:types
```

That overwrites `lib/database.types.ts`. Do not hand-edit that file.

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Admin login is [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm prettier` | Format with Prettier |
| `pnpm gen:types` | Regenerate `lib/database.types.ts` from the linked Supabase schema |

---

## Routes

**Public**

| Path | Page |
| --- | --- |
| `/` | Home |
| `/about` | About |
| `/services` | Services and pricing |
| `/gallery` | Gallery |
| `/contact` | Contact, hours, map, FAQ |
| `/privacy` | Privacy policy |
| `/terms` | Terms of use |

**Admin** (protected except login)

| Path | Page |
| --- | --- |
| `/admin/login` | Sign in |
| `/admin/set-password` | First-time password (invited users) |
| `/admin/onboarding` | Profile onboarding |
| `/admin/dashboard` | Overview / schedule |
| `/admin/appointment` | Appointments |
| `/admin/services` | Categories and services |
| `/admin/shop-info` | Shop name, address, hours |
| `/admin/welcome` | Home welcome copy |
| `/admin/about` | About page copy |
| `/admin/gallery` | Gallery images |
| `/admin/announcements` | Site banner announcements |
| `/admin/faq` | FAQs |
| `/admin/legal` | Privacy and terms |
| `/admin/profile` | Account settings |
| `/admin/invite` | Invite an admin (master only) |

---

## Data

Live tables used by the app:

`categories`, `services`, `shop_info`, `shop_hours`, `site_announcements`, `gallery_images`, `faqs`, `admin_profiles`, `about_content`, `welcome_content`, `legal_documents`, `appointment`

Catalog content is not hardcoded. Edit it in `/admin/services` and `/admin/shop-info`, not in a static config file.

---

## Project structure

```text
app/
  (public)/              Public pages and layout (navbar, banner, footer)
  (admin-protected)/     Authenticated admin CMS
  admin/login/           Login (outside the protected group)
  admin/set-password/    Invite password setup
  admin/onboarding/      First-time profile
  api/contact/           Contact form → Resend
  auth/callback/         Supabase auth redirect
components/              Public UI
  admin/                 Admin UI
  ui/                    shadcn primitives
lib/                     Clients, types, validations
  app.types.ts           Domain types
  database.types.ts      Generated Supabase schema (do not hand-edit)
  validations/           Zod schemas
proxy.ts                 Auth gate for /admin/*
supabase/                SQL helpers for schema changes
```

Path alias: `@/*` → repo root.

---

## Customization

- **Copy, hours, prices, gallery, FAQ, legal** — use the admin CMS.
- **Images** — `public/images/` for static assets; gallery uploads go to Supabase Storage.
- **Brand** — dark surfaces, `yellow-400` accent, `font-lexend` headings, `font-questrial` body. Theme tokens live in `app/globals.css` (`@theme inline`).
- **SEO** — `metadata` in `app/layout.tsx`.

---

## License

This project is currently unlicensed. Add a license file if you intend to open-source it.
