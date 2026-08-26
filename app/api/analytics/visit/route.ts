import { NextResponse } from "next/server";
import { recordVisit } from "@/lib/store-db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      path?: string;
      referrer?: string;
    };
    const pathName =
      typeof body.path === "string" && body.path.startsWith("/") ? body.path : "/";
    if (pathName.startsWith("/psks-ops") || pathName.startsWith("/api/")) {
      return NextResponse.json({ ok: true, skipped: true });
    }
    await recordVisit({
      path: pathName.slice(0, 200),
      referrer: typeof body.referrer === "string" ? body.referrer.slice(0, 300) : undefined,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal mencatat kunjungan.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
