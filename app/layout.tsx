import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans } from "next/font/google";
import { AppProviders } from "@/components/app-providers";
import { BRAND } from "@/lib/brand";
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

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: `${BRAND.name} | Kue basah & snack box untuk acara di ${BRAND.deliveryArea}`,
  description: `${BRAND.tagline}. Lebih dari 50 pilihan kue basah: lemper, risoles, pastel, nagasari, sampai kue tampah. Mulai Rp 5.000 per pcs. ${BRAND.orderLead}. Antar ${BRAND.deliveryArea}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${sans.variable} ${display.variable}`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
