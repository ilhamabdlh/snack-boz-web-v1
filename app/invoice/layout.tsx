import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Invoice",
  description: "Invoice pesanan.",
  path: "/invoice",
  index: false,
});

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
