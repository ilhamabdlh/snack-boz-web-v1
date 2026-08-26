import { createClient, type Client } from "@libsql/client";
import type { Order } from "@/lib/commerce";

export type VisitEvent = {
  at: string;
  path: string;
  referrer?: string;
};

export type AnalyticsStore = {
  totalVisits: number;
  daily: Record<string, number>;
  recent: VisitEvent[];
};

let client: Client | null = null;
let schemaReady: Promise<void> | null = null;

function requireTursoEnv() {
  const url = process.env.TURSO_DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();
  if (!url || !authToken) {
    throw new Error(
      "TURSO_DATABASE_URL dan TURSO_AUTH_TOKEN wajib diset di environment.",
    );
  }
  return { url, authToken };
}

function getClient() {
  if (!client) {
    const { url, authToken } = requireTursoEnv();
    client = createClient({ url, authToken });
  }
  return client;
}

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const db = getClient();
      await db.batch(
        [
          `CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            created_at TEXT NOT NULL,
            status TEXT NOT NULL,
            customer_name TEXT NOT NULL,
            customer_phone TEXT NOT NULL,
            customer_email TEXT,
            place_name TEXT,
            address TEXT NOT NULL,
            delivery_note TEXT,
            delivery_date TEXT NOT NULL,
            delivery_time TEXT NOT NULL,
            shipping_method TEXT NOT NULL,
            payment_method TEXT NOT NULL,
            subtotal INTEGER NOT NULL,
            shipping_fee INTEGER NOT NULL,
            discount INTEGER NOT NULL,
            total INTEGER NOT NULL,
            coupon TEXT,
            items_json TEXT NOT NULL,
            profile_json TEXT NOT NULL
          )`,
          `CREATE TABLE IF NOT EXISTS visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            visited_at TEXT NOT NULL,
            path TEXT NOT NULL,
            referrer TEXT,
            day TEXT NOT NULL
          )`,
          `CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at)`,
          `CREATE INDEX IF NOT EXISTS idx_visits_day ON visits(day)`,
          `CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON visits(visited_at)`,
        ],
        "write",
      );
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  await schemaReady;
}

function rowToOrder(row: Record<string, unknown>): Order {
  const items = JSON.parse(String(row.items_json || "[]"));
  const profile = JSON.parse(String(row.profile_json || "{}"));
  return {
    id: String(row.id),
    createdAt: String(row.created_at),
    status: row.status as Order["status"],
    items,
    profile,
    deliveryDate: String(row.delivery_date),
    deliveryTime: String(row.delivery_time),
    shippingMethod: String(row.shipping_method),
    paymentMethod: String(row.payment_method),
    subtotal: Number(row.subtotal) || 0,
    shippingFee: Number(row.shipping_fee) || 0,
    discount: Number(row.discount) || 0,
    total: Number(row.total) || 0,
    coupon: row.coupon ? String(row.coupon) : undefined,
  };
}

export async function readOrders(): Promise<Order[]> {
  await ensureSchema();
  const result = await getClient().execute(
    "SELECT * FROM orders ORDER BY created_at DESC LIMIT 500",
  );
  return result.rows.map((row) => rowToOrder(row as Record<string, unknown>));
}

export async function appendOrder(order: Order) {
  await ensureSchema();
  await getClient().execute({
    sql: `INSERT INTO orders (
      id, created_at, status,
      customer_name, customer_phone, customer_email, place_name, address, delivery_note,
      delivery_date, delivery_time, shipping_method, payment_method,
      subtotal, shipping_fee, discount, total, coupon,
      items_json, profile_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      status=excluded.status,
      customer_name=excluded.customer_name,
      customer_phone=excluded.customer_phone,
      customer_email=excluded.customer_email,
      place_name=excluded.place_name,
      address=excluded.address,
      delivery_note=excluded.delivery_note,
      delivery_date=excluded.delivery_date,
      delivery_time=excluded.delivery_time,
      shipping_method=excluded.shipping_method,
      payment_method=excluded.payment_method,
      subtotal=excluded.subtotal,
      shipping_fee=excluded.shipping_fee,
      discount=excluded.discount,
      total=excluded.total,
      coupon=excluded.coupon,
      items_json=excluded.items_json,
      profile_json=excluded.profile_json`,
    args: [
      order.id,
      order.createdAt,
      order.status,
      order.profile.name,
      order.profile.phone,
      order.profile.email || null,
      order.profile.placeName || null,
      order.profile.address,
      order.profile.deliveryNote || null,
      order.deliveryDate,
      order.deliveryTime,
      order.shippingMethod,
      order.paymentMethod,
      order.subtotal,
      order.shippingFee,
      order.discount,
      order.total,
      order.coupon || null,
      JSON.stringify(order.items),
      JSON.stringify(order.profile),
    ],
  });
  return order;
}

export async function readAnalytics(): Promise<AnalyticsStore> {
  await ensureSchema();
  const db = getClient();
  const [totalRes, dailyRes, recentRes] = await Promise.all([
    db.execute("SELECT COUNT(*) AS total FROM visits"),
    db.execute(
      "SELECT day, COUNT(*) AS count FROM visits GROUP BY day ORDER BY day DESC LIMIT 90",
    ),
    db.execute(
      "SELECT visited_at, path, referrer FROM visits ORDER BY visited_at DESC LIMIT 300",
    ),
  ]);

  const daily: Record<string, number> = {};
  for (const row of dailyRes.rows) {
    daily[String(row.day)] = Number(row.count) || 0;
  }

  return {
    totalVisits: Number(totalRes.rows[0]?.total) || 0,
    daily,
    recent: recentRes.rows.map((row) => ({
      at: String(row.visited_at),
      path: String(row.path),
      referrer: row.referrer ? String(row.referrer) : undefined,
    })),
  };
}

export async function recordVisit(event: Omit<VisitEvent, "at"> & { at?: string }) {
  await ensureSchema();
  const at = event.at ?? new Date().toISOString();
  const day = at.slice(0, 10);
  await getClient().execute({
    sql: `INSERT INTO visits (visited_at, path, referrer, day) VALUES (?, ?, ?, ?)`,
    args: [at, event.path, event.referrer || null, day],
  });
  return readAnalytics();
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() || "";
}

export function isAdminAuthorized(request: Request) {
  const password = getAdminPassword();
  if (!password) return false;
  const header = request.headers.get("authorization") || "";
  if (header === `Bearer ${password}`) return true;
  const cookie = request.headers.get("cookie") || "";
  return cookie.split(";").some((part) => {
    const trimmed = part.trim();
    if (!trimmed.startsWith("psks_ops=")) return false;
    return decodeURIComponent(trimmed.slice("psks_ops=".length)) === password;
  });
}
