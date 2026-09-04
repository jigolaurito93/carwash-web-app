# Onyx Premium Carwash

Marketing site and admin CMS for **Onyx Premium Carwash**. The public site is a dark, mobile-first experience for services, gallery, hours, and contact. Shop content lives in **Supabase** and is edited from `/admin`.

---

## Tech stack

| Layer           | Choice                                         |
| --------------- | ---------------------------------------------- |
| Framework       | Next.js 16 (App Router) with React Compiler    |
| UI              | React 19, TypeScript (strict)                  |
| Styling         | Tailwind CSS v4, shadcn/ui                     |
| Package manager | pnpm                                           |
| Database / Auth | Supabase (Postgres + Auth) via `@supabase/ssr` |
| Forms           | react-hook-form, Zod                           |
| Email           | Resend (`POST /api/contact`)                   |
| Maps            | `@react-google-maps/api`                       |
| Toasts          | sonner                                         |

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
- A [Supabase](https://supabase.com) project
- A [Resend](https://resend.com) API key (contact form)
- A Google Maps JavaScript API key (contact-page map)

### 1. Clone and install

```bash
git clone <your-repo-url> carwash-app
cd carwash-app
pnpm install
```

### 2. Environment

Copy the example file and fill in values (names only live in git):

```bash
cp .env.example .env.local
```

On Windows PowerShell: `Copy-Item .env.example .env.local`

| Variable                          | Where to get it                                     | Notes                                   |
| --------------------------------- | --------------------------------------------------- | --------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`        | Supabase → Project Settings → API                   | Project URL                             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Same page → `anon` `public`                         | Safe for the browser; RLS still applies |
| `SUPABASE_SERVICE_ROLE_KEY`       | Same page → `service_role`                          | **Server-only.** Invites + onboarding   |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Cloud → Credentials                          | Enable Maps JavaScript API              |
| `RESEND_API_KEY`                  | Resend → API Keys                                   | Server-only                             |
| `OWNER_EMAIL`                     | The inbox that should receive contact-form messages | Server-only                             |

Never commit `.env.local`. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.

### 3. Database

On a **new** Supabase project, open **SQL Editor**, paste all of [`supabase/schema.sql`](supabase/schema.sql), and run it. That creates the live tables, Row Level Security, the public `gallery` storage bucket, and seed rows the site expects (shop info, hours, about/welcome/FAQ/legal placeholders, one `Washes` category).

Other files in `supabase/` are **feature patches** for databases that already exist. Do not run `rename-catalog.sql` on a new project.

Optional: [link the CLI](https://supabase.com/docs/reference/cli/supabase-link) so you can regenerate types after schema changes:

```bash
pnpm gen:types
```

That overwrites `lib/database.types.ts`. Do not hand-edit that file.

### 4. First admin user

Invites require an existing **master** admin, so the first account is created in the Supabase dashboard.

1. In Supabase → **Authentication → URL Configuration**:
   - **Site URL:** `http://localhost:3000`
   - **Redirect URLs:** add `http://localhost:3000/auth/callback`
2. In **Authentication → Users → Add user**, create a user with email + password. Enable **Auto Confirm User** so you can sign in immediately.
3. Confirm `.env.local` includes `SUPABASE_SERVICE_ROLE_KEY` (onboarding cannot finish without it).
4. Run the app (next step) and open [http://localhost:3000/admin/login](http://localhost:3000/admin/login).
5. Sign in. You will be sent to `/admin/onboarding`. Complete the profile — the first `admin_profiles` row becomes **master**.
6. Later staff accounts: from `/admin/invite` (master only). Invited users land on `/admin/set-password`, then onboarding.

Disable public sign-ups under **Authentication → Providers → Email** if you want invite-only access. Dashboard-created users and `inviteUserByEmail` still work.

### 5. Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Admin login is [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## Deploy to Vercel

1. Push the repo to GitHub (do not commit `.env.local`).
2. In [Vercel](https://vercel.com), **Add New → Project** and import the repo. Framework preset: Next.js. Install command: `pnpm install`.
3. Add the same environment variables as `.env.example` to the Vercel project (Production, and Preview if you use preview deploys).
4. Deploy. Note the production URL, for example `https://your-shop.vercel.app`.
5. In Supabase → **Authentication → URL Configuration**:
   - **Site URL:** `https://your-domain.com` (custom domain or the Vercel URL)
   - **Redirect URLs:** add `https://your-domain.com/auth/callback`  
     Optionally add `https://*-your-team.vercel.app/auth/callback` for preview deploys.
6. Point a custom domain at Vercel if you have one, then use that domain as Site URL and in Redirect URLs.
7. Restrict the Google Maps key to your production (and localhost) HTTP referrers.
8. In Resend, verify the sending domain you will use in production.

After deploy, create the first admin the same way as locally (or invite from an existing master). Production invites use `https://your-domain.com/auth/callback` automatically.

---

## Scripts

| Script           | What it does                                                       |
| ---------------- | ------------------------------------------------------------------ |
| `pnpm dev`       | Development server                                                 |
| `pnpm build`     | Production build                                                   |
| `pnpm start`     | Serve the production build                                         |
| `pnpm lint`      | ESLint                                                             |
| `pnpm prettier`  | Format with Prettier                                               |
| `pnpm gen:types` | Regenerate `lib/database.types.ts` from the linked Supabase schema |

---

## Routes

**Public**

| Path        | Page                     |
| ----------- | ------------------------ |
| `/`         | Home                     |
| `/about`    | About                    |
| `/services` | Services and pricing     |
| `/gallery`  | Gallery                  |
| `/contact`  | Contact, hours, map, FAQ |
| `/privacy`  | Privacy policy           |
| `/terms`    | Terms of use             |

**Admin** (protected except login)

| Path                   | Page                                |
| ---------------------- | ----------------------------------- |
| `/admin/login`         | Sign in                             |
| `/admin/set-password`  | First-time password (invited users) |
| `/admin/onboarding`    | Profile onboarding                  |
| `/admin/dashboard`     | Overview / schedule                 |
| `/admin/appointment`   | Appointments                        |
| `/admin/services`      | Categories and services             |
| `/admin/shop-info`     | Shop name, address, hours           |
| `/admin/welcome`       | Home welcome copy                   |
| `/admin/about`         | About page copy                     |
| `/admin/gallery`       | Gallery images                      |
| `/admin/announcements` | Site banner announcements           |
| `/admin/faq`           | FAQs                                |
| `/admin/legal`         | Privacy and terms                   |
| `/admin/profile`       | Account settings                    |
| `/admin/invite`        | Invite an admin (master only)       |

---

## Data

Live tables used by the app:

`categories`, `services`, `shop_info`, `shop_hours`, `site_announcements`, `gallery_images`, `faqs`, `admin_profiles`, `about_content`, `welcome_content`, `legal_documents`, `appointment`

Recreate them with [`supabase/schema.sql`](supabase/schema.sql). Catalog content is not hardcoded — edit it in `/admin/services` and `/admin/shop-info`.

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
supabase/
  schema.sql             Greenfield bootstrap (new projects)
  *.sql                  Feature patches for existing databases
```

Path alias: `@/*` → repo root.

---

## Customization

- **Copy, hours, prices, gallery, FAQ, legal** — use the admin CMS.
- **Images** — `public/images/` for static assets; gallery uploads go to Supabase Storage.
- **Brand** — dark surfaces, `yellow-400` accent, `font-lexend` headings, `font-questrial` body. Theme tokens live in `app/globals.css` (`@theme inline`).
- **SEO** — `metadata` in `app/layout.tsx`.

---

## Client handoff checklist

Use this when packaging the site for a shop owner. Demo / Pexels photos are fine until handoff; replace them before go-live.

**From the client**

- [ ] Business name, tagline, and logo (`public/images/nav-logo-icon.png` and any wordmark)
- [ ] Phone, email, full address, and map coordinates (or a Google Maps pin)
- [ ] Opening hours (including holidays / closed days)
- [ ] Service list with prices and what each package includes
- [ ] Real shop photos (exterior, bays, before/after, team) — not stock
- [ ] About copy (owner name, story, mission)
- [ ] FAQ answers that match how the shop actually works
- [ ] Social profile URLs (Instagram, Facebook, Twitter/X)
- [ ] Production domain (or agreement to use the Vercel URL)
- [ ] Contact inbox for `OWNER_EMAIL` and a first-admin email address
- [ ] Privacy / terms review (seed legal pages are placeholders, not legal advice)

**Replace stock images** (files under `public/images/`)

| File                | Used on                       |
| ------------------- | ----------------------------- |
| `carwash-1.jpg`     | Home hero                     |
| `carwash-2.jpg`     | Welcome section (CMS default) |
| `carwash-3.jpg`     | Login, contact hero (desktop) |
| `carwash-4.jpg`     | Contact hero (mobile)         |
| `carwash-6.jpg`     | About                         |
| `carwash-7.jpg`     | About                         |
| `carwash-8.jpg`     | Services hero (desktop)       |
| `carwash-9.jpg`     | Services hero (mobile)        |
| `nav-logo-icon.png` | Navbar and admin auth screens |

Gallery photos belong in **Admin → Gallery** (Supabase Storage), not `public/images/`.

**Before launch**

- [ ] Env vars set on Vercel; schema applied; first admin can sign in
- [ ] Supabase production Site URL + `/auth/callback` redirect
- [ ] Shop info, hours, catalog, and welcome/about copy updated in admin
- [ ] Contact form test received at `OWNER_EMAIL`
- [ ] Map pin and “Get Directions” match the real address
- [ ] Privacy and terms published from `/admin/legal`

---

## License

This project is currently unlicensed. Add a license file if you intend to open-source it.
