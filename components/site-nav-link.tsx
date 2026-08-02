"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type SiteNavLinkProps = {
  href: string;
  children: React.ReactNode;
  match?: "exact" | "prefix";
  className?: string;
};

export function SiteNavLink({
  href,
  children,
  match = "exact",
  className,
}: SiteNavLinkProps) {
  const pathname = usePathname();
  const active =
    match === "exact"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-colors duration-200",
        active
          ? "bg-[var(--yellow-soft)] font-semibold text-[var(--green)]"
          : "text-[var(--black)] hover:bg-[var(--yellow-soft)]",
        className,
      )}
    >
      {children}
    </Link>
  );
}
