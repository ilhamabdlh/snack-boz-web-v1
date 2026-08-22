"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, Droplets, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/toast-provider";
import {
  BOX_PRICE_WITHOUT_WATER,
  BOX_PRICE_WITH_WATER,
  SNACK_BOX_MIN_QTY,
} from "@/lib/commerce";
import { products, type Product } from "@/lib/data";
import { cn, rupiah } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const SNACK_BOX_EXCLUDED_CATEGORIES = new Set([
  "Kue Tampah",
  "Makanan Berat",
  "Snack Box",
]);

function isSnackBoxEligible(product: Product) {
  if (SNACK_BOX_EXCLUDED_CATEGORIES.has(product.category)) return false;
  const name = product.name.toLowerCase();
  if (name.includes("nasi bakar")) return false;
  if (name.includes("ricebowl") || name.includes("rice bowl")) return false;
  if (name.includes("ricebox") || name.includes("rice box")) return false;
  if (name.includes("tampah")) return false;
  return true;
}

const snackItems = products.filter(isSnackBoxEligible);
const presetPackages = products.filter((product) => product.category === "Snack Box");

const boxSizes = [
  {
    name: "Reguler",
    desc: "Sampai 3 macam snack. Ukuran paling sering diambil untuk rapat singkat.",
    maxSnacks: 3,
  },
  {
    name: "Lengkap",
    desc: "Sampai 4 macam snack. Pilihan aman kalau tamunya beragam selera.",
    maxSnacks: 4,
  },
  {
    name: "Bebas pilih",
    desc: "Sampai 5 macam snack. Untuk acara yang ingin isi boxnya terasa penuh.",
    maxSnacks: 5,
  },
];

