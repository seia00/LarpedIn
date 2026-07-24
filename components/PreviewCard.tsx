import { forwardRef } from "react";
import type { GeneratedProfile } from "@/lib/types";

function Divider() {
  return <hr className="hairline my-6" />;
}

// Split a description into clean bullet lines. Accepts newline- or
// bullet-delimited text and falls back to sentence-ish splitting.
function toLines(description: string): string[] {
  const trimmed = description.trim();
  if (!trimmed) return [];
  const byLine = trimmed
    .split(/\n+/)
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
  if (byLine.length > 1) return byLine;
  return [trimmed];
}

function initials(name?: string): string {
  if (!name) return "★";
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * The Profile Preview Card. Mirrors LinkedIn's information hierarchy
 * (banner → photo → name/headline → About → Experience → Education → Skills)
 * but with LarpedIn's own chrome so it reads as our product when shared.
 *
 * forwardRef so the /preview page can hand the node to html-to-image.
 */
const PreviewCard = forwardRef<HTMLDivElement, { profile: GeneratedProfile }>(
  function PreviewCard({ profile }, ref) {
    return (
      <div
        ref={ref}
        className="mx-auto w-full max-w-card overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card"
      >
        {/* Banner */}
        <div
          className="h-28"
          style={{
            background:
              "linear-gradient(120deg, #9B1B30 0%, #7E1626 60%, #B84152 100%)",
          }}
        />

        <div className="px-7 pb-8">
          {/* Avatar overlapping the banner */}
          <div className="-mt-12 mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-linen font-serif text-3xl font-semibold text-crimson shadow-sm">
            {initials(profile.name)}
          </div>

          <h1 className="font-serif text-3xl font-semibold leading-tight text-ink">
            {profile.name || "Your Name"}
            {profile.pronouns && (
              <span className="ml-2 align-middle text-base font-normal text-ink/45">
                ({profile.pronouns})
              </span>
            )}
          </h1>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink/70">
            {profile.headline}
          </p>

          {profile.about && (
            <>
              <Divider />
              <section>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-crimson">
                  About
                </h2>
                <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink/80">
                  {profile.about}
                </p>
              </section>
            </>
          )}

          {profile.experience.length > 0 && (
            <>
              <Divider />
              <section>
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-crimson">
                  Experience
                </h2>
                <ol className="relative space-y-6 border-l border-ink/10 pl-5">
                  {profile.experience.map((exp, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-crimson" />
                      <p className="font-serif text-lg font-semibold leading-tight text-ink">
                        {exp.title || "Role"}
                      </p>
                      <p className="text-[15px] font-medium text-ink/75">
                        {[exp.company, exp.location]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      {exp.dates && (
                        <p className="mt-0.5 text-sm text-ink/45">
                          {exp.dates}
                        </p>
                      )}
                      {toLines(exp.description).length > 0 && (
                        <ul className="mt-2 space-y-1.5">
                          {toLines(exp.description).map((line, j) => (
                            <li
                              key={j}
                              className="flex gap-2 text-[14.5px] leading-relaxed text-ink/75"
                            >
                              <span className="mt-2 h-1 w-1 flex-none rounded-full bg-crimson/60" />
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            </>
          )}

          {profile.education.length > 0 && (
            <>
              <Divider />
              <section>
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-crimson">
                  Education
                </h2>
                <ol className="relative space-y-4 border-l border-ink/10 pl-5">
                  {profile.education.map((edu, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-[26px] top-1.5 h-2 w-2 rounded-full border-2 border-white bg-ink/40" />
                      <p className="font-serif text-base font-semibold leading-tight text-ink">
                        {edu.school || "School"}
                      </p>
                      <p className="text-sm text-ink/70">
                        {[edu.degree].filter(Boolean).join(", ")}
                      </p>
                      {edu.dates && (
                        <p className="text-sm text-ink/45">{edu.dates}</p>
                      )}
                      {edu.activities && (
                        <p className="mt-1 text-sm text-ink/60">
                          {edu.activities}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            </>
          )}

          {profile.skills.length > 0 && (
            <>
              <Divider />
              <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-crimson">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-crimson/40 bg-white px-3 py-1 text-sm font-medium text-crimson"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            </>
          )}

          <div className="mt-8 text-center">
            <span className="font-serif text-sm italic text-ink/30">
              Larped on LarpedIn
            </span>
          </div>
        </div>
      </div>
    );
  },
);

export default PreviewCard;
