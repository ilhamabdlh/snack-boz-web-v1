import Image from "next/image";
import { BRAND } from "@/lib/brand";
import { STORE_LINKS } from "@/lib/belanja-links";
import { formatWhatsAppDisplay, getWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type MarketplaceLinksProps = {
  className?: string;
  /** Compact icon-only for header (Shopee + Tokopedia) */
  compact?: boolean;
  /** Light text on dark footer */
  light?: boolean;
  /** Include WhatsApp, Instagram, Threads in the list (footer) */
  withSocial?: boolean;
};

type LinkItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
  cover?: boolean;
};

const marketplaceItems: LinkItem[] = [
  {
    id: "shopee",
    label: "Shopee",
    href: STORE_LINKS.shopee,
    icon: "/belanja/icons/shopee.png",
  },
  {
    id: "tokopedia",
    label: "Tokopedia",
    href: STORE_LINKS.tokopedia,
    icon: "/belanja/icons/tokopedia.png",
  },
];

function socialItems(): LinkItem[] {
  return [
    {
      id: "whatsapp",
      label: formatWhatsAppDisplay(),
      href: getWhatsAppUrl(BRAND.waGreeting),
      icon: "/belanja/icons/whatsapp.png",
      cover: true,
    },
    {
      id: "instagram",
      label: `@${BRAND.instagram}`,
      href: STORE_LINKS.instagram,
      icon: "/belanja/icons/instagram.jpg",
      cover: true,
    },
    {
      id: "threads",
      label: `@${BRAND.threads}`,
      href: `https://www.threads.net/@${BRAND.threads}`,
      icon: "/belanja/icons/threads.png",
    },
  ];
}

function IconBadge({
  icon,
  cover = false,
  size = "md",
}: {
  icon: string;
  cover?: boolean;
  size?: "sm" | "md";
}) {
  const shell = size === "sm" ? "size-9" : "size-7";
  const inner = size === "sm" ? "size-5" : "size-[1.125rem]";

  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-white",
        shell,
        size === "sm" && "outline outline-1 outline-[rgba(27,67,50,0.12)]",
      )}
    >
      <span className={cn("relative", cover ? "size-full" : inner)}>
        <Image
          src={icon}
          alt=""
          fill
          sizes={size === "sm" ? "36px" : "28px"}
          className={cover ? "object-cover" : "object-contain"}
        />
      </span>
    </span>
  );
}

export function MarketplaceLinks({
  className,
  compact = false,
  light = false,
  withSocial = false,
}: MarketplaceLinksProps) {
  const items = withSocial
    ? [...socialItems(), ...marketplaceItems]
    : marketplaceItems;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {marketplaceItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            title={item.label}
            className="transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]"
          >
            <IconBadge icon={item.icon} size="sm" />
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-2.5", className)}>
      {items.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-2.5 text-sm transition-colors",
            light
              ? "text-white/75 hover:text-white"
              : "text-[var(--muted)] hover:text-[var(--green)]",
          )}
        >
          <IconBadge icon={item.icon} cover={item.cover} />
          {item.label}
        </a>
      ))}
    </div>
  );
}
