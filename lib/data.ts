export type Category =
  | "Kue Basah"
  | "Kue Kering"
  | "Snack Box"
  | "Kue Tampah"
  | "Makanan Berat";

export type ProductVariant = {
  id: string;
  name: string;
  price: number;
  portion: string;
};

export type Product = {
  slug: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  minOrder: number;
  image: string;
  occasions: string[];
  tags: string[];
  bestSeller?: boolean;
  readySoon?: boolean;
  ingredients: string;
  portion: string;
  variants?: ProductVariant[];
};

export const categories: Category[] = [
  "Kue Basah",
  "Kue Kering",
  "Snack Box",
  "Kue Tampah",
  "Makanan Berat",
];

export const occasions = [
  "Rapat Kantor",
  "Arisan",
  "Pengajian",
  "Pernikahan",
  "Hari Raya",
  "Ulang Tahun",
  "Kumpul Keluarga",
  "Hampers",
];

import productsData from "../data/products.json";

export const products: Product[] = productsData as Product[];

export const bestSellers = products.filter((product) => product.bestSeller).slice(0, 10);

/** Bowl photos — pin slightly below top so the bowl sits centered after cropping excess top space. */
const IMAGE_OBJECT_TOP_SLUGS = new Set([
  "nasi-ayam-asam-manis-bowl",
  "nasi-ayam-suwir-kemangi-bowl",
  "nasi-ayam-teriyaki-bowl",
  "nasi-cumi-asin-balado-bowl",
]);

export function productImageObjectClass(slug: string, category?: Category) {
  if (IMAGE_OBJECT_TOP_SLUGS.has(slug)) return "object-cover object-[center_55%]";
  if (category === "Kue Tampah") return "object-cover object-center";
  return "object-cover object-bottom";
}

export const occasionCopy: Record<string, string> = {
  "Rapat Kantor":
    "Yang ringan dan tidak berantakan di meja, gampang dibagi satu-satu.",
  Arisan: "Campuran manis dan gurih, supaya rapi dan enak dilihat waktu dibuka.",
  Pengajian: "Cocok untuk jumlah besar. Isinya sederhana, jam antarnya pasti.",
  Pernikahan: "Kue tampah atau hantaran untuk meja tamu dan keluarga.",
  "Hari Raya": "Suguhan di rumah, isian toples, sampai hampers untuk dikirim.",
  "Ulang Tahun": "Snack box, atau menu yang lebih mengenyangkan kalau tamunya ramai.",
  "Kumpul Keluarga": "Kue tampah dan menu yang enak dimakan bersama-sama.",
  Hampers: "Kue kering dan camilan tradisional, dikemas rapi untuk dikirim.",
};
