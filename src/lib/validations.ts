import { z } from "zod";

// ── Reserved usernames ──────────────────────────────
const RESERVED_USERNAMES = [
  "auth",
  "api",
  "dashboard",
  "admin",
  "settings",
  "login",
  "signup",
  "privacy",
  "terms",
] as const;

// ── Project schemas ─────────────────────────────────
export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  category: z.string().max(50).optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
  externalLink: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

// ── Case Study schemas ──────────────────────────────
const metricSchema = z.object({
  label: z.string().min(1).max(100),
  value: z.string().min(1).max(50),
  unit: z.string().max(30),
});

export const createCaseStudySchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  clientName: z.string().max(100).optional(),
  professionTemplate: z
    .enum(["dev", "design", "marketing", "consulting", "other"])
    .optional(),
  projectId: z.string().uuid().optional().nullable(),
  problem: z.string().max(5000).optional(),
  solution: z.string().max(5000).optional(),
  result: z.string().max(5000).optional(),
  metrics: z.array(metricSchema).max(10).optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  displayOrder: z.number().int().min(0).optional(),
});

export const updateCaseStudySchema = createCaseStudySchema.partial();

// ── Profile schema ──────────────────────────────────
export const updateProfileSchema = z.object({
  fullName: z.string().max(100).optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(
      /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
      "Only lowercase letters, numbers, and hyphens"
    )
    .refine(
      (val) =>
        !RESERVED_USERNAMES.includes(val as (typeof RESERVED_USERNAMES)[number]),
      "This username is reserved"
    )
    .optional(),
  bio: z.string().max(1000).optional(),
  tagline: z.string().max(200).optional(),
  profession: z.string().max(50).optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  template: z.enum(["minimal", "bold", "darktech"]).optional(),
  primaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  accentColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  socialLinks: z
    .object({
      github: z.string().url().optional().or(z.literal("")),
      linkedin: z.string().url().optional().or(z.literal("")),
      twitter: z.string().url().optional().or(z.literal("")),
      website: z.string().url().optional().or(z.literal("")),
      dribbble: z.string().url().optional().or(z.literal("")),
      behance: z.string().url().optional().or(z.literal("")),
    })
    .optional(),
});

// ── Contact form schema ─────────────────────────────
export const contactFormSchema = z.object({
  senderName: z.string().min(1, "Name is required").max(100),
  senderEmail: z.string().email("Invalid email"),
  message: z.string().min(1, "Message is required").max(5000),
  budgetRange: z
    .enum(["under-1k", "1k-5k", "5k-10k", "10k-plus"])
    .optional(),
  privacyConsent: z.literal(true, { message: "Privacy consent is required" }),
});

// ── Consent constants ───────────────────────────────
export const CONSENT_TYPES = ["privacy", "cross_border", "terms"] as const;
export const CURRENT_POLICY_VERSION = "1.0";

// ── Consent record schema ───────────────────────────
const consentItemSchema = z.object({
  type: z.enum(CONSENT_TYPES),
  policyVersion: z.string().min(1).max(20),
});

export const consentRecordSchema = z.object({
  consents: z.array(consentItemSchema).min(1).max(5),
});

// ── Analytics schema ────────────────────────────────
export const trackEventSchema = z.object({
  profileId: z.string().uuid(),
  eventType: z.enum(["page_view", "cta_click", "contact_submit"]),
  visitorId: z.string().max(100).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// ── Lead read toggle schema ─────────────────────────
export const toggleReadSchema = z.object({
  isRead: z.boolean(),
});
