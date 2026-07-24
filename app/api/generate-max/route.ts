import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { ProfileFormData } from "@/lib/types";
import { SYSTEM_PROMPT, buildUserPrompt, parseModelJson } from "@/lib/prompt";

export const runtime = "nodejs";
export const maxDuration = 120;

interface MaxImage {
  mediaType: string;
  dataUrl: string;
}

const SUPPORTED_MEDIA = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

const MAX_SYSTEM = `${SYSTEM_PROMPT}

=== MAX TIER: EXTRA FIREPOWER ===

You are operating in Larp-Max mode. You have been given screenshots of the person's EXISTING LinkedIn profile alongside their manual inputs. This is the premium tier — expectations are higher and the output must be richer.

First, silently extract every last detail from the screenshots: the full About section, every job's title and description (including any truncated text you can infer), all education, skills, endorsements, featured posts, recommendations — everything readable. If a screenshot appears cut off mid-content, infer and expand what's likely there based on context. Do NOT reproduce stale or obviously outdated info verbatim — detect and elevate it.

Then merge the screenshot data with the manual typed inputs. Where they disagree, prefer the more complete or more recent version. Where the screenshot has rich raw material, go HARDER with the LARP — you have more facts to work with, so push the elevation even further.

ADDITIONAL OUTPUT — exclusively for Max tier:
- Include a "suggested_recommendations" array: 3-4 short, specific, prestige-soaked prompts the person can send to former colleagues to request a recommendation. Each prompt should subtly guide the recommender toward highlighting a specific, impressive trait or achievement. Example: "Would you be open to writing a recommendation referencing the payments flow redesign we shipped together? The one that ended up cited across the company."

The Max output should feel like the difference between a well-edited cover letter (Lite) and a full page in Forbes 30 Under 30 (Max).`;

function dataUrlToBase64(dataUrl: string): string {
  const comma = dataUrl.indexOf(",");
  return comma === -1 ? dataUrl : dataUrl.slice(comma + 1);
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Anthropic API key is not configured on the server." },
      { status: 500 },
    );
  }

  let form: ProfileFormData;
  let images: MaxImage[] = [];
  try {
    const body = await req.json();
    form = body.form;
    images = Array.isArray(body.images) ? body.images : [];
    if (!form || typeof form !== "object") throw new Error("missing form");
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  // Build the multimodal user turn: images first, then the structured prompt.
  const imageBlocks = images
    .filter((img) => SUPPORTED_MEDIA.has(img.mediaType))
    .slice(0, 12)
    .map((img) => ({
      type: "image" as const,
      source: {
        type: "base64" as const,
        media_type: img.mediaType as
          | "image/png"
          | "image/jpeg"
          | "image/webp"
          | "image/gif",
        data: dataUrlToBase64(img.dataUrl),
      },
    }));

  const content: Array<Anthropic.TextBlockParam | Anthropic.ImageBlockParam> = [
    ...imageBlocks,
    { type: "text", text: buildUserPrompt(form) },
  ];

  try {
    // Stream and collect the final message — robust against long outputs and
    // the extra tokens adaptive thinking can add.
    const stream = client.messages.stream({
      model: "claude-opus-4-8",
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      system: MAX_SYSTEM,
      messages: [{ role: "user", content }],
    });

    const message = await stream.finalMessage();
    const raw = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    if (!raw) {
      return NextResponse.json(
        { error: "The AI returned an empty response." },
        { status: 502 },
      );
    }

    const profile = parseModelJson(raw);
    return NextResponse.json({ profile });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      console.error("Anthropic error", err.status, err.message);
      return NextResponse.json(
        { error: "The AI service failed to respond. Please try again." },
        { status: 502 },
      );
    }
    console.error("generate-max failed", err);
    return NextResponse.json(
      { error: "We couldn't parse the generated profile. Please try again." },
      { status: 500 },
    );
  }
}
