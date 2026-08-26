import { NextResponse } from "next/server";
import { rupiah } from "@/lib/utils";
import {
  getAdminPassword,
  isAdminAuthorized,
  readAnalytics,
  readOrders,
} from "@/lib/store-db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!getAdminPassword()) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_PASSWORD belum diset di environment." },
      { status: 503 },
    );
  }
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const [orders, analytics] = await Promise.all([readOrders(), readAnalytics()]);
  const today = new Date().toISOString().slice(0, 10);
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    return { date: key, visits: analytics.daily[key] ?? 0 };
  });

  const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const byPayment = orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.paymentMethod] = (acc[order.paymentMethod] ?? 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    ok: true,
    summary: {
      orderCount: orders.length,
      revenue,
      revenueLabel: rupiah(revenue),
      visitsToday: analytics.daily[today] ?? 0,
      visitsTotal: analytics.totalVisits,
      byPayment,
      last7Days: last7,
    },
    orders,
    recentVisits: analytics.recent.slice(0, 50),
  });
}
