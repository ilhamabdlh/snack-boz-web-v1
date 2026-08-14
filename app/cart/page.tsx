"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COUPONS, canCheckoutCart, getCartOrderIssues, productPcsTotal } from "@/lib/commerce";
import { rupiah } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { useEffect, useMemo, useState } from "react";

function QtyEditor({
  value,
  min = 1,
  label,
  onCommit,
}: {
  value: number;
  min?: number;
  label: string;
  onCommit: (qty: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  function commit(raw: string) {
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed)) {
      setDraft(String(value));
      return;
    }
    const next = Math.max(min, parsed);
    setDraft(String(next));
    onCommit(next);
  }

  return (
    <div className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--ivory)] p-1">
      <button
        type="button"
        className="grid size-7 place-items-center rounded-[var(--radius-sm)] bg-white"
        aria-label={`Kurangi ${label}`}
        onClick={() => onCommit(Math.max(min, value - 1))}
      >
        <Minus className="size-3" />
      </button>
      <input
        type="number"
        min={min}
        inputMode="numeric"
        aria-label={`Jumlah ${label}`}
        className="h-7 w-14 rounded-[var(--radius-sm)] border-0 bg-transparent text-center text-sm font-semibold tabular-nums outline-none"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => commit(draft)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
      />
      <button
        type="button"
        className="grid size-7 place-items-center rounded-[var(--radius-sm)] bg-white"
        aria-label={`Tambah ${label}`}
        onClick={() => onCommit(value + 1)}
      >
        <Plus className="size-3" />
      </button>
    </div>
  );
}

