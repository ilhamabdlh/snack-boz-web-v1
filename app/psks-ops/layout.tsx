import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ops Console",
  robots: { index: false, follow: false, nocache: true },
};

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
