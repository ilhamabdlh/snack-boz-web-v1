# DESIGN RULES

Panduan desain ringkas untuk proyek Snack Boz — baca sebelum men-generate UI.

Prinsip umum
- Inspired by Linear, Stripe, Vercel: tipis, profesional, dan fungsional.
- Maksimum 2 warna aksen. Hindari gradien berlebih.
- Gunakan sistem spasi berbasis 8px.
- Tipografi dulu: skala ukuran, berat, dan leading konsisten.
- Jaga whitespace besar dan hierarki visual yang jelas.
- Batasi border; gunakan shadow lembut bila perlu.
- Hindari glassmorphism kecuali diminta.
- Hindari estetika "AI-generated" (terlalu ramai, warna mencolok, motif acak).

Komponen & pola
- Gunakan desain komponen konsisten (contoh: shadcn/ui + Radix).
- Semua tombol/CTA harus mempunyai ukuran, warna, dan jarak yang konsisten.
- Gambar produk: gunakan foto nyata, alt text deskriptif, dan aspect-ratio konsisten.
- Semua interaksi harus keyboard-accessible; gunakan semantic HTML dan atribut a11y.

Data & konfigurasi
- Jangan hard-code data sensitif: pindahkan nomor WA, API keys ke `.env`.
- Pindahkan dataset besar (`lib/data.ts`) ke `data/products.json` atau sumber API.

Tailwind & styling
- Pakai 8px scale: spacing (0, 2, 4, 8, 16, ...).
- Batasi utility classes di komponen — buat kelas/komponen ulang untuk pola berulang.

Copilot / AI prompts (pakai sebelum menghasilkan UI)
1. Baca file `DESIGN_RULES.md` dulu.
2. Prompt contoh (landing):
   Build a responsive landing page in Next.js + Tailwind following DESIGN_RULES.md. Use strong typography hierarchy, two accent colors (#0f766e and #0f172a), generous whitespace, minimal borders, and consistent 8px spacing. Use shadcn/ui or Radix components where appropriate. Avoid gradients and glassmorphism.

Checklist PR minimal
- Include `DESIGN_RULES.md` reference in PR description.
- Move any hard-coded external values to `.env` and reference `process.env`.
- Replace inline product data with an import from `data/products.json`.
- Ensure `npm run lint` and `npm run build` pass.

Contoh warna dan tipografi (awal)
- Primary accent: #0f766e (teal)
- Neutral dark: #0f172a
- Background: #ffffff / #f8fafc
- Font stack: Lora (display) + Plus Jakarta Sans (ui)

Jika setuju, saya bisa:
- Buat `data/products.json` dari `lib/data.ts`.
- Ganti nomor WA ke env var dan update `components/site-header.tsx`.
- Pasang shadcn/ui + radikalisasi header/product-card (PR terpisah).

— Tim desain
Ikuti panduan ini untuk semua perubahan UI sehingga hasilnya terlihat konsisten dan profesional.
