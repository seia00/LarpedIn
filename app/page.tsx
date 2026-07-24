import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-crimson px-6 text-center">
      {/* Subtle radial warmth so the flat crimson doesn't feel dead. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.10), transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center animate-fade-in">
        <span className="section-eyebrow mb-6 text-cream/80">
          Old money, meet startup.
        </span>

        <h1 className="font-serif text-[clamp(4rem,16vw,9rem)] font-semibold leading-none tracking-tight text-white">
          LarpedIn
        </h1>

        <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-cream/85 sm:text-xl">
          Turn your career background into a profile people actually want to
          read — narrative-driven, polished, copy-paste ready.
        </p>

        <Link href="/choose" className="group mt-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-crimson shadow-sm transition hover:bg-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-crimson">
            Elevate Your Profile
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      </div>

      <footer className="relative z-10 mt-20 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-cream/70">
        <Link href="/privacy" className="hover:text-white">
          Privacy
        </Link>
        <span aria-hidden className="text-cream/30">
          ·
        </span>
        <a href="mailto:hello@larpedin.app" className="hover:text-white">
          Contact
        </a>
        <span aria-hidden className="text-cream/30">
          ·
        </span>
        <span>© {new Date().getFullYear()} LarpedIn</span>
      </footer>
    </main>
  );
}
