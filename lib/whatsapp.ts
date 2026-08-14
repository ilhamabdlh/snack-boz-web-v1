import { BRAND } from "@/lib/brand";

const FALLBACK_WA = BRAND.whatsappFallback;

export function getWhatsAppNumber() {
  return (process.env.NEXT_PUBLIC_WHATSAPP || FALLBACK_WA).replace(/\D/g, "");
}

export function formatWhatsAppDisplay(number = getWhatsAppNumber()) {
  const digits = number.replace(/\D/g, "");
  if (digits.startsWith("62") && digits.length >= 11) {
    const local = `0${digits.slice(2)}`;
    return local.replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3");
  }
  return digits;
}

export function getWhatsAppUrl(message?: string) {
  const base = `https://wa.me/${getWhatsAppNumber()}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}
