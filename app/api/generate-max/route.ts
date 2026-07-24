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

// The Max tier gets a richer instruction: first extract what's in the
// screenshots, then merge with the manual inputs and rewrite.
const MAX_SYSTEM = `${SYSTEM_PROMPT}

You have also been given screenshots of the person's EXISTING profile. First, silently extract every detail you can read from them — About text, each job's full description, education, skills. Then combine that with the manual inputs below and produce a single, richer rewrite. When the screenshots and the typed inputs disagree, prefer the more complete/recent information. You may additionally include a "suggested_recommendations" array: 2-3 short prompts the person could send to former colleagues to request a recommendation.`;

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
