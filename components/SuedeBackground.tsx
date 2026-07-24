"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive suede / velvet background.
 *
 * Real suede shades lighter or darker depending on which way the nap is
 * brushed. We model a field of "nap direction" vectors and shade each cell by
 * how much its direction faces a fixed light. Dragging the pointer combs the
 * nap toward the direction of motion; a per-frame Laplacian diffusion then lets
 * those streaks bleed into their neighbours so the wake flows like liquid
 * before slowly settling back to the drape. The small buffer is upscaled with
 * bilinear smoothing (plus a hair of blur) so it reads as smooth gradients.
 *
 * Everything is oxblood-family so it still reads as the crimson hero.
 */
export default function SuedeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Offscreen low-res buffer we upscale from.
    const off = document.createElement("canvas");
    const octx = off.getContext("2d");
    if (!octx) return;

    // Light comes from the upper-left.
    const lx = -0.55;
    const ly = -0.835;
    // Baseline nap sits perpendicular to the light, so the resting field lands
    // at mid-oxblood (the hero colour). Brushing then combs it toward or away
    // from the light, revealing lighter and darker streaks.
    const baseLen = Math.hypot(-0.835, 0.55);
    const bX = -0.835 / baseLen;
    const bY = 0.55 / baseLen;

    // Colour ramp (all oxblood): shadow → mid → sheen.
    const shadow = [0x33, 0x0a, 0x12];
    const mid = [0x5a, 0x12, 0x1e];
    const sheen = [0x99, 0x2b, 0x3d];

    let cols = 0;
    let rows = 0;
    let napX = new Float32Array(0);
    let napY = new Float32Array(0);
    let tmpX = new Float32Array(0);
    let tmpY = new Float32Array(0);
    let grain = new Float32Array(0);
    let img: ImageData | null = null;
    let W = 0;
    let H = 0;

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(W * dpr);
      canvas!.height = Math.floor(H * dpr);
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.imageSmoothingEnabled = true;
      ctx!.imageSmoothingQuality = "high";

      // Finer buffer than before → less to upscale, crisper strokes.
      cols = Math.max(90, Math.min(340, Math.round(W / 6)));
      rows = Math.max(56, Math.round((cols * H) / W));
      off.width = cols;
      off.height = rows;

      const n = cols * rows;
      napX = new Float32Array(n);
      napY = new Float32Array(n);
      tmpX = new Float32Array(n);
      tmpY = new Float32Array(n);
      grain = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        napX[i] = bX + (Math.random() - 0.5) * 0.08;
        napY[i] = bY + (Math.random() - 0.5) * 0.08;
        grain[i] = (Math.random() - 0.5) * 0.05; // permanent suede texture
      }
      img = octx!.createImageData(cols, rows);
    }

    resize();

    const R = () => Math.max(6, cols * 0.05);

    // Comb the nap at one point toward a direction, with a soft smoothstep
    // falloff so there are no hard edges.
    function stamp(px: number, py: number, dirx: number, diry: number, strength: number) {
      const r = R();
      const r2 = r * r;
      const x0 = Math.max(0, Math.floor(px - r));
      const x1 = Math.min(cols - 1, Math.ceil(px + r));
      const y0 = Math.max(0, Math.floor(py - r));
      const y1 = Math.min(rows - 1, Math.ceil(py + r));
      for (let y = y0; y <= y1; y++) {
        const dy = y - py;
        for (let x = x0; x <= x1; x++) {
          const dx = x - px;
          const d2 = dx * dx + dy * dy;
          if (d2 > r2) continue;
          const f = 1 - Math.sqrt(d2) / r;
          const sm = f * f * (3 - 2 * f); // smoothstep
          const w = sm * strength * 0.32;
          const i = y * cols + x;
          napX[i] += (dirx - napX[i]) * w;
          napY[i] += (diry - napY[i]) * w;
        }
      }
    }

    // Stamp continuously ALONG the pointer segment so fast moves leave an
    // unbroken stroke instead of dotted blobs.
    let prevX = -1;
    let prevY = -1;
    function onPointerMove(e: PointerEvent) {
      const px = (e.clientX / W) * cols;
      const py = (e.clientY / H) * rows;
      if (prevX >= 0) {
        const dx = px - prevX;
        const dy = py - prevY;
        const dist = Math.hypot(dx, dy);
        if (dist > 0.0001) {
          const dirx = dx / dist;
          const diry = dy / dist;
          const strength = Math.min(1, dist / 4);
          const steps = Math.min(64, Math.max(1, Math.ceil(dist / 0.6)));
          for (let s = 1; s <= steps; s++) {
            const t = s / steps;
            stamp(prevX + dx * t, prevY + dy * t, dirx, diry, strength);
          }
        }
      }
      prevX = px;
      prevY = py;
    }
    function onPointerLeave() {
      prevX = -1;
      prevY = -1;
    }

    // Laplacian diffusion — streaks bleed into neighbours so the wake flows and
    // smooths itself out (the "liquid" feel). A constant field diffuses to
    // nothing, so at rest this is a no-op and stays stable.
    function diffuse() {
      const k = 0.17;
      for (let y = 1; y < rows - 1; y++) {
        let i = y * cols + 1;
        for (let x = 1; x < cols - 1; x++, i++) {
          tmpX[i] =
            napX[i] +
            k * (napX[i - 1] + napX[i + 1] + napX[i - cols] + napX[i + cols] - 4 * napX[i]);
          tmpY[i] =
            napY[i] +
            k * (napY[i - 1] + napY[i + 1] + napY[i - cols] + napY[i + cols] - 4 * napY[i]);
        }
      }
      for (let y = 1; y < rows - 1; y++) {
        let i = y * cols + 1;
        for (let x = 1; x < cols - 1; x++, i++) {
          napX[i] = tmpX[i];
          napY[i] = tmpY[i];
        }
      }
    }

    function render() {
      if (!img) return;
      if (!reduceMotion) diffuse();
      const data = img.data;
      const relax = 0.008; // settle back toward the drape
      const n = cols * rows;
      for (let i = 0, p = 0; i < n; i++, p += 4) {
        let ax = napX[i];
        let ay = napY[i];
        ax += (bX - ax) * relax;
        ay += (bY - ay) * relax;
        napX[i] = ax;
        napY[i] = ay;

        const len = Math.hypot(ax, ay) || 1;
        let t = (ax / len) * lx + (ay / len) * ly; // -1..1
        t = t * 0.5 + 0.5 + grain[i]; // 0..1 + texture
        if (t < 0) t = 0;
        else if (t > 1) t = 1;

        let r: number;
        let g: number;
        let b: number;
        if (t < 0.5) {
          const u = t * 2;
          r = shadow[0] + (mid[0] - shadow[0]) * u;
          g = shadow[1] + (mid[1] - shadow[1]) * u;
          b = shadow[2] + (mid[2] - shadow[2]) * u;
        } else {
          const u = (t - 0.5) * 2;
          r = mid[0] + (sheen[0] - mid[0]) * u;
          g = mid[1] + (sheen[1] - mid[1]) * u;
          b = mid[2] + (sheen[2] - mid[2]) * u;
        }
        data[p] = r;
        data[p + 1] = g;
        data[p + 2] = b;
        data[p + 3] = 255;
      }
      octx!.putImageData(img, 0, 0);
      ctx!.drawImage(off, 0, 0, cols, rows, 0, 0, W, H);
    }

    let raf = 0;
    function loop() {
      render();
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    if (reduceMotion) {
      render(); // one static drape, no interaction
    } else {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave, { passive: true });
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ filter: "blur(2px)" }}
    />
  );
}
