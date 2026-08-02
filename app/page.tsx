import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { HeroSection } from "@/components/hero-section";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { bestSellers, categories, occasionCopy, occasions, products } from "@/lib/data";
import { rupiah } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const categoryImage: Record<string, string> = {
  "Kue Basah": products.find((p) => p.slug === "dadar-gulung")!.image,
  "Kue Kering": products.find((p) => p.slug === "nastar")!.image,
  "Snack Box": products.find((p) => p.slug === "snack-box-rapat")!.image,
  "Kue Tampah": products.find((p) => p.slug === "tampah-keluarga")!.image,
  "Makanan Berat": products.find((p) => p.slug === "nasi-bakar-ayam-suwir")!.image,
};

const heroFeatured = [
  products.find((p) => p.slug === "dadar-gulung")!,
  products.find((p) => p.slug === "lemper-isi-ayam")!,
  products.find((p) => p.slug === "kue-lapis-legit")!,
  products.find((p) => p.slug === "risol-rogut")!,
];

const heroOccasions = ["Rapat Kantor", "Arisan", "Hari Raya"];

const trustPoints = [
  {
    title: "Dibuat sesuai jadwal",
    body: "Pesanan diproduksi mendekati waktu kirim, bukan dari stok lama.",
  },
  {
    title: "Jadwal fleksibel",
    body: "Bisa diatur untuk rapat, arisan, pengajian, dan acara keluarga.",
  },
  {
    title: "Pembayaran lengkap",
    body: "Transfer, QRIS, kartu, dan e-wallet. Admin siap bantu pesanan besar.",
  },
];

