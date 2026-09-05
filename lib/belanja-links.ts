import { BRAND } from "@/lib/brand";

export type BelanjaLink = {
  id: string;
  title: string;
  description: string;
  href: string;
  external: boolean;
  tone: "shopee" | "tokopedia" | "whatsapp" | "instagram" | "website";
  group: "marketplace" | "direct";
};

function envUrl(key: string, fallback: string) {
  return process.env[key]?.trim() || fallback;
}

export const STORE_LINKS = {
  website: envUrl(
    "NEXT_PUBLIC_WEBSITE_URL",
    "https://www.pasarsenenkuesubuh.com/",
  ),
  shopee: envUrl("NEXT_PUBLIC_SHOPEE_URL", "https://shopee.co.id/.goodvibes."),
  tokopedia: envUrl(
    "NEXT_PUBLIC_TOKOPEDIA_URL",
    "https://tokopedia.link/snackboz",
  ),
  whatsapp: envUrl("NEXT_PUBLIC_WHATSAPP_URL", "https://wa.me/6281806791309"),
  instagram: `https://instagram.com/${BRAND.instagram}`,
} as const;

export function getBelanjaLinks(): BelanjaLink[] {
  return [
    {
      id: "website",
      title: "Website resmi",
      description: "Lihat menu lengkap & pesan snack box langsung di sini",
      href: STORE_LINKS.website,
      external: true,
      tone: "website",
      group: "marketplace",
    },
    {
      id: "shopee",
      title: "Shopee",
      description: "Order di Shopee — ada voucher gratis ongkir",
      href: STORE_LINKS.shopee,
      external: true,
      tone: "shopee",
      group: "marketplace",
    },
    {
      id: "tokopedia",
      title: "Tokopedia",
      description: "Order di Tokopedia lebih aman dan nyaman",
      href: STORE_LINKS.tokopedia,
      external: true,
      tone: "tokopedia",
      group: "marketplace",
    },
    {
      id: "instagram",
      title: "Instagram",
      description: `Lihat update menu & promo di @${BRAND.instagram}`,
      href: STORE_LINKS.instagram,
      external: true,
      tone: "instagram",
      group: "direct",
    },
    {
      id: "whatsapp",
      title: "WhatsApp",
      description:
        "Order lebih fleksibel, request khusus, atau sekadar tanya-tanya dulu",
      href: STORE_LINKS.whatsapp,
      external: true,
      tone: "whatsapp",
      group: "direct",
    },
  ];
}
