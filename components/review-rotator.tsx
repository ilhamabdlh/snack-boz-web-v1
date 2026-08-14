"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const REVIEWS = [
  {
    quote:
      "Pesan 120 snack buat pengajian kemarin, jam 6 pagi udah nongol di depan rumah. Risolesnya masih anget banget, ibu-ibu pada nambah.",
    name: "Bu Yanti",
    meta: "panitia pengajian, Bekasi",
  },
  {
    quote:
      "Kalau mau arisan, saya tinggal chat aja. Mau campur lemper, pastel, nagasari, pokoknya praktis banget. Anak-anak juga doyan semua.",
    name: "Mba Rina",
    meta: "ibu rumah tangga, Depok",
  },
  {
    quote:
      "Kantor udah langganan di sini, snack box-nya selalu rapi, tinggal terima jadi. ga repot mikirin mau suguhin kue apa.",
    name: "Pak Andi",
    meta: "admin kantor, Jakarta Pusat",
  },
  {
    quote:
      "Kue tampahnya rekomen banget buat kumpul keluarga. semua pada suka, seller juga kasih kue-kue yang enak dan menarik buat dimakan, jadi cantik tampahnya.",
    name: "Bu Sari",
    meta: "hajatan keluarga, Tangerang",
  },
  {
    quote:
      "Dari Senen ke Bekasi selalu ontime. Admin WA-nya gercep banget response nya, cocok kalau lagi buru-buru pesen dadakan.",
    name: "Kak Dina",
    meta: "ulang tahun anak, Bekasi",
  },
] as const;

const ROTATE_MS = 5500;

export function ReviewRotator({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % REVIEWS.length);
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [paused]);

  const current = REVIEWS[index];

  return (
    <div
      className={cn(
        "relative max-w-md rounded-[var(--radius)] bg-white p-3.5 shadow-[var(--shadow-sm)] sm:p-4",
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-live="polite"
    >
      <Quote className="size-4 text-[var(--green)]/40" aria-hidden />
      <div className="relative mt-2 min-h-[5.5rem]">
        {REVIEWS.map((review, i) => (
          <div
            key={review.name}
            className={cn(
              "absolute inset-0 transition-opacity duration-500",
              i === index ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            aria-hidden={i !== index}
          >
            <p className="text-sm leading-6 text-[var(--cocoa)]">{review.quote}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
              <span className="font-semibold text-[var(--black)]">{review.name}</span>
              <span className="text-[var(--muted)]">{review.meta}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-1.5" aria-label="Navigasi ulasan">
        {REVIEWS.map((review, i) => (
          <button
            key={review.name}
            type="button"
            aria-label={`Ulasan ${i + 1}`}
            aria-current={i === index}
            className={cn(
              "h-1.5 rounded-full transition-[width,background-color] duration-300",
              i === index
                ? "w-5 bg-[var(--green)]"
                : "w-1.5 bg-[var(--line)] hover:bg-[var(--muted)]",
            )}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
      <span className="sr-only">
        Ulasan dari {current.name}: {current.quote}
      </span>
    </div>
  );
}
