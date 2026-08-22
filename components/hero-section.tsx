"use client";

import Link from "next/link";
import Image from "next/image";
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
  Truck,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewRotator } from "@/components/review-rotator";
import { Product, products } from "@/lib/data";
import { BRAND } from "@/lib/brand";
import { cn, rupiah } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import heroCarousel from "@/data/hero-carousel.json";

type HeroSlide = {
  product: Product | null;
  slug: string;
  name: string;
  image: string;
  href: string;
  price?: number;
  minOrder?: number;
};

const OCCASION_ICONS = {
  Arisan: Calendar,
  Pengajian: Users,
  "Rapat Kantor": Briefcase,
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
  const slides = useMemo<HeroSlide[]>(
    () =>
      heroCarousel.map((entry) => {
        const product = products.find((p) => p.slug === entry.slug) ?? null;
        return {
          product,
          slug: entry.slug,
          name: product?.name ?? entry.name,
          image: entry.image,
          href: product ? `/products/${product.slug}` : "/products",
          price: product?.price,
          minOrder: product?.minOrder,
        };
      }),
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
          <div className="relative z-[var(--z-raised)] order-1 max-w-xl lg:col-start-1 lg:row-start-1">
            <div className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-white px-3.5 py-1.5 text-xs font-medium text-[var(--green)] shadow-[var(--shadow-sm)]">
              <ChefHat className="size-3.5 shrink-0" />
              Dapur kue basah · antar Jabodetabek
            </div>

            <h1 className="font-display mt-4 text-balance text-[1.85rem] font-bold leading-[1.12] text-[var(--green)] sm:mt-5 sm:text-[2.4rem] lg:text-[3rem] lg:leading-[1.1]">
              Kue Tradisional Indonesia terlengkap di{" "}
              <span className="relative inline-block">
                <span className="hero-spark-lines" aria-hidden>
                  <span />
                  <span />
                  <span />
                </span>
                <span className="hero-highlight">Jakarta</span>
              </span>
              , selalu fresh dan lezat.
            </h1>

            <p className="mt-3 max-w-[38ch] text-pretty text-sm leading-6 text-[var(--muted)] sm:mt-4 sm:text-[0.95rem] sm:leading-7">
              Lebih dari 50 pilihan kue tradisional: lemper, risoles, pastel, nagasari, sampai
              kue tampah pun ada. kita buat kue tiap hari, jadi dijamin fresh dan lezat. Mulai Rp 2.000 per pcs
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-6 sm:gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a
                  href={getWhatsAppUrl(
                    `${BRAND.waGreeting}, saya mau tanya menu dan jadwal antar.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tanya lewat WhatsApp
                  <MessageCircle className="size-4" />
                </a>
              </Button>
              <Link
                href="/products"
                className="inline-flex h-11 items-center gap-1.5 px-2 text-sm font-semibold text-[var(--green)] transition-colors hover:text-[var(--green-mid)]"
              >
                Lihat menu
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
          </div>

          <div
            className="relative z-[var(--z-raised)] order-2 mx-auto w-full max-w-[560px] lg:col-start-2 lg:row-span-2 lg:row-start-1"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="relative min-h-[4.75rem] min-w-0 flex-1">
                {slides.map((slide, i) => (
                  <div
                    key={slide.slug}
                    className={cn(
                      "hero-copy-layer absolute inset-x-0 top-0 pr-2",
                      i === index ? "is-active" : "is-idle",
                    )}
                    aria-hidden={i !== index}
                  >
                    <p className="text-xs font-medium text-[var(--muted)]">Menu pilihan</p>
                    <Link
                      href={slide.href}
                      tabIndex={i === index ? 0 : -1}
                      className="font-display block truncate text-2xl font-bold text-[var(--green)]"
                    >
                      {slide.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-[var(--muted)]">
                      {slide.price != null ? (
                        <>
                          <span className="font-semibold tabular-nums text-[var(--green)]">
                            {rupiah(slide.price)}
                          </span>
                          {slide.minOrder && slide.minOrder > 1
                            ? ` / min. ${slide.minOrder} pcs`
                            : " / pcs"}
                        </>
                      ) : (
                        "Lihat semua menu"
                      )}
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
                    key={slide.slug}
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
                      href={slide.href}
                      tabIndex={isActive ? 0 : -1}
                      className="hero-cover-frame relative block"
                      aria-hidden={!isVisible}
                    >
                      <Image
                        src={slide.image}
                        alt={slide.name}
                        fill
                        sizes="(max-width: 640px) 300px, 360px"
                        quality={75}
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
                         Favorit Warga!
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[var(--green)]">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <UtensilsCrossed className="size-3.5 opacity-70" />
                <span className="tabular-nums font-bold">50+</span> pilihan menu
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Calendar className="size-3.5 opacity-70" />
                Min. <span className="tabular-nums font-bold">20</span> pcs, boleh campur
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Truck className="size-3.5 opacity-70" />
                Pemesanan H-1
              </span>
            </div>
          </div>

          <ReviewRotator className="order-3 mt-2 sm:mt-0 lg:col-start-1 lg:row-start-2 lg:mt-8" />
        </div>
      </div>
    </section>
  );
}
