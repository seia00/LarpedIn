// ---- Form input shapes (client → API) ----

export interface ExperienceEntry {
  title: string;
  company: string;
  dates: string;
  location: string;
  description: string;
}

export interface EducationEntry {
  school: string;
  degree: string;
  field: string;
  dates: string;
  activities: string;
}

export interface ProfileFormData {
  about: string; // "Who are you?" — background, hobbies, story
  industry: string; // current or target industry
  goals: string; // where they want to be in 5–10 years
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string; // comma-separated
  extras: string; // freeform: certs, awards, languages
}

// ---- Generated output shape (API → client), shared by both tiers ----

export interface GeneratedExperience {
  title: string;
  company: string;
  dates: string;
  location: string;
  description: string;
}

export interface GeneratedEducation {
  school: string;
  degree: string;
  dates: string;
  activities: string;
}

export interface GeneratedProfile {
  name?: string;
  pronouns?: string;
  headline: string; // max 220 chars
  about: string; // max 2600 chars
  experience: GeneratedExperience[];
  education: GeneratedEducation[];
  skills: string[];
  suggested_featured: string[];
  // Max-tier extras (optional)
  suggested_recommendations?: string[];
}

export type Tier = "lite" | "max";

export const emptyExperience = (): ExperienceEntry => ({
  title: "",
  company: "",
  dates: "",
  location: "",
  description: "",
});

export const emptyEducation = (): EducationEntry => ({
  school: "",
  degree: "",
  field: "",
  dates: "",
  activities: "",
});

export const emptyForm = (): ProfileFormData => ({
  about: "",
  industry: "",
  goals: "",
  experience: [emptyExperience()],
  education: [emptyEducation()],
  skills: "",
  extras: "",
});
