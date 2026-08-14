import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import { faqs } from "@/lib/faq";
import type { Product } from "@/lib/data";

export const SITE_URL = BRAND.siteUrl;
export const DEFAULT_OG_IMAGE = `${SITE_URL}/poster/poster1.webp`;

export const LOCAL_BUSINESS = {
  streetAddress: "Pasar Senen Jaya",
  addressLocality: "Jakarta Pusat",
  addressRegion: "DKI Jakarta",
  postalCode: "10410",
  addressCountry: "ID",
  latitude: -6.1764,
  longitude: 106.8413,
  areaServed: ["Jakarta", "Bogor", "Depok", "Tangerang", "Bekasi"],
} as const;

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  index = true,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  index?: boolean;
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ? absoluteUrl(image) : DEFAULT_OG_IMAGE;
  const fullTitle = title.includes(BRAND.name) ? title : `${title} | ${BRAND.name}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url,
      siteName: BRAND.name,
      title: fullTitle,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: BRAND.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: BRAND.name,
    alternateName: ["The Snack Boz", "Snack Boz", BRAND.shortName],
    url: SITE_URL,
    logo: absoluteUrl("/brand/snack-boz-logo.png"),
    image: DEFAULT_OG_IMAGE,
    sameAs: [
      `https://instagram.com/${BRAND.instagram}`,
      `https://www.threads.net/@${BRAND.threads}`,
      `https://wa.me/${BRAND.whatsappFallback}`,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: `+${BRAND.whatsappFallback}`,
      areaServed: "ID",
      availableLanguage: ["Indonesian"],
    },
  };
}

export function localBusinessSchema() {
  return {
    "@type": "Bakery",
    "@id": `${SITE_URL}/#localbusiness`,
    name: BRAND.name,
    description: `${BRAND.tagline}. Kue basah, snack box, kue tampah, dan makanan berat untuk acara di ${BRAND.deliveryArea}. ${BRAND.orderLead}.`,
    url: SITE_URL,
    telephone: `+${BRAND.whatsappFallback}`,
    image: [DEFAULT_OG_IMAGE, absoluteUrl("/brand/snack-boz-logo.png")],
    logo: absoluteUrl("/brand/snack-boz-logo.png"),
    priceRange: "Rp 4.000 – Rp 198.000",
    currenciesAccepted: "IDR",
    paymentAccepted: "Transfer Bank, QRIS",
    foundingLocation: LOCAL_BUSINESS.addressLocality,
    address: {
      "@type": "PostalAddress",
      streetAddress: LOCAL_BUSINESS.streetAddress,
      addressLocality: LOCAL_BUSINESS.addressLocality,
      addressRegion: LOCAL_BUSINESS.addressRegion,
      postalCode: LOCAL_BUSINESS.postalCode,
      addressCountry: LOCAL_BUSINESS.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: LOCAL_BUSINESS.latitude,
      longitude: LOCAL_BUSINESS.longitude,
    },
    areaServed: LOCAL_BUSINESS.areaServed.map((name) => ({
      "@type": "City",
      name,
    })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${LOCAL_BUSINESS.latitude},${LOCAL_BUSINESS.longitude}`,
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BRAND.name,
    inLanguage: "id-ID",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function faqPageSchema() {
  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productSchema(product: Product) {
  return {
    "@type": "Product",
    "@id": `${absoluteUrl(`/products/${product.slug}`)}#product`,
    name: product.name,
    description: product.description,
    image: absoluteUrl(product.image),
    sku: product.slug,
    category: product.category,
    brand: { "@id": `${SITE_URL}/#organization` },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.slug}`),
      priceCurrency: "IDR",
      price: product.price,
      availability: product.readySoon
        ? "https://schema.org/PreOrder"
        : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${SITE_URL}/#localbusiness` },
    },
  };
}

export function itemListSchema(
  products: Product[],
  listName: string,
  path: string,
) {
  return {
    "@type": "ItemList",
    name: listName,
    url: absoluteUrl(path),
    numberOfItems: products.length,
    itemListElement: products.slice(0, 24).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/products/${product.slug}`),
      name: product.name,
    })),
  };
}

export function graphSchema(nodes: Record<string, unknown>[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
