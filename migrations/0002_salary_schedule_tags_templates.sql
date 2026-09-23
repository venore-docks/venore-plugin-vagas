CREATE TABLE "vagas"."form_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"fields" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vagas"."job_tags" (
	"id" text PRIMARY KEY NOT NULL,
	"job_id" text NOT NULL,
	"tag_item_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vagas"."tag_items" (
	"id" text PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"label" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vagas_tag_items_category_check" CHECK ("vagas"."tag_items"."category" in ('benefit', 'knowledge', 'skill', 'attitude', 'activity', 'contract_regime'))
);
--> statement-breakpoint
ALTER TABLE "vagas"."jobs" ADD COLUMN "disc_environment_label" text;--> statement-breakpoint
ALTER TABLE "vagas"."jobs" ADD COLUMN "salary_type" text DEFAULT 'negotiable' NOT NULL;--> statement-breakpoint
ALTER TABLE "vagas"."jobs" ADD COLUMN "salary_amount" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "vagas"."jobs" ADD COLUMN "contract_regime_id" text;--> statement-breakpoint
ALTER TABLE "vagas"."jobs" ADD COLUMN "contract_type" text;--> statement-breakpoint
ALTER TABLE "vagas"."jobs" ADD COLUMN "schedule_type" text DEFAULT 'weekly_hours' NOT NULL;--> statement-breakpoint
ALTER TABLE "vagas"."jobs" ADD COLUMN "weekly_hours" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "vagas"."jobs" ADD COLUMN "daily_start_time" text;--> statement-breakpoint
ALTER TABLE "vagas"."jobs" ADD COLUMN "daily_end_time" text;--> statement-breakpoint
ALTER TABLE "vagas"."jobs" ADD COLUMN "schedule_week_days" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "vagas"."jobs" ADD COLUMN "manager_email" text;--> statement-breakpoint
ALTER TABLE "vagas"."job_tags" ADD CONSTRAINT "job_tags_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "vagas"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vagas"."job_tags" ADD CONSTRAINT "job_tags_tag_item_id_tag_items_id_fk" FOREIGN KEY ("tag_item_id") REFERENCES "vagas"."tag_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "vagas_job_tags_unique_idx" ON "vagas"."job_tags" USING btree ("job_id","tag_item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "vagas_tag_items_category_label_idx" ON "vagas"."tag_items" USING btree ("category","label");--> statement-breakpoint
ALTER TABLE "vagas"."jobs" ADD CONSTRAINT "jobs_contract_regime_id_tag_items_id_fk" FOREIGN KEY ("contract_regime_id") REFERENCES "vagas"."tag_items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vagas"."jobs" ADD CONSTRAINT "vagas_jobs_salary_type_check" CHECK ("vagas"."jobs"."salary_type" in ('fixed', 'hourly', 'negotiable', 'interview'));--> statement-breakpoint
ALTER TABLE "vagas"."jobs" ADD CONSTRAINT "vagas_jobs_contract_type_check" CHECK ("vagas"."jobs"."contract_type" is null or "vagas"."jobs"."contract_type" in ('indeterminate', 'determinate'));--> statement-breakpoint
ALTER TABLE "vagas"."jobs" ADD CONSTRAINT "vagas_jobs_schedule_type_check" CHECK ("vagas"."jobs"."schedule_type" in ('fixed', 'weekly_hours'));