import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Akun",
  description: "Riwayat pesanan dan profil.",
  path: "/account",
  index: false,
});

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
