import Link from "next/link";
import ProfileForm from "@/components/ProfileForm";

export default function LitePage() {
  return (
    <main className="min-h-screen bg-parchment px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <header className="mb-12">
          <Link
            href="/"
            className="font-serif text-xl font-semibold text-crimson"
          >
            LarpLink
          </Link>
          <div className="mt-6">
            <span className="section-eyebrow">Larp-Lite · Free</span>
            <h1 className="mt-2 font-serif text-4xl font-semibold text-ink">
              Tell us your story
            </h1>
            <p className="mt-3 font-serif text-[17px] italic leading-relaxed text-ink/70">
              Tell us as much as you care to — the more you offer, the sharper
              the rewrite. All optional, save a few words about yourself.
            </p>
          </div>
        </header>

        <ProfileForm tier="lite" />
      </div>
    </main>
  );
}
