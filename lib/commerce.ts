export const CART_STORAGE_KEY = "snackboz-cart-v1";
export const ORDERS_STORAGE_KEY = "snackboz-orders-v1";
export const PROFILE_STORAGE_KEY = "snackboz-profile-v1";
export const ADDRESSES_STORAGE_KEY = "snackboz-addresses-v1";

/** Minimum total pcs for product items (can mix across products). */
export const MIXED_PRODUCT_MIN_QTY = 20;
/** Minimum boxes for custom snack-box orders. */
export const SNACK_BOX_MIN_QTY = 20;
export const BOX_PRICE_WITH_WATER = 3500;
export const BOX_PRICE_WITHOUT_WATER = 3000;

export type CartItemKind = "product" | "snack-box";

export type CartItem = {
  id: string;
  kind: CartItemKind;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  qty: number;
  minOrder: number;
  note?: string;
  meta?: {
    boxSize?: string;
    snacks?: { name: string; qty: number }[];
    eventDate?: string;
    withWater?: boolean;
  };
};

export type CartState = {
  items: CartItem[];
  coupon?: string;
};

export type CheckoutProfile = {
  name: string;
  phone: string;
  email: string;
  placeName: string;
  address: string;
  deliveryNote: string;
};

export type SavedAddress = {
  id: string;
  label: string;
  placeName: string;
  address: string;
  note?: string;
};

export type OrderItem = Omit<CartItem, "note"> & { note?: string };

export type Order = {
  id: string;
  createdAt: string;
  status: "Diproses" | "Siap dikirim" | "Selesai";
  items: OrderItem[];
  profile: CheckoutProfile;
  deliveryDate: string;
  deliveryTime: string;
  shippingMethod: string;
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  coupon?: string;
};

export const SHIPPING_OPTIONS = [
  { id: "kurir", label: "Kurir Snack Boz", fee: 35000 },
  { id: "pickup", label: "Ambil di dapur", fee: 0 },
  { id: "sameday", label: "Same-day (by request)", fee: 55000 },
] as const;

export const PAYMENT_OPTIONS = ["Transfer Bank", "QRIS", "Kartu", "E-wallet"] as const;

export const COUPONS: Record<string, { type: "percent" | "fixed"; value: number; label: string }> = {
  SNACK10: { type: "percent", value: 10, label: "Diskon 10%" },
  HEMAT50: { type: "fixed", value: 50000, label: "Potongan Rp 50.000" },
};

export function createCartItemId(kind: CartItemKind, slug: string, boxSize?: string) {
  return kind === "snack-box" ? `snack-box:${slug}:${boxSize ?? "custom"}` : `product:${slug}`;
}

export function calcSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
}

export function calcDiscount(subtotal: number, coupon?: string) {
  if (!coupon) return 0;
  const rule = COUPONS[coupon.toUpperCase()];
  if (!rule) return 0;
  if (rule.type === "percent") return Math.round((subtotal * rule.value) / 100);
  return Math.min(rule.value, subtotal);
}

export function calcCartTotal(items: CartItem[], coupon?: string, shippingFee = 0) {
  const subtotal = calcSubtotal(items);
  const discount = calcDiscount(subtotal, coupon);
  return {
    subtotal,
    discount,
    shippingFee,
    total: Math.max(0, subtotal - discount + shippingFee),
  };
}

export function createOrderId(date = new Date()) {
  const y = String(date.getFullYear()).slice(2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = String(Math.floor(Math.random() * 900) + 100);
  return `SB-${y}${m}${d}-${rand}`;
}

export function safeParseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function productPcsTotal(items: CartItem[]) {
  return items
    .filter((item) => item.kind === "product")
    .reduce((sum, item) => sum + item.qty, 0);
}

export function snackBoxQtyTotal(items: CartItem[]) {
  return items
    .filter((item) => item.kind === "snack-box")
    .reduce((sum, item) => sum + item.qty, 0);
}

/** Cart may checkout if: no products, or mixed product pcs >= 20; snack boxes each already min 20. */
export function getCartOrderIssues(items: CartItem[]) {
  const issues: string[] = [];
  const productPcs = productPcsTotal(items);
  const hasProducts = items.some((item) => item.kind === "product");
  if (hasProducts && productPcs < MIXED_PRODUCT_MIN_QTY) {
    issues.push(
      `Minimum pemesanan kue ${MIXED_PRODUCT_MIN_QTY} pcs (bisa mix antar produk). Saat ini ${productPcs} pcs.`,
    );
  }
  for (const item of items) {
    if (item.kind === "snack-box" && item.qty < SNACK_BOX_MIN_QTY) {
      issues.push(`${item.name}: minimum ${SNACK_BOX_MIN_QTY} box.`);
    }
  }
  return issues;
}

export function canCheckoutCart(items: CartItem[]) {
  return items.length > 0 && getCartOrderIssues(items).length === 0;
}
