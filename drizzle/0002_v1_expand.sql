-- 0002 EXPAND (additive, safe with old+new code): new project/profile columns.
-- Apply this NOW. Old deployed code ignores these columns; new code uses them.
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "demo_url" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "repo_url" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "body_markdown" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "role" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "stack" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "repo_id" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "stars" integer;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "language" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "last_synced_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "github_pinned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "skills" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "resume_url" text;
--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "inquiry_type" text;
