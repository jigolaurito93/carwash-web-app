## Onyx Premium Carwash – Web App

A modern, responsive marketing site for **Onyx Premium Carwash**, built with **Next.js** and **Tailwind CSS**. It showcases services, pricing, gallery, contact information, and operating hours with a clean, mobile‑first design.

---

## Tech Stack

- **Framework**: Next.js (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Icons**: `react-icons`
- **Fonts**: Google Fonts via `next/font`
- **Deployment**: Any Node/Next-compatible host (e.g. Vercel)

---

## Features

- **Responsive layout** for mobile, tablet, and desktop
- **Sticky navbar** with scroll‑based translucent background
- **Services page** with cards for:
  - Core wash packages
  - Add‑ons & specialty services
  - Detailing options
- **Hours & Contact section** with adaptive layout (stacked on mobile, side‑by‑side on desktop)
- **Footer** with quick links and shop info
- **SEO-ready** metadata (`title`, `description`)

---

## Getting Started

### Prerequisites

- **Node.js** (LTS recommended, e.g. 18+)
- **npm** or **yarn** or **pnpm**

### Installation

```bash
# clone this repo
git clone <your-repo-url> carwash-web-app
cd carwash-web-app

# install dependencies
npm install
# or
yarn
# or
pnpm install
```

### Development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Then open `http://localhost:3000` in your browser.

---

## Available Scripts

- **`npm run dev`** – Start the development server
- **`npm run build`** – Create an optimized production build
- **`npm start`** – Run the production build
- **`npm run lint`** – Run linting

(Replace `npm` with `yarn`/`pnpm` as needed.)

---

## Project Structure (high level)

- `app/`
  - `layout.tsx` – Root layout (navbar, footer, global fonts)
  - `page.tsx` – Home page
  - `services/page.tsx` – Services & pricing page
- `components/`
  - `navbar/` – `Navbar`, `MobileNavLinks`
  - `ServicesSection`, `ServicesCard`, `ServicesCard2`
  - `HoursOpenSection`
  - `ShopInfoSection`
  - `Welcome`
  - `Footer`
- `data/`
  - `services.ts` – Configuration for service cards
- `public/images/` – Static images (logo, gallery, etc.)

---

## Styling & Layout Notes

- **Layout** uses Tailwind utility classes with `flex` and `grid` for responsive behavior.
- The **navbar** is fixed at the top; some pages (e.g. Services) add extra top padding or a black bar to avoid content being hidden.
- Sections like **Hours & Contact** use responsive flex layouts: stacked on mobile, side‑by‑side on wider screens.
- Add more later

---

## Customization

- Update text, prices, and offerings in `data/services.ts`.
- Swap images in `public/images/`.
- Adjust colors, spacing, and fonts in Tailwind config or directly in component class names.
- Modify `<metadata>` in `app/layout.tsx` for SEO (title, description).

---

## License

This project is currently unlicensed. Add a license file (e.g. MIT) here if you intend to open‑source it.
