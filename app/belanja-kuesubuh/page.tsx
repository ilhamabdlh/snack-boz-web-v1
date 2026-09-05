import Image from "next/image";
import type { BelanjaLink } from "@/lib/belanja-links";
import { getBelanjaLinks } from "@/lib/belanja-links";
import { BRAND } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Belanja Kue Subuh",
  description:
    "Order kue basah & snack box Pasar Senen Kue Subuh lewat website, Shopee, Tokopedia, Instagram, atau WhatsApp.",
  path: "/belanja-kuesubuh",
  keywords: [
    "belanja kue subuh",
    "order kue basah",
    "shopee kue subuh",
    "tokopedia kue basah",
    "Pasar Senen Kue Subuh",
  ],
});

const ICON_SRC: Record<BelanjaLink["tone"], string> = {
  website: "/belanja/icons/website.png",
  shopee: "/belanja/icons/shopee.png",
  tokopedia: "/belanja/icons/tokopedia.png",
  instagram: "/belanja/icons/instagram.jpg",
  whatsapp: "/belanja/icons/whatsapp.png",
};

const TONE_CLASS: Record<BelanjaLink["tone"], string> = {
  website:
    "bg-[linear-gradient(135deg,#143528_0%,#1b4332_55%,#2d6a4f_100%)] text-white shadow-[0_16px_36px_rgba(0,0,0,0.28)]",
  shopee:
    "bg-[linear-gradient(135deg,#ee4d2d_0%,#ff6a3d_100%)] text-white shadow-[0_16px_36px_rgba(238,77,45,0.35)]",
  tokopedia:
    "bg-[linear-gradient(135deg,#02990c_0%,#03ac0e_55%,#42b549_100%)] text-white shadow-[0_16px_36px_rgba(3,172,14,0.3)]",
  whatsapp:
    "bg-[linear-gradient(135deg,#128c7e_0%,#25d366_100%)] text-white shadow-[0_16px_36px_rgba(37,211,102,0.32)]",
  instagram:
    "bg-[linear-gradient(135deg,#f58529_0%,#dd2a7b_45%,#8134af_78%,#515bd4_100%)] text-white shadow-[0_16px_36px_rgba(221,42,123,0.32)]",
};

export default function BelanjaKueSubuhPage() {
  const links = getBelanjaLinks();
  const primary = links.filter((link) => link.group === "primary");
  const secondary = links.filter((link) => link.group === "secondary");

  return (
    <main className="belanja-hub relative min-h-dvh overflow-hidden">
      <div className="belanja-hub__bg" aria-hidden>
        <Image
          src="/belanja/kue-bg-v2.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="belanja-hub__veil" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[28rem] flex-col px-5 pb-10 pt-9 sm:px-6 sm:pt-12">
        <header className="belanja-hub__intro flex flex-col items-center text-center">
          <div className="belanja-hub__logo relative mx-auto aspect-[839/467] w-[min(92vw,22rem)] sm:w-[24rem]">
            <Image
              src="/belanja/snack-boz-logo.png"
              alt="The Snack Boz"
              fill
              priority
              sizes="(max-width: 640px) 92vw, 384px"
              className="object-contain object-center drop-shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
            />
          </div>

          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">
            {BRAND.name}
          </p>
          <h1 className="font-display mt-2 text-[2rem] font-bold leading-none tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-[2.35rem]">
            Belanja Kue Subuh
          </h1>
          <p className="mt-3 max-w-[22rem] text-sm leading-6 text-white/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
            Menjual aneka kue basah dan kering. Silakan order melalui store di
            bawah.
          </p>
        </header>

        <nav className="mt-8 flex flex-1 flex-col gap-3" aria-label="Link belanja">
          {primary.map((link, index) => (
            <HubLink key={link.id} link={link} index={index} />
          ))}

          <div className="belanja-hub__divider my-2" aria-hidden>
            <span />
            <svg viewBox="0 0 20 20" className="size-4 fill-none stroke-current">
              <path
                d="M5 8l5 5 5-5"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span />
          </div>

          {secondary.map((link, index) => (
            <HubLink
              key={link.id}
              link={link}
              index={primary.length + index}
            />
          ))}
        </nav>

        <footer className="mt-10 text-center">
          <p className="text-[11px] leading-4 tracking-wide text-white/65">
            {BRAND.legalName}
            <br />
            {BRAND.location}
          </p>
        </footer>
      </div>
    </main>
  );
}

function HubLink({ link, index }: { link: BelanjaLink; index: number }) {
  const className = cn(
    "belanja-hub__link group relative flex min-h-[4.75rem] items-center gap-3.5 overflow-hidden rounded-[18px] px-4 py-3.5 transition-[transform,box-shadow] duration-300 ease-out",
    "hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(0,0,0,0.28)] active:translate-y-0 active:scale-[0.985]",
    TONE_CLASS[link.tone],
  );
  const style = { animationDelay: `${120 + index * 70}ms` } as const;

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
    >
      <span className="belanja-hub__icon relative size-12 shrink-0 overflow-hidden rounded-full bg-white shadow-[0_6px_16px_rgba(0,0,0,0.18)]">
        <Image
          src={ICON_SRC[link.tone]}
          alt=""
          fill
          sizes="48px"
          className={cn(
            "object-contain",
            link.tone === "instagram" || link.tone === "whatsapp"
              ? "object-cover p-0"
              : "p-1.5",
            link.tone === "website" && "p-1",
            link.tone === "tokopedia" && "p-1",
          )}
        />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-[0.95rem] font-extrabold uppercase tracking-[0.04em]">
          {link.title}
        </span>
        <span className="mt-0.5 block text-[12px] leading-4 text-white/90">
          {link.description}
        </span>
      </span>
      <span className="belanja-hub__arrow grid size-8 shrink-0 place-items-center rounded-full bg-black/15 text-current opacity-90 transition-transform duration-300 group-hover:translate-x-0.5">
        <svg viewBox="0 0 20 20" className="size-4 fill-none stroke-current">
          <path
            d="M7 4l6 6-6 6"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  );
}
