import Link from "next/link";
import { Clock, MapPin, MessageCircle } from "lucide-react";
import { formatWhatsAppDisplay, getWhatsAppUrl } from "@/lib/whatsapp";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-[var(--green)] text-white">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="font-display text-2xl font-bold">
            Snack<span className="text-[var(--yellow)]">Boz</span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
            Kue basah, kue kering, snack box, tampah, dan paket acara. Dibuat
            sesuai jadwal pesanan Anda.
          </p>
          <div className="mt-5 grid gap-2 text-sm text-white/75">
            <a
              href={getWhatsAppUrl("Halo Snack Boz")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              <MessageCircle className="size-4 shrink-0" /> WhatsApp {formatWhatsAppDisplay()}
            </a>
            <span className="flex items-center gap-2">
              <span className="size-4 shrink-0 text-center text-xs">@</span> snackboz.id
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Belanja</h3>
          <div className="mt-3 grid gap-2 text-sm text-white/75">
            <Link href="/products" className="transition-colors hover:text-white">
              Semua Produk
            </Link>
            <Link href="/snack-box" className="transition-colors hover:text-white">
              Buat Snack Box
            </Link>
            <Link
              href="/products?category=Kue%20Tampah"
              className="transition-colors hover:text-white"
            >
              Kue Tampah
            </Link>
            <Link href="/cart" className="transition-colors hover:text-white">
              Keranjang
            </Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Bantuan</h3>
          <div className="mt-3 grid gap-2 text-sm text-white/75">
            <Link href="/checkout" className="transition-colors hover:text-white">
              Cara Checkout
            </Link>
            <Link
              href="/products?occasion=Hampers"
              className="transition-colors hover:text-white"
            >
              Hampers
            </Link>
            <Link href="/account" className="transition-colors hover:text-white">
              Pesanan Saya
            </Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Jam & Lokasi</h3>
          <div className="mt-3 grid gap-2.5 text-sm leading-6 text-white/75">
            <span className="flex gap-2">
              <Clock className="mt-0.5 size-4 shrink-0" /> Senin-Sabtu, 06.00-17.00
            </span>
            <span className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" /> Jakarta Selatan, pengiriman
              Jabodetabek
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4">
        <div className="container-shell flex flex-wrap justify-between gap-2 text-xs text-white/50">
          <span>Transfer Bank / QRIS / Kartu / E-wallet</span>
          <span>© 2026 Snack Boz</span>
        </div>
      </div>
    </footer>
  );
}
