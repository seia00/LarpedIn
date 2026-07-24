"use client";

import { useState } from "react";

export default function CopySection({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API can fail (permissions, insecure context) — fail silently
      // rather than throwing; the user can still select the text manually.
    }
  }

  if (!text.trim()) return null;

  return (
    <div className="rounded-xl border border-ink/10 bg-white">
      <div className="flex items-center justify-between border-b border-ink/8 px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/55">
          {label}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium text-crimson transition hover:bg-crimson/5"
        >
          {copied ? (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3.5 8.5l3 3 6-7"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
                <rect
                  x="5"
                  y="5"
                  width="8"
                  height="8"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M3 11V4a1 1 0 011-1h7"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="max-h-56 overflow-auto whitespace-pre-wrap px-4 py-3 font-sans text-[14px] leading-relaxed text-ink/80">
        {text}
      </pre>
    </div>
  );
}
