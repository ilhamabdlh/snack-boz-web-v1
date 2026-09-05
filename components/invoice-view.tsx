"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { Download, Loader2, MessageCircle, Printer } from "lucide-react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";
import type { Order } from "@/lib/commerce";
import { BANK_ACCOUNTS, INVOICE_BRAND } from "@/lib/payment";
import { buildDynamicQris } from "@/lib/qris";
import {
  formatInvoiceDate,
  formatInvoiceDateFromYmd,
  rupiah,
} from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/whatsapp";

type InvoiceViewProps = {
  order: Order;
};

export function InvoiceView({ order }: InvoiceViewProps) {
  const isQris = order.paymentMethod === "QRIS";
  const isTransfer = order.paymentMethod === "Transfer Bank";
  const [qrisUrl, setQrisUrl] = useState("");
  const [qrisLoading, setQrisLoading] = useState(false);

  useEffect(() => {
    if (!isQris) {
      setQrisUrl("");
      return;
    }

    let cancelled = false;
    async function generate() {
      setQrisLoading(true);
      try {
        const payload = buildDynamicQris(order.total);
        const url = await QRCode.toDataURL(payload, {
          errorCorrectionLevel: "M",
          margin: 2,
          width: 280,
          color: { dark: "#111111", light: "#ffffff" },
        });
        if (!cancelled) setQrisUrl(url);
      } catch {
        if (!cancelled) setQrisUrl("");
      } finally {
        if (!cancelled) setQrisLoading(false);
      }
    }

    void generate();
    return () => {
      cancelled = true;
    };
  }, [isQris, order.total]);

  const waText = useMemo(() => {
    const lines = order.items.map((item) => `- ${item.name} x${item.qty}`);
    return [
      `Halo Pasar Senen Kue Subuh, saya sudah buat pesanan ${order.id}.`,
      `Nama: ${order.profile.name}`,
      `Bayar: ${order.paymentMethod}`,
      `Kirim: ${order.deliveryDate} jam ${order.deliveryTime}`,
      `Alamat: ${order.profile.address}`,
      "",
      "Pesanan:",
      ...lines,
      "",
      `Total: ${rupiah(order.total)}`,
    ].join("\n");
  }, [order]);

  function downloadQris() {
    if (!qrisUrl) return;
    const link = document.createElement("a");
    link.href = qrisUrl;
    link.download = `qris-${order.id}.png`;
    link.click();
  }

  return (
    <PageShell>
      <section className="container-shell py-6 sm:py-8 print:py-0">
        <div className="mb-4 flex flex-col gap-3 print:hidden sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="section-kicker">Invoice</p>
            <h1 className="font-display mt-1 text-xl font-bold text-[var(--palm)] sm:text-3xl">
              Pesanan berhasil dibuat
            </h1>
            <p className="mt-1 text-sm leading-5 text-[var(--muted)]">
              Silakan selesaikan pembayaran sesuai metode yang dipilih.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => window.print()}
            >
              <Printer className="size-4" /> Cetak / PDF
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <a href={getWhatsAppUrl(waText)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" /> Kirim ke WA
              </a>
            </Button>
            <Button asChild className="col-span-2 w-full sm:col-span-1 sm:w-auto">
              <Link href="/account">Lihat riwayat</Link>
            </Button>
          </div>
        </div>

        <article
          id="invoice-sheet"
          className="mx-auto max-w-3xl overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-white px-4 py-5 text-[var(--black)] shadow-[var(--shadow-sm)] sm:p-8 print:max-w-none print:overflow-visible print:rounded-none print:border-0 print:p-0 print:shadow-none"
        >
          <header className="border-b border-black pb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <h2 className="text-[1.75rem] font-black leading-none tracking-tight sm:text-4xl">
                INVOICE
              </h2>
              <div className="sm:max-w-[18rem] sm:text-right">
                <div className="text-[0.95rem] font-black leading-tight tracking-wide sm:text-xl">
                  {INVOICE_BRAND.name}
                </div>
                <div className="mt-1 text-xs leading-4 text-[var(--muted)] sm:text-sm sm:leading-5">
                  {INVOICE_BRAND.tagline}
                </div>
              </div>
            </div>
          </header>

          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3.5 text-sm sm:mt-6 sm:grid-cols-2">
            <MetaBlock label="Kepada">
              <div className="break-words text-base font-semibold leading-snug">
                {order.profile.name}
              </div>
              {order.profile.phone ? (
                <div className="mt-0.5 text-[var(--muted)]">{order.profile.phone}</div>
              ) : null}
            </MetaBlock>
            <MetaBlock label="No Invoice" className="sm:text-right">
              <div className="font-semibold tracking-wide">{order.id}</div>
            </MetaBlock>
            <MetaBlock label="Tanggal">
              <div className="font-semibold">{formatInvoiceDate(order.createdAt)}</div>
            </MetaBlock>
            <MetaBlock label="Tgl Pengiriman" className="sm:text-right">
              <div className="font-semibold">
                {formatInvoiceDateFromYmd(order.deliveryDate)}
                {order.deliveryTime ? ` · ${order.deliveryTime}` : ""}
              </div>
            </MetaBlock>
          </div>

          {/* Mobile: stacked item rows (no horizontal scroll) */}
          <div className="mt-6 sm:hidden">
            <div className="flex items-center justify-between rounded-[8px] bg-[#efefef] px-3 py-2.5 text-xs font-semibold uppercase tracking-wide">
              <span>Keterangan</span>
              <span>Total</span>
            </div>
            <ul className="divide-y divide-[var(--line)]">
              {order.items.map((item) => {
                const unit = item.kind === "snack-box" ? "BOX" : "PCS";
                return (
                  <li key={item.id} className="py-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold leading-snug">{item.name}</div>
                        <div className="mt-1 text-xs text-[var(--muted)]">
                          {rupiah(item.unitPrice)} × {item.qty} {unit}
                        </div>
                      </div>
                      <div className="shrink-0 text-right text-sm font-semibold tabular-nums">
                        {rupiah(item.unitPrice * item.qty)}
                      </div>
                    </div>
                    {item.kind === "snack-box" && item.meta?.snacks?.length ? (
                      <p className="mt-2 text-[11px] leading-4 text-[var(--muted)]">
                        Isi:{" "}
                        {item.meta.snacks.map((s) => `${s.name} ${s.qty}x`).join(", ")}
                      </p>
                    ) : null}
                    {item.note ? (
                      <p className="mt-1.5 text-[11px] leading-4 text-[var(--muted)]">
                        Catatan: {item.note}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Desktop / print: full table */}
          <div className="mt-6 hidden sm:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#efefef] text-left">
                  <th className="px-3 py-2.5 font-semibold">Keterangan</th>
                  <th className="px-3 py-2.5 font-semibold">Harga</th>
                  <th className="px-3 py-2.5 font-semibold">Jml</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-[var(--line)]">
                    <td className="px-3 py-3 align-top">
                      <div className="font-medium">{item.name}</div>
                      {item.kind === "snack-box" && item.meta?.snacks?.length ? (
                        <div className="mt-0.5 text-xs leading-4 text-[var(--muted)]">
                          Isi:{" "}
                          {item.meta.snacks.map((s) => `${s.name} ${s.qty}x`).join(", ")}
                        </div>
                      ) : null}
                      {item.note ? (
                        <div className="mt-0.5 text-xs text-[var(--muted)]">
                          Catatan: {item.note}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-3 py-3 align-top whitespace-nowrap tabular-nums">
                      {rupiah(item.unitPrice)}
                    </td>
                    <td className="px-3 py-3 align-top whitespace-nowrap">
                      {item.qty} {item.kind === "snack-box" ? "BOX" : "PCS"}
                    </td>
                    <td className="px-3 py-3 align-top text-right font-medium whitespace-nowrap tabular-nums">
                      {rupiah(item.unitPrice * item.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-[1.1fr_0.9fr] sm:items-start">
            <div className="min-w-0">
              <div className="text-sm font-bold uppercase tracking-wide">Pembayaran</div>
              <div className="mt-2 space-y-1 text-sm leading-5 text-[var(--muted)]">
                <div>Metode: {order.paymentMethod}</div>
                <div>Pengiriman: {order.shippingMethod}</div>
              </div>

              {isTransfer ? (
                <div className="mt-3 space-y-3 rounded-[var(--radius-sm)] bg-[var(--ivory)] p-3.5 text-sm">
                  {BANK_ACCOUNTS.map((account) => (
                    <div key={`${account.bank}-${account.accountNumber}`}>
                      <div>
                        {account.bank} an. <strong>{account.accountName}</strong>
                      </div>
                      <div>
                        No. rek : <strong>{account.accountNumber}</strong>
                      </div>
                    </div>
                  ))}
                  <p className="text-xs leading-5 text-[var(--muted)]">
                    Transfer sesuai total invoice. Cantumkan no invoice{" "}
                    <strong>{order.id}</strong> di berita transfer.
                  </p>
                </div>
              ) : null}

              {isQris ? (
                <div className="mt-3 rounded-[var(--radius-sm)] bg-[var(--ivory)] px-3.5 py-4">
                  <p className="text-center text-sm font-semibold sm:text-left">
                    Scan QRIS sesuai total
                  </p>
                  <div className="mt-3 flex flex-col items-center gap-3">
                    {qrisLoading ? (
                      <div className="flex size-[180px] items-center justify-center sm:size-[200px]">
                        <Loader2 className="size-6 animate-spin text-[var(--muted)]" />
                      </div>
                    ) : qrisUrl ? (
                      <img
                        src={qrisUrl}
                        alt={`QRIS ${order.id}`}
                        className="size-[180px] rounded-[10px] bg-white p-2 sm:size-[200px]"
                      />
                    ) : (
                      <p className="text-sm text-red-700">Gagal membuat QRIS.</p>
                    )}
                    <div className="text-center">
                      <div className="text-xs text-[var(--muted)]">Total dibayar</div>
                      <div className="mt-0.5 text-xl font-bold tabular-nums text-[var(--green)]">
                        {rupiah(order.total)}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full max-w-[220px] print:hidden"
                      disabled={!qrisUrl}
                      onClick={downloadQris}
                    >
                      <Download className="size-4" /> Unduh QRIS
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-2.5 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[#fafafa] px-3.5 py-3.5 text-sm sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-right">
              <div className="flex justify-between gap-4 sm:justify-end">
                <span className="text-[var(--muted)]">Subtotal</span>
                <strong className="tabular-nums">{rupiah(order.subtotal)}</strong>
              </div>
              {order.discount > 0 ? (
                <div className="flex justify-between gap-4 text-[var(--green)] sm:justify-end">
                  <span>Diskon {order.coupon}</span>
                  <strong className="tabular-nums">-{rupiah(order.discount)}</strong>
                </div>
              ) : null}
              <div className="flex justify-between gap-4 sm:justify-end">
                <span className="text-[var(--muted)]">Ongkir</span>
                <strong className="tabular-nums">
                  {order.shippingFee === 0 ? "Gratis" : rupiah(order.shippingFee)}
                </strong>
              </div>
              <div className="flex justify-between gap-4 border-t border-black pt-2.5 text-base sm:justify-end">
                <span className="font-bold">Total</span>
                <strong className="text-xl tabular-nums">{rupiah(order.total)}</strong>
              </div>
            </div>
          </div>

          <footer className="mt-8 flex flex-col items-center gap-5 border-t border-[var(--line)] pt-6 text-center sm:mt-10 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:text-left">
            <p className="max-w-[18ch] text-sm font-bold leading-snug uppercase sm:max-w-[16ch]">
              {INVOICE_BRAND.thankYou}
            </p>
            <div className="flex flex-col items-center">
              <div className="flex h-24 w-[13rem] items-center justify-center sm:h-32 sm:w-[17rem]">
                <img
                  src={INVOICE_BRAND.signatureLogo}
                  alt="The Snack Boz"
                  className="h-full w-auto max-w-full object-contain"
                />
              </div>
              <div className="mt-1.5 font-display text-base italic text-[var(--palm)] sm:text-lg">
                {INVOICE_BRAND.ownerName}
              </div>
            </div>
          </footer>
        </article>
      </section>
    </PageShell>
  );
}

function MetaBlock({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">
        {label}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
