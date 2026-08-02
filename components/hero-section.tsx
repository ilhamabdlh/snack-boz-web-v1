"use client";

import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Clock,
  Gift,
  MessageCircle,
  Quote,
  Star,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, products } from "@/lib/data";
import { cn, rupiah } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/whatsapp";

import img1 from "../remove_bg/1.png";
import img2 from "../remove_bg/2.png";
import img3 from "../remove_bg/3.png";
import img4 from "../remove_bg/4.png";
import img5 from "../remove_bg/5.png";
import img6 from "../remove_bg/6.png";
import img7 from "../remove_bg/7.png";
import img8 from "../remove_bg/8.png";
import img9 from "../remove_bg/9.png";
import img10 from "../remove_bg/10.png";
import img11 from "../remove_bg/11.png";
import img12 from "../remove_bg/12.png";

const SLIDE_CONFIG: { slug: string; image: StaticImageData }[] = [
  { slug: "dadar-gulung", image: img3 },
  { slug: "risol-rogut", image: img2 },
  { slug: "lemper-isi-ayam", image: img1 },
  { slug: "kue-lapis-legit", image: img4 },
  { slug: "kroket-isi-daging", image: img5 },
  { slug: "bolu-gulung-pelangi", image: img6 },
  { slug: "gabin-tape", image: img7 },
  { slug: "ketan-serundeng", image: img8 },
  { slug: "bakwan-udang", image: img9 },
  { slug: "donat-gula-halus", image: img10 },
  { slug: "bolu-karamel", image: img11 },
  { slug: "cantik-manis", image: img12 },
];

const OCCASION_ICONS = {
  "Rapat Kantor": Briefcase,
  Arisan: Calendar,
  "Hari Raya": Gift,
} as const;

const AUTOPLAY_MS = 5500;
const SWIPE_THRESHOLD = 36;
const TRANSITION_MS = 700;

/** Offset sirkular terdekat (-n/2 … n/2) agar wrap next/prev tetap animasi natural */
function circularOffset(i: number, active: number, count: number) {
  let offset = i - active;
  if (offset > count / 2) offset -= count;
  if (offset < -count / 2) offset += count;
  return offset;
}

type HeroSectionProps = {
  featured: Product[];
  occasions: string[];
};

