import { NextResponse } from "next/server";
import type { Order } from "@/lib/commerce";
import { appendOrder } from "@/lib/store-db";

export const runtime = "nodejs";

function isOrderPayload(value: unknown): value is Order {
  if (!value || typeof value !== "object") return false;
  const order = value as Partial<Order>;
  return (
    typeof order.id === "string" &&
    typeof order.paymentMethod === "string" &&
    Array.isArray(order.items) &&
    typeof order.profile === "object" &&
    order.profile != null &&
    typeof order.profile.name === "string" &&
    typeof order.profile.phone === "string" &&
    typeof order.total === "number"
  );
}

/** Simpan order dari checkout ke Turso */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    if (!isOrderPayload(body)) {
      return NextResponse.json({ ok: false, error: "Payload order tidak valid." }, { status: 400 });
    }
    await appendOrder(body);
    return NextResponse.json({ ok: true, id: body.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal menyimpan order.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
