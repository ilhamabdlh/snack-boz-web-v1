import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { HeroSection } from "@/components/hero-section";
import { OccasionCarousel } from "@/components/occasion-carousel";
import { PosterCarousel } from "@/components/poster-carousel";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/faq-section";
import { JsonLd } from "@/components/json-ld";
import { BOX_PRICE_WITH_WATER } from "@/lib/commerce";
import { bestSellers, occasions, products } from "@/lib/data";
import { posters } from "@/lib/posters";
import { faqPageSchema, graphSchema, pageMetadata } from "@/lib/seo";
import { rupiah } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export const metadata = pageMetadata({
  title: `Kue basah & snack box untuk acara di Jabodetabek`,
  description:
    "Pasar Senen Kue Subuh menyediakan kue basah, snack box, dan kue tampah dari Pasar Senen Jaya. Minimal 20 pcs, boleh campur menu, pemesanan H-1, antar Jabodetabek.",
  path: "/",
  keywords: [
    "kue basah Jakarta Pusat",
    "snack box arisan",
    "kue tampah pengajian",
    "Pasar Senen Jaya",
  ],
});

const heroFeatured = [
  products.find((p) => p.slug === "dadar-gulung")!,
  products.find((p) => p.slug === "lemper-isi-ayam")!,
  products.find((p) => p.slug === "kue-lapis-legit")!,
  products.find((p) => p.slug === "risol-rogut")!,
];

const heroOccasions = ["Arisan", "Pengajian", "Rapat Kantor"];

const trustPoints = [
  {
    title: "Digoreng dan dikukus di hari antar",
    body: "Bukan stok kemarin. Risoles dan pastel baru turun dari wajan beberapa jam sebelum dikirim, jadi masih renyah waktu sampai.",
  },
  {
    title: "Satu pesanan boleh campur banyak menu",
    body: "Minimal 20 pcs, tapi tidak harus satu jenis. Mau 5 lemper, 5 risoles, 10 onde-onde dalam satu order juga boleh.",
  },
  {
    title: "Jam antar mengikuti jam acara",
    body: "Rapat pagi, arisan sore, pengajian malam. Sebutkan jamnya waktu pesan, nanti jadwal masak dan berangkatnya kami sesuaikan.",
  },
  {
    title: "Harganya kelihatan sejak awal",
    body: "Mulai Rp 5.000 per pcs. Biaya box dan ongkos antar dihitung terpisah, dan sudah muncul semua sebelum Anda bayar.",
  },
];

