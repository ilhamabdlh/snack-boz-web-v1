import { BRAND } from "@/lib/brand";

export const BANK_ACCOUNTS = [
  {
    bank: "BNI",
    accountNumber: "0480597143",
    accountName: "Ilham Abdullah",
  },
  {
    bank: "BCA",
    accountNumber: "4820425109",
    accountName: "Ilham Abdullah",
  },
  {
    bank: "BTPN",
    accountNumber: "90130144919",
    accountName: "Ilham Abdullah",
  },
  {
    bank: "CIMB",
    accountNumber: "707019829700",
    accountName: "Ilham Abdullah",
  },
] as const;

export const INVOICE_BRAND = {
  name: BRAND.name.toUpperCase(),
  tagline: BRAND.tagline,
  thankYou: "TERIMAKASIH ATAS PEMBELIAN ANDA",
  ownerName: "Ilham Abdullah",
  signatureLogo: "/brand/snack-boz-logo.png",
} as const;

export type PaymentMethod = "Transfer Bank" | "QRIS";
