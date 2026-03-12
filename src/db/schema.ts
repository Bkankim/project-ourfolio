import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";

// ── Profiles ─────────────────────────────────────────
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().unique(), // BetterAuth user ID
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  username: text("username").unique(),
  bio: text("bio"),
  tagline: text("tagline"),
  profession: text("profession"),
  template: text("template").notNull().default("darktech"),
  primaryColor: text("primary_color").notNull().default("#3B82F6"),
  accentColor: text("accent_color").notNull().default("#FBBF24"),
  socialLinks: jsonb("social_links").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Projects ─────────────────────────────────────────
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  category: text("category"),
  tags: text("tags").array().default([]),
  externalLink: text("external_link"),
  featured: boolean("featured").notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Case Studies ─────────────────────────────────────
export const caseStudies = pgTable("case_studies", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  clientName: text("client_name"),
  professionTemplate: text("profession_template"),
  problem: text("problem"),
  solution: text("solution"),
  result: text("result"),
  metrics: jsonb("metrics").notNull().default([]),
  coverImageUrl: text("cover_image_url"),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Leads ────────────────────────────────────────────
export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  senderName: text("sender_name").notNull(),
  senderEmail: text("sender_email").notNull(),
  message: text("message"),
  budgetRange: text("budget_range"),
  isRead: boolean("is_read").notNull().default(false),
  privacyConsent: boolean("privacy_consent").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Analytics Events ─────────────────────────────────
export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(), // page_view | cta_click | contact_submit
  visitorId: text("visitor_id"),
  metadata: jsonb("metadata").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Consents ────────────────────────────────────────
export const consents = pgTable("consents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  consentType: text("consent_type").notNull(), // privacy | cross_border | terms
  policyVersion: text("policy_version").notNull(),
  consentedAt: timestamp("consented_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Relations ────────────────────────────────────────
export const profilesRelations = relations(profiles, ({ many }) => ({
  projects: many(projects),
  caseStudies: many(caseStudies),
  leads: many(leads),
  analyticsEvents: many(analyticsEvents),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [projects.profileId],
    references: [profiles.id],
  }),
  caseStudies: many(caseStudies),
}));

export const caseStudiesRelations = relations(caseStudies, ({ one }) => ({
  profile: one(profiles, {
    fields: [caseStudies.profileId],
    references: [profiles.id],
  }),
  project: one(projects, {
    fields: [caseStudies.projectId],
    references: [projects.id],
  }),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  profile: one(profiles, {
    fields: [leads.profileId],
    references: [profiles.id],
  }),
}));

export const analyticsEventsRelations = relations(analyticsEvents, ({ one }) => ({
  profile: one(profiles, {
    fields: [analyticsEvents.profileId],
    references: [profiles.id],
  }),
}));
