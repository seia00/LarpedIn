import Link from "next/link";

function Check() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 flex-none text-crimson"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MethodCard({
  eyebrow,
  title,
  price,
  description,
  bullets,
  cta,
  href,
}: {
  eyebrow: string;
  title: string;
  price: string;
  description: string;
  bullets: string[];
  cta: string;
  href: string;
}) {
  return (
    <div className="flex flex-1 flex-col rounded-2xl border border-ink/10 bg-white p-8 shadow-card transition hover:border-crimson/30">
      <div className="flex items-baseline justify-between">
        <span className="section-eyebrow">{eyebrow}</span>
        <span className="font-serif text-2xl font-medium text-ink">{price}</span>
      </div>

      <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">{title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
        {description}
      </p>

      <ul className="mt-6 space-y-3">
        {bullets.map((b) => (
          <li key={b} className="flex gap-3 text-[15px] text-ink/80">
            <Check />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex-1" />
      <Link href={href} className="btn-primary w-full">
        {cta}
      </Link>
    </div>
  );
}

export default function ChoosePage() {
  return (
    <main className="min-h-screen bg-linen px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <Link
            href="/"
            className="font-serif text-2xl font-semibold text-crimson"
          >
            LarpedIn
          </Link>
          <h1 className="mt-6 font-serif text-4xl font-semibold text-ink sm:text-5xl">
            Choose your method
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-ink/70">
            Same destination, two speeds. Fast if you just want a sharp rewrite —
            thorough if you want us to read your whole story first.
          </p>
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <MethodCard
            eyebrow="Larp-Lite — Free"
            title="Fast"
            price="Free"
            description="Type in your details and get a clean, narrative rewrite in seconds. Great for a quick refresh."
            bullets={[
              "Type in your details",
              "AI-generated rewrite",
              "Copy-paste ready output",
            ]}
            cta="Start Free"
            href="/lite"
          />
          <MethodCard
            eyebrow="Larp-Max — $1"
            title="Thorough"
            price="$1"
            description="Upload screenshots of your current profile for full context. Deeper analysis, more detailed, more tailored."
            bullets={[
              "Upload your profile screenshots",
              "Deeper AI analysis",
              "More polished, detailed rewrite",
            ]}
            cta="Go Max"
            href="/max"
          />
        </div>

        <p className="mt-10 text-center text-sm text-ink/50">
          Not sure? Start with Lite — you can always go Max later.
        </p>
      </div>
    </main>
  );
}
