import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { ProductCard } from "@/components/product-card";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { products } from "@/lib/data";
import { rupiah } from "@/lib/utils";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();

  const similar = products
    .filter((item) => item.category === product.category && item.slug !== product.slug)
    .slice(0, 4);

  return (
    <PageShell>
      <section className="container-shell grid gap-8 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[var(--rice)] shadow-[var(--shadow-sm)]">
            <img
              src={product.image}
              alt={product.name}
              className="aspect-[5/4] w-full object-cover object-bottom lg:aspect-[4/5]"
            />
          </div>
          {similar.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[product, ...similar.slice(0, 3)].map((item) => (
                <Link
                  key={item.slug}
                  href={`/products/${item.slug}`}
                  className={`overflow-hidden rounded-[var(--radius-sm)] bg-[var(--rice)] ${item.slug === product.slug ? "ring-2 ring-[var(--pandan)]" : ""}`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="aspect-square w-full object-cover object-bottom"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-[var(--pandan)]">
            {product.category}
          </div>
          <h1 className="font-display mt-2 text-3xl font-bold leading-tight text-[var(--palm)] md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-3 text-base leading-7 text-[var(--muted)]">{product.description}</p>
          <div className="mt-5 text-2xl font-bold text-[var(--palm)]">{rupiah(product.price)}</div>

          <ProductPurchasePanel product={product} />

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--warm-white)] p-4">
              <div className="text-sm font-semibold text-[var(--palm)]">Bahan utama</div>
              <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">{product.ingredients}</p>
            </div>
            <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--warm-white)] p-4">
              <div className="text-sm font-semibold text-[var(--palm)]">Porsi</div>
              <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">{product.portion}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {product.occasions.map((occasion) => (
              <Link
                key={occasion}
                href={`/products?occasion=${encodeURIComponent(occasion)}`}
                className="rounded-[var(--radius-sm)] bg-[var(--rice)] px-2.5 py-1 text-xs font-medium text-[var(--cocoa)] hover:bg-[var(--pandan)] hover:text-[var(--white)]"
              >
                {occasion}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="container-shell border-t border-[var(--line)] py-10">
          <h2 className="font-display text-2xl font-bold text-[var(--palm)]">Menu serupa</h2>
          <div className="product-grid product-grid-4 mt-5">
            {similar.map((item) => (
              <ProductCard key={item.slug} product={item} compact />
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
