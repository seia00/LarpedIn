// Lightweight hand-off of the generated profile from a form page to /preview.
// We use sessionStorage (survives the client-side navigation, not shared across
// tabs, cleared when the tab closes) rather than a query param — the payload is
// far too large for a URL and we don't want to persist it server-side for v1.

import type { GeneratedProfile, Tier } from "./types";

const KEY = "larpedin:profile";

export interface StoredProfile {
  profile: GeneratedProfile;
  tier: Tier;
  savedAt: number;
}

export function saveProfile(profile: GeneratedProfile, tier: Tier): void {
  if (typeof window === "undefined") return;
  const payload: StoredProfile = { profile, tier, savedAt: Date.now() };
  sessionStorage.setItem(KEY, JSON.stringify(payload));
}

export function loadProfile(): StoredProfile | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredProfile;
  } catch {
    return null;
  }
}

export function clearProfile(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
