"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Catat kunjungan halaman (1x per tab session per path). */
export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/psks-ops")) return;
    const key = `psks-visit:${pathname}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // ignore
    }
    void fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: typeof document !== "undefined" ? document.referrer : "",
      }),
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}
