import Image from "next/image";
import { cn } from "@/lib/utils";

/** Payment marks — putih mono untuk footer gelap. */
const LOGOS = [
  { id: "bca", title: "BCA", src: "/payment/bca.png", width: 88, height: 28 },
  { id: "mandiri", title: "Mandiri", src: "/payment/mandiri.png", width: 94, height: 28 },
  { id: "bni", title: "BNI", src: "/payment/bni.png", width: 95, height: 28 },
  { id: "cimb", title: "CIMB Niaga", src: "/payment/cimb.png", width: 177, height: 28 },
  { id: "smbc", title: "SMBC", src: "/payment/smbc.png", width: 93, height: 28 },
  { id: "qris", title: "QRIS", src: "/payment/qris.png", width: 70, height: 28 },
] as const;

export function PaymentMarks({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <p className="text-[11px] lowercase tracking-wide text-white/55">
        pembayaran dengan:
      </p>
      <div
        className="flex flex-wrap items-center gap-x-3.5 gap-y-2"
        aria-label="Metode pembayaran"
      >
        {LOGOS.map((logo) => (
          <span
            key={logo.id}
            title={logo.title}
            aria-label={logo.title}
            className="inline-flex h-5 items-center opacity-90 transition-opacity hover:opacity-100"
          >
            <Image
              src={logo.src}
              alt={logo.title}
              width={logo.width}
              height={logo.height}
              className="h-4 w-auto object-contain sm:h-[18px]"
            />
          </span>
        ))}
      </div>
    </div>
  );
}
