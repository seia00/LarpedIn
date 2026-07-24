"use client";

import { useEffect, useState } from "react";

const ACK_KEY = "larplink:mobile-ack";

/**
 * A one-time, dismissible warning shown to small-screen visitors recommending
 * they use a computer for the full experience. Triggers on the standard mobile
 * breakpoint so real phones always see it; a desktop user in a narrow window
 * can simply dismiss it. Dismissal is remembered for the session so it doesn't
 * nag on navigation.
 */
export default function MobileGate() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Use a numeric width with a > 0 guard: a bogus 0 reading (before the
    // viewport is measurable) must not falsely gate a desktop visitor.
    const w = window.innerWidth || document.documentElement.clientWidth || 0;
    const isSmall = w > 0 && w <= 767;
    if (!isSmall) return;
    if (sessionStorage.getItem(ACK_KEY) === "1") return;
    setShow(true);
    document.body.style.overflow = "hidden";
  }, []);

  function dismiss() {
    sessionStorage.setItem(ACK_KEY, "1");
    document.body.style.overflow = "";
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Desktop recommended"
      className="fixed inset-0 z-[9995] flex flex-col items-center justify-center overflow-hidden bg-crimson px-8 text-center"
    >
      {/* Gold hairline frame, matching the landing plate. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-4 border border-gold/30"
      />

      <div className="relative flex flex-col items-center">
        {/* Monogram crest */}
        <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 font-serif text-xl font-semibold tracking-tight text-gold-light">
          LL
        </div>

        <span className="section-eyebrow text-gold-light/80">
          A note before you enter
        </span>

        <h1 className="mt-4 max-w-sm font-serif text-3xl font-semibold leading-tight text-cream">
          LarpLink is best experienced on a computer
        </h1>

        <div className="rule-gold mt-6 w-full max-w-[180px]">
          <span className="text-sm leading-none">❖</span>
        </div>

        <p className="mt-6 max-w-xs font-serif text-[15px] italic leading-relaxed text-cream/80">
          The interactive details and layout were composed for a larger screen.
          It still works here — it&apos;s simply grander on desktop.
        </p>

        <button
          type="button"
          onClick={dismiss}
          className="mt-9 inline-flex items-center justify-center rounded-[2px] bg-cream px-8 py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-crimson ring-1 ring-inset ring-gold/40 transition active:bg-white"
        >
          I don&apos;t care — continue
        </button>
      </div>
    </div>
  );
}
