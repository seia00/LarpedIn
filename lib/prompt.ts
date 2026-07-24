import type { ProfileFormData, GeneratedProfile } from "./types";

// The JSON schema both tiers must return. Kept in one place so Lite and Max
// stay in lockstep and the preview card can rely on a single shape.
export const OUTPUT_SCHEMA_DESCRIPTION = `{
  "name": "string, optional — the person's name if you can infer it, else omit",
  "pronouns": "string, optional — e.g. 'she/her', only if clearly stated",
  "headline": "string, max 220 chars — punchy, specific, no clichés",
  "about": "string, max 2600 chars — first-person narrative with a human hook, then substance",
  "experience": [
    { "title": "string", "company": "string", "dates": "string", "location": "string", "description": "string — 2-4 tight achievement-oriented sentences or bullet-style lines" }
  ],
  "education": [
    { "school": "string", "degree": "string", "dates": "string", "activities": "string" }
  ],
  "skills": ["string"],
  "suggested_featured": ["string — 2-4 ideas for Featured items, e.g. a portfolio link, a talk, a writing sample"]
}`;

export const SYSTEM_PROMPT = `You are LarpLink, a sharp career-branding ghostwriter. You turn a person's raw career details into a polished, narrative-driven LinkedIn profile that reads like it was written by a great human editor — confident, specific, and free of corporate cliché.

Rules:
- Write in the first person for the About section.
- Be concrete. Prefer specifics ("led a 6-person team", "cut load times 40%") over vague ("results-driven professional").
- No buzzword soup. Avoid "synergy", "passionate about", "results-oriented", "wear many hats", em-dash-laden filler.
- Keep the person's real facts intact. Do not invent employers, degrees, or metrics that weren't provided; you may sharpen phrasing and infer reasonable connective tissue.
- Respect field limits: headline <= 220 chars, about <= 2600 chars.
- Return ONLY valid JSON matching the schema. No markdown, no code fences, no commentary before or after.`;

export function buildUserPrompt(form: ProfileFormData): string {
  const experience = form.experience
    .filter((e) => e.title || e.company || e.description)
    .map(
      (e, i) =>
        `  ${i + 1}. Title: ${e.title || "—"} | Company: ${e.company || "—"} | Dates: ${e.dates || "—"} | Location: ${e.location || "—"}\n     Description: ${e.description || "—"}`,
    )
    .join("\n");

  const education = form.education
    .filter((e) => e.school || e.degree || e.field)
    .map(
      (e, i) =>
        `  ${i + 1}. School: ${e.school || "—"} | Degree: ${e.degree || "—"} | Field: ${e.field || "—"} | Dates: ${e.dates || "—"} | Activities: ${e.activities || "—"}`,
    )
    .join("\n");

  return `Here are the person's raw details. Rewrite them into a polished profile.

ABOUT / BACKGROUND:
${form.about || "(not provided)"}

CURRENT OR TARGET INDUSTRY:
${form.industry || "(not provided)"}

WHERE THEY WANT TO BE IN 5–10 YEARS:
${form.goals || "(not provided)"}

EXPERIENCE:
${experience || "(none provided)"}

EDUCATION:
${education || "(none provided)"}

SKILLS (comma-separated):
${form.skills || "(none provided)"}

CERTIFICATIONS / AWARDS / LANGUAGES / EXTRAS (freeform — parse and structure sensibly):
${form.extras || "(none provided)"}

Return a single JSON object matching exactly this schema:
${OUTPUT_SCHEMA_DESCRIPTION}`;
}

// Model output can arrive wrapped in ```json fences or with stray prose. This
// pulls out the first balanced JSON object and parses it, throwing on failure.
export function parseModelJson(raw: string): GeneratedProfile {
  let text = raw.trim();

  // Strip markdown code fences if present.
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  // Fall back to slicing from the first { to the last }.
  if (!text.startsWith("{")) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      text = text.slice(start, end + 1);
    }
  }

  const parsed = JSON.parse(text) as GeneratedProfile;
  return normalizeProfile(parsed);
}

// Guard against missing/misshaped fields so the preview never crashes.
export function normalizeProfile(p: Partial<GeneratedProfile>): GeneratedProfile {
  return {
    name: typeof p.name === "string" ? p.name : undefined,
    pronouns: typeof p.pronouns === "string" ? p.pronouns : undefined,
    headline: (p.headline ?? "").toString().slice(0, 220),
    about: (p.about ?? "").toString().slice(0, 2600),
    experience: Array.isArray(p.experience)
      ? p.experience.map((e) => ({
          title: e?.title ?? "",
          company: e?.company ?? "",
          dates: e?.dates ?? "",
          location: e?.location ?? "",
          description: e?.description ?? "",
        }))
      : [],
    education: Array.isArray(p.education)
      ? p.education.map((e) => ({
          school: e?.school ?? "",
          degree: e?.degree ?? "",
          dates: e?.dates ?? "",
          activities: e?.activities ?? "",
        }))
      : [],
    skills: Array.isArray(p.skills) ? p.skills.filter(Boolean).map(String) : [],
    suggested_featured: Array.isArray(p.suggested_featured)
      ? p.suggested_featured.filter(Boolean).map(String)
      : [],
    suggested_recommendations: Array.isArray(p.suggested_recommendations)
      ? p.suggested_recommendations.filter(Boolean).map(String)
      : undefined,
  };
}
