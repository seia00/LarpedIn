"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  emptyEducation,
  emptyExperience,
  emptyForm,
  type ProfileFormData,
  type Tier,
} from "@/lib/types";
import { saveProfile } from "@/lib/store";
import ImageDropzone, { type UploadedImage } from "./ImageDropzone";

function SectionHeader({
  eyebrow,
  title,
  hint,
}: {
  eyebrow: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-5">
      <span className="section-eyebrow">{eyebrow}</span>
      <h2 className="mt-1.5 font-serif text-2xl font-semibold text-ink">
        {title}
      </h2>
      {hint && <p className="mt-1 text-sm text-ink/55">{hint}</p>}
    </div>
  );
}

export default function ProfileForm({ tier }: { tier: Tier }) {
  const router = useRouter();
  const [form, setForm] = useState<ProfileFormData>(emptyForm());
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  // ---- Experience rows ----
  const setExp = (i: number, key: string, value: string) =>
    setForm((f) => {
      const experience = [...f.experience];
      experience[i] = { ...experience[i], [key]: value };
      return { ...f, experience };
    });
  const addExp = () =>
    setForm((f) => ({ ...f, experience: [...f.experience, emptyExperience()] }));
  const removeExp = (i: number) =>
    setForm((f) => ({
      ...f,
      experience: f.experience.filter((_, idx) => idx !== i),
    }));

  // ---- Education rows ----
  const setEdu = (i: number, key: string, value: string) =>
    setForm((f) => {
      const education = [...f.education];
      education[i] = { ...education[i], [key]: value };
      return { ...f, education };
    });
  const addEdu = () =>
    setForm((f) => ({ ...f, education: [...f.education, emptyEducation()] }));
  const removeEdu = (i: number) =>
    setForm((f) => ({
      ...f,
      education: f.education.filter((_, idx) => idx !== i),
    }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const endpoint =
        tier === "max" ? "/api/generate-max" : "/api/generate-lite";
      const body =
        tier === "max"
          ? {
              form,
              images: images.map((i) => ({
                mediaType: i.mediaType,
                dataUrl: i.dataUrl,
              })),
            }
          : { form };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg.error || `Generation failed (${res.status})`);
      }

      const data = await res.json();
      saveProfile(data.profile, tier);
      router.push("/preview");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {tier === "max" && (
        <section>
          <SectionHeader
            eyebrow="Upload"
            title="Your current profile"
            hint="Before screenshotting, click 'see more' on every section (About, each job, etc.) so we capture your full story — not the truncated version."
          />
          <ImageDropzone images={images} onChange={setImages} />
        </section>
      )}

      {/* About You */}
      <section>
        <SectionHeader
          eyebrow="About You"
          title="Who are you?"
          hint="Your background, hobbies, and story. This becomes the human hook of your About section."
        />
        <textarea
          className="field-textarea min-h-[140px]"
          placeholder="I grew up taking things apart to see how they worked…"
          value={form.about}
          onChange={(e) => set("about", e.target.value)}
        />
      </section>

      {/* Industry & Goals */}
      <section>
        <SectionHeader eyebrow="Industry & Goals" title="Where you're headed" />
        <div className="space-y-4">
          <div>
            <label className="field-label">
              What industry are you in or aiming to enter?
            </label>
            <input
              className="field-input"
              placeholder="e.g. Product design, fintech, biotech…"
              value={form.industry}
              onChange={(e) => set("industry", e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">
              Where do you want to be in 5–10 years?
            </label>
            <textarea
              className="field-textarea"
              placeholder="Leading a design team at a company shaping how people…"
              value={form.goals}
              onChange={(e) => set("goals", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Experience */}
      <section>
        <SectionHeader eyebrow="Experience" title="Where you've worked" />
        <div className="space-y-5">
          {form.experience.map((exp, i) => (
            <div
              key={i}
              className="rounded-xl border border-ink/10 bg-linen/50 p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-ink/60">
                  Role {i + 1}
                </span>
                {form.experience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExp(i)}
                    className="text-sm font-medium text-crimson hover:text-crimson-dark"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label">Job title</label>
                  <input
                    className="field-input"
                    value={exp.title}
                    onChange={(e) => setExp(i, "title", e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label">Company</label>
                  <input
                    className="field-input"
                    value={exp.company}
                    onChange={(e) => setExp(i, "company", e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label">Dates</label>
                  <input
                    className="field-input"
                    placeholder="Jan 2022 – Present"
                    value={exp.dates}
                    onChange={(e) => setExp(i, "dates", e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label">Location</label>
                  <input
                    className="field-input"
                    placeholder="Remote · Berlin"
                    value={exp.location}
                    onChange={(e) => setExp(i, "location", e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="field-label">
                  What did you do? (achievements, scope, impact)
                </label>
                <textarea
                  className="field-textarea"
                  value={exp.description}
                  onChange={(e) => setExp(i, "description", e.target.value)}
                />
              </div>
            </div>
          ))}
          <button type="button" onClick={addExp} className="btn-ghost">
            + Add another role
          </button>
        </div>
      </section>

      {/* Education */}
      <section>
        <SectionHeader eyebrow="Education" title="Where you studied" />
        <div className="space-y-5">
          {form.education.map((edu, i) => (
            <div
              key={i}
              className="rounded-xl border border-ink/10 bg-linen/50 p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-ink/60">
                  School {i + 1}
                </span>
                {form.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEdu(i)}
                    className="text-sm font-medium text-crimson hover:text-crimson-dark"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label">School</label>
                  <input
                    className="field-input"
                    value={edu.school}
                    onChange={(e) => setEdu(i, "school", e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label">Degree</label>
                  <input
                    className="field-input"
                    placeholder="B.S., M.A., …"
                    value={edu.degree}
                    onChange={(e) => setEdu(i, "degree", e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label">Field of study</label>
                  <input
                    className="field-input"
                    value={edu.field}
                    onChange={(e) => setEdu(i, "field", e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label">Dates</label>
                  <input
                    className="field-input"
                    placeholder="2016 – 2020"
                    value={edu.dates}
                    onChange={(e) => setEdu(i, "dates", e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="field-label">Activities (optional)</label>
                <input
                  className="field-input"
                  placeholder="Clubs, honors, research…"
                  value={edu.activities}
                  onChange={(e) => setEdu(i, "activities", e.target.value)}
                />
              </div>
            </div>
          ))}
          <button type="button" onClick={addEdu} className="btn-ghost">
            + Add another school
          </button>
        </div>
      </section>

      {/* Skills & Extras */}
      <section>
        <SectionHeader
          eyebrow="Skills & Extras"
          title="The finishing touches"
          hint="Optional, but they sharpen the result."
        />
        <div className="space-y-4">
          <div>
            <label className="field-label">Skills (comma-separated)</label>
            <input
              className="field-input"
              placeholder="Figma, user research, prototyping, design systems"
              value={form.skills}
              onChange={(e) => set("skills", e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">
              Certifications, awards, languages (freeform)
            </label>
            <textarea
              className="field-textarea"
              placeholder="Fluent in Spanish. AWS Certified. Won the 2023 …"
              value={form.extras}
              onChange={(e) => set("extras", e.target.value)}
            />
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-crimson/30 bg-crimson/5 px-4 py-3 text-sm text-crimson-dark">
          {error}
        </div>
      )}

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <Link href="/choose" className="text-sm text-ink/50 hover:text-ink">
          ← Back to methods
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full sm:w-auto"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <Spinner />
              <span className="font-serif italic">
                Composing your story…
              </span>
            </span>
          ) : tier === "max" ? (
            "Generate My Profile (Max)"
          ) : (
            "Generate My Profile"
          )}
        </button>
      </div>
    </form>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-90"
        d="M12 2a10 10 0 0110 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
