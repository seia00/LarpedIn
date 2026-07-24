import { NextResponse } from "next/server";
import type { ProfileFormData } from "@/lib/types";
import { SYSTEM_PROMPT, buildUserPrompt, parseModelJson } from "@/lib/prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

const DEEPSEEK_BASE_URL =
  process.env.DEEPSEEK_BASE_URL?.replace(/\/$/, "") || "https://api.deepseek.com";

export async function POST(req: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "DeepSeek API key is not configured on the server." },
      { status: 500 },
    );
  }

  let form: ProfileFormData;
  try {
    const body = await req.json();
    form = body.form;
    if (!form || typeof form !== "object") throw new Error("missing form");
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    const res = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(form) },
        ],
        response_format: { type: "json_object" },
        // Bolder sampling for a more vivid, varied LARP; JSON mode keeps the
        // structure intact regardless.
        temperature: 0.9,
        max_tokens: 4000,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("DeepSeek error", res.status, detail);
      return NextResponse.json(
        { error: "The AI service failed to respond. Please try again." },
        { status: 502 },
      );
    }

    const data = await res.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? "";
    if (!raw) {
      return NextResponse.json(
        { error: "The AI returned an empty response." },
        { status: 502 },
      );
    }

    const profile = parseModelJson(raw);
    return NextResponse.json({ profile });
  } catch (err) {
    console.error("generate-lite failed", err);
    return NextResponse.json(
      { error: "We couldn't parse the generated profile. Please try again." },
      { status: 500 },
    );
  }
}