export default function SnackBoxPage() {
  const router = useRouter();
  const { addSnackBox } = useCart();
  const { toast } = useToast();
  const [boxIndex, setBoxIndex] = useState(1);
  const [withWater, setWithWater] = useState(true);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [boxCount, setBoxCount] = useState(SNACK_BOX_MIN_QTY);
  const [eventDate, setEventDate] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  const box = boxSizes[boxIndex];
  const boxBasePrice = withWater ? BOX_PRICE_WITH_WATER : BOX_PRICE_WITHOUT_WATER;
  const selectedSnacks = useMemo(
    () => snackItems.filter((item) => selectedSlugs.includes(item.slug)),
    [selectedSlugs],
  );
  const snackSlots = selectedSnacks.length;
  const snacksCost = selectedSnacks.reduce((sum, item) => sum + item.price, 0);
  const unitPrice = boxBasePrice + snacksCost;
  const total = unitPrice * Math.max(0, boxCount);
  const minOk = boxCount >= SNACK_BOX_MIN_QTY;
  const snacksOk = snackSlots > 0 && snackSlots <= box.maxSnacks;

  function toggleSnack(slug: string) {
    const alreadySelected = selectedSlugs.includes(slug);
    if (alreadySelected) {
      setMessage("");
      setSelectedSlugs((prev) => prev.filter((item) => item !== slug));
      return;
    }
    if (selectedSlugs.length >= box.maxSnacks) {
      setMessage(`Ukuran ${box.name} maksimal ${box.maxSnacks} snack. Lepas pilihan lain dulu.`);
      return;
    }
    setMessage("");
    setSelectedSlugs((prev) => [...prev, slug]);
  }

  function handleAdd() {
    setMessage("");
    if (!minOk) {
      setMessage(`Minimal pesanan ${SNACK_BOX_MIN_QTY} box.`);
      return;
    }
    if (!snacksOk) {
      setMessage(`Pilih 1-${box.maxSnacks} snack untuk ukuran ${box.name}.`);
      return;
    }
    const image = selectedSnacks[0]?.image ?? snackItems[0].image;
    const waterNote = withWater ? "dengan air mineral" : "tanpa air mineral";
    addSnackBox({
      boxSize: box.name,
      unitPrice,
      qty: boxCount,
      image,
      snacks: selectedSnacks.map((item) => ({
        name: item.name,
        qty: 1,
      })),
      eventDate: eventDate || undefined,
      note: [note, waterNote].filter(Boolean).join(" - ") || undefined,
      withWater,
    });
    toast(`Snack Box ${box.name} berhasil ditambahkan ke keranjang`);
    router.push("/cart");
  }

  return (
    <PageShell>
      <section className="border-b border-[rgba(27,67,50,0.08)] bg-[var(--hero-cream)] py-10">
        <div className="container-shell grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="section-kicker">Snack box</p>
            <h1 className="font-display mt-1 text-3xl font-bold leading-tight text-[var(--palm)] md:text-4xl">
              Susun sendiri isi boxnya
            </h1>
          </div>
          <p className="section-lead mt-0">
            Pilih ukuran box, isi snacknya, pakai air mineral atau tidak, lalu
            tentukan jumlah dan jam antar. Minimal 10 box, dan totalnya
            terhitung otomatis sambil Anda memilih.
          </p>
        </div>
      </section>

      <section className="container-shell py-8">
        {presetPackages.length > 0 ? (
          <div className="mb-10">
            <h2 className="text-sm font-semibold text-[var(--palm)]">Paket siap pakai</h2>
            <p className="mt-1 max-w-[52ch] text-xs leading-5 text-[var(--muted)]">
              Isi box sudah ditentukan, tinggal pilih jumlah. Cocok kalau mau pesan cepat
              tanpa susun sendiri.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {presetPackages.map((pkg) => (
                <article
                  key={pkg.slug}
                  className="grid gap-4 rounded-[var(--radius)] border border-[var(--line)] bg-white p-4 sm:grid-cols-[140px_1fr]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-sm)] bg-[var(--rice)] sm:aspect-[3/4]">
                    <Image
                      src={pkg.image}
                      alt={pkg.name}
                      fill
                      sizes="140px"
                      quality={70}
                      className="object-contain object-center"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-bold text-[var(--palm)]">
                      {pkg.name}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{pkg.description}</p>
                    {pkg.packageItems?.length ? (
                      <ul className="mt-2 space-y-1 text-xs leading-5 text-[var(--muted)]">
                        {pkg.packageItems.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    ) : null}
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <strong className="text-sm text-[var(--green)]">
                        {rupiah(pkg.price)}/box
                      </strong>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/products/${pkg.slug}`}>Lihat detail</Link>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mb-8 flex flex-wrap gap-4 border-b border-[var(--line)] pb-6">
          {["Ukuran box", "Pilih snack", "Jumlah & jadwal"].map((step, i) => {
            const active =
              i === 0 || (i === 1 && snackSlots > 0) || (i === 2 && boxCount >= SNACK_BOX_MIN_QTY);
            return (
              <div key={step} className="flex items-center gap-2">
                <span
                  className={`grid size-7 place-items-center rounded-[var(--radius-sm)] text-xs font-bold ${
                    active
                      ? "bg-[var(--pandan)] text-[var(--white)]"
                      : "bg-[var(--rice)] text-[var(--muted)]"
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className={`text-sm font-medium ${
                    active ? "text-[var(--palm)]" : "text-[var(--muted)]"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="text-sm font-semibold text-[var(--palm)]">Pilih ukuran box</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {boxSizes.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    setBoxIndex(index);
                    setSelectedSlugs((prev) => prev.slice(0, item.maxSnacks));
                    setMessage("");
                  }}
                  className={`rounded-[var(--radius)] border p-4 text-left transition-colors ${
                    index === boxIndex
                      ? "border-[var(--pandan)] bg-white"
                      : "border-[var(--line)] bg-[var(--warm-white)]"
                  }`}
                >
                  <div className="font-semibold text-[var(--palm)]">{item.name}</div>
                  <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{item.desc}</p>
                  <p className="mt-2 text-xs font-semibold text-[var(--green)]">
                    Max {item.maxSnacks} produk
                  </p>
                </button>
              ))}
            </div>

            <h2 className="mt-8 text-sm font-semibold text-[var(--palm)]">Air mineral</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setWithWater(true)}
                className={`rounded-[var(--radius)] border p-4 text-left ${
                  withWater
                    ? "border-[var(--pandan)] bg-white"
                    : "border-[var(--line)] bg-[var(--warm-white)]"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-[var(--palm)]">
                  <Droplets className="size-4 text-[var(--green)]" />
                  Dengan air mineral
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Biaya box {rupiah(BOX_PRICE_WITH_WATER)} + harga snack
                </p>
              </button>
              <button
                type="button"
                onClick={() => setWithWater(false)}
                className={`rounded-[var(--radius)] border p-4 text-left ${
                  !withWater
                    ? "border-[var(--pandan)] bg-white"
                    : "border-[var(--line)] bg-[var(--warm-white)]"
                }`}
              >
                <div className="font-semibold text-[var(--palm)]">Tanpa air mineral</div>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Biaya box {rupiah(BOX_PRICE_WITHOUT_WATER)} + harga snack
                </p>
              </button>
            </div>

            <h2 className="mt-8 text-sm font-semibold text-[var(--palm)]">
              Pilih snack ({snackSlots}/{box.maxSnacks})
            </h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Ketuk untuk memilih atau melepas. Satu snack terpilih berarti satu isi
              di dalam setiap box.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {snackItems.map((item) => {
                const selected = selectedSlugs.includes(item.slug);
                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => toggleSnack(item.slug)}
                    aria-pressed={selected}
                    className={cn(
                      "rounded-[var(--radius)] border p-3 text-left transition-colors",
                      selected
                        ? "border-[var(--pandan)] bg-white shadow-[var(--shadow-sm)]"
                        : "border-[var(--line)] bg-[var(--warm-white)] hover:border-[rgba(27,67,50,0.25)]",
                    )}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-sm)]">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 50vw, 220px"
                        quality={65}
                        className="object-cover"
                      />
                      {selected ? (
                        <span className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-[var(--green)] text-[var(--white)]">
                          <Check className="size-3.5" aria-hidden />
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-2 font-semibold text-[var(--palm)]">{item.name}</div>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="text-sm text-[var(--muted)]">{rupiah(item.price)}</span>
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          selected ? "text-[var(--green)]" : "text-[var(--muted)]",
                        )}
                      >
                        {selected ? "Dipilih" : "Pilih"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-[var(--radius)] border border-[var(--line)] bg-white p-4">
              <div className="font-display text-xl font-bold text-[var(--palm)]">Ringkasan</div>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {box.name} - {withWater ? "dengan air mineral" : "tanpa air mineral"}
              </p>
              <div className="mt-3 grid gap-2">
                {selectedSnacks.length === 0 ? (
                  <p className="text-sm text-[var(--muted)]">Belum ada snack yang dipilih.</p>
                ) : (
                  selectedSnacks.map((item) => (
                    <div
                      key={item.slug}
                      className="flex items-center gap-2.5 rounded-[var(--radius-sm)] bg-[var(--ivory)] p-2"
                    >
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-[var(--radius-sm)]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="40px"
                          quality={60}
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-semibold">{item.name}</div>
                        <div className="text-xs text-[var(--muted)]">{rupiah(item.price)}</div>
                      </div>
                      <button
                        type="button"
                        className="text-xs font-semibold text-[var(--green)]"
                        onClick={() => toggleSnack(item.slug)}
                      >
                        Lepas
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 grid gap-2">
                <label htmlFor="box-count" className="text-xs font-semibold text-[var(--palm)]">
                  Jumlah box
                </label>
                <Input
                  id="box-count"
                  type="number"
                  min={SNACK_BOX_MIN_QTY}
                  value={boxCount}
                  onChange={(e) => setBoxCount(Math.max(0, Number(e.target.value) || 0))}
                />
                <label htmlFor="event-date" className="text-xs font-semibold text-[var(--palm)]">
                  Tanggal acara
                </label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
                  <Input
                    id="event-date"
                    type="date"
                    className="pl-10"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
                <label htmlFor="box-note" className="text-xs font-semibold text-[var(--palm)]">
                  Catatan
                </label>
                <textarea
                  id="box-note"
                  className="min-h-20 rounded-[var(--radius-sm)] border border-[var(--line)] p-3 text-sm outline-none focus:border-[var(--pandan)]"
                  placeholder="Contoh: kirim sebelum jam 08.30"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <div className="mt-4 rounded-[var(--radius-sm)] bg-[var(--rice)] p-3 text-sm">
                <div className="flex justify-between text-xs text-[var(--muted)]">
                  <span>Biaya box</span>
                  <span>{rupiah(boxBasePrice)}</span>
                </div>
                <div className="mt-1 flex justify-between text-xs text-[var(--muted)]">
                  <span>Isi snack / box</span>
                  <span>{rupiah(snacksCost)}</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-[rgba(27,67,50,0.08)] pt-2">
                  <span className="text-[var(--muted)]">
                    Estimasi ({boxCount || 0} box)
                  </span>
                  <strong>{rupiah(total)}</strong>
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {minOk
                    ? `Jumlahnya sudah memenuhi minimal ${SNACK_BOX_MIN_QTY} box.`
                    : `Minimal pesanan ${SNACK_BOX_MIN_QTY} box ya.`}
                </p>
              </div>
              {message ? <p className="mt-2 text-sm text-red-700">{message}</p> : null}
              <Button type="button" size="lg" className="mt-3 w-full" onClick={handleAdd}>
                <ShoppingBag className="size-4" /> Tambah ke keranjang
              </Button>
              <Button asChild variant="outline" className="mt-2 w-full">
                <a
                  href={getWhatsAppUrl(
                    `Halo Pasar Senen Kue Subuh, saya mau tanya soal snack box ukuran ${box.name}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-4" /> Tanya lewat WhatsApp
                </a>
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
