"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Check, MessageCircle, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { MIXED_PRODUCT_MIN_QTY } from "@/lib/commerce";
import { Product } from "@/lib/data";
import { rupiah } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const { addProduct } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setQty(1);
    setAdded(false);
  }, [product.slug]);

  const lineTotal = useMemo(() => product.price * qty, [product.price, qty]);

  function bump(delta: number) {
    setQty((prev) => Math.max(1, prev + delta));
  }

  function addToCart(goCheckout = false) {
    addProduct({
      slug: product.slug,
      name: product.name,
      image: product.image,
      unitPrice: product.price,
      qty,
      minOrder: 1,
    });
    if (goCheckout) {
      router.push("/checkout");
      return;
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="mt-5 grid gap-3 rounded-[var(--radius)] border border-[var(--line)] bg-white p-4">
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
          <strong className="min-w-[2ch] text-center">{qty}</strong>
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
        Minimum {MIXED_PRODUCT_MIN_QTY} pcs total di keranjang (bisa mix antar produk). Subtotal item ini{" "}
        {rupiah(lineTotal)}.
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button type="button" size="lg" onClick={() => addToCart(false)}>
          {added ? (
            <>
              <Check className="size-4" /> Sudah di Keranjang
            </>
          ) : (
            <>
              <ShoppingBag className="size-4" /> Tambah ke Keranjang
            </>
          )}
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={() => addToCart(true)}>
          Beli Langsung
        </Button>
      </div>
      <Button asChild variant="outline" size="sm">
        <a
          href={getWhatsAppUrl(
            `Halo Snack Boz, saya ingin tanya pesanan banyak untuk ${product.name}.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="size-4" /> Tanya Admin - Pesanan Banyak
        </a>
      </Button>
      <div className="flex justify-center gap-3 text-xs">
        <Link href="/cart" className="text-[var(--green)] hover:underline">
          Lihat keranjang
        </Link>
        <Link href="/products" className="text-[var(--muted)] hover:text-[var(--green)]">
          Kembali ke katalog
        </Link>
      </div>
    </div>
  );
}
