# LarpedIn

Turn a person's career background into a polished, narrative-driven profile they can copy-paste live. Two tiers:

- **Larp-Lite (free)** — manual text input, generated with the DeepSeek API.
- **Larp-Max ($1)** — upload screenshots of an existing profile + manual input, generated with Claude Opus (vision + text).

Both tiers end on the same `/preview` card with copy-paste-ready section blocks and a "Download as Image" export.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · EB Garamond + Inter (`next/font/google`) · `@anthropic-ai/sdk` · `html-to-image`.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in your keys
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Var | Used by | Notes |
| --- | --- | --- |
| `DEEPSEEK_API_KEY` | `/api/generate-lite` | Required for Larp-Lite. |
| `DEEPSEEK_BASE_URL` | `/api/generate-lite` | Optional; defaults to `https://api.deepseek.com`. |
| `ANTHROPIC_API_KEY` | `/api/generate-max` | Required for Larp-Max. Uses `claude-opus-4-8`. |

The UI (landing, `/choose`, forms, preview with a sample profile) works without keys — only live generation needs them.

## Routes

| Path | What |
| --- | --- |
| `/` | Landing — crimson hero, single CTA. |
| `/choose` | Larp-Lite vs Larp-Max cards. |
| `/lite` | Larp-Lite form. |
| `/max` | Larp-Max form (screenshot upload + manual). |
| `/preview` | Styled profile card + copy panel + image export. |
| `/api/generate-lite` | DeepSeek generation. |
| `/api/generate-max` | Claude vision generation. |

## Structure

```
app/            routes, layout, fonts, globals
components/     ProfileForm, ImageDropzone, PreviewCard, CopySection
lib/            types, prompt builder + JSON parsing, sessionStorage store, sample
```

The generated profile is handed from a form page to `/preview` via `sessionStorage` (see `lib/store.ts`) — no DB in v1.

## Not yet wired (see build spec)

- **Payment gate** on `/max` — add a Stripe Checkout / payment-link check before granting access (`app/max/page.tsx` has a note).
- Optional Supabase persistence of generated profiles / accounts.
