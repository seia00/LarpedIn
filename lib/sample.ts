import type { GeneratedProfile } from "./types";

// Used as a fallback on /preview when there's nothing in sessionStorage — so
// the card is demonstrable on its own, and useful while building the UI.
export const SAMPLE_PROFILE: GeneratedProfile = {
  name: "Alex Rivera",
  pronouns: "they/them",
  headline:
    "Product designer turning fuzzy problems into interfaces people actually understand · ex-fintech, now in climate tech",
  about:
    "I got into design the long way around — I studied philosophy, spent two years fixing bicycles, and only later realized that the thing I loved about both was making complicated systems feel obvious.\n\nThese days I design product experiences for teams that are trying to change something hard. I care about the boring 80% nobody screenshots: the empty states, the error copy, the moment a new user decides whether to stay. I work best embedded with engineers, shipping small and often, and I'd rather run a scrappy usability test today than a perfect one next quarter.",
  experience: [
    {
      title: "Senior Product Designer",
      company: "Verdant",
      dates: "2022 – Present",
      location: "Remote",
      description:
        "Owned the onboarding redesign that lifted activation 34% in one quarter.\nBuilt the team's first design system, cutting handoff time roughly in half.\nRan a weekly research cadence that put engineers in front of real users.",
    },
    {
      title: "Product Designer",
      company: "Ledgerline",
      dates: "2019 – 2022",
      location: "Berlin",
      description:
        "Designed the core payments flow used by 200k+ small businesses.\nPartnered with compliance to make a legally dense flow feel human.",
    },
  ],
  education: [
    {
      school: "University of Edinburgh",
      degree: "M.A. Philosophy",
      dates: "2015 – 2019",
      activities: "Debate society; ran the student design collective.",
    },
  ],
  skills: [
    "Product design",
    "Design systems",
    "User research",
    "Prototyping",
    "Figma",
    "Design ops",
  ],
  suggested_featured: [
    "A case study on the Verdant onboarding redesign",
    "Your talk on designing for compliance-heavy products",
  ],
};
