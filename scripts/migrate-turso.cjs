const { createClient } = require("@libsql/client");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env");
const env = fs.readFileSync(envPath, "utf8");
function get(key) {
  const match = env.match(new RegExp(`^${key}=(.*)$`, "m"));
  return match?.[1]?.trim();
}

async function main() {
  const url = get("TURSO_DATABASE_URL");
  const authToken = get("TURSO_AUTH_TOKEN");
  if (!url || !authToken) {
    throw new Error("Missing TURSO env");
  }
  const db = createClient({ url, authToken });
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
  const tables = await db.execute(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
  );
  console.log(
    "OK tables:",
    tables.rows.map((r) => r.name).join(", "),
  );
}

main().catch((err) => {
  console.error("FAIL", err.message || err);
  process.exit(1);
});
