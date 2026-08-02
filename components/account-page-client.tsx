"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, PackageCheck, RotateCcw, UserRound } from "lucide-react";
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
import { rupiah } from "@/lib/utils";

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

  function saveProfileForm(event: React.FormEvent) {
    event.preventDefault();
    saveProfile(profile);
    setFlash("Profil disimpan di perangkat ini.");
  }

  function addAddress(event: React.FormEvent<HTMLFormElement>) {
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
    { id: "orders" as const, label: "Riwayat Pesanan", Icon: PackageCheck },
    { id: "reorder" as const, label: "Pesan Ulang", Icon: RotateCcw },
    { id: "addresses" as const, label: "Alamat Tersimpan", Icon: MapPin },
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
                  {profile.name || "Pembeli Snack Boz"}
                </div>
                <div className="text-xs text-[var(--muted)]">
                  {profile.phone || "Riwayat di perangkat ini"}
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
            <p className="section-kicker">Akun Saya</p>
            <h1 className="font-display mt-1 text-3xl font-bold text-[var(--palm)]">
              Pesanan di perangkat Anda
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
              <section className="mt-8 rounded-[var(--radius)] border border-[var(--line)] bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-display text-xl font-bold text-[var(--palm)]">
                    {tab === "reorder" ? "Pesan ulang" : "Riwayat Pesanan"}
                  </h2>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/products">Pesan lagi</Link>
                  </Button>
                </div>
                <div className="mt-3 grid gap-2">
                  {orders.length === 0 ? (
                    <p className="text-sm text-[var(--muted)]">
                      Belum ada pesanan. Selesaikan checkout untuk menyimpan riwayat di perangkat ini.
                    </p>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        className="grid gap-2 rounded-[var(--radius-sm)] bg-[var(--ivory)] p-3 text-sm md:grid-cols-[1fr_1.2fr_1fr_auto] md:items-center"
                      >
                        <div>
                          <strong className="text-[var(--palm)]">{order.id}</strong>
                          <div className="text-xs text-[var(--muted)]">{order.status}</div>
                        </div>
                        <span>
                          {order.items[0]?.name}
                          {order.items.length > 1 ? ` +${order.items.length - 1} item` : ""}
                        </span>
                        <span className="text-[var(--muted)]">
                          {new Date(order.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => reorder(order)}
                        >
                          Pesan ulang - {rupiah(order.total)}
                        </Button>
                      </div>
                    ))
                  )}
                </div>
                {activeOrders > 0 ? (
                  <p className="mt-3 text-xs text-[var(--muted)]">
                    {activeOrders} pesanan berstatus Diproses / Siap dikirim.
                  </p>
                ) : null}
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
              <h2 className="font-display text-xl font-bold text-[var(--palm)]">Rekomendasi untuk Anda</h2>
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
