import Link from "next/link";
import ProfileForm from "@/components/ProfileForm";

// NOTE: In production, gate this route behind a Stripe checkout / payment link
// before granting access (see build spec step 9). For v1 the form is open so the
// end-to-end flow can be exercised; add the payment check in middleware or a
// server component wrapper here.
export default function MaxPage() {
  return (
    <main className="min-h-screen bg-parchment px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <header className="mb-12">
          <Link
            href="/"
            className="font-serif text-xl font-semibold text-crimson"
          >
            LarpLink
          </Link>
          <div className="mt-6">
            <span className="section-eyebrow">Larp-Max · $1</span>
            <h1 className="mt-2 font-serif text-4xl font-semibold text-ink">
              The full treatment
            </h1>
            <p className="mt-3 font-serif text-[17px] italic leading-relaxed text-ink/70">
              Provide screenshots of your current profile so we may read your
              whole story, then fill in the details below. Claude will draw out
              what is there and render it richer.
            </p>
          </div>
        </header>

        <ProfileForm tier="max" />
      </div>
    </main>
  );
}