export default function HomePage() {
  const snackBoxExampleItems = products
    .filter((p) => p.category === "Kue Basah")
    .slice(0, 4);
  const snackBoxExamplePrice =
    BOX_PRICE_WITH_WATER +
    snackBoxExampleItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <PageShell>
      <JsonLd data={graphSchema([faqPageSchema()])} />
      <HeroSection featured={heroFeatured} occasions={heroOccasions} />

      {/* Poster menu */}
      <section className="container-shell section-pad">
        <div className="relative mb-6 max-w-xl sm:mb-9 lg:pr-24">
          <p className="section-kicker">Sorotan menu</p>
          <h2 className="section-title mt-1">Menu Favorit konsumen:</h2>
        </div>

        <PosterCarousel posters={posters} />
      </section>

      {/* Acara */}
      <section className="texture-paper section-pad">
        <div className="container-shell relative">
          <div className="mb-6 grid gap-3 sm:mb-9 lg:grid-cols-[1fr_auto] lg:items-end lg:pr-24">
            <div className="max-w-lg">
              <p className="section-kicker">Pilih dari acaranya</p>
              <h2 className="section-title mt-1">Bingung mau pesan apa? Coba tentuin dari acaranya dulu aja:</h2>
              <p className="section-lead">
                Arisan biasanya campur manis dan gurih. Rapat cari yang simple dan ga
                berantakan di meja. Hari raya butuh yang memorable, jadi kamu bisa coba menu-menu ini sesuai acaranya.
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm font-semibold text-[var(--green)] transition-colors hover:text-[var(--green-mid)]"
            >
              Semua menu →
            </Link>
          </div>

          <OccasionCarousel
            occasions={occasions.slice(0, 8)}
            images={occasions.slice(0, 8).map((_, index) => products[(index * 7) % products.length].image)}
          />
        </div>
      </section>

      {/* Favorit */}
      <section className="container-shell section-pad">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-9 sm:gap-4">
          <div>
            <p className="section-kicker">Favorit pelanggan</p>
            <h2 className="section-title mt-1">Kue-kue yang sering dipesan konsumen:</h2>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/products">Lihat semua</Link>
          </Button>
        </div>

        <div className="product-grid product-grid-4">
          {bestSellers.slice(0, 8).map((product) => (
            <ProductCard key={product.slug} product={product} compact />
          ))}
        </div>
      </section>

      {/* Snack box CTA */}
      <section className="bg-[var(--green)] py-12 text-white lg:py-20">
        <div className="container-shell grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div>
            <p className="text-sm font-semibold text-[var(--yellow)]">Snack box</p>
            <h2 className="font-display mt-2 text-balance text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
              Susun sendiri aja isi kuenya di box, sesuaikan dengan acara dan budget kamu
            </h2>
            <p className="mt-3 max-w-[42ch] text-pretty text-sm leading-6 text-white/75">
              Tentukan berapa macam snack per box, pakai air mineral atau tidak,
              lalu isi jumlah dan jam antar. Totalnya langsung terhitung, jadi
              gampang kalau perlu disesuaikan dengan kebutuhan acara.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-white/85 sm:mt-6">
              {[
                "Pilih ukuran box, 3 sampai 5 macam snack",
                "Pilih sendiri isinya dari menu kue basah",
                "Isi jumlah box dan jam antar",
              ].map((step) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="mt-2 size-1.5 shrink-0 self-start rounded-full bg-[var(--yellow)]" />
                  {step}
                </li>
              ))}
            </ul>
            <Button asChild size="lg" variant="accent" className="mt-6 w-full sm:mt-7 sm:w-auto">
              <Link href="/snack-box">Susun snack box</Link>
            </Button>
          </div>

          <div className="relative lg:-mr-4 lg:translate-y-2">
            <div className="rounded-[var(--radius-xl)] bg-[var(--yellow-soft)] p-3.5 text-[var(--black)] shadow-[var(--shadow-lg)] sm:p-5">
              <div className="grid gap-2 sm:gap-2.5">
                {snackBoxExampleItems.map((item) => (
                    <div
                      key={item.slug}
                      className="flex items-center gap-3 rounded-[var(--radius-sm)] bg-white p-2.5"
                    >
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-[8px] sm:size-14">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="56px"
                          quality={65}
                          className="object-cover"
                        />
                      </div>
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
                <span className="text-[var(--muted)]">Contoh isi 1 box</span>
                <strong className="tabular-nums">{rupiah(snackBoxExamplePrice)}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="container-shell section-pad">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="section-kicker">Cara kami kerja</p>
            <h2 className="section-title mt-1">Empat hal yang biasanya ditanyakan sebelum pesan</h2>
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

      <FaqSection />

      {/* Final CTA */}
      <section className="container-shell pb-12 sm:pb-16">
        <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--green)] px-5 py-7 text-white shadow-[var(--shadow-lg)] sm:rounded-[var(--radius-xl)] sm:px-7 sm:py-8 md:px-10 md:py-10">
          <div className="grid items-center gap-5 md:grid-cols-[1fr_auto] md:gap-6">
            <div>
              <h2 className="font-display text-balance text-xl font-bold sm:text-2xl md:text-3xl">
                Acaranya besok pagi? Tanyain dulu aja ke kami.
              </h2>
              <p className="mt-2 text-sm text-white/75">
                kasih tau mau pesan snack box, kue tampah atau kue lainnya, kami akan siapkan stok nya untuk kamu.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
              <Button asChild size="lg" variant="accent" className="w-full sm:w-auto">
                <Link href="/products">Lihat menu</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full border-white/25 bg-transparent text-white hover:border-white/50 hover:bg-white/10 hover:text-white sm:w-auto"
              >
                <a
                  href={getWhatsAppUrl(
                    "Halo Pasar Senen Kue Subuh, apakah masih bisa antar untuk acara besok?",
                  )}
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
