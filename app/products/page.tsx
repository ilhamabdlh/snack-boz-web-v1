import Link from "next/link";
import type { Metadata } from "next";
import { Filter, Search, X } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { ProductInfiniteGrid } from "@/components/product-infinite-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, occasions, products } from "@/lib/data";
import {
  breadcrumbSchema,
  graphSchema,
  itemListSchema,
  pageMetadata,
} from "@/lib/seo";
import { cn } from "@/lib/utils";

function productsHref(next: { category?: string; occasion?: string; q?: string }) {
  const params = new URLSearchParams();
  if (next.category) params.set("category", next.category);
  if (next.occasion) params.set("occasion", next.occasion);
  if (next.q) params.set("q", next.q);
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-8 shrink-0 items-center whitespace-nowrap rounded-full px-3.5 text-[0.8125rem] font-medium transition-colors",
        active
          ? "bg-[var(--green)] text-white"
          : "border border-[rgba(27,67,50,0.12)] bg-white text-[var(--palm)] hover:border-[var(--green)] hover:text-[var(--green)]",
      )}
    >
      {children}
    </Link>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; occasion?: string; q?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const bits = [params.category, params.occasion, params.q].filter(Boolean);
  const label = bits.length ? bits.join(" · ") : "Semua menu";
  return pageMetadata({
    title: `${label} kue & snack box`,
    description:
      "Lihat semua menu kue basah, kue kering, snack box, kue tampah, dan makanan berat. Saring per kategori atau acara. Minimal 20 pcs, boleh campur menu. Antar Jabodetabek.",
    path: productsHref({
      category: params.category,
      occasion: params.occasion,
      q: params.q,
    }),
    keywords: ["menu kue basah", "katalog snack box", ...categories, ...occasions],
  });
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; occasion?: string; q?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category;
  const selectedOccasion = params.occasion;
  const query = params.q?.toLowerCase() ?? "";
  const hasFilter = Boolean(selectedCategory || selectedOccasion || params.q);

  const filtered = products.filter((product) => {
    const categoryMatch = selectedCategory ? product.category === selectedCategory : true;
    const occasionMatch = selectedOccasion ? product.occasions.includes(selectedOccasion) : true;
    const queryMatch = query
      ? `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query)
      : true;
    return categoryMatch && occasionMatch && queryMatch;
  });

  return (
    <PageShell>
      <JsonLd
        data={graphSchema([
          itemListSchema(filtered, "Menu Pasar Senen Kue Subuh", "/products"),
          breadcrumbSchema([
            { name: "Beranda", path: "/" },
            { name: "Menu", path: "/products" },
          ]),
        ])}
      />
      <section className="border-b border-[rgba(27,67,50,0.08)] bg-[var(--hero-cream)] py-8 sm:py-10">
        <div className="container-shell">
          <p className="section-kicker">Produk</p>
          <div className="mt-2 grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <h1 className="font-display text-balance text-3xl font-bold text-[var(--palm)] md:text-4xl">
                Semua menu kue & snack box
              </h1>
              <p className="section-lead">
                Saring dari kategori atau jenis acara. Minimal 20 pcs untuk satu
                pesanan, dan boleh dicampur dari beberapa menu sekaligus.
              </p>
            </div>
            <form
              action="/products"
              method="get"
              className="rounded-[var(--radius)] bg-white p-2 shadow-[var(--shadow-sm)]"
            >
              {selectedCategory ? (
                <input type="hidden" name="category" value={selectedCategory} />
              ) : null}
              {selectedOccasion ? (
                <input type="hidden" name="occasion" value={selectedOccasion} />
              ) : null}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
                  <Input
                    name="q"
                    defaultValue={params.q}
                    className="border-0 bg-[var(--page)] pl-10"
                    placeholder="Cari lemper, risoles, nagasari..."
                  />
                </div>
                <Button type="submit">Cari</Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="container-shell py-6 sm:py-8">
        <div className="rounded-[var(--radius)] border border-[rgba(27,67,50,0.08)] bg-white/80 p-3 shadow-[var(--shadow-sm)] sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
              Kategori
            </p>
            {hasFilter ? (
              <Link
                href="/products"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--green)] hover:underline"
              >
                <X className="size-3.5" />
                Reset
              </Link>
            ) : null}
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-0.5 hide-scrollbar">
            <FilterChip
              href={productsHref({ occasion: selectedOccasion, q: params.q })}
              active={!selectedCategory}
            >
              Semua
            </FilterChip>
            {categories.map((category) => (
              <FilterChip
                key={category}
                href={productsHref({
                  category,
                  occasion: selectedOccasion,
                  q: params.q,
                })}
                active={selectedCategory === category}
              >
                {category}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-[var(--radius)] bg-white p-4 shadow-[var(--shadow-sm)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--palm)]">
                <Filter className="size-4" /> Saring acara
              </div>
              <div className="mt-3 grid gap-1">
                <Link
                  href={productsHref({ category: selectedCategory, q: params.q })}
                  className={`rounded-[var(--radius-sm)] px-3 py-2 text-sm transition-colors ${
                    !selectedOccasion
                      ? "bg-[var(--green)] text-[var(--white)]"
                      : "text-[var(--cocoa)] hover:bg-[var(--yellow-soft)]"
                  }`}
                >
                  Semua acara
                </Link>
                {occasions.map((occasion) => (
                  <Link
                    key={occasion}
                    href={productsHref({
                      category: selectedCategory,
                      occasion,
                      q: params.q,
                    })}
                    className={`rounded-[var(--radius-sm)] px-3 py-2 text-sm transition-colors ${
                      selectedOccasion === occasion
                        ? "bg-[var(--green)] text-[var(--white)]"
                        : "text-[var(--cocoa)] hover:bg-[var(--yellow-soft)]"
                    }`}
                  >
                    {occasion}
                  </Link>
                ))}
              </div>
              <p className="mt-4 rounded-[var(--radius-sm)] bg-[var(--yellow-soft)] p-3 text-xs leading-5 text-[var(--cocoa)]">
                Pesanan di atas 100 pcs? Hubungi kami lewat WhatsApp, nanti dibantu
                hitung isi box dan jam antarnya.
              </p>
            </div>
          </aside>

          <div>
            <div className="mb-4">
              <p className="text-sm text-[var(--muted)]">
                {filtered.length} menu
                {selectedCategory ? ` · ${selectedCategory}` : ""}
                {selectedOccasion ? ` · ${selectedOccasion}` : ""}
                {params.q ? ` · “${params.q}”` : ""}
              </p>
            </div>
            {filtered.length === 0 ? (
              <div className="rounded-[var(--radius)] bg-white p-6 shadow-[var(--shadow-sm)]">
                <p className="text-[var(--muted)]">
                  Tidak ada menu yang cocok. Coba hapus filternya atau ganti kata kuncinya.
                </p>
                <Button asChild className="mt-4" variant="outline">
                  <Link href="/products">Reset filter</Link>
                </Button>
              </div>
            ) : (
              <ProductInfiniteGrid products={filtered} />
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
