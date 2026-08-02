"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CreditCard, MapPin, Truck } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  calcCartTotal,
  getCartOrderIssues,
  PAYMENT_OPTIONS,
  SHIPPING_OPTIONS,
  type CheckoutProfile,
  type Order,
} from "@/lib/commerce";
import {
  createOrderId,
  loadProfile,
  saveOrder,
  saveProfile,
  upsertAddressFromProfile,
} from "@/lib/orders-storage";
import { rupiah } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const emptyProfile: CheckoutProfile = {
  name: "",
  phone: "",
  email: "",
  placeName: "",
  address: "",
  deliveryNote: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, coupon, discount, clearCart, ready } = useCart();
  const [profile, setProfile] = useState<CheckoutProfile>(emptyProfile);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("08.00 - 08.30");
  const [shippingId, setShippingId] = useState<(typeof SHIPPING_OPTIONS)[number]["id"]>("kurir");
  const [paymentMethod, setPaymentMethod] =
    useState<(typeof PAYMENT_OPTIONS)[number]>("QRIS");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = loadProfile();
    if (saved) setProfile(saved);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDeliveryDate(tomorrow.toISOString().slice(0, 10));
  }, []);

  const shipping = SHIPPING_OPTIONS.find((item) => item.id === shippingId) ?? SHIPPING_OPTIONS[0];
  const totals = useMemo(
    () => calcCartTotal(items, coupon, shipping.fee),
    [items, coupon, shipping.fee],
  );

  const steps = useMemo(() => {
    const filledContact = Boolean(profile.name && profile.phone);
    const filledAddress = Boolean(profile.address);
    const filledSchedule = Boolean(deliveryDate && deliveryTime);
    return [
      { label: "Data", done: filledContact },
      { label: "Alamat", done: filledAddress },
      { label: "Jadwal", done: filledSchedule },
      { label: "Kirim", done: true },
      { label: "Bayar", done: true },
      { label: "Review", done: items.length > 0 },
    ];
  }, [profile, deliveryDate, deliveryTime, items.length]);

  function updateProfile<K extends keyof CheckoutProfile>(key: K, value: CheckoutProfile[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  function placeOrder() {
    setError("");
    if (!items.length) {
      setError("Keranjang kosong. Tambah menu dulu.");
      return;
    }
    const issues = getCartOrderIssues(items);
    if (issues.length) {
      setError(issues[0]);
      return;
    }
    if (!profile.name.trim() || !profile.phone.trim()) {
      setError("Nama dan nomor WhatsApp wajib diisi.");
      return;
    }
    if (!profile.address.trim()) {
      setError("Alamat pengiriman wajib diisi.");
      return;
    }
    if (!deliveryDate) {
      setError("Tanggal kirim wajib diisi.");
      return;
    }

    setSubmitting(true);
    const order: Order = {
      id: createOrderId(),
      createdAt: new Date().toISOString(),
      status: "Diproses",
      items: items.map((item) => ({ ...item })),
      profile,
      deliveryDate,
      deliveryTime,
      shippingMethod: shipping.label,
      paymentMethod,
      subtotal: totals.subtotal,
      shippingFee: shipping.fee,
      discount: totals.discount,
      total: totals.total,
      coupon,
    };

    saveProfile(profile);
    upsertAddressFromProfile(profile);
    saveOrder(order);
    clearCart();

    const lines = order.items.map((item) => `- ${item.name} x${item.qty}`);
    const waText = [
      `Halo Snack Boz, saya sudah buat pesanan ${order.id}.`,
      `Nama: ${profile.name}`,
      `Kirim: ${deliveryDate} ${deliveryTime}`,
      `Alamat: ${profile.address}`,
      "",
      "Pesanan:",
      ...lines,
      "",
      `Total: ${rupiah(order.total)} via ${paymentMethod}`,
    ].join("\n");

    window.open(getWhatsAppUrl(waText), "_blank", "noopener,noreferrer");
    router.push(`/account?order=${order.id}`);
  }

  if (!ready) {
    return (
      <PageShell>
        <section className="container-shell py-16">
          <p className="text-sm text-[var(--muted)]">Memuat checkout...</p>
        </section>
      </PageShell>
    );
  }

  if (items.length === 0) {
    return (
      <PageShell>
        <section className="container-shell py-16 text-center">
          <h1 className="font-display text-3xl font-bold text-[var(--palm)]">Checkout kosong</h1>
          <p className="mt-2 text-[var(--muted)]">Tambahkan produk ke keranjang terlebih dahulu.</p>
          <Button asChild className="mt-5">
            <Link href="/products">Lihat produk</Link>
          </Button>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="container-shell py-8">
        <p className="section-kicker">Checkout</p>
        <h1 className="font-display mt-1 text-3xl font-bold text-[var(--palm)]">
          Atur jadwal kirim dan pembayaran
        </h1>
        <div className="mt-5 flex flex-wrap gap-1">
          {steps.map((step) => (
            <div
              key={step.label}
              className={`rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-semibold ${
                step.done
                  ? "bg-[var(--pandan)] text-[var(--white)]"
                  : "border border-[var(--line)] bg-white text-[var(--muted)]"
              }`}
            >
              {step.label}
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell grid gap-8 pb-10 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-4">
          <div className="rounded-[var(--radius)] border border-[var(--line)] bg-white p-4">
            <h2 className="font-display text-xl font-bold text-[var(--palm)]">Informasi Pemesan</h2>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <Input
                placeholder="Nama lengkap"
                value={profile.name}
                onChange={(e) => updateProfile("name", e.target.value)}
                required
              />
              <Input
                placeholder="No. WhatsApp"
                value={profile.phone}
                onChange={(e) => updateProfile("phone", e.target.value)}
                required
              />
              <Input
                className="md:col-span-2"
                placeholder="Email (opsional)"
                type="email"
                value={profile.email}
                onChange={(e) => updateProfile("email", e.target.value)}
              />
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">Checkout tanpa membuat akun. Data tersimpan di perangkat Anda.</p>
          </div>

          <div className="rounded-[var(--radius)] border border-[var(--line)] bg-white p-4">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-[var(--pandan)]" />
              <h2 className="font-display text-xl font-bold text-[var(--palm)]">Alamat Pengiriman</h2>
            </div>
            <div className="mt-3 grid gap-2">
              <Input
                placeholder="Nama lokasi / kantor"
                value={profile.placeName}
                onChange={(e) => updateProfile("placeName", e.target.value)}
              />
              <Input
                placeholder="Alamat lengkap"
                value={profile.address}
                onChange={(e) => updateProfile("address", e.target.value)}
                required
              />
              <textarea
                className="min-h-20 rounded-[var(--radius-sm)] border border-[var(--line)] p-3 text-sm outline-none focus:border-[var(--pandan)]"
                placeholder="Catatan pengiriman"
                value={profile.deliveryNote}
                onChange={(e) => updateProfile("deliveryNote", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[var(--radius)] border border-[var(--line)] bg-white p-4">
              <h2 className="font-display text-xl font-bold text-[var(--palm)]">Tanggal & Jam</h2>
              <div className="mt-3 grid gap-2">
                <Input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
                <Input
                  placeholder="Jam kirim, mis. 08.00 - 08.30"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                />
              </div>
            </div>
            <div className="rounded-[var(--radius)] border border-[var(--line)] bg-white p-4">
              <div className="flex items-center gap-2">
                <Truck className="size-4 text-[var(--pandan)]" />
                <h2 className="font-display text-xl font-bold text-[var(--palm)]">Metode Kirim</h2>
              </div>
              <div className="mt-3 grid gap-1.5 text-sm">
                {SHIPPING_OPTIONS.map((method) => (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-[var(--radius-sm)] border p-2.5 ${
                      shippingId === method.id
                        ? "border-[var(--pandan)] bg-[var(--ivory)]"
                        : "border-[var(--line)]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        className="accent-[var(--green)]"
                        checked={shippingId === method.id}
                        onChange={() => setShippingId(method.id)}
                      />
                      {method.label}
                    </span>
                    <span className="text-xs font-semibold">
                      {method.fee === 0 ? "Gratis" : rupiah(method.fee)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[var(--radius)] border border-[var(--line)] bg-white p-4">
            <div className="flex items-center gap-2">
              <CreditCard className="size-4 text-[var(--pandan)]" />
              <h2 className="font-display text-xl font-bold text-[var(--palm)]">Pembayaran</h2>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-4">
              {PAYMENT_OPTIONS.map((payment) => (
                <button
                  key={payment}
                  type="button"
                  onClick={() => setPaymentMethod(payment)}
                  className={`rounded-[var(--radius-sm)] border p-3 text-left text-sm font-semibold ${
                    paymentMethod === payment
                      ? "border-[var(--pandan)] bg-[var(--ivory)]"
                      : "border-[var(--line)]"
                  }`}
                >
                  {payment}
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside>
          <div className="sticky top-20 rounded-[var(--radius)] border border-[var(--line)] bg-white p-4">
            <div className="font-display text-xl font-bold text-[var(--palm)]">Ringkasan Pesanan</div>
            <div className="mt-3 grid gap-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-2.5 rounded-[var(--radius-sm)] bg-[var(--ivory)] p-2.5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-12 rounded-[var(--radius-sm)] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{item.name}</div>
                    <div className="text-xs text-[var(--muted)]">Qty {item.qty}</div>
                  </div>
                  <strong className="text-sm">{rupiah(item.unitPrice * item.qty)}</strong>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Subtotal</span>
                <strong>{rupiah(totals.subtotal)}</strong>
              </div>
              {discount > 0 ? (
                <div className="flex justify-between text-[var(--green)]">
                  <span>Diskon {coupon}</span>
                  <strong>-{rupiah(discount)}</strong>
                </div>
              ) : null}
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Ongkir</span>
                <strong>{shipping.fee === 0 ? "Gratis" : rupiah(shipping.fee)}</strong>
              </div>
              <div className="flex justify-between border-t border-[var(--line)] pt-2 font-semibold">
                <span>Total</span>
                <span>{rupiah(totals.total)}</span>
              </div>
            </div>
            {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
            <Button
              type="button"
              size="lg"
              className="mt-4 w-full"
              disabled={submitting || !items.length}
              onClick={placeOrder}
            >
              <CheckCircle2 className="size-4" /> Buat Pesanan
            </Button>
            <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
              Setelah buat pesanan, ringkasan dikirim ke WhatsApp admin dan tersimpan di halaman Akun.
            </p>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
