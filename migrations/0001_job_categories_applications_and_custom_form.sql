CREATE TABLE "vagas"."applications" (
	"id" text PRIMARY KEY NOT NULL,
	"job_id" text NOT NULL,
	"candidate_name" text NOT NULL,
	"candidate_email" text NOT NULL,
	"candidate_phone" text,
	"resume_media_asset_id" text,
	"form_responses" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"disc_instance_id" text,
	"disc_report_id" text,
	"status" text DEFAULT 'submitted' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vagas_applications_status_check" CHECK ("vagas"."applications"."status" in ('submitted', 'awaiting_disc', 'completed'))
);
--> statement-breakpoint
CREATE TABLE "vagas"."job_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"cover_media_asset_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "job_categories_key_unique" UNIQUE("key"),
	CONSTRAINT "job_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "vagas"."jobs" ADD COLUMN "category_id" text;--> statement-breakpoint
ALTER TABLE "vagas"."jobs" ADD COLUMN "cover_media_asset_id" text;--> statement-breakpoint
ALTER TABLE "vagas"."jobs" ADD COLUMN "custom_form_fields" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "vagas"."jobs" ADD COLUMN "requires_disc" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "vagas"."applications" ADD CONSTRAINT "applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "vagas"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vagas"."jobs" ADD CONSTRAINT "jobs_category_id_job_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "vagas"."job_categories"("id") ON DELETE restrict ON UPDATE no action;