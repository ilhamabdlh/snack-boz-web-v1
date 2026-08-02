**SnackBoz — Features Overview**

This document lists the app features, where they live in the repo, and quick notes to help you run or adapt the project in Google AI Studio or other environments.

**Core App**:
- **Framework**: Next.js (app router), TypeScript, Tailwind CSS.
- **Entry**: [app/page.tsx](app/page.tsx) — home page and hero.
- **Layout**: [app/layout.tsx](app/layout.tsx) — global layout, fonts, and `globals.css`.

**Important Components**:
- **Hero**: [components/hero-section.tsx](components/hero-section.tsx) — large hero card, carousel, CTA.
- **Product card**: [components/product-card.tsx](components/product-card.tsx) — product tile used in lists.
- **Page shell**: [components/page-shell.tsx](components/page-shell.tsx) — site frame.
- **Site header / footer**: [components/site-header.tsx](components/site-header.tsx), [components/site-footer.tsx](components/site-footer.tsx).
- **UI primitives**: [components/ui/button.tsx](components/ui/button.tsx), [components/ui/card.tsx](components/ui/card.tsx), [components/ui/input.tsx](components/ui/input.tsx).

**Data & images**:
- Product data: [data/products.json](data/products.json) and [lib/data.ts](lib/data.ts) — typed product export.
- Public images: [public/makanan](public/makanan) — LCP images used by pages.
- Decorative assets: `remove_bg/` — transparent PNGs used for hero decoration.

**Environment & config**:
- `.env.example` contains `NEXT_PUBLIC_WHATSAPP` (public runtime variable referenced by `site-header`).
- `next.config.ts` sets `images.unoptimized = true` (local dev / simplified hosting).

**Build / Scripts**:
- `npm run dev` — development server.
- `npm run build` — production build.
- `npm run start` — start production server.
- `npm run lint` — Next lint (verify `package.json` script before CI).

**Notes & known issues**:
- Hero had a previous parse error during styling edits — restored to a working version and added decorative images via `remove_bg` imports.
- LCP image warnings addressed by switching hero images to `next/image` with `priority`.

If you want a single-file manifest for import into other tools, tell me which format (JSON/YAML) and I’ll export it.
