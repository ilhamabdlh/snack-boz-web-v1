import Link from "next/link";
import { Filter, Search } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { ProductInfiniteGrid } from "@/components/product-infinite-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, occasions, products } from "@/lib/data";

function productsHref(next: { category?: string; occasion?: string; q?: string }) {
  const params = new URLSearchParams();
  if (next.category) params.set("category", next.category);
  if (next.occasion) params.set("occasion", next.occasion);
  if (next.q) params.set("q", next.q);
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
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
      <section className="border-b border-[rgba(27,67,50,0.08)] bg-[var(--hero-cream)] py-10">
        <div className="container-shell">
          <p className="section-kicker">Produk</p>
          <div className="mt-2 grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <h1 className="font-display text-balance text-3xl font-bold text-[var(--palm)] md:text-4xl">
                Pilih menu untuk acara Anda
              </h1>
              <p className="section-lead">
                Filter berdasarkan kategori atau jenis acara.
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
                    placeholder="Cari produk atau paket..."
                  />
                </div>
                <Button type="submit">Cari</Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="container-shell py-8">
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          <Button asChild variant={!selectedCategory ? "secondary" : "outline"} size="sm">
            <Link href={productsHref({ occasion: selectedOccasion, q: params.q })}>Semua</Link>
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              asChild
              variant={selectedCategory === category ? "secondary" : "outline"}
              size="sm"
            >
              <Link
                href={productsHref({
                  category,
                  occasion: selectedOccasion,
                  q: params.q,
                })}
              >
                {category}
              </Link>
            </Button>
          ))}
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 hide-scrollbar lg:hidden">
          <Button
            asChild
            variant={!selectedOccasion ? "secondary" : "outline"}
            size="sm"
          >
            <Link href={productsHref({ category: selectedCategory, q: params.q })}>
              Semua acara
            </Link>
          </Button>
          {occasions.map((occasion) => (
            <Button
              key={occasion}
              asChild
              variant={selectedOccasion === occasion ? "secondary" : "outline"}
              size="sm"
            >
              <Link
                href={productsHref({
                  category: selectedCategory,
                  occasion,
                  q: params.q,
                })}
              >
                {occasion}
              </Link>
            </Button>
          ))}
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-[var(--radius)] bg-white p-4 shadow-[var(--shadow-sm)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--palm)]">
                <Filter className="size-4" /> Filter Acara
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
                Pesanan banyak? Admin bisa bantu rekomendasi isi box dan jadwal kirim.
              </p>
            </div>
          </aside>

          <div>
            <div className="mb-4">
              <p className="text-sm text-[var(--muted)]">
                {filtered.length} menu tersedia
                {selectedCategory ? ` - ${selectedCategory}` : ""}
                {selectedOccasion ? ` - ${selectedOccasion}` : ""}
                {params.q ? ` - "${params.q}"` : ""}
              </p>
            </div>
            {filtered.length === 0 ? (
              <div className="rounded-[var(--radius)] bg-white p-6 shadow-[var(--shadow-sm)]">
                <p className="text-[var(--muted)]">Tidak ada produk yang cocok.</p>
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
