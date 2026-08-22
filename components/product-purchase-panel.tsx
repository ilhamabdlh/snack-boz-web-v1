"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Check, MessageCircle, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { useToast } from "@/components/toast-provider";
import { Button } from "@/components/ui/button";
import { MIXED_PRODUCT_MIN_QTY, SNACK_BOX_MIN_QTY } from "@/lib/commerce";
import { Product } from "@/lib/data";
import { cn, rupiah } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const { addProduct, addSnackBox } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const variants = product.variants ?? [];
  const hasVariants = variants.length > 0;
  const defaultVariant =
    variants.find((item) => item.id === "sedang") ?? variants[0] ?? null;

  const isTrayProduct = product.category === "Kue Tampah";
  const isHeavyMeal = product.category === "Makanan Berat";
  const isPresetSnackBox = product.category === "Snack Box";
  const exemptFromMixedMin = isTrayProduct || isHeavyMeal || isPresetSnackBox;
  const minOrder = product.minOrder || 1;
  const floorQty = isHeavyMeal || isPresetSnackBox ? minOrder : 1;

  const [qty, setQty] = useState(floorQty);
  const [added, setAdded] = useState(false);
  const [variantId, setVariantId] = useState(defaultVariant?.id ?? "");

  useEffect(() => {
    setQty(isHeavyMeal || isPresetSnackBox ? product.minOrder || 1 : 1);
    setAdded(false);
    setVariantId(
      (product.variants?.find((item) => item.id === "sedang") ?? product.variants?.[0])
        ?.id ?? "",
    );
  }, [product.slug, product.variants, product.minOrder, isHeavyMeal, isPresetSnackBox]);

  const selectedVariant = useMemo(
    () => variants.find((item) => item.id === variantId) ?? defaultVariant,
    [variants, variantId, defaultVariant],
  );

  const unitPrice = selectedVariant?.price ?? product.price;
  const portionLabel = selectedVariant?.portion ?? product.portion;
  const lineTotal = unitPrice * qty;

  function bump(delta: number) {
    setQty((prev) => Math.max(floorQty, prev + delta));
  }

  function addToCart(goCheckout = false) {
    if (hasVariants && !selectedVariant) {
      toast("Pilih varian dulu.");
      return;
    }

    const variantName = selectedVariant?.name;

    if (isPresetSnackBox) {
      addSnackBox({
        slug: product.slug,
        name: product.name,
        boxSize: product.name.replace(/^Paket Snack Box /i, "Paket "),
        unitPrice,
        qty: Math.max(minOrder, qty),
        image: product.image,
        snacks: (product.packageItems ?? []).map((name) => ({ name, qty: 1 })),
        withWater: true,
      });
      toast(`${product.name} berhasil ditambahkan ke keranjang`);
      if (goCheckout) {
        router.push("/checkout");
        return;
      }
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1800);
      return;
    }

    addProduct({
      slug: product.slug,
      name: product.name,
      image: product.image,
      unitPrice,
      qty: Math.max(floorQty, qty),
      minOrder,
      variantId: selectedVariant?.id,
      variantName,
      exemptFromMixedMin,
    });
    toast(
      `${product.name}${variantName ? ` ${variantName}` : ""} berhasil ditambahkan ke keranjang`,
    );
    if (goCheckout) {
      router.push("/checkout");
      return;
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="mt-5 grid gap-3 rounded-[var(--radius)] border border-[var(--line)] bg-white p-4">
      {hasVariants ? (
        <div>
          <div className="text-sm font-semibold text-[var(--palm)]">Pilih varian</div>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {variants.map((variant) => {
              const active = variant.id === selectedVariant?.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setVariantId(variant.id)}
                  className={cn(
                    "rounded-[var(--radius-sm)] border p-3 text-left transition-colors",
                    active
                      ? "border-[var(--pandan)] bg-[var(--ivory)]"
                      : "border-[var(--line)] bg-[var(--warm-white)] hover:border-[rgba(27,67,50,0.25)]",
                  )}
                >
                  <div className="font-semibold text-[var(--palm)]">{variant.name}</div>
                  <div className="mt-0.5 text-sm font-semibold tabular-nums text-[var(--green)]">
                    {rupiah(variant.price)}
                  </div>
                  <p className="mt-1 text-[0.7rem] leading-4 text-[var(--muted)]">
                    {variant.portion}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Jumlah</span>
        <div className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--ivory)] p-1">
          <button
            type="button"
            className="grid size-8 place-items-center rounded-[var(--radius-sm)] bg-white"
            aria-label="Kurangi jumlah"
            onClick={() => bump(-1)}
          >
            <Minus className="size-3.5" />
          </button>
          <input
            type="number"
            min={floorQty}
            inputMode="numeric"
            aria-label="Jumlah"
            className="h-8 w-14 rounded-[var(--radius-sm)] border-0 bg-transparent text-center text-sm font-semibold tabular-nums outline-none"
            value={qty}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (Number.isNaN(next)) return;
              setQty(Math.max(floorQty, Math.floor(next)));
            }}
          />
          <button
            type="button"
            className="grid size-8 place-items-center rounded-[var(--radius-sm)] bg-white"
            aria-label="Tambah jumlah"
            onClick={() => bump(1)}
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-[var(--radius-sm)] bg-[var(--rice)] p-3 text-sm text-[var(--cocoa)]">
        <CalendarClock className="mt-0.5 size-4 shrink-0" />
        <span>
          {isTrayProduct ? (
            <>
              Pesanan per tampah. {portionLabel}. Boleh dicampur dengan kue lain tanpa
              minimal 20 pcs. Subtotal <strong>{rupiah(lineTotal)}</strong>.
            </>
          ) : isHeavyMeal ? (
            <>
              Minimal {minOrder} box per menu. {portionLabel}. Subtotal{" "}
              <strong>{rupiah(lineTotal)}</strong>.
            </>
          ) : isPresetSnackBox ? (
            <>
              Minimal {SNACK_BOX_MIN_QTY} box per pesanan. Sudah termasuk isi paket
              lengkap per box. Subtotal <strong>{rupiah(lineTotal)}</strong>.
            </>
          ) : (
            <>
              Minimal {MIXED_PRODUCT_MIN_QTY} pcs per pesanan dan boleh dicampur dengan
              menu lain. Subtotal untuk menu ini {rupiah(lineTotal)}.
            </>
          )}
        </span>
      </div>

      <div className="flex items-end justify-between gap-3 border-t border-[var(--line)] pt-3">
        <div>
          <div className="text-xs text-[var(--muted)]">Harga satuan</div>
          <div className="text-xl font-bold tabular-nums text-[var(--palm)]">
            {rupiah(unitPrice)}
            {isPresetSnackBox ? <span className="text-sm font-medium"> / box</span> : null}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[var(--muted)]">Subtotal</div>
          <div className="text-lg font-semibold tabular-nums text-[var(--green)]">
            {rupiah(lineTotal)}
          </div>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button type="button" size="lg" onClick={() => addToCart(false)}>
          {added ? (
            <>
              <Check className="size-4" /> Sudah masuk
            </>
          ) : (
            <>
              <ShoppingBag className="size-4" /> Tambah ke keranjang
            </>
          )}
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={() => addToCart(true)}>
          Beli sekarang
        </Button>
      </div>
      <Button asChild variant="outline" size="sm">
        <a
          href={getWhatsAppUrl(
            `Halo Pasar Senen Kue Subuh, saya mau tanya pesanan ${product.name}${
              selectedVariant ? ` ukuran ${selectedVariant.name}` : ""
            }.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="size-4" /> Tanya harga untuk jumlah banyak
        </a>
      </Button>
      <div className="flex justify-center gap-3 text-xs">
        <Link href="/cart" className="text-[var(--green)] hover:underline">
          Lihat keranjang
        </Link>
        <Link href="/products" className="text-[var(--muted)] hover:text-[var(--green)]">
          Kembali ke menu
        </Link>
      </div>
    </div>
  );
}
