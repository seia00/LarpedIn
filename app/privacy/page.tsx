import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-parchment px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="font-serif text-xl font-semibold text-crimson">
          LarpLink
        </Link>
        <h1 className="mt-8 font-serif text-4xl font-semibold text-ink">
          Privacy
        </h1>
        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink/75">
          <p>
            LarpLink sends the details you enter (and, for Larp-Max, the
            screenshots you upload) to an AI model to generate your profile. We
            don&apos;t store your inputs or the generated result on our servers
            for v1 — the output lives only in your browser session.
          </p>
          <p>
            Your inputs are processed by third-party AI providers (DeepSeek for
            Larp-Lite, Anthropic&apos;s Claude for Larp-Max) subject to their
            respective privacy policies. Don&apos;t upload anything you
            wouldn&apos;t want processed by those services.
          </p>
          <p>
            Questions? Email{" "}
            <a
              href="mailto:hello@larplink.app"
              className="text-crimson underline-offset-2 hover:underline"
            >
              hello@larplink.app
            </a>
            .
          </p>
        </div>
        <Link
          href="/"
          className="mt-10 inline-block text-sm text-ink/50 hover:text-ink"
        >
          ← Back home
        </Link>
      </div>
    </main>
  );
}
