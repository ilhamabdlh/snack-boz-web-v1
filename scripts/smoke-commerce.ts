/**
 * Smoke tests for commerce helpers (no browser).
 * Run: npx tsx scripts/smoke-commerce.ts
 */
import assert from "node:assert/strict";
import {
  calcCartTotal,
  calcDiscount,
  calcSubtotal,
  COUPONS,
  createCartItemId,
  createOrderId,
  type CartItem,
} from "../lib/commerce";
import { getWhatsAppUrl, formatWhatsAppDisplay } from "../lib/whatsapp";

const sample: CartItem[] = [
  {
    id: createCartItemId("product", "lemper-isi-ayam"),
    kind: "product",
    slug: "lemper-isi-ayam",
    name: "Lemper Isi Ayam",
    image: "/makanan/lemper.jpg",
    unitPrice: 5500,
    qty: 20,
    minOrder: 20,
  },
  {
    id: createCartItemId("snack-box", "custom-premium", "Premium"),
    kind: "snack-box",
    slug: "custom-premium",
    name: "Snack Box Premium",
    image: "/makanan/x.jpg",
    unitPrice: 32000,
    qty: 30,
    minOrder: 20,
    meta: { boxSize: "Premium", snacks: [{ name: "Risoles", qty: 1 }] },
  },
];

assert.equal(calcSubtotal(sample), 5500 * 20 + 32000 * 30);
assert.equal(calcDiscount(100000, "SNACK10"), 10000);
assert.equal(calcDiscount(100000, "HEMAT50"), 50000);
assert.equal(calcDiscount(100000, "INVALID"), 0);
assert.ok(COUPONS.SNACK10);

const totals = calcCartTotal(sample, "SNACK10", 35000);
assert.equal(totals.subtotal, 5500 * 20 + 32000 * 30);
assert.equal(totals.discount, Math.round(totals.subtotal * 0.1));
assert.equal(totals.shippingFee, 35000);
assert.equal(totals.total, totals.subtotal - totals.discount + 35000);

assert.match(createOrderId(new Date("2026-07-28")), /^SB-260728-\d{3}$/);
assert.ok(getWhatsAppUrl("halo").includes("wa.me/"));
assert.ok(getWhatsAppUrl("halo").includes("text="));
assert.ok(formatWhatsAppDisplay("6281200000000").startsWith("0812"));

console.log("OK: commerce + whatsapp smoke tests passed");
