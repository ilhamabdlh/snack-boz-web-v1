"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PosterItem } from "@/lib/posters";

export function PosterCarousel({ posters }: { posters: PosterItem[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-poster-card]");
    const step = (card?.offsetWidth ?? 280) + 16;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  if (posters.length === 0) return null;

  return (
    <div className="relative">
      <div className="mb-3 flex justify-end gap-2 sm:absolute sm:-top-14 sm:right-0 sm:mb-0">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          className="grid size-9 place-items-center rounded-full border border-[var(--line)] bg-white text-[var(--green)] shadow-[var(--shadow-sm)] transition-transform hover:scale-105 active:scale-95"
          aria-label="Geser poster ke kiri"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          className="grid size-9 place-items-center rounded-full border border-[var(--line)] bg-white text-[var(--green)] shadow-[var(--shadow-sm)] transition-transform hover:scale-105 active:scale-95"
          aria-label="Geser poster ke kanan"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div
        ref={scrollerRef}
        className="hide-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2"
      >
        {posters.map((poster) => (
          <Link
            key={poster.src}
            href={poster.href}
            data-poster-card
            className="group w-[min(78vw,300px)] shrink-0 snap-start overflow-hidden rounded-[var(--radius-lg)] bg-[var(--rice)] shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow)] sm:w-[280px] lg:w-[300px]"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={poster.src}
                alt={poster.alt}
                fill
                sizes="(max-width: 640px) 78vw, 300px"
                quality={75}
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
