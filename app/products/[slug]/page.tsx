import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { ProductCard } from "@/components/product-card";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { productImageObjectClass, products } from "@/lib/data";
import {
  breadcrumbSchema,
  graphSchema,
  pageMetadata,
  productSchema,
} from "@/lib/seo";
import { rupiah } from "@/lib/utils";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) return { title: "Menu tidak ditemukan" };

  return pageMetadata({
    title: `${product.name} — ${product.category}`,
    description: `${product.description} Harga ${rupiah(product.price)}. Minimal ${product.minOrder} pcs. Cocok untuk ${product.occasions.slice(0, 3).join(", ")}.`,
    path: `/products/${product.slug}`,
    image: product.image,
    keywords: [product.name, product.category, ...product.occasions, ...product.tags],
  });
}

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
      <JsonLd
        data={graphSchema([
          productSchema(product),
          breadcrumbSchema([
            { name: "Beranda", path: "/" },
            { name: "Menu", path: "/products" },
            { name: product.name, path: `/products/${product.slug}` },
          ]),
        ])}
      />
      <section className="container-shell grid gap-8 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--rice)] shadow-[var(--shadow-sm)] lg:aspect-[4/5]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={75}
              className={productImageObjectClass(product.slug, product.category)}
            />
          </div>
          {similar.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[product, ...similar.slice(0, 3)].map((item) => (
                <Link
                  key={item.slug}
                  href={`/products/${item.slug}`}
                  className={`relative aspect-square overflow-hidden rounded-[var(--radius-sm)] bg-[var(--rice)] ${item.slug === product.slug ? "ring-2 ring-[var(--pandan)]" : ""}`}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="120px"
                    quality={65}
                    className={productImageObjectClass(item.slug, item.category)}
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
          <div className="mt-5">
            {product.variants?.length ? (
              <>
                <div className="text-xs font-medium text-[var(--muted)]">Mulai dari</div>
                <div className="text-2xl font-bold text-[var(--palm)]">
                  {rupiah(Math.min(...product.variants.map((item) => item.price)))}
                </div>
              </>
            ) : (
              <div className="text-2xl font-bold text-[var(--palm)]">{rupiah(product.price)}</div>
            )}
          </div>

          <ProductPurchasePanel product={product} />

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--warm-white)] p-4">
              <div className="text-sm font-semibold text-[var(--palm)]">Bahan utama</div>
              <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">{product.ingredients}</p>
            </div>
            <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--warm-white)] p-4">
              <div className="text-sm font-semibold text-[var(--palm)]">Porsi</div>
              <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">
                {product.variants?.length
                  ? product.variants
                      .map((item) => `${item.name}: ${item.portion}`)
                      .join(" · ")
                  : product.portion}
              </p>
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