export default function HomePage() {
  const featuredCategory = categories[0];
  const sideCategories = categories.slice(1, 3);
  const bottomCategories = categories.slice(3);

  return (
    <PageShell>
      <HeroSection featured={heroFeatured} occasions={heroOccasions} />

      {/* Kategori */}
      <section className="container-shell section-pad">
        <div className="mb-6 max-w-xl sm:mb-9">
          <p className="section-kicker">Kategori</p>
          <h2 className="section-title mt-1">Langsung pilih yang dibutuhkan</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:grid-rows-[220px_180px] md:gap-4">
          <Link
            href={`/products?category=${encodeURIComponent(featuredCategory)}`}
            className="group relative col-span-2 min-h-[200px] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--rice)] md:col-span-7 md:row-span-2 md:min-h-0"
          >
            <img
              src={categoryImage[featuredCategory]}
              alt={featuredCategory}
              className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(27,67,50,0.78)] via-[rgba(27,67,50,0.15)] to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
              <div className="font-display text-2xl font-bold sm:text-3xl">{featuredCategory}</div>
              <div className="mt-1 text-sm text-white/80">
                {products.filter((p) => p.category === featuredCategory).length} pilihan menu
              </div>
            </div>
          </Link>

          {sideCategories.map((category) => (
            <Link
              key={category}
              href={`/products?category=${encodeURIComponent(category)}`}
              className="group relative min-h-[140px] overflow-hidden rounded-[var(--radius)] md:col-span-5 md:min-h-0"
            >
              <img
                src={categoryImage[category]}
                alt={category}
                className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-[rgba(27,67,50,0.42)] transition-colors group-hover:bg-[rgba(27,67,50,0.32)]" />
              <div className="relative flex h-full min-h-[140px] flex-col justify-end p-3 text-white sm:p-5 md:min-h-0">
                <div className="font-display text-base font-bold sm:text-xl">{category}</div>
                <div className="mt-0.5 text-xs text-white/80 sm:text-sm">
                  {products.filter((p) => p.category === category).length} pilihan
                </div>
              </div>
            </Link>
          ))}

          {bottomCategories.map((category) => (
            <Link
              key={category}
              href={`/products?category=${encodeURIComponent(category)}`}
              className="group col-span-2 flex overflow-hidden rounded-[var(--radius)] bg-white shadow-[var(--shadow-sm)] sm:col-span-1 md:col-span-6"
            >
              <div className="relative w-[38%] shrink-0 overflow-hidden bg-[var(--rice)] sm:w-40">
                <img
                  src={categoryImage[category]}
                  alt={category}
                  className="size-full min-h-[96px] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center p-3 sm:p-5">
                <div className="text-sm font-semibold text-[var(--palm)] sm:text-base">{category}</div>
                <div className="mt-1 text-xs text-[var(--muted)]">
                  {products.filter((p) => p.category === category).length} pilihan
                </div>
                <span className="mt-2 text-xs font-semibold text-[var(--green)] sm:mt-3">
                  Lihat menu →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Acara */}
      <section className="texture-paper section-pad">
        <div className="container-shell relative">
          <div className="mb-6 grid gap-3 sm:mb-9 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-lg">
              <p className="section-kicker">Untuk acara</p>
              <h2 className="section-title mt-1">Pilih berdasarkan meja acara</h2>
              <p className="section-lead">
                Rapat kantor, arisan, pengajian, pernikahan, hingga hari raya.
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm font-semibold text-[var(--green)] transition-colors hover:text-[var(--green-mid)]"
            >
              Semua produk →
            </Link>
          </div>

          <div className="hide-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2 sm:gap-4">
            {occasions.slice(0, 8).map((occasion, index) => {
              const wide = index % 3 === 0;
              return (
                <Link
                  href={`/products?occasion=${encodeURIComponent(occasion)}`}
                  key={occasion}
                  className={`group shrink-0 overflow-hidden rounded-[var(--radius-lg)] bg-white shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow)] ${
                    wide ? "w-[240px] sm:w-[300px]" : "w-[200px] sm:w-[220px]"
                  }`}
                >
                  <div className={`overflow-hidden bg-[var(--rice)] ${wide ? "aspect-[5/3.2]" : "aspect-[5/3]"}`}>
                    <img
                      src={products[(index * 7) % products.length].image}
                      alt={occasion}
                      className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-3.5 sm:p-4">
                    <div className="font-display text-base font-bold text-[var(--palm)] sm:text-lg">
                      {occasion}
                    </div>
                    <p className="mt-1 line-clamp-2 text-pretty text-xs leading-5 text-[var(--muted)]">
                      {occasionCopy[occasion]}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Favorit */}
      <section className="container-shell section-pad">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-9 sm:gap-4">
          <div>
            <p className="section-kicker">Favorit</p>
            <h2 className="section-title mt-1">Sering dipesan untuk kantor & keluarga</h2>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/products">Lihat semua</Link>
          </Button>
        </div>

        {/* Mobile: 2 cards per row */}
        <div className="product-grid lg:hidden">
          {bestSellers.slice(0, 6).map((product) => (
            <ProductCard key={product.slug} product={product} compact />
          ))}
        </div>

        {/* Desktop: featured + compact editorial */}
        <div className="hidden lg:block">
          <div className="grid gap-4 lg:grid-cols-12">
            {bestSellers.slice(0, 1).map((product) => (
              <div key={product.slug} className="lg:col-span-7">
                <ProductCard product={product} featured />
              </div>
            ))}
            <div className="grid gap-4 lg:col-span-5 lg:grid-cols-1">
              {bestSellers.slice(1, 3).map((product) => (
                <ProductCard key={product.slug} product={product} compact />
              ))}
            </div>
          </div>
          <div className="product-grid product-grid-4 mt-4">
            {bestSellers.slice(3, 7).map((product) => (
              <ProductCard key={product.slug} product={product} compact />
            ))}
          </div>
        </div>
      </section>

      {/* Snack box CTA */}
      <section className="bg-[var(--green)] py-12 text-white lg:py-20">
        <div className="container-shell grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div>
            <p className="text-sm font-semibold text-[var(--yellow)]">Buat snack box</p>
            <h2 className="font-display mt-2 text-balance text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
              Susun isi box sesuai acara Anda
            </h2>
            <p className="mt-3 max-w-[40ch] text-pretty text-sm leading-6 text-white/75">
              Pilih ukuran, tambah snack, atur jumlah dan jadwal kirim. Cocok
              untuk rapat kantor, pengajian, dan arisan.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-white/85 sm:mt-6">
              {["Pilih ukuran box", "Tambah snack favorit", "Atur jadwal pengiriman"].map(
                (step) => (
                  <li key={step} className="flex items-center gap-3">
                    <span className="size-1.5 shrink-0 rounded-full bg-[var(--yellow)]" />
                    {step}
                  </li>
                ),
              )}
            </ul>
            <Button asChild size="lg" variant="accent" className="mt-6 w-full sm:mt-7 sm:w-auto">
              <Link href="/snack-box">Mulai Buat Snack Box</Link>
            </Button>
          </div>

          <div className="relative lg:-mr-4 lg:translate-y-2">
            <div className="rounded-[var(--radius-xl)] bg-[var(--yellow-soft)] p-3.5 text-[var(--black)] shadow-[var(--shadow-lg)] sm:p-5">
              <div className="grid gap-2 sm:gap-2.5">
                {products
                  .filter((p) => p.category === "Kue Basah")
                  .slice(0, 4)
                  .map((item) => (
                    <div
                      key={item.slug}
                      className="flex items-center gap-3 rounded-[var(--radius-sm)] bg-white p-2.5"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-12 rounded-[8px] object-cover sm:size-14"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold">{item.name}</div>
                        <div className="text-xs tabular-nums text-[var(--muted)]">
                          {rupiah(item.price)}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[var(--green)]">1x</span>
                    </div>
                  ))}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-[var(--radius-sm)] bg-[var(--yellow)]/50 px-3.5 py-3 text-sm">
                <span className="text-[var(--muted)]">Estimasi 30 box</span>
                <strong className="tabular-nums">{rupiah(705000)}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="container-shell section-pad">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="section-kicker">Kenapa Snack Boz</p>
            <h2 className="section-title mt-1">Pesanan tiba tepat waktu</h2>
          </div>
          <ul className="space-y-0">
            {trustPoints.map((point) => (
              <li
                key={point.title}
                className="border-b border-[rgba(27,67,50,0.1)] py-5 first:pt-0 last:border-0 sm:py-6"
              >
                <h3 className="font-display text-lg font-bold text-[var(--palm)] sm:text-xl">
                  {point.title}
                </h3>
                <p className="mt-1.5 max-w-[48ch] text-pretty text-sm leading-6 text-[var(--muted)]">
                  {point.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-shell pb-12 sm:pb-16">
        <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--green)] px-5 py-7 text-white shadow-[var(--shadow-lg)] sm:rounded-[var(--radius-xl)] sm:px-7 sm:py-8 md:px-10 md:py-10">
          <div className="grid items-center gap-5 md:grid-cols-[1fr_auto] md:gap-6">
            <div>
              <h2 className="font-display text-balance text-xl font-bold sm:text-2xl md:text-3xl">
                Ada acara mendadak? Kami siap bantu.
              </h2>
              <p className="mt-2 text-sm text-white/75">
                Konsultasi menu dan jadwal via WhatsApp.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
              <Button asChild size="lg" variant="accent" className="w-full sm:w-auto">
                <Link href="/products">Mulai Pesan</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full border-white/25 bg-transparent text-white hover:border-white/50 hover:bg-white/10 hover:text-white sm:w-auto"
              >
                <a
                  href={getWhatsAppUrl("Halo Snack Boz, saya butuh bantuan acara mendadak.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
