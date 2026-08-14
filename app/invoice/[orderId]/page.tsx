"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { InvoiceView } from "@/components/invoice-view";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import type { Order } from "@/lib/commerce";
import { getOrderById } from "@/lib/orders-storage";

export default function InvoicePage() {
  const params = useParams<{ orderId: string }>();
  const orderId = decodeURIComponent(params.orderId ?? "");
  const [order, setOrder] = useState<Order | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOrder(orderId ? getOrderById(orderId) : null);
    setReady(true);
  }, [orderId]);

  if (!ready) {
    return (
      <PageShell>
        <section className="container-shell py-16">
          <p className="text-sm text-[var(--muted)]">Memuat invoice...</p>
        </section>
      </PageShell>
    );
  }

  if (!order) {
    return (
      <PageShell>
        <section className="container-shell py-16 text-center">
          <h1 className="font-display text-3xl font-bold text-[var(--palm)]">
            Invoice tidak ditemukan
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Data pesanan hanya tersimpan di perangkat ini. Coba buka dari halaman
            Akun, atau buat pesanan baru.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button asChild>
              <Link href="/account">Ke halaman akun</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/products">Lihat menu</Link>
            </Button>
          </div>
        </section>
      </PageShell>
    );
  }

  return <InvoiceView order={order} />;
}
