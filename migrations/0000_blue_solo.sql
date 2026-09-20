CREATE SCHEMA "vagas";
--> statement-breakpoint
CREATE TABLE "vagas"."jobs" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"department" text,
	"location" text,
	"description" text NOT NULL,
	"requirements" text,
	"apply_contact" text,
	"status" text DEFAULT 'open' NOT NULL,
	"published_at" timestamp with time zone,
	"closes_at" timestamp with time zone,
	"created_by_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "jobs_slug_unique" UNIQUE("slug"),
	CONSTRAINT "vagas_jobs_status_check" CHECK ("vagas"."jobs"."status" in ('open', 'paused', 'closed'))
);
