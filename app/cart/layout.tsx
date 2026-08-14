import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Keranjang",
  description: "Keranjang belanja Pasar Senen Kue Subuh.",
  path: "/cart",
  index: false,
});

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
