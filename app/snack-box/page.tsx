"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, Droplets, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BOX_PRICE_WITHOUT_WATER,
  BOX_PRICE_WITH_WATER,
  SNACK_BOX_MIN_QTY,
} from "@/lib/commerce";
import { products } from "@/lib/data";
import { cn, rupiah } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const snackItems = products.filter((product) => product.category === "Kue Basah").slice(0, 12);

const boxSizes = [
  {
    name: "Reguler",
    desc: "Maksimal 3 snack per box. Cocok untuk rapat singkat.",
    maxSnacks: 3,
  },
  {
    name: "Premium",
    desc: "Maksimal 4 snack per box. Pilihan lebih lengkap.",
    maxSnacks: 4,
  },
  {
    name: "Custom Snack",
    desc: "Maksimal 5 produk per box. Susun sesuai kebutuhan acara.",
    maxSnacks: 5,
  },
];

export default function SnackBoxPage() {
  const router = useRouter();
  const { addSnackBox } = useCart();
  const [boxIndex, setBoxIndex] = useState(1);
  const [withWater, setWithWater] = useState(true);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(() =>
    snackItems.slice(0, 3).map((item) => item.slug),
  );
  const [boxCount, setBoxCount] = useState(30);
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
      setMessage(`Minimum order ${SNACK_BOX_MIN_QTY} box.`);
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
    router.push("/cart");
  }

  return (
    <PageShell>
      <section className="border-b border-[rgba(27,67,50,0.08)] bg-[var(--hero-cream)] py-10">
        <div className="container-shell grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="section-kicker">Buat snack box</p>
            <h1 className="font-display mt-1 text-3xl font-bold leading-tight text-[var(--palm)] md:text-4xl">
              Susun isi box sesuai acara
            </h1>
          </div>
          <p className="section-lead mt-0">
            Pilih ukuran, isi snack, air mineral, jumlah pesanan, dan catatan khusus.
            Cocok untuk rapat pagi, pengajian, arisan, dan acara kantor.
          </p>
        </div>
      </section>

      <section className="container-shell py-8">
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
              Ketuk kartu untuk memilih atau membatalkan. Tiap snack masuk 1x ke dalam box.
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
                    <div className="relative">
                      <img
                        src={item.image}
                        alt=""
                        className="aspect-[4/3] w-full rounded-[var(--radius-sm)] object-cover"
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
              <div className="font-display text-xl font-bold text-[var(--palm)]">Ringkasan Box</div>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {box.name} - {withWater ? "dengan air mineral" : "tanpa air mineral"}
              </p>
              <div className="mt-3 grid gap-2">
                {selectedSnacks.length === 0 ? (
                  <p className="text-sm text-[var(--muted)]">Belum ada snack dipilih.</p>
                ) : (
                  selectedSnacks.map((item) => (
                    <div
                      key={item.slug}
                      className="flex items-center gap-2.5 rounded-[var(--radius-sm)] bg-[var(--ivory)] p-2"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-10 rounded-[var(--radius-sm)] object-cover"
                      />
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
                    ? `Minimum ${SNACK_BOX_MIN_QTY} box terpenuhi.`
                    : `Minimum order ${SNACK_BOX_MIN_QTY} box.`}
                </p>
              </div>
              {message ? <p className="mt-2 text-sm text-red-700">{message}</p> : null}
              <Button type="button" size="lg" className="mt-3 w-full" onClick={handleAdd}>
                <ShoppingBag className="size-4" /> Tambah ke Keranjang
              </Button>
              <Button asChild variant="outline" className="mt-2 w-full">
                <a
                  href={getWhatsAppUrl(
                    `Halo Snack Boz, saya ingin konsultasi snack box ${box.name}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-4" /> Tanya Admin
                </a>
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
