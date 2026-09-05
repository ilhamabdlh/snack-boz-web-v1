import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { MarketplaceLinks } from "@/components/marketplace-links";
import { PaymentMarks } from "@/components/payment-marks";
import { SiteBrandMark } from "@/components/site-brand";
import { BRAND } from "@/lib/brand";

export function SiteFooter() {
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
          <MarketplaceLinks light withSocial className="mt-5" />
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
            <Link href="/belanja-kuesubuh" className="transition-colors hover:text-white">
              Belanja Kue Subuh
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
