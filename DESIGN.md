**Design System & Visual Notes**

This file documents the visual system and design decisions used across the repo so you can reproduce the hero layout and visual polish in Google AI Studio or other environments.

**Tokens & variables**
- **Color variables**: CSS custom properties are used across the app (see [app/globals.css](app/globals.css)). Examples: `--green`, `--yellow`, `--muted`, `--line`, `--white`, `--pandan`.
- **Typography**: `font-display` is used for headings; sizes follow Tailwind utility classes in the components.
- **Radius & spacing**: Components use `rounded-[var(--radius)]` and explicit rounded values (e.g., `rounded-[1.75rem]` or `rounded-[2.25rem]`) for the hero card.

**Hero card (how it’s built)**
- Layout: two-column grid (`container-shell` with `lg:grid-cols-[1fr_1.05fr]`). Left column: headline, CTAs, trust quote. Right column: yellow card with product carousel.
- Visual details to match screenshot:
  - Card background: saturated warm yellow (use `--yellow`), large corner radius (≈ 36px), soft shadow (`0 30px 70px rgba(0,0,0,0.12)`).
  - Central product frame: white rounded inset with drop shadow and overflow-hidden image.
  - Decorative elements: leaf PNGs placed absolutely behind the card; dot-pattern (can be added with SVG background) for subtle texture.
  - Controls: circular previous/next buttons in the card header; rounded pill CTA (`Lihat Detail`) centered.

**Image handling**
- Use Next.js `Image` for hero images (already implemented) and mark the main hero image with `priority` to preload LCP.
- Use `sizes` responsive hints to keep bundle small: e.g. `sizes="(min-width:1024px) 48vw, 80vw"` for the main image.
- Decorative PNGs from `remove_bg/` are imported and placed with `aria-hidden`.

**Spacing & responsive behavior**
- The hero uses `py-10` → `lg:py-14` with internal paddings `p-6` → `sm:p-8` on the card; tweak these values to achieve the exact vertical alignments.
- Card width is constrained with `max-w-sm`/`max-w-md` depending on viewport; adjust `w-[78%]` to match screenshot overlap.

**Accessibility**
- Decorative images must use `aria-hidden` and empty `alt` or descriptive text if informative.
- Buttons include `aria-label` attributes for screen reader clarity.

If you want, I can produce a small style token JSON (colors, radii, shadows) that you can import into Figma or a design-to-code workflow.
