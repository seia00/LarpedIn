import Link from "next/link";
import SuedeBackground from "@/components/SuedeBackground";

export default function LandingPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-crimson px-6 text-center">
      {/* Interactive suede — brush it with the pointer. */}
      <SuedeBackground />

      {/* Vignette above the suede for edge depth (never blocks the pointer). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 32%, rgba(198,170,115,0.08), transparent 55%), radial-gradient(ellipse at 50% 125%, rgba(0,0,0,0.42), transparent 60%)",
        }}
      />

      {/* Gold hairline frame, inset from the edges — engraved-plate feel. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-4 z-[2] border border-gold/30 sm:inset-6"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[22px] z-[2] border border-gold/15 sm:inset-[30px]"
      />

      <div className="relative z-10 flex flex-col items-center animate-fade-in">
        {/* Monogram crest */}
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 font-serif text-2xl font-semibold tracking-tight text-gold-light">
          LL
        </div>

        <span className="section-eyebrow text-gold-light/80">
          Est. MMXXVI · By Invitation
        </span>

        <h1 className="mt-6 font-serif text-[clamp(3.6rem,15vw,8.5rem)] font-semibold leading-none tracking-tight text-cream">
          LarpLink
        </h1>

        <div className="rule-gold mt-8 w-full max-w-xs">
          <span className="text-lg leading-none">❖</span>
        </div>

        <p className="mt-8 max-w-xl font-serif text-lg italic leading-relaxed text-cream/85 sm:text-xl">
          The quiet art of turning a career into a story worth reading —
          composed, considered, and yours to keep.
        </p>

        <Link href="/choose" className="group mt-10">
          <span className="inline-flex items-center gap-3 rounded-[2px] bg-cream px-9 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-crimson ring-1 ring-inset ring-gold/40 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
            Elevate Your Profile
            <svg
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      </div>

      <footer className="relative z-10 mt-20 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-serif text-sm text-cream/60">
        <Link href="/privacy" className="italic hover:text-cream">
          Privacy
        </Link>
        <span aria-hidden className="text-gold/40">
          ✦
        </span>
        <a href="mailto:hello@larplink.app" className="italic hover:text-cream">
          Contact
        </a>
        <span aria-hidden className="text-gold/40">
          ✦
        </span>
        <span>© {new Date().getFullYear()} LarpLink</span>
      </footer>
    </main>
  );
}
