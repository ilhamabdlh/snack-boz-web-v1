export type Category =
  | "Kue Basah"
  | "Kue Kering"
  | "Snack Box"
  | "Kue Tampah"
  | "Makanan Berat";

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

export const occasionCopy: Record<string, string> = {
  "Rapat Kantor": "Siap untuk rapat pagi, training, dan coffee break kantor.",
  Arisan: "Pilihan manis-gurih yang rapi untuk meja arisan.",
  Pengajian: "Paket praktis dengan jumlah besar dan jadwal jelas.",
  Pernikahan: "Tampah dan hantaran yang pantas untuk momen keluarga.",
  "Hari Raya": "Suguhan tamu, hampers, dan paket keluarga.",
  "Ulang Tahun": "Snack box dan makanan berat untuk acara lebih ramai.",
  "Kumpul Keluarga": "Kue tampah dan favorit rumah untuk dimakan bersama.",
  Hampers: "Hantaran kue kering dan snack tradisional yang rapi.",
};
