-- 0003 CONTRACT (DESTRUCTIVE — DEFER until new code is deployed to ourfolio.bkan.dev).
-- Old deployed code still queries external_link + case_studies; only run this AFTER
-- the W1 code (which removes those references) is live.
UPDATE "projects" SET "repo_url" = "external_link" WHERE "external_link" IS NOT NULL AND "repo_url" IS NULL;--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN IF EXISTS "external_link";--> statement-breakpoint
DROP TABLE IF EXISTS "case_studies" CASCADE;
--> statement-breakpoint
ALTER TABLE "leads" DROP COLUMN IF EXISTS "budget_range";
