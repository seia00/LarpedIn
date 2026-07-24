import Link from "next/link";

function Check() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 flex-none text-gold-dark"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.5"
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
  comingSoon = false,
}: {
  eyebrow: string;
  title: string;
  price: string;
  description: string;
  bullets: string[];
  cta: string;
  href: string;
  comingSoon?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-1 flex-col bg-ivory p-8 shadow-card ring-1 ring-ink/10 transition ${
        comingSoon ? "opacity-90" : "hover:ring-gold/50"
      }`}
    >
      {/* Gold top rule */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gold/50" />

      <div className="flex items-baseline justify-between">
        <span className="section-eyebrow">{eyebrow}</span>
        <span className="font-serif text-2xl font-medium text-crimson">
          {price}
        </span>
      </div>

      <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">{title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
        {description}
      </p>

      <ul className="mt-6 space-y-3">
        {bullets.map((b) => (
          <li
            key={b}
            className={`flex gap-3 text-[15px] ${comingSoon ? "text-ink/50" : "text-ink/80"}`}
          >
            <Check />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex-1" />
      {comingSoon ? (
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="w-full cursor-not-allowed rounded-[2px] border border-ink/20 bg-transparent px-8 py-3.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink/45"
        >
          Coming Soon…
        </button>
      ) : (
        <Link href={href} className="btn-primary w-full">
          {cta}
        </Link>
      )}
    </div>
  );
}

export default function ChoosePage() {
  return (
    <main className="min-h-screen bg-parchment px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-14 text-center">
          <Link
            href="/"
            className="font-serif text-2xl font-semibold text-crimson"
          >
            LarpLink
          </Link>
          <h1 className="mt-6 font-serif text-4xl font-semibold text-ink sm:text-5xl">
            Choose your method
          </h1>
          <div className="rule-gold mx-auto mt-6 w-full max-w-[220px]">
            <span className="text-base leading-none">❖</span>
          </div>
          <p className="mx-auto mt-6 max-w-lg font-serif text-[17px] italic leading-relaxed text-ink/70">
            One destination, two temperaments. Swift, if you seek a sharp
            rewrite — thorough, if you would have us read your whole story first.
          </p>
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <MethodCard
            eyebrow="Larp-Lite · Complimentary"
            title="The Swift"
            price="Free"
            description="Enter your details and receive a clean, narrative rewrite in moments. Ideal for a considered refresh."
            bullets={[
              "Type in your details",
              "AI-composed rewrite",
              "Copy-paste ready output",
            ]}
            cta="Begin Freely"
            href="/lite"
          />
          <MethodCard
            eyebrow="Larp-Max · Coming Soon"
            title="The Thorough"
            price="$1"
            description="Provide screenshots of your current profile for full context. Deeper reading, richer detail, more tailored prose."
            bullets={[
              "Upload your profile screenshots",
              "Deeper analysis",
              "A more polished, detailed rewrite",
            ]}
            cta="Go Max"
            href="/max"
            comingSoon
          />
        </div>

        <p className="mt-12 text-center font-serif text-sm italic text-ink/50">
          Undecided? Begin with the Swift — the Thorough will keep.
        </p>
      </div>
    </main>
  );
}
