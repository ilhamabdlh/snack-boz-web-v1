"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/data";

const PAGE_SIZE = 12;

export function ProductInfiniteGrid({ products }: { products: Product[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const productKey = useMemo(
    () => products.map((product) => product.slug).join("|"),
    [products],
  );

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [productKey]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setVisibleCount((current) => Math.min(current + PAGE_SIZE, products.length));
      },
      { root: null, rootMargin: "320px 0px", threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [products.length, productKey]);

  const visible = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return (
    <div>
      <div className="product-grid">
        {visible.map((product) => (
          <ProductCard key={product.slug} product={product} compact />
        ))}
      </div>

      {hasMore ? (
        <div
          ref={sentinelRef}
          className="mt-8 flex flex-col items-center gap-2 py-4 text-sm text-[var(--muted)]"
          aria-live="polite"
        >
          <span className="inline-block size-5 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--green)]" />
          Memuat menu lainnya...
        </div>
      ) : products.length > PAGE_SIZE ? (
        <p className="mt-8 text-center text-sm text-[var(--muted)]">
          Semua {products.length} menu sudah ditampilkan
        </p>
      ) : null}
    </div>
  );
}
