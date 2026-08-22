"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Check, Plus, Timer } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useToast } from "@/components/toast-provider";
import { MIXED_PRODUCT_MIN_QTY } from "@/lib/commerce";
import { productImageObjectClass, Product } from "@/lib/data";
import { cn, rupiah } from "@/lib/utils";

export function ProductCard({
  product,
  compact = false,
  featured = false,
  className,
  style,
}: {
  product: Product;
  compact?: boolean;
  featured?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { addProduct, addSnackBox } = useCart();
  const { toast } = useToast();
  const [justAdded, setJustAdded] = useState(false);
  const variants = product.variants ?? [];
  const hasVariants = variants.length > 0;
  const cheapestVariant = useMemo(() => {
    if (!variants.length) return undefined;
    return variants.reduce((lowest, item) =>
      item.price < lowest.price ? item : lowest,
    );
  }, [variants]);
  const [variantId, setVariantId] = useState(cheapestVariant?.id ?? "");
  const selectedVariant =
    variants.find((item) => item.id === variantId) ?? cheapestVariant;
  const startingPrice = cheapestVariant?.price ?? product.price;
  const displayPrice = selectedVariant?.price ?? product.price;
  const isTray = product.category === "Kue Tampah";
  const isHeavyMeal = product.category === "Makanan Berat";
  const isPresetSnackBox = product.category === "Snack Box";
  const exemptFromMixedMin = isTray || isHeavyMeal || isPresetSnackBox;
  const minOrder = product.minOrder || 1;
  const addQty = isHeavyMeal || isPresetSnackBox ? minOrder : 1;

  function handleAdd(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (hasVariants && !selectedVariant) return;

    if (isPresetSnackBox) {
      addSnackBox({
        slug: product.slug,
        name: product.name,
        boxSize: product.name.replace(/^Paket Snack Box /i, "Paket "),
        unitPrice: displayPrice,
        qty: addQty,
        image: product.image,
        snacks: (product.packageItems ?? []).map((name) => ({ name, qty: 1 })),
        withWater: true,
      });
      toast(`${product.name} berhasil ditambahkan ke keranjang`);
      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 1600);
      return;
    }

    addProduct({
      slug: product.slug,
      name: product.name,
      image: product.image,
      unitPrice: displayPrice,
      qty: addQty,
      minOrder,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      exemptFromMixedMin,
    });
    toast(
      `${product.name}${selectedVariant ? ` ${selectedVariant.name}` : ""} berhasil ditambahkan ke keranjang`,
    );
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  }

  return (
    <article
      className={cn(
        "surface-card group flex h-full flex-col overflow-hidden",
        featured && "lg:flex-row",
        className,
      )}
      style={style}
    >
      <Link
        href={`/products/${product.slug}`}
        className={cn(
          "relative block overflow-hidden bg-[var(--rice)]",
          featured
            ? "aspect-[5/4] lg:aspect-auto lg:w-[56%] lg:min-h-[280px]"
            : isPresetSnackBox
              ? "aspect-[4/5]"
              : "aspect-[5/4]",
        )}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={
            featured
              ? "(max-width: 1024px) 50vw, 50vw"
              : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          }
          quality={70}
          className={cn(
            productImageObjectClass(product.slug, product.category),
            !isPresetSnackBox &&
              "transition-transform duration-500 ease-out group-hover:scale-[1.03]",
          )}
        />
        {product.bestSeller ? (
          <span className="absolute left-2 top-2 z-[1] rounded-[6px] bg-[var(--green)] px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-wide text-[var(--white)] sm:left-3 sm:top-3 sm:px-2 sm:py-1 sm:text-[0.65rem]">
            Laris
          </span>
        ) : null}
      </Link>

      <div
        className={cn(
          "flex flex-1 flex-col",
          featured ? "justify-between p-3 sm:p-5 lg:p-6" : "p-2.5 sm:p-4",
        )}
      >
        <div>
          <Link
            href={`/products/${product.slug}`}
            className={cn(
              "line-clamp-2 text-[0.8125rem] font-semibold leading-snug text-[var(--palm)] transition-colors hover:text-[var(--green)] sm:text-sm",
              featured && "sm:font-display sm:text-2xl sm:font-bold sm:leading-tight sm:line-clamp-none",
            )}
          >
            {product.name}
          </Link>
          {featured ? (
            <p className="mt-1.5 hidden text-pretty text-sm leading-6 text-[var(--muted)] sm:line-clamp-2 lg:line-clamp-3 lg:max-w-[36ch]">
              {product.description}
            </p>
          ) : !compact ? (
            <p className="mt-1 hidden text-pretty text-sm leading-5 text-[var(--muted)] sm:line-clamp-2">
              {product.description}
            </p>
          ) : null}
        </div>

        <div className={cn("mt-2.5 sm:mt-4", featured && "lg:mt-6")}>
          <div className="text-[0.8125rem] font-semibold tabular-nums text-[var(--green)] sm:text-sm">
            {hasVariants ? `Mulai ${rupiah(startingPrice)}` : rupiah(displayPrice)}
          </div>

          {hasVariants ? (
            <label className="mt-1.5 block">
              <span className="sr-only">Pilih ukuran {product.name}</span>
              <select
                value={variantId}
                onChange={(event) => setVariantId(event.target.value)}
                onClick={(event) => event.stopPropagation()}
                className="h-8 w-full rounded-[var(--radius-sm)] border border-[rgba(27,67,50,0.14)] bg-white px-2 text-[0.7rem] text-[var(--palm)] outline-none transition-colors hover:border-[var(--green)] focus:border-[var(--green)] sm:h-9 sm:text-xs"
              >
                {variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.name} · {rupiah(variant.price)}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div className="mt-0.5 flex items-center gap-1 text-[0.65rem] text-[var(--muted)] sm:mt-1 sm:text-xs">
              <Timer className="hidden size-3.5 opacity-70 sm:block" />
              {isHeavyMeal || isPresetSnackBox ? (
                <>
                  <span className="sm:hidden">Min. {minOrder}</span>
                  <span className="hidden sm:inline">Min. {minOrder} box</span>
                </>
              ) : (
                <>
                  <span className="sm:hidden">Min. {MIXED_PRODUCT_MIN_QTY}</span>
                  <span className="hidden sm:inline">
                    Min. {MIXED_PRODUCT_MIN_QTY} pcs, boleh campur
                  </span>
                </>
              )}
            </div>
          )}

          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={handleAdd}
              aria-label={`Tambah ${product.name} ke keranjang`}
              className="inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-[var(--radius-sm)] bg-[var(--green)] px-2.5 text-xs font-semibold text-[var(--white)] transition-[background-color,transform] duration-200 hover:bg-[var(--green-mid)] hover:text-[var(--white)] active:scale-[0.98] sm:h-9 sm:gap-1.5 sm:px-3.5 sm:text-sm"
            >
              {justAdded ? (
                <>
                  <Check className="size-3.5" />
                  <span className="hidden sm:inline">Masuk</span>
                </>
              ) : (
                <>
                  <Plus className="size-3.5" />
                  <span className="hidden sm:inline">Tambah</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
