"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, MessageCircle, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteNavLink } from "@/components/site-nav-link";
import { categories, occasions } from "@/lib/data";
import { formatWhatsAppDisplay, getWhatsAppUrl } from "@/lib/whatsapp";

export function SiteHeader() {
  const { itemCount, ready } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  function onSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const q = String(form.get("q") || "").trim();
    setMenuOpen(false);
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }

  return (
    <header className="sticky top-0 z-[var(--z-header)] border-b border-[rgba(27,67,50,0.08)] bg-[rgba(253,252,248,0.92)] backdrop-blur-md">
      <a href="#main-content" className="skip-link">
        Lewati ke konten
      </a>
      <div className="container-shell flex h-14 items-center gap-2 sm:h-[4.25rem] sm:gap-3">
        <Link href="/" className="mr-1 flex shrink-0 items-center" onClick={() => setMenuOpen(false)}>
          <span className="font-display text-[1.2rem] font-bold leading-none text-[var(--green)] sm:text-[1.35rem]">
            Snack<span className="text-[var(--black)]">Boz</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Navigasi utama">
          <SiteNavLink href="/products" match="prefix">
            Produk
          </SiteNavLink>
          <div className="group relative">
            <button
              type="button"
              className="rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-[var(--black)] transition-colors duration-200 hover:bg-[var(--yellow-soft)]"
            >
              Kategori
            </button>
            <div className="invisible absolute left-0 top-9 z-[var(--z-dropdown)] w-52 rounded-[var(--radius)] bg-white p-1.5 opacity-0 shadow-[var(--shadow)] outline outline-1 outline-[rgba(27,67,50,0.08)] transition-[opacity,visibility] duration-200 group-hover:visible group-hover:opacity-100">
              {categories.map((category) => (
                <Link
                  key={category}
                  className="block rounded-[var(--radius-sm)] px-3 py-2 text-sm transition-colors hover:bg-[var(--yellow-soft)]"
                  href={`/products?category=${encodeURIComponent(category)}`}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
          <div className="group relative">
            <button
              type="button"
              className="rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-[var(--black)] transition-colors duration-200 hover:bg-[var(--yellow-soft)]"
            >
              Untuk Acara
            </button>
            <div className="invisible absolute left-0 top-9 z-[var(--z-dropdown)] grid w-64 grid-cols-2 gap-0.5 rounded-[var(--radius)] bg-white p-1.5 opacity-0 shadow-[var(--shadow)] outline outline-1 outline-[rgba(27,67,50,0.08)] transition-[opacity,visibility] duration-200 group-hover:visible group-hover:opacity-100">
              {occasions.slice(0, 8).map((occasion) => (
                <Link
                  key={occasion}
                  className="rounded-[var(--radius-sm)] px-2.5 py-2 text-sm transition-colors hover:bg-[var(--yellow-soft)]"
                  href={`/products?occasion=${encodeURIComponent(occasion)}`}
                >
                  {occasion}
                </Link>
              ))}
            </div>
          </div>
          <SiteNavLink href="/snack-box">Snack Box</SiteNavLink>
        </nav>

        <form
          onSubmit={onSearch}
          className="ml-auto hidden min-w-52 flex-1 items-center lg:flex"
          role="search"
        >
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
            <Input
              name="q"
              className="rounded-[var(--radius-sm)] border-[rgba(27,67,50,0.1)] bg-white pl-10"
              placeholder="Cari lemper, risoles, snack box..."
            />
          </div>
        </form>

        <Button asChild variant="outline" size="sm" className="hidden xl:inline-flex">
          <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
        </Button>
        <Button asChild variant="ghost" size="icon" aria-label="Akun">
          <Link href="/account">
            <UserRound className="size-4" />
          </Link>
        </Button>
        <Button asChild variant="secondary" size="icon" aria-label="Keranjang" className="relative">
          <Link href="/cart">
            <ShoppingBag className="size-4" />
            {ready && itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-[var(--yellow)] px-1 text-[0.65rem] font-bold text-[var(--black)]">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            ) : null}
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </Button>
      </div>

      <div className="container-shell pb-2.5 lg:hidden">
        <form onSubmit={onSearch} role="search">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
            <Input
              name="q"
              className="h-9 rounded-[var(--radius-sm)] border-[rgba(27,67,50,0.1)] bg-white pl-10 text-sm"
              placeholder="Cari kue atau paket acara..."
            />
          </div>
        </form>
      </div>

      {menuOpen ? (
        <div className="border-t border-[rgba(27,67,50,0.08)] bg-[var(--hero-cream)] lg:hidden">
          <nav className="container-shell grid gap-1 py-3" aria-label="Menu mobile">
            <Link
              href="/products"
              className="rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Produk
            </Link>
            <Link
              href="/snack-box"
              className="rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Snack Box
            </Link>
            <Link
              href="/cart"
              className="rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Keranjang {ready && itemCount > 0 ? `(${itemCount})` : ""}
            </Link>
            <Link
              href="/account"
              className="rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Akun / Pesanan
            </Link>
            <div className="mt-2 border-t border-[rgba(27,67,50,0.08)] pt-2">
              <p className="px-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Kategori
              </p>
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/products?category=${encodeURIComponent(category)}`}
                  className="block rounded-[var(--radius-sm)] px-3 py-2 text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
            </div>
            <a
              href={getWhatsAppUrl(`Halo Snack Boz, saya ingin tanya menu.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--green)] px-3 py-2.5 text-sm font-semibold text-[var(--white)]"
              onClick={() => setMenuOpen(false)}
            >
              <MessageCircle className="size-4" />
              WhatsApp {formatWhatsAppDisplay()}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
