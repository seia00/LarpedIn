"use client";

import { useEffect, useRef } from "react";

/**
 * A custom cursor: a small filled dot at the true pointer position and a larger
 * brass ring that trails behind it with easing. Over interactive elements the
 * ring swells and fills faintly. Falls back to the native cursor on touch
 * devices (no hover) and keeps a text caret over form fields.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Coarse pointers (touch) have no hover — skip entirely.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let visible = false;

    const setPos = (el: HTMLElement, x: number, y: number) => {
      el.style.setProperty("--x", String(x));
      el.style.setProperty("--y", String(y));
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      setPos(dot, mx, my);
      if (!visible) {
        visible = true;
        root.classList.add("cursor-ready");
      }
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        "a, button, [role='button'], input, textarea, select, label",
      );
      root.classList.toggle("cursor-hot", Boolean(interactive));
    };

    const onDown = () => root.classList.add("cursor-down");
    const onUp = () => root.classList.remove("cursor-down");
    const onLeave = () => root.classList.remove("cursor-ready");
    const onEnter = () => {
      if (visible) root.classList.add("cursor-ready");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    let raf = 0;
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      setPos(ring, rx, ry);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      root.classList.remove(
        "has-custom-cursor",
        "cursor-ready",
        "cursor-hot",
        "cursor-down",
      );
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}
