"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { occasionCopy } from "@/lib/data";

type OccasionCarouselProps = {
  occasions: string[];
  images: string[];
};

export function OccasionCarousel({ occasions, images }: OccasionCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-occasion-card]");
    const step = (card?.offsetWidth ?? 240) + 16;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div className="mb-3 flex justify-end gap-2 sm:absolute sm:-top-14 sm:right-0 sm:mb-0">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          className="grid size-9 place-items-center rounded-full border border-[var(--line)] bg-white text-[var(--green)] shadow-[var(--shadow-sm)] transition-transform hover:scale-105 active:scale-95"
          aria-label="Geser ke kiri"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          className="grid size-9 place-items-center rounded-full border border-[var(--line)] bg-white text-[var(--green)] shadow-[var(--shadow-sm)] transition-transform hover:scale-105 active:scale-95"
          aria-label="Geser ke kanan"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div
        ref={scrollerRef}
        className="hide-scrollbar -mx-1 flex gap-4 overflow-x-auto scroll-smooth px-1 pb-2"
      >
        {occasions.map((occasion, index) => (
          <Link
            href={`/products?occasion=${encodeURIComponent(occasion)}`}
            key={occasion}
            data-occasion-card
            className="group w-[220px] shrink-0 overflow-hidden rounded-[var(--radius-lg)] bg-white shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow)] sm:w-[240px]"
          >
            <div className="relative aspect-[5/3.2] overflow-hidden bg-[var(--rice)]">
              <Image
                src={images[index % images.length]}
                alt={occasion}
                fill
                sizes="240px"
                quality={70}
                className="object-cover object-[center_72%] transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex min-h-[108px] flex-col p-3.5 sm:p-4">
              <div className="font-display text-base font-bold text-[var(--palm)] sm:text-lg">
                {occasion}
              </div>
              <p className="mt-1 line-clamp-2 text-pretty text-xs leading-5 text-[var(--muted)]">
                {occasionCopy[occasion]}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
