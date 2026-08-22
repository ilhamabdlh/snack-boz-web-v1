import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans } from "next/font/google";
import { AppProviders } from "@/components/app-providers";
import { JsonLd } from "@/components/json-ld";
import { BRAND } from "@/lib/brand";
import {
  DEFAULT_OG_IMAGE,
  SITE_URL,
  graphSchema,
  localBusinessSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Lora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const defaultTitle = `${BRAND.name} | Kue basah & snack box untuk acara di ${BRAND.deliveryArea}`;
const defaultDescription = `${BRAND.tagline}. Lebih dari 50 pilihan kue basah: lemper, risoles, pastel, nagasari, sampai kue tampah. Mulai Rp 5.000 per pcs. ${BRAND.orderLead}. Antar ${BRAND.deliveryArea}.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: `%s | ${BRAND.name}`,
  },
  description: defaultDescription,
  applicationName: BRAND.name,
  keywords: [
    "kue basah Jakarta",
    "snack box Jabodetabek",
    "kue tampah",
    "Pasar Senen Kue Subuh",
    "katering arisan",
    "snack box rapat kantor",
    "kue pengajian",
  ],
  authors: [{ name: BRAND.name, url: SITE_URL }],
  creator: BRAND.name,
  publisher: BRAND.name,
  category: "food",
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: BRAND.name,
    title: defaultTitle,
    description: defaultDescription,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: BRAND.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "500x500" },
    ],
    apple: "/icon.png",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${sans.variable} ${display.variable}`}>
      <body>
        <JsonLd
          data={graphSchema([
            organizationSchema(),
            localBusinessSchema(),
            websiteSchema(),
          ])}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
