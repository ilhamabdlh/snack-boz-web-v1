import Link from "next/link";
import { Clock, MapPin, MessageCircle } from "lucide-react";
import { PaymentMarks } from "@/components/payment-marks";
import { SiteBrandMark } from "@/components/site-brand";
import { BRAND } from "@/lib/brand";
import { formatWhatsAppDisplay, getWhatsAppUrl } from "@/lib/whatsapp";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12.186 24h-.007C6.618 23.99 2 19.366 2 13.786V10.21C2 4.63 6.618.006 12.179 0h.007C17.748.006 22.366 4.63 22.366 10.21v3.576c0 5.58-4.618 10.204-10.18 10.214zm5.036-13.54c-.164-2.84-1.92-4.56-4.92-4.72v-.01c-.21-.01-.43-.02-.65-.02-2.58 0-4.28 1.4-4.71 3.53-.1.49.23.8.73.8h.02c.4 0 .7-.24.79-.58.28-1.15 1.16-1.84 2.97-1.84.14 0 .28 0 .42.01 1.85.1 2.84 1.04 2.95 2.76-1.4-.3-2.89-.25-4.27.16-2.03.6-3.34 2.14-3.34 4.02 0 2.3 1.87 3.9 4.35 3.9 1.56 0 2.9-.66 3.78-1.85.1.68.3 1.32.6 1.9.18.35.52.5.87.5.1 0 .2-.01.3-.05.47-.16.72-.68.56-1.15-.4-.99-.6-2.03-.6-3.12v-4.86zm-4.7 6.66c-1.38 0-2.3-.8-2.3-2.02 0-1.5 1.3-2.5 3.5-2.95.78-.16 1.58-.22 2.36-.16v.66c0 2.45-1.5 4.47-3.56 4.47z" />
    </svg>
  );
}

export function SiteFooter() {
  const igUrl = `https://instagram.com/${BRAND.instagram}`;
  const threadsUrl = `https://www.threads.net/@${BRAND.threads}`;

  return (
    <footer className="mt-20 bg-[var(--green)] text-white">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <SiteBrandMark light />
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
            Dapur kue basah, snack box, dan kue tampah dari {BRAND.location}. Lebih
            dari 50 pilihan menu untuk arisan, pengajian, dan acara kantor di{" "}
            {BRAND.deliveryArea}.
          </p>
          <div className="mt-5 grid gap-2.5 text-sm text-white/75">
            <a
              href={getWhatsAppUrl(BRAND.waGreeting)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              <MessageCircle className="size-4 shrink-0" />
              {formatWhatsAppDisplay()}
            </a>
            <a
              href={igUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              <InstagramIcon className="size-4 shrink-0" />
              @{BRAND.instagram}
            </a>
            <a
              href={threadsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              <ThreadsIcon className="size-4 shrink-0" />
              @{BRAND.threads}
            </a>
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
              <Clock className="mt-0.5 size-4 shrink-0" />
              <span>
                {BRAND.hours}
                <span className="mt-0.5 block text-white/55">{BRAND.orderLead}</span>
              </span>
            </span>
            <span className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" /> {BRAND.location} · pengiriman{" "}
              {BRAND.deliveryArea}
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4">
        <div className="container-shell flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <PaymentMarks />
          <span className="text-xs text-white/50">
            © 2026 {BRAND.legalName} · {BRAND.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
