/**
 * Utilitas QRIS MPM: ubah QRIS statis (01=11) menjadi dinamis (01=12)
 * dengan menyisipkan Tag 54 (nominal) lalu menghitung ulang CRC-16/CCITT.
 *
 * Catatan: ini bukan dynamic QR dari payment gateway (Midtrans/Xendit).
 * Ini pola umum UMKM: nominal terkunci di QR yang discan e-wallet.
 */

export const QRIS_STATIC_PAYLOAD =
  "00020101021126610014COM.GO-JEK.WWW01189360091430411501340210G0411501340303UMI51440014ID.CO.QRIS.WWW0215ID10265663951940303UMI5204581253033605802ID5925Pasar Senen Kue Subuh (Sn6013JAKARTA PUSAT61051041062070703A016304EDAB";

export const QRIS_MERCHANT_NAME = "Pasar Senen Kue Subuh";
export const QRIS_NMID = "ID1026566395194";

type QrisTag = { tag: string; value: string };

/** CRC-16/CCITT-FALSE (poly 0x1021, init 0xFFFF) — standar EMVCo QRIS. */
export function crc16Ccitt(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i += 1) {
    crc ^= data.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      if (crc & 0x8000) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function parseQrisTags(payload: string): QrisTag[] {
  const tags: QrisTag[] = [];
  let i = 0;
  while (i + 4 <= payload.length) {
    const tag = payload.slice(i, i + 2);
    const length = Number.parseInt(payload.slice(i + 2, i + 4), 10);
    if (Number.isNaN(length) || i + 4 + length > payload.length) {
      throw new Error("Payload QRIS tidak valid.");
    }
    const value = payload.slice(i + 4, i + 4 + length);
    tags.push({ tag, value });
    i += 4 + length;
    if (tag === "63") break;
  }
  return tags;
}

function encodeTag(tag: string, value: string): string {
  const length = value.length;
  if (length > 99) {
    throw new Error(`Nilai tag ${tag} terlalu panjang (${length}).`);
  }
  return `${tag}${String(length).padStart(2, "0")}${value}`;
}

function rebuildPayload(tags: QrisTag[]): string {
  const withoutCrc = tags.filter((item) => item.tag !== "63");
  const body = withoutCrc.map((item) => encodeTag(item.tag, item.value)).join("") + "6304";
  return body + crc16Ccitt(body);
}

/** Format nominal Tag 54: "125000.00" (2 desimal, tanpa pemisah ribuan). */
export function formatQrisAmount(amount: number): string {
  const rounded = Math.round(amount);
  if (!Number.isFinite(rounded) || rounded <= 0) {
    throw new Error("Nominal QRIS harus lebih dari 0.");
  }
  return `${rounded}.00`;
}

/**
 * Ubah QRIS statis menjadi dinamis dengan nominal checkout.
 * - Tag 01: 11 → 12 (dynamic)
 * - Tag 54: nominal transaksi
 * - Tag 63: CRC dihitung ulang
 */
export function buildDynamicQris(
  amount: number,
  staticPayload: string = QRIS_STATIC_PAYLOAD,
): string {
  const tags = parseQrisTags(staticPayload).filter((item) => item.tag !== "63");
  const amountValue = formatQrisAmount(amount);

  const next: QrisTag[] = [];
  let insertedAmount = false;

  for (const item of tags) {
    if (item.tag === "01") {
      next.push({ tag: "01", value: "12" });
      continue;
    }
    if (item.tag === "54") {
      // ganti jika sudah ada
      next.push({ tag: "54", value: amountValue });
      insertedAmount = true;
      continue;
    }
    // Sisipkan Tag 54 setelah currency (53), sebelum country (58)
    if (item.tag === "58" && !insertedAmount) {
      next.push({ tag: "54", value: amountValue });
      insertedAmount = true;
    }
    next.push(item);
  }

  if (!insertedAmount) {
    next.push({ tag: "54", value: amountValue });
  }

  return rebuildPayload(next);
}

export function getQrisAmountFromPayload(payload: string): number | null {
  const amountTag = parseQrisTags(payload).find((item) => item.tag === "54");
  if (!amountTag) return null;
  const value = Number.parseFloat(amountTag.value);
  return Number.isFinite(value) ? value : null;
}

export function isDynamicQris(payload: string): boolean {
  const method = parseQrisTags(payload).find((item) => item.tag === "01");
  return method?.value === "12";
}
