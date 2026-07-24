import Link from "next/link";

// Larp-Max is gated until Stripe checkout is wired up (see build spec step 9).
// Until then this route shows a coming-soon state rather than the form, so the
// premium flow can't be used even via a direct URL. To re-enable: restore the
// ProfileForm (tier="max") behind a payment check.
export default function MaxPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-parchment px-6 py-20 text-center">
      <div className="mx-auto max-w-lg">
        <Link href="/" className="font-serif text-xl font-semibold text-crimson">
          LarpLink
        </Link>

        <div className="mt-10">
          <span className="section-eyebrow">Larp-Max · $1</span>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-ink">
            Coming soon
          </h1>
          <div className="rule-gold mx-auto mt-6 w-full max-w-[200px]">
            <span className="text-base leading-none">❖</span>
          </div>
          <p className="mt-6 font-serif text-[17px] italic leading-relaxed text-ink/70">
            The full treatment — screenshot upload, deeper analysis, a richer,
            more tailored LARP — is nearly ready. We&apos;re putting the finishing
            touches on checkout. In the meantime, the Swift is free and every bit
            as bold.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/lite" className="btn-primary">
            Try Larp-Lite Free
          </Link>
          <Link href="/choose" className="btn-ghost">
            Back to methods
          </Link>
        </div>
      </div>
    </main>
  );
}