export function HeroSection({ occasions }: HeroSectionProps) {
  const slides = useMemo(
    () =>
      SLIDE_CONFIG.map(({ slug, image }) => {
        const product = products.find((p) => p.slug === slug);
        return product ? { product, image } : null;
      }).filter((slide): slide is { product: Product; image: StaticImageData } => slide !== null),
    [],
  );

  const slideCount = slides.length;
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const lockRef = useRef(false);

  const current = slides[index];

  const goTo = useCallback(
    (nextIndex: number) => {
      if (slideCount === 0 || lockRef.current) return;
      const normalized = ((nextIndex % slideCount) + slideCount) % slideCount;
      if (normalized === index) return;

      lockRef.current = true;
      setIsAnimating(true);
      setIndex(normalized);

      window.setTimeout(() => {
        lockRef.current = false;
        setIsAnimating(false);
      }, TRANSITION_MS);
    },
    [slideCount, index],
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    if (slideCount <= 1 || isPaused) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const timer = window.setInterval(() => goTo(index + 1), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [slideCount, isPaused, index, goTo]);

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = touchStartX.current - endX;
    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      if (delta > 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  if (!current) return null;

  return (
    <section className="hero-cream relative overflow-hidden border-b border-[var(--line)]">
      <div className="hero-dots hero-dots-tl pointer-events-none" aria-hidden />
      <div className="hero-dots hero-dots-br pointer-events-none" aria-hidden />

      <div className="container-shell relative py-8 sm:py-10 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 xl:gap-14">
          <div className="relative z-[var(--z-raised)] max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-white px-3.5 py-1.5 text-xs font-medium text-[var(--green)] shadow-[var(--shadow-sm)]">
              <ChefHat className="size-3.5 shrink-0" />
              Kue & catering acara, Jabodetabek
            </div>

            <h1 className="font-display mt-4 text-balance text-[1.85rem] font-bold leading-[1.12] text-[var(--green)] sm:mt-5 sm:text-[2.4rem] lg:text-[3rem] lg:leading-[1.1]">
              Pilihan{" "}
              <span className="relative inline-block">
                <span className="hero-spark-lines" aria-hidden>
                  <span />
                  <span />
                  <span />
                </span>
                <span className="hero-highlight">#1</span>
              </span>{" "}
              kue & snack box untuk acara Anda.
            </h1>

            <p className="mt-3 max-w-[36ch] text-pretty text-sm leading-6 text-[var(--muted)] sm:mt-4 sm:text-[0.95rem] sm:leading-7">
              Lemper, risoles, tampah, hingga paket kantor. Dibuat sesuai jadwal
              pesanan dan dikirim tepat waktu ke lokasi acara.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-6 sm:gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a
                  href={getWhatsAppUrl("Halo Snack Boz, saya ingin pesan kue/snack box.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pesan Sekarang
                  <MessageCircle className="size-4" />
                </a>
              </Button>
              <Link
                href="/products"
                className="inline-flex h-11 items-center gap-1.5 px-2 text-sm font-semibold text-[var(--green)] transition-colors hover:text-[var(--green-mid)]"
              >
                Lihat Menu
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 sm:mt-7">
              {occasions.map((item) => {
                const Icon = OCCASION_ICONS[item as keyof typeof OCCASION_ICONS] ?? Briefcase;
                return (
                  <Link key={item} href={`/products?occasion=${encodeURIComponent(item)}`} className="chip">
                    <Icon className="size-3.5 shrink-0" />
                    {item}
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 max-w-md rounded-[var(--radius)] bg-white p-3.5 shadow-[var(--shadow-sm)] sm:mt-8 sm:p-4">
              <Quote className="size-4 text-[var(--green)]/40" aria-hidden />
              <p className="mt-2 text-sm leading-6 text-[var(--cocoa)]">
                Snack Boz jadi andalan rapat kantor kami. Rapi, tepat waktu, dan
                isi box bisa disesuaikan.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                <span className="font-semibold text-[var(--black)]">Sari Prameswari</span>
                <span className="text-[var(--muted)]">- Admin HR, Jakarta</span>
                <span className="flex text-[#e6a800] sm:ml-auto" aria-label="5 dari 5 bintang">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </span>
              </div>
            </div>
          </div>

          <div
            className="relative z-[var(--z-raised)] mx-auto w-full max-w-[560px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="relative min-h-[4.75rem] min-w-0 flex-1">
                {slides.map((slide, i) => (
                  <div
                    key={slide.product.slug}
                    className={cn(
                      "hero-copy-layer absolute inset-x-0 top-0 pr-2",
                      i === index ? "is-active" : "is-idle",
                    )}
                    aria-hidden={i !== index}
                  >
                    <p className="text-xs font-medium text-[var(--muted)]">Pilihan hari ini</p>
                    <Link
                      href={`/products/${slide.product.slug}`}
                      tabIndex={i === index ? 0 : -1}
                      className="font-display block truncate text-2xl font-bold text-[var(--green)]"
                    >
                      {slide.product.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-[var(--muted)]">
                      <span className="font-semibold tabular-nums text-[var(--green)]">
                        {rupiah(slide.product.price)}
                      </span>
                      {" / min. 20 pcs (bisa mix)"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex shrink-0 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={isAnimating}
                  className="grid size-9 cursor-pointer place-items-center rounded-full border border-[var(--line)] bg-white transition-transform duration-200 hover:scale-105 active:scale-95 disabled:opacity-60"
                  aria-label="Produk sebelumnya"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={isAnimating}
                  className="grid size-9 cursor-pointer place-items-center rounded-full border border-[var(--line)] bg-white transition-transform duration-200 hover:scale-105 active:scale-95 disabled:opacity-60"
                  aria-label="Produk berikutnya"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {/* Coverflow: semua item ukuran sama, posisi + scale + opacity bergerak */}
            <div className="hero-coverflow relative mx-auto h-[300px] w-full sm:h-[380px] lg:h-[440px]">
              {slides.map((slide, i) => {
                const offset = circularOffset(i, index, slideCount);
                const abs = Math.abs(offset);
                const isActive = offset === 0;
                const isSide = abs === 1;
                const isVisible = abs <= 1;

                return (
                  <div
                    key={slide.product.slug}
                    className={cn(
                      "hero-cover-item absolute left-1/2 top-1/2",
                      isActive && "is-active",
                      isSide && "is-side",
                      !isVisible && "is-hidden",
                    )}
                    style={
                      {
                        "--offset": offset,
                      } as React.CSSProperties
                    }
                  >
                    <Link
                      href={`/products/${slide.product.slug}`}
                      tabIndex={isActive ? 0 : -1}
                      className="hero-cover-frame relative block"
                      aria-hidden={!isVisible}
                    >
                      <Image
                        src={slide.image}
                        alt={slide.product.name}
                        fill
                        sizes="(max-width: 640px) 300px, 360px"
                        className="hero-food-shadow object-contain"
                        style={{ background: "transparent" }}
                        priority={i < 3}
                      />
                      <span
                        className={cn(
                          "absolute right-1 top-3 z-[1] inline-flex items-center gap-1 rounded-[6px] bg-[var(--green)] px-2.5 py-1 text-[0.58rem] font-bold uppercase text-[var(--white)] transition-opacity duration-500",
                          isActive ? "opacity-100" : "opacity-0",
                        )}
                      >
                        <Clock className="size-2.5" />
                        Siap besok
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[var(--green)]">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <UtensilsCrossed className="size-3.5 opacity-70" />
                <span className="tabular-nums font-bold">90+</span> menu
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Calendar className="size-3.5 opacity-70" />
                Min. <span className="tabular-nums font-bold">20</span> pcs
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Truck className="size-3.5 opacity-70" />
                <span className="font-bold">H+1</span> siap kirim
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
