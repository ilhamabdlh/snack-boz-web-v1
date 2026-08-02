import { Suspense } from "react";
import { AccountPageClient } from "@/components/account-page-client";
import { PageShell } from "@/components/page-shell";

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <PageShell>
          <section className="container-shell py-16">
            <p className="text-sm text-[var(--muted)]">Memuat akun...</p>
          </section>
        </PageShell>
      }
    >
      <AccountPageClient />
    </Suspense>
  );
}
