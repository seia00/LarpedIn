"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import PreviewCard from "@/components/PreviewCard";
import CopySection from "@/components/CopySection";
import { loadProfile } from "@/lib/store";
import { SAMPLE_PROFILE } from "@/lib/sample";
import type { GeneratedProfile, Tier } from "@/lib/types";

function experienceToText(p: GeneratedProfile): string {
  return p.experience
    .map((e) => {
      const head = [e.title, e.company].filter(Boolean).join(" — ");
      const meta = [e.dates, e.location].filter(Boolean).join(" · ");
      return [head, meta, e.description].filter(Boolean).join("\n");
    })
    .join("\n\n");
}

function educationToText(p: GeneratedProfile): string {
  return p.education
    .map((e) => {
      const head = [e.school, e.degree].filter(Boolean).join(" — ");
      return [head, e.dates, e.activities].filter(Boolean).join("\n");
    })
    .join("\n\n");
}

export default function PreviewPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<GeneratedProfile | null>(null);
  const [tier, setTier] = useState<Tier | null>(null);
  const [isSample, setIsSample] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const stored = loadProfile();
    if (stored) {
      setProfile(stored.profile);
      setTier(stored.tier);
    } else {
      setProfile(SAMPLE_PROFILE);
      setIsSample(true);
    }
  }, []);

  async function downloadImage() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = "larpedin-profile.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Image export failed", err);
    } finally {
      setDownloading(false);
    }
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-linen">
        <p className="font-serif text-lg italic text-ink/50">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linen px-6 py-14">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10 text-center">
          <Link
            href="/"
            className="font-serif text-xl font-semibold text-crimson"
          >
            LarpedIn
          </Link>
          <h1 className="mt-6 font-serif text-4xl font-semibold text-ink">
            Your elevated profile
          </h1>
          <p className="mt-3 text-[15px] text-ink/65">
            {tier === "max" ? "Larp-Max" : tier === "lite" ? "Larp-Lite" : ""}
            {isSample
              ? "This is a sample — generate your own from the form."
              : " · Review the card, then copy each section into LinkedIn."}
          </p>
        </header>

        {/* Preview card */}
        <PreviewCard ref={cardRef} profile={profile} />

        {/* Download CTA */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={downloadImage}
            disabled={downloading}
            className="btn-primary"
          >
            {downloading ? "Rendering…" : "Download as Image"}
          </button>
        </div>

        {/* Copy panel — plain text for pasting into real LinkedIn fields */}
        <section className="mt-12">
          <h2 className="mb-4 font-serif text-2xl font-semibold text-ink">
            Copy sections
          </h2>
          <p className="mb-5 text-sm text-ink/60">
            The card is for visual review. Paste these into the matching LinkedIn
            fields.
          </p>
          <div className="space-y-4">
            <CopySection label="Headline" text={profile.headline} />
            <CopySection label="About" text={profile.about} />
            <CopySection label="Experience" text={experienceToText(profile)} />
            <CopySection label="Education" text={educationToText(profile)} />
            {profile.skills.length > 0 && (
              <CopySection label="Skills" text={profile.skills.join(", ")} />
            )}
          </div>
        </section>

        {/* Suggestions */}
        {(profile.suggested_featured.length > 0 ||
          (profile.suggested_recommendations?.length ?? 0) > 0) && (
          <section className="mt-10 rounded-xl border border-ink/10 bg-white p-6">
            {profile.suggested_featured.length > 0 && (
              <div>
                <h3 className="section-eyebrow">Featured ideas</h3>
                <ul className="mt-3 space-y-2 text-[15px] text-ink/75">
                  {profile.suggested_featured.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 flex-none rounded-full bg-crimson/60" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {profile.suggested_recommendations &&
              profile.suggested_recommendations.length > 0 && (
                <div className="mt-6">
                  <h3 className="section-eyebrow">
                    Recommendation prompts
                  </h3>
                  <ul className="mt-3 space-y-2 text-[15px] text-ink/75">
                    {profile.suggested_recommendations.map((s, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 flex-none rounded-full bg-crimson/60" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </section>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link href="/choose" className="btn-ghost">
            Start over
          </Link>
        </div>
      </div>
    </main>
  );
}
