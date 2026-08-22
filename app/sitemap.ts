import type { MetadataRoute } from "next";
import { occasions, products } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/products"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/snack-box"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const occasionRoutes: MetadataRoute.Sitemap = occasions.map((occasion) => ({
    url: absoluteUrl(`/products?occasion=${encodeURIComponent(occasion)}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: absoluteUrl(`/products/${product.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: product.bestSeller ? 0.8 : 0.7,
  }));

  return [...staticRoutes, ...occasionRoutes, ...productRoutes];
}
