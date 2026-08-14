"use client";

import { useEffect, useMemo, useState } from "react";
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
      <section className="container-shell py-8 print:py-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div>
            <p className="section-kicker">Invoice</p>
            <h1 className="font-display mt-1 text-2xl font-bold text-[var(--palm)] sm:text-3xl">
              Pesanan berhasil dibuat
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Silakan selesaikan pembayaran sesuai metode yang dipilih.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => window.print()}>
              <Printer className="size-4" /> Cetak / PDF
            </Button>
            <Button asChild variant="outline">
              <a href={getWhatsAppUrl(waText)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" /> Kirim ke WA
              </a>
            </Button>
            <Button asChild>
              <Link href="/account">Lihat riwayat</Link>
            </Button>
          </div>
        </div>

        <article
          id="invoice-sheet"
          className="mx-auto max-w-3xl rounded-[var(--radius)] border border-[var(--line)] bg-white p-5 text-[var(--black)] shadow-[var(--shadow-sm)] sm:p-8 print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none"
        >
          <header className="flex items-start justify-between gap-4 border-b border-black pb-4">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">INVOICE</h2>
            <div className="text-right">
              <div className="text-lg font-black tracking-wide sm:text-xl">
                {INVOICE_BRAND.name}
              </div>
              <div className="text-xs text-[var(--muted)] sm:text-sm">
                {INVOICE_BRAND.tagline}
              </div>
            </div>
          </header>

          <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <div className="space-y-2">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Kepada
                </div>
                <div className="mt-0.5 text-base font-semibold">{order.profile.name}</div>
                {order.profile.phone ? (
                  <div className="text-[var(--muted)]">{order.profile.phone}</div>
                ) : null}
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  No Invoice
                </div>
                <div className="mt-0.5 font-semibold">{order.id}</div>
              </div>
            </div>
            <div className="space-y-2 sm:text-right">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Tanggal
                </div>
                <div className="mt-0.5 font-semibold">
                  {formatInvoiceDate(order.createdAt)}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Tgl Pengiriman
                </div>
                <div className="mt-0.5 font-semibold">
                  {formatInvoiceDateFromYmd(order.deliveryDate)}
                  {order.deliveryTime ? ` · ${order.deliveryTime}` : ""}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
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
                        <div className="mt-0.5 text-xs text-[var(--muted)]">
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
                    <td className="px-3 py-3 align-top whitespace-nowrap">
                      {rupiah(item.unitPrice)}
                    </td>
                    <td className="px-3 py-3 align-top whitespace-nowrap">
                      {item.qty} {item.kind === "snack-box" ? "BOX" : "PCS"}
                    </td>
                    <td className="px-3 py-3 align-top text-right font-medium whitespace-nowrap">
                      {rupiah(item.unitPrice * item.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="text-sm font-bold uppercase tracking-wide">Pembayaran</div>
              <div className="mt-2 text-sm">
                <div className="text-[var(--muted)]">Metode: {order.paymentMethod}</div>
                <div className="mt-1 text-[var(--muted)]">Pengiriman: {order.shippingMethod}</div>
              </div>

              {isTransfer ? (
                <div className="mt-3 space-y-3 rounded-[var(--radius-sm)] bg-[var(--ivory)] p-3 text-sm">
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
                <div className="mt-3 rounded-[var(--radius-sm)] bg-[var(--ivory)] p-3">
                  <p className="text-sm font-semibold">Scan QRIS sesuai total</p>
                  <div className="mt-3 flex flex-col items-center gap-2">
                    {qrisLoading ? (
                      <div className="flex size-[200px] items-center justify-center">
                        <Loader2 className="size-6 animate-spin text-[var(--muted)]" />
                      </div>
                    ) : qrisUrl ? (
                      <img
                        src={qrisUrl}
                        alt={`QRIS ${order.id}`}
                        className="size-[200px] rounded-[10px] bg-white p-2"
                      />
                    ) : (
                      <p className="text-sm text-red-700">Gagal membuat QRIS.</p>
                    )}
                    <div className="text-center">
                      <div className="text-xs text-[var(--muted)]">Total dibayar</div>
                      <div className="text-lg font-bold text-[var(--green)]">
                        {rupiah(order.total)}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="print:hidden"
                      disabled={!qrisUrl}
                      onClick={downloadQris}
                    >
                      <Download className="size-4" /> Unduh QRIS
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-2 text-sm sm:text-right">
              <div className="flex justify-between gap-4 sm:justify-end">
                <span className="text-[var(--muted)]">Subtotal</span>
                <strong>{rupiah(order.subtotal)}</strong>
              </div>
              {order.discount > 0 ? (
                <div className="flex justify-between gap-4 text-[var(--green)] sm:justify-end">
                  <span>Diskon {order.coupon}</span>
                  <strong>-{rupiah(order.discount)}</strong>
                </div>
              ) : null}
              <div className="flex justify-between gap-4 sm:justify-end">
                <span className="text-[var(--muted)]">Ongkir</span>
                <strong>
                  {order.shippingFee === 0 ? "Gratis" : rupiah(order.shippingFee)}
                </strong>
              </div>
              <div className="flex justify-between gap-4 border-t border-black pt-2 text-base sm:justify-end">
                <span className="font-bold">Total</span>
                <strong className="text-xl">{rupiah(order.total)}</strong>
              </div>
            </div>
          </div>

          <footer className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-[var(--line)] pt-6">
            <p className="max-w-[16ch] text-sm font-bold leading-snug uppercase">
              {INVOICE_BRAND.thankYou}
            </p>
            <div className="text-center">
              <div className="mx-auto flex h-28 w-[15rem] items-center justify-center sm:h-32 sm:w-[17rem]">
                <img
                  src={INVOICE_BRAND.signatureLogo}
                  alt="The Snack Boz"
                  className="h-full w-auto max-w-full object-contain"
                />
              </div>
              <div className="mt-2 font-display text-lg italic text-[var(--palm)]">
                {INVOICE_BRAND.ownerName}
              </div>
              <div className="text-xs text-[var(--muted)]">{INVOICE_BRAND.ownerName}</div>
            </div>
          </footer>
        </article>
      </section>
    </PageShell>
  );
}
