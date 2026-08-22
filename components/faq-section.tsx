import { faqs } from "@/lib/faq";

export function FaqSection() {
  return (
    <section className="texture-paper section-pad" aria-labelledby="faq-heading">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="section-kicker">Pertanyaan umum</p>
          <h2 id="faq-heading" className="section-title mt-1">
            yang biasanya ditanyakan sebelum pesan
          </h2>
          <p className="section-lead">
            Kesegaran kue, minimal order, jadwal H-1, area antar, snack box, harga,
            dan cara bayar — dirangkum di sini.
          </p>
        </div>
        <div className="divide-y divide-[rgba(27,67,50,0.1)]">
          {faqs.map((item) => (
            <details key={item.question} className="group py-5 first:pt-0">
              <summary className="cursor-pointer list-none font-display text-lg font-bold text-[var(--palm)] sm:text-xl">
                <span className="flex items-start justify-between gap-4">
                  {item.question}
                  <span className="mt-1 shrink-0 text-sm font-semibold text-[var(--green)] group-open:hidden">
                    +
                  </span>
                  <span className="mt-1 hidden shrink-0 text-sm font-semibold text-[var(--green)] group-open:inline">
                    −
                  </span>
                </span>
              </summary>
              <p className="mt-2 max-w-[52ch] text-pretty text-sm leading-6 text-[var(--muted)]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
