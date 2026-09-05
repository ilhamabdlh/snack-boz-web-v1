"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileText,
  MapPin,
  PackageCheck,
  RotateCcw,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { PageShell } from "@/components/page-shell";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CheckoutProfile, Order, SavedAddress } from "@/lib/commerce";
import { bestSellers, products } from "@/lib/data";
import {
  loadAddresses,
  loadOrders,
  loadProfile,
  saveAddresses,
  saveProfile,
} from "@/lib/orders-storage";
import { cn, rupiah } from "@/lib/utils";

type Tab = "orders" | "reorder" | "addresses" | "profile";

export function AccountPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { replaceItems, clearCart } = useCart();
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [profile, setProfile] = useState<CheckoutProfile>({
    name: "",
    phone: "",
    email: "",
    placeName: "",
    address: "",
    deliveryNote: "",
  });
  const [flash, setFlash] = useState("");

  useEffect(() => {
    setOrders(loadOrders());
    setAddresses(loadAddresses());
    const saved = loadProfile();
    if (saved) setProfile(saved);
    const orderId = searchParams.get("order");
    if (orderId) {
      setFlash(`Pesanan ${orderId} berhasil dibuat dan tersimpan di perangkat ini.`);
      setTab("orders");
    }
  }, [searchParams]);

  const activeOrders = useMemo(
    () => orders.filter((order) => order.status !== "Selesai").length,
    [orders],
  );

  const favoriteOccasion = useMemo(() => {
    const counts = new Map<string, number>();
    for (const order of orders) {
      for (const item of order.items) {
        const product = products.find((p) => p.slug === item.slug);
        product?.occasions.forEach((occasion) => {
          counts.set(occasion, (counts.get(occasion) ?? 0) + 1);
        });
      }
    }
    let best = "-";
    let max = 0;
    counts.forEach((value, key) => {
      if (value > max) {
        max = value;
        best = key;
      }
    });
    return best;
  }, [orders]);

  function reorder(order: Order) {
    clearCart();
    replaceItems(order.items.map((item) => ({ ...item })));
    router.push("/cart");
  }

  function saveProfileForm(event: FormEvent) {
    event.preventDefault();
    saveProfile(profile);
    setFlash("Profil disimpan di perangkat ini.");
  }

  function addAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next: SavedAddress = {
      id: `addr-${Date.now()}`,
      label: String(form.get("label") || "Alamat"),
      placeName: String(form.get("placeName") || ""),
      address: String(form.get("address") || ""),
      note: String(form.get("note") || ""),
    };
    if (!next.address.trim()) return;
    const updated = [next, ...addresses].slice(0, 8);
    setAddresses(updated);
    saveAddresses(updated);
    event.currentTarget.reset();
    setFlash("Alamat tersimpan.");
  }

  function removeAddress(id: string) {
    const updated = addresses.filter((item) => item.id !== id);
    setAddresses(updated);
    saveAddresses(updated);
  }

  const nav = [
    { id: "orders" as const, label: "Riwayat pesanan", Icon: PackageCheck },
    { id: "reorder" as const, label: "Pesan ulang", Icon: RotateCcw },
    { id: "addresses" as const, label: "Alamat tersimpan", Icon: MapPin },
  ];

  return (
    <PageShell>
      <section className="container-shell py-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-[var(--radius)] border border-[var(--line)] bg-white p-4 lg:self-start">
            <button
              type="button"
              className="flex w-full items-center gap-3 text-left"
              onClick={() => setTab("profile")}
            >
              <div className="grid size-10 place-items-center rounded-full bg-[var(--palm)] text-[var(--white)]">
                <UserRound className="size-4" />
              </div>
              <div>
                <div className="font-semibold text-[var(--palm)]">
                  {profile.name || "Nama belum diisi"}
                </div>
                <div className="text-xs text-[var(--muted)]">
                  {profile.phone || "Nomor WhatsApp belum diisi"}
                </div>
              </div>
            </button>
            <div className="mt-5 grid gap-1 text-sm font-medium text-[var(--cocoa)]">
              {nav.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-left ${
                    tab === id ? "bg-[var(--ivory)] text-[var(--green)]" : "hover:bg-[var(--ivory)]"
                  }`}
                >
                  <Icon className="size-4 text-[var(--pandan)]" /> {label}
                </button>
              ))}
            </div>
          </aside>

          <div>
            <p className="section-kicker">Akun</p>
            <h1 className="font-display mt-1 text-3xl font-bold text-[var(--palm)]">
              Riwayat pesanan di perangkat ini
            </h1>
            {flash ? (
              <p className="mt-3 rounded-[var(--radius-sm)] bg-[var(--yellow-soft)] px-3 py-2 text-sm text-[var(--black)]">
                {flash}
              </p>
            ) : null}

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                ["Pesanan tersimpan", String(orders.length)],
                ["Alamat tersimpan", String(addresses.length)],
                ["Acara favorit", favoriteOccasion],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[var(--radius)] border border-[var(--line)] bg-white p-4">
                  <div className="text-xs text-[var(--muted)]">{label}</div>
                  <div className="font-display mt-1 text-2xl font-bold text-[var(--palm)]">{value}</div>
                </div>
              ))}
            </div>

            {tab === "orders" || tab === "reorder" ? (
              <section className="mt-8 rounded-[var(--radius)] border border-[var(--line)] bg-white p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-display text-xl font-bold text-[var(--palm)]">
                      {tab === "reorder" ? "Pesan ulang" : "Riwayat pesanan"}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {orders.length === 0
                        ? "Belum ada pesanan tersimpan."
                        : `${orders.length} pesanan · ${activeOrders} masih aktif`}
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="shrink-0">
                    <Link href="/products">
                      <ShoppingBag className="size-3.5" />
                      Menu
                    </Link>
                  </Button>
                </div>

                <div className="mt-4 grid gap-3">
                  {orders.length === 0 ? (
                    <div className="rounded-[var(--radius-sm)] border border-dashed border-[var(--line)] bg-[var(--ivory)] px-4 py-8 text-center">
                      <div className="mx-auto grid size-11 place-items-center rounded-full bg-white text-[var(--green)] shadow-[var(--shadow-sm)]">
                        <PackageCheck className="size-5" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-[var(--palm)]">
                        Belum ada riwayat
                      </p>
                      <p className="mt-1 text-sm leading-5 text-[var(--muted)]">
                        Setelah checkout selesai, pesanan Anda muncul di sini.
                      </p>
                      <Button asChild size="sm" className="mt-4">
                        <Link href="/products">Mulai pesan</Link>
                      </Button>
                    </div>
                  ) : (
                    orders.map((order) => {
                      const first = order.items[0];
                      const extraCount = Math.max(order.items.length - 1, 0);
                      const dateLabel = new Date(order.createdAt).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      );
                      const itemQty = order.items.reduce((sum, item) => sum + item.qty, 0);

                      return (
                        <article
                          key={order.id}
                          className="overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--ivory)] transition-[border-color,box-shadow] duration-200 hover:border-[rgba(27,67,50,0.22)] hover:shadow-[var(--shadow-sm)]"
                        >
                          <div className="p-3.5 sm:p-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <StatusBadge status={order.status} />
                              <span className="text-xs text-[var(--muted)]">{dateLabel}</span>
                            </div>

                            <h3 className="mt-2 truncate text-sm font-bold tracking-wide text-[var(--palm)]">
                              {order.id}
                            </h3>

                            <p className="mt-0.5 line-clamp-2 text-sm leading-5 text-[var(--cocoa)]">
                              {first?.name ?? "Pesanan"}
                              {extraCount > 0 ? ` +${extraCount} item lain` : ""}
                            </p>

                            <div className="mt-2.5 flex flex-wrap items-end justify-between gap-2">
                              <div className="text-xs leading-4 text-[var(--muted)]">
                                <span>
                                  {itemQty} pcs · {order.paymentMethod}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                                  Total
                                </div>
                                <div className="font-display text-lg font-bold tabular-nums leading-none text-[var(--green)]">
                                  {rupiah(order.total)}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 border-t border-[var(--line)] bg-white/70 px-3.5 py-3 sm:px-4">
                            <Button asChild size="sm" variant="outline" className="w-full">
                              <Link href={`/invoice/${encodeURIComponent(order.id)}`}>
                                <FileText className="size-3.5" />
                                Invoice
                              </Link>
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="primary"
                              className="w-full"
                              onClick={() => reorder(order)}
                            >
                              <RotateCcw className="size-3.5" />
                              Pesan lagi
                            </Button>
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>
              </section>
            ) : null}

            {tab === "addresses" ? (
              <section className="mt-8 rounded-[var(--radius)] border border-[var(--line)] bg-white p-4">
                <h2 className="font-display text-xl font-bold text-[var(--palm)]">Alamat tersimpan</h2>
                <form onSubmit={addAddress} className="mt-3 grid gap-2 md:grid-cols-2">
                  <Input name="label" placeholder="Label (Rumah / Kantor)" required />
                  <Input name="placeName" placeholder="Nama lokasi" />
                  <Input name="address" className="md:col-span-2" placeholder="Alamat lengkap" required />
                  <Input name="note" className="md:col-span-2" placeholder="Catatan (opsional)" />
                  <Button type="submit" className="md:col-span-2 sm:w-fit">
                    Simpan alamat
                  </Button>
                </form>
                <div className="mt-4 grid gap-2">
                  {addresses.length === 0 ? (
                    <p className="text-sm text-[var(--muted)]">Belum ada alamat tersimpan.</p>
                  ) : (
                    addresses.map((address) => (
                      <div
                        key={address.id}
                        className="flex items-start justify-between gap-3 rounded-[var(--radius-sm)] bg-[var(--ivory)] p-3"
                      >
                        <div>
                          <div className="font-semibold text-[var(--palm)]">{address.label}</div>
                          <div className="text-sm text-[var(--muted)]">{address.placeName}</div>
                          <div className="text-sm">{address.address}</div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeAddress(address.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </section>
            ) : null}

            {tab === "profile" ? (
              <section className="mt-8 rounded-[var(--radius)] border border-[var(--line)] bg-white p-4">
                <h2 className="font-display text-xl font-bold text-[var(--palm)]">Profil pemesan</h2>
                <form onSubmit={saveProfileForm} className="mt-3 grid gap-2 md:grid-cols-2">
                  <Input
                    placeholder="Nama"
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  />
                  <Input
                    placeholder="WhatsApp"
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  />
                  <Input
                    className="md:col-span-2"
                    placeholder="Email"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  />
                  <Button type="submit" className="md:col-span-2 sm:w-fit">
                    Simpan profil
                  </Button>
                </form>
              </section>
            ) : null}

            <section className="mt-8">
              <h2 className="font-display text-xl font-bold text-[var(--palm)]">Mau pesan lagi?</h2>
              <div className="product-grid mt-4">
                {[products.find((p) => p.slug === "tampah-keluarga")!, ...bestSellers.slice(0, 2)].map(
                  (product) => (
                    <ProductCard key={product.slug} product={product} compact />
                  ),
                )}
              </div>
            </section>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function StatusBadge({ status }: { status: Order["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide",
        status === "Diproses" && "bg-[var(--yellow-soft)] text-[var(--cocoa)]",
        status === "Siap dikirim" && "bg-[rgba(64,145,108,0.14)] text-[var(--green)]",
        status === "Selesai" && "bg-[rgba(27,67,50,0.08)] text-[var(--muted)]",
      )}
    >
      {status}
    </span>
  );
}
