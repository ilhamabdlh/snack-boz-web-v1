import { JsonLd } from "@/components/json-ld";
import {
  SITE_URL,
  breadcrumbSchema,
  faqPageSchema,
  graphSchema,
  pageMetadata,
} from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Susun snack box",
  description:
    "Susun snack box sendiri: pilih 3–5 macam kue, dengan atau tanpa air mineral, tentukan jumlah dan jadwal antar. Minimal 10 box. Antar Jabodetabek.",
  path: "/snack-box",
  keywords: ["snack box Jakarta", "snack box rapat", "katering snack box"],
});

export default function SnackBoxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={graphSchema([
          faqPageSchema(`${SITE_URL}/snack-box#faq`),
          breadcrumbSchema([
            { name: "Beranda", path: "/" },
            { name: "Snack Box", path: "/snack-box" },
          ]),
        ])}
      />
      {children}
    </>
  );
}
