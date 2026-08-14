"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Loader2, QrCode } from "lucide-react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import {
  buildDynamicQris,
  getQrisAmountFromPayload,
  isDynamicQris,
  QRIS_MERCHANT_NAME,
  QRIS_NMID,
} from "@/lib/qris";
import { rupiah } from "@/lib/utils";

type QrisPaymentPanelProps = {
  amount: number;
  className?: string;
};

export function QrisPaymentPanel({ amount, className }: QrisPaymentPanelProps) {
  const [dataUrl, setDataUrl] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const safeAmount = useMemo(() => Math.max(0, Math.round(amount)), [amount]);

  useEffect(() => {
    let cancelled = false;

    async function generate() {
      if (safeAmount <= 0) {
        setDataUrl("");
        setPayload("");
        setError("Total masih 0 — isi keranjang dulu.");
        return;
      }

      setLoading(true);
      setError("");
      try {
        const nextPayload = buildDynamicQris(safeAmount);
        const url = await QRCode.toDataURL(nextPayload, {
          errorCorrectionLevel: "M",
          margin: 2,
          width: 320,
          color: { dark: "#1a1a1a", light: "#ffffff" },
        });
        if (cancelled) return;
        setPayload(nextPayload);
        setDataUrl(url);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Gagal membuat QRIS dinamis.");
        setDataUrl("");
        setPayload("");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void generate();
    return () => {
      cancelled = true;
    };
  }, [safeAmount]);

  const lockedAmount = payload ? getQrisAmountFromPayload(payload) : null;

  function downloadQr() {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `qris-pasar-senen-kue-subuh-${safeAmount}.png`;
    link.click();
  }

  return (
    <div
      className={
        className ??
        "rounded-[var(--radius)] border border-[var(--line)] bg-white p-4"
      }
    >
      <div className="flex items-center gap-2">
        <QrCode className="size-4 text-[var(--pandan)]" />
        <h2 className="font-display text-xl font-bold text-[var(--palm)]">
          Bayar dengan QRIS
        </h2>
      </div>
      <p className="mt-1 text-sm text-[var(--muted)]">
        QR di bawah sudah dikunci sesuai total checkout. Scan pakai GoPay, OVO,
        Dana, ShopeePay, atau aplikasi bank.
      </p>

      <div className="mt-4 grid justify-items-center gap-3 rounded-[var(--radius-sm)] bg-[var(--ivory)] p-4">
        {loading ? (
          <div className="flex h-[220px] w-[220px] items-center justify-center">
            <Loader2 className="size-6 animate-spin text-[var(--muted)]" />
          </div>
        ) : dataUrl ? (
          <img
            src={dataUrl}
            alt={`QRIS dinamis ${rupiah(safeAmount)}`}
            className="size-[220px] rounded-[12px] bg-white p-2 shadow-[var(--shadow-sm)]"
          />
        ) : (
          <div className="flex h-[220px] w-[220px] items-center justify-center text-center text-sm text-[var(--muted)]">
            {error || "QRIS belum siap"}
          </div>
        )}

        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Total dibayar
          </p>
          <p className="font-display text-2xl font-bold text-[var(--green)]">
            {rupiah(safeAmount)}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">{QRIS_MERCHANT_NAME}</p>
          <p className="text-[0.7rem] text-[var(--muted)]">NMID {QRIS_NMID}</p>
        </div>
      </div>

      {payload && isDynamicQris(payload) && lockedAmount != null ? (
        <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
          QRIS dinamis aktif — nominal terkunci di{" "}
          <strong className="text-[var(--palm)]">{rupiah(lockedAmount)}</strong>.
          Setelah transfer berhasil, lanjut buat pesanan.
        </p>
      ) : null}

      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}

      <Button
        type="button"
        variant="outline"
        className="mt-3 w-full"
        disabled={!dataUrl}
        onClick={downloadQr}
      >
        <Download className="size-4" /> Unduh QRIS
      </Button>
    </div>
  );
}
