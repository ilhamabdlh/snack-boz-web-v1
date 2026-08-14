export type PosterItem = {
  src: string;
  alt: string;
  href: string;
};

/** Tambah poster baru di sini — carousel otomatis ikut. */
export const posters: PosterItem[] = [
  {
    src: "/poster/poster1.webp",
    alt: "Poster Nasi Ayam Teriyaki Bowl",
    href: "/products/nasi-ayam-teriyaki-bowl",
  },
  {
    src: "/poster/poster2.webp",
    alt: "Poster Lapis Pepe Pandan",
    href: "/products?q=lapis",
  },
  {
    src: "/poster/poster3.webp",
    alt: "Poster Nasi Bakar Ayam Pedas",
    href: "/products/nasi-bakar-ayam-suwir",
  },
  {
    src: "/poster/poster4.webp",
    alt: "Poster Kue Angku Isi Kacang Hijau",
    href: "/products/kue-angku",
  },
  {
    src: "/poster/poster5.webp",
    alt: "Poster Risoles Mayonaise",
    href: "/products/risoles-mayones",
  },
];
