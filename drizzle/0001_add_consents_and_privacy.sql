CREATE TABLE "consents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"consent_type" text NOT NULL,
	"policy_version" text NOT NULL,
	"consented_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "privacy_consent" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "consents" ADD CONSTRAINT "consents_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
