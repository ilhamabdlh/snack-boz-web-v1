"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { rupiah } from "@/lib/utils";
import type { Order } from "@/lib/commerce";

type SummaryResponse = {
  ok: boolean;
  error?: string;
  summary?: {
    orderCount: number;
    revenue: number;
    revenueLabel: string;
    visitsToday: number;
    visitsTotal: number;
    byPayment: Record<string, number>;
    last7Days: { date: string; visits: number }[];
  };
  orders?: Order[];
  recentVisits?: { at: string; path: string; referrer?: string }[];
};

const COOKIE_NAME = "psks_ops";

function readCookiePassword() {
  if (typeof document === "undefined") return "";
  const match = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  return match ? decodeURIComponent(match.slice(COOKIE_NAME.length + 1)) : "";
}

export default function OpsConsolePage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<SummaryResponse | null>(null);

  const loadSummary = useCallback(async (pwd: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/summary", {
        headers: { Authorization: `Bearer ${pwd}` },
        cache: "no-store",
      });
      const json = (await res.json()) as SummaryResponse;
      if (!res.ok || !json.ok) {
        setAuthed(false);
        setError(json.error || "Gagal memuat data.");
        setData(null);
        return;
      }
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(pwd)}; path=/; max-age=${60 * 60 * 12}; SameSite=Lax`;
      setAuthed(true);
      setData(json);
    } catch {
      setError("Tidak bisa menghubungi server.");
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = readCookiePassword();
    if (saved) {
      setPassword(saved);
      void loadSummary(saved);
    }
  }, [loadSummary]);

  function onLogin(event: FormEvent) {
    event.preventDefault();
    void loadSummary(password.trim());
  }

  function logout() {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
    setAuthed(false);
    setData(null);
    setPassword("");
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-[var(--hero-cream)] px-4 py-16">
        <form
          onSubmit={onLogin}
          className="mx-auto max-w-sm rounded-[var(--radius)] border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-sm)]"
        >
          <h1 className="font-display text-2xl font-bold text-[var(--palm)]">Ops Console</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Halaman internal. Masukkan password admin.
          </p>
          <label className="mt-5 block text-xs font-semibold text-[var(--palm)]">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-[var(--radius-sm)] border border-[var(--line)] px-3 text-sm outline-none focus:border-[var(--pandan)]"
              autoComplete="current-password"
              required
            />
          </label>
          {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--green)] text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Memuat..." : "Masuk"}
          </button>
        </form>
      </main>
    );
  }

  const summary = data?.summary;

  return (
    <main className="min-h-screen bg-[var(--hero-cream)] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
              Internal
            </p>
            <h1 className="font-display text-2xl font-bold text-[var(--palm)] sm:text-3xl">
              Ops Console
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void loadSummary(password)}
              className="h-9 rounded-[var(--radius-sm)] border border-[var(--line)] bg-white px-3 text-sm font-semibold text-[var(--palm)]"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={logout}
              className="h-9 rounded-[var(--radius-sm)] bg-[var(--green)] px-3 text-sm font-semibold text-white"
            >
              Keluar
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total order", value: String(summary?.orderCount ?? 0) },
            { label: "Omzet (semua order)", value: summary?.revenueLabel ?? "Rp 0" },
            { label: "Kunjungan hari ini", value: String(summary?.visitsToday ?? 0) },
            { label: "Total kunjungan", value: String(summary?.visitsTotal ?? 0) },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-[var(--radius)] border border-[var(--line)] bg-white p-4 shadow-[var(--shadow-sm)]"
            >
              <p className="text-xs text-[var(--muted)]">{card.label}</p>
              <p className="mt-1 font-display text-xl font-bold text-[var(--palm)]">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <section className="mt-8 rounded-[var(--radius)] border border-[var(--line)] bg-white p-4 shadow-[var(--shadow-sm)] sm:p-5">
          <h2 className="font-display text-lg font-bold text-[var(--palm)]">
            Kunjungan 7 hari terakhir
          </h2>
          <ul className="mt-3 grid gap-1.5 text-sm">
            {(summary?.last7Days ?? []).map((day) => (
              <li key={day.date} className="flex justify-between border-b border-[var(--line)] py-1.5">
                <span className="text-[var(--muted)]">{day.date}</span>
                <strong className="tabular-nums">{day.visits}</strong>
              </li>
            ))}
          </ul>
          {summary?.byPayment && Object.keys(summary.byPayment).length > 0 ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Metode bayar
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {Object.entries(summary.byPayment).map(([method, count]) => (
                  <li key={method} className="flex justify-between">
                    <span>{method}</span>
                    <strong>{count}</strong>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <section className="mt-8 rounded-[var(--radius)] border border-[var(--line)] bg-white p-4 shadow-[var(--shadow-sm)] sm:p-5">
          <h2 className="font-display text-lg font-bold text-[var(--palm)]">
            Order ({data?.orders?.length ?? 0})
          </h2>
          {(data?.orders?.length ?? 0) === 0 ? (
            <p className="mt-3 text-sm text-[var(--muted)]">Belum ada order tersimpan.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {data?.orders?.map((order) => (
                <article
                  key={order.id}
                  className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--warm-white)] p-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-[var(--palm)]">{order.id}</p>
                      <p className="text-xs text-[var(--muted)]">
                        {new Date(order.createdAt).toLocaleString("id-ID")} · {order.status}
                      </p>
                    </div>
                    <strong className="tabular-nums text-[var(--green)]">
                      {rupiah(order.total)}
                    </strong>
                  </div>
                  <p className="mt-2 text-sm">
                    {order.profile.name} · {order.profile.phone}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--muted)]">
                    {order.deliveryDate} {order.deliveryTime} · {order.shippingMethod} ·{" "}
                    {order.paymentMethod}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--muted)]">{order.profile.address}</p>
                  <ul className="mt-2 space-y-0.5 text-xs text-[var(--cocoa)]">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.name} × {item.qty} · {rupiah(item.unitPrice * item.qty)}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-[var(--radius)] border border-[var(--line)] bg-white p-4 shadow-[var(--shadow-sm)] sm:p-5">
          <h2 className="font-display text-lg font-bold text-[var(--palm)]">
            Kunjungan terbaru
          </h2>
          <ul className="mt-3 max-h-80 space-y-1.5 overflow-y-auto text-sm">
            {(data?.recentVisits ?? []).map((visit, index) => (
              <li
                key={`${visit.at}-${visit.path}-${index}`}
                className="flex flex-wrap justify-between gap-2 border-b border-[var(--line)] py-1.5"
              >
                <span className="font-medium text-[var(--palm)]">{visit.path}</span>
                <span className="text-xs text-[var(--muted)]">
                  {new Date(visit.at).toLocaleString("id-ID")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