export default function CartPage() {
  const {
    items,
    ready,
    subtotal,
    discount,
    coupon,
    setQty,
    removeItem,
    setNote,
    applyCoupon,
    clearCoupon,
  } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  const orderIssues = useMemo(() => getCartOrderIssues(items), [items]);
  const canCheckout = canCheckoutCart(items);
  const hasTray = useMemo(
    () => items.some((item) => item.kind === "product" && item.slug === "tampah-keluarga"),
    [items],
  );
  const productPcs = useMemo(() => productPcsTotal(items), [items]);

  const waMessage = useMemo(() => {
    if (!items.length) return "Halo Pasar Senen Kue Subuh, saya mau tanya soal pesanan.";
    const lines = items.map((item) => `- ${item.name} x${item.qty}`);
    return `Halo Pasar Senen Kue Subuh, saya mau tanya soal pesanan berikut:\n${lines.join("\n")}\nSubtotal: ${rupiah(subtotal)}`;
  }, [items, subtotal]);

  function onApplyCoupon(event: React.FormEvent) {
    event.preventDefault();
    const result = applyCoupon(couponInput);
    setCouponMessage(result.message);
    if (result.ok) setCouponInput("");
  }

  return (
    <PageShell>
      <section className="container-shell grid gap-8 py-8 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="section-kicker">Keranjang</p>
          <h1 className="font-display mt-1 text-3xl font-bold text-[var(--palm)]">
            Periksa pesanan Anda
          </h1>

          {!ready ? (
            <p className="mt-6 text-sm text-[var(--muted)]">Memuat keranjang...</p>
          ) : items.length === 0 ? (
            <div className="mt-6 rounded-[var(--radius)] bg-white p-6 shadow-[var(--shadow-sm)]">
              <p className="text-[var(--muted)]">
                Keranjangnya masih kosong. Pilih menunya dulu, ya.
              </p>
              <Button asChild className="mt-4">
                <Link href="/products">Lihat menu</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-6 grid gap-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-4 rounded-[var(--radius)] bg-white p-4 shadow-[var(--shadow-sm)] md:grid-cols-[100px_1fr_auto]"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-sm)] bg-[var(--rice)]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="100px"
                      quality={65}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--palm)]">{item.name}</div>
                    <p className="mt-0.5 text-sm text-[var(--muted)]">
                      {item.kind === "snack-box"
                        ? `${item.meta?.boxSize ?? "Custom"} - ${item.meta?.withWater ? "dengan air mineral" : "tanpa air mineral"} - ${rupiah(item.unitPrice)}/box`
                        : `${rupiah(item.unitPrice)} / pcs`}
                    </p>
                    {item.meta?.snacks?.length ? (
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        Isi: {item.meta.snacks.map((s) => `${s.name} ${s.qty}x`).join(", ")}
                      </p>
                    ) : null}
                    <Input
                      className="mt-2"
                      placeholder="Catatan item (opsional)"
                      value={item.note ?? ""}
                      onChange={(event) => setNote(item.id, event.target.value)}
                    />
                  </div>
                  <div className="flex flex-row items-center justify-between gap-4 md:flex-col md:items-end">
                    <div className="font-semibold text-[var(--palm)]">
                      {rupiah(item.unitPrice * item.qty)}
                    </div>
                    <QtyEditor
                      value={item.qty}
                      min={
                        item.kind === "snack-box" ||
                        (item.kind === "product" &&
                          item.meta?.exemptFromMixedMin &&
                          item.minOrder > 1)
                          ? item.minOrder
                          : 1
                      }
                      label={item.name}
                      onCommit={(qty) => setQty(item.id, qty)}
                    />
                    <button
                      type="button"
                      className="text-[var(--green)]"
                      aria-label={`Hapus ${item.name}`}
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside>
          <div className="sticky top-20 rounded-[var(--radius)] bg-white p-4 shadow-[var(--shadow-sm)]">
            <div className="font-display text-xl font-bold text-[var(--palm)]">Ringkasan</div>
            <div className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Subtotal</span>
                <strong>{rupiah(subtotal)}</strong>
              </div>
              {discount > 0 ? (
                <div className="flex justify-between text-[var(--green)]">
                  <span>Diskon {coupon}</span>
                  <strong>-{rupiah(discount)}</strong>
                </div>
              ) : null}
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Ongkir</span>
                <span className="text-[var(--muted)]">Dihitung saat checkout</span>
              </div>
              <div className="flex justify-between border-t border-[var(--line)] pt-2 font-semibold">
                <span>Estimasi</span>
                <span>{rupiah(Math.max(0, subtotal - discount))}</span>
              </div>
            </div>

            <form onSubmit={onApplyCoupon} className="mt-4 grid gap-2">
              <Input
                placeholder="Kode kupon (SNACK10 / HEMAT50)"
                value={couponInput}
                onChange={(event) => setCouponInput(event.target.value)}
              />
              <div className="flex gap-2">
                <Button type="submit" variant="outline" className="flex-1">
                  Pakai kupon
                </Button>
                {coupon ? (
                  <Button type="button" variant="ghost" onClick={clearCoupon}>
                    Hapus
                  </Button>
                ) : null}
              </div>
              {couponMessage ? (
                <p className="text-xs text-[var(--muted)]">{couponMessage}</p>
              ) : (
                <p className="text-xs text-[var(--muted)]">
                  Contoh: {Object.keys(COUPONS).join(", ")}
                </p>
              )}
            </form>

            {productPcs > 0 ? (
              <p className="mt-3 text-xs text-[var(--muted)]">
                {hasTray
                  ? "Ada kue tampah di keranjang: kue lain tidak kena minimal 20 pcs."
                  : `Total kue di keranjang: ${productPcs} pcs. Minimal 20 pcs, boleh campur menu.`}
              </p>
            ) : null}
            {orderIssues.length > 0 ? (
              <div className="mt-3 grid gap-1 rounded-[var(--radius-sm)] bg-[var(--yellow-soft)] p-3 text-xs text-[var(--black)]">
                {orderIssues.map((issue) => (
                  <p key={issue}>{issue}</p>
                ))}
              </div>
            ) : null}

            {canCheckout ? (
              <Button asChild size="lg" className="mt-3 w-full">
                <Link href="/checkout">Lanjut bayar</Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="mt-3 w-full" variant="outline">
                <Link href="/products">
                  {items.length ? "Tambah menu sampai minimal terpenuhi" : "Lihat menu"}
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" className="mt-2 w-full">
              <a href={getWhatsAppUrl(waMessage)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" /> Tanya lewat WhatsApp
              </a>
            </Button>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
