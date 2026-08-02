/**
 * E2E smoke against local dev server.
 * Run: npx playwright test is not configured; use: npx tsx scripts/e2e-smoke.mts
 */
import { chromium, type Page } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3000";

async function waitReady(page: Page) {
  await page.waitForFunction(() => {
    const raw = localStorage.getItem("snackboz-cart-v1");
    return raw !== null || document.readyState === "complete";
  });
  // Cart provider sets ready after hydrate; give it a tick
  await page.waitForTimeout(300);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.clear());
  const results: string[] = [];

  function ok(label: string) {
    results.push(`PASS ${label}`);
    console.log(`PASS ${label}`);
  }

  // 1) Home
  await page.goto(BASE, { waitUntil: "networkidle" });
  await waitReady(page);
  await page.getByRole("heading", { name: /Pilihan #1|kue & snack box/i }).first().waitFor();
  ok("homepage loads");

  // 2) Header search
  await page.locator('form[role="search"] input[name="q"]').first().fill("lemper");
  await page.locator('form[role="search"]').first().evaluate((form) => (form as HTMLFormElement).requestSubmit());
  await page.waitForURL(/\/products\?q=lemper/);
  await page.getByText(/Menampilkan/i).waitFor();
  ok("header search navigates to products?q=");

  // 3) Add product from card (stays on page, updates cart)
  const addBtn = page.getByRole("button", { name: /Tambah/i }).first();
  await addBtn.click();
  await page.getByRole("button", { name: /Masuk/i }).first().waitFor({ timeout: 3000 });
  await page.goto(`${BASE}/cart`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: /Pesanan untuk acara Anda/i }).waitFor();
  const cartText = await page.locator("main article").first().innerText();
  if (!/Lemper|lemper|Rp/i.test(cartText)) throw new Error("Cart missing product after add");
  ok("add to cart from product card");

  // 4) Qty controls
  const qtyBefore = await page.locator("article strong").first().innerText();
  await page.getByRole("button", { name: /Tambah/i }).first().click();
  await page.waitForTimeout(200);
  const qtyAfter = await page.locator("article strong").first().innerText();
  if (Number(qtyAfter) <= Number(qtyBefore)) throw new Error("Qty did not increase");
  ok("cart quantity increase");

  // 5) Coupon
  await page.getByPlaceholder(/Kode kupon/i).fill("SNACK10");
  await page.getByRole("button", { name: /Pakai kupon/i }).click();
  await page.getByText(/Diskon SNACK10/i).waitFor();
  ok("coupon SNACK10 applies");

  // 6) Snack box builder
  await page.goto(`${BASE}/snack-box`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Premium/i }).click();
  // clear then set snacks within limit by toggling if needed
  const firstSnack = page.locator("button[aria-pressed]").first();
  if ((await firstSnack.getAttribute("aria-pressed")) !== "true") {
    await firstSnack.click();
  }
  await page.locator("#box-count").fill("25");
  await page.getByRole("button", { name: /Tambah ke Keranjang/i }).click();
  await page.waitForURL("**/cart");
  await page.locator("main article").filter({ hasText: /Snack Box/i }).first().waitFor();
  ok("snack-box adds custom box to cart");

  // Ensure mixed product minimum before checkout (or remove products and keep snack-box only)
  await page.goto(`${BASE}/cart`, { waitUntil: "networkidle" });
  // Bump first product qty to satisfy mix min if present
  const productRow = page.locator("main article").filter({ hasNotText: /Snack Box/i }).first();
  if (await productRow.count()) {
    for (let i = 0; i < 25; i++) {
      await productRow.getByRole("button", { name: /Tambah/i }).click();
    }
  }

  // 7) Checkout flow
  await page.goto(`${BASE}/checkout`, { waitUntil: "networkidle" });
  await page.getByPlaceholder("Nama lengkap").waitFor({ timeout: 10000 });
  await page.getByPlaceholder("Nama lengkap").fill("Tester Boz");
  await page.getByPlaceholder("No. WhatsApp").fill("081234567890");
  await page.getByPlaceholder("Alamat lengkap").fill("Jl. Uji Coba No. 1, Jakarta Selatan");
  await page.getByPlaceholder("Nama lokasi / kantor").fill("Kantor Test");
  page.on("popup", async (popup) => {
    await popup.close().catch(() => undefined);
  });
  await page.getByRole("button", { name: /Buat Pesanan/i }).click();
  await page.waitForURL(/\/account\?order=/, { timeout: 15000 });
  await page.getByText(/berhasil dibuat/i).waitFor();
  ok("checkout creates order and redirects to account");

  // 8) Cart cleared
  await page.goto(`${BASE}/cart`, { waitUntil: "networkidle" });
  await page.getByText(/Keranjang masih kosong/i).waitFor();
  ok("cart cleared after order");

  // 9) Reorder
  await page.goto(`${BASE}/account`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /Pesan ulang -/i }).first().click();
  await page.waitForURL("**/cart");
  await page.locator("main article").first().waitFor();
  ok("reorder restores cart items");

  // 10) Product detail buy
  await page.goto(`${BASE}/products/dadar-gulung`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Tambah ke Keranjang/i }).click();
  await page.getByRole("button", { name: /Sudah di Keranjang/i }).waitFor({ timeout: 3000 });
  await page.goto(`${BASE}/cart`, { waitUntil: "networkidle" });
  await page.locator("main article").filter({ hasText: /Dadar Gulung/i }).first().waitFor();
  ok("product detail add to cart");

  // 11) Mobile menu + products filter
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Buka menu/i }).click();
  await page.getByRole("navigation", { name: /Menu mobile/i }).getByText("Produk").click();
  await page.waitForURL("**/products");
  ok("mobile menu navigates");

  await page.goto(`${BASE}/products?category=${encodeURIComponent("Kue Basah")}&occasion=${encodeURIComponent("Arisan")}`);
  await page.locator("main").getByText(/Kue Basah/i).first().waitFor();
  await page.locator("main").getByText(/Menampilkan/i).waitFor();
  ok("combined product filters work");

  await browser.close();
  console.log("\nAll E2E checks passed:");
  results.forEach((line) => console.log(` - ${line}`));
}

main().catch((error) => {
  console.error("E2E FAILED:", error);
  process.exit(1);
});
