"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// How long the leaving page zooms/fades before we actually navigate. Kept in
// sync with the .page-enter[data-leaving] animation duration in globals.css.
const EXIT_MS = 220;

/**
 * Adds the "zoom-through" half of the page transition. On an internal link
 * click we tag the current page so it zooms out and fades, then navigate after
 * the animation; the arriving page plays its own zoom-in (via template.tsx).
 *
 * Runs in the capture phase and stops propagation so it wins over next/link's
 * own click handling. Falls back to normal navigation on reduced-motion,
 * modified clicks, new-tab targets, downloads, and external/hash links.
 */
export default function PageTransition() {
  const router = useRouter();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function onClick(e: MouseEvent) {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;

      // Only same-origin, same-tab, non-download navigations to a different path.
      const target = anchor.getAttribute("target");
      if (target && target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href") || "";
      if (!href.startsWith("/") || href.startsWith("//")) return; // external / mailto / hash

      const url = new URL(anchor.href, window.location.href);
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return; // same page
      }

      // Take over from next/link.
      e.preventDefault();
      e.stopPropagation();

      const page = document.querySelector(".page-enter");
      page?.setAttribute("data-leaving", "");

      const dest = url.pathname + url.search + url.hash;
      window.setTimeout(() => router.push(dest), EXIT_MS);
    }

    document.addEventListener("click", onClick, true); // capture phase
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
