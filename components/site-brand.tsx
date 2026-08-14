import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function SiteBrand({
  href = "/",
  className,
  compact = false,
  onClick,
}: {
  href?: string;
  className?: string;
  compact?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("flex min-w-0 shrink-0 flex-col leading-none", className)}
      aria-label={BRAND.name}
    >
      <span
        className={cn(
          "font-display font-bold tracking-tight text-[var(--green)]",
          compact ? "text-[0.95rem] sm:text-[1.05rem]" : "text-[1.05rem] sm:text-[1.2rem]",
        )}
      >
        Pasar Senen
      </span>
      <span
        className={cn(
          "font-display relative mt-0.5 inline-block font-bold tracking-tight",
          compact ? "text-[0.78rem] sm:text-[0.88rem]" : "text-[0.82rem] sm:text-[0.95rem]",
        )}
      >
        <span className="brand-spark-lines" aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <span className="brand-highlight">Kue Subuh</span>
      </span>
    </Link>
  );
}

export function SiteBrandMark({
  className,
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={cn("leading-none", className)} aria-label={BRAND.name}>
      <div
        className={cn(
          "font-display text-2xl font-bold",
          light ? "text-white" : "text-[var(--green)]",
        )}
      >
        Pasar Senen
      </div>
      <div
        className={cn(
          "font-display mt-0.5 text-lg font-semibold",
          light ? "text-[var(--yellow)]" : "text-[var(--black)]",
        )}
      >
        Kue Subuh
      </div>
    </div>
  );
}
