import { sql } from "drizzle-orm";
import { boolean, check, jsonb, numeric, pgSchema, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const vagasSchema = pgSchema("vagas");

// Catálogo único, compartilhado entre todas as vagas — 5 grupos multi-seleção (benefit/
// knowledge/skill/attitude/activity, via vagas_job_tags abaixo) + contract_regime (single-select,
// FK direta em jobs.contractRegimeId, N:N não faz sentido pra "uma vaga tem um regime só").
// Unique (category, label): RH não duplica "Vale-refeição" dentro de Benefícios, mas o mesmo texto
// pode existir em categorias diferentes.
export const VAGAS_TAG_CATEGORIES = ["benefit", "knowledge", "skill", "attitude", "activity", "contract_regime"] as const;

export const vagasTagItems = vagasSchema.table(
  "tag_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    category: text("category").notNull(),
    label: text("label").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("vagas_tag_items_category_label_idx").on(table.category, table.label),
    check(
      "vagas_tag_items_category_check",
      sql`${table.category} in ('benefit', 'knowledge', 'skill', 'attitude', 'activity', 'contract_regime')`,
    ),
  ],
);

// Categoria da vaga — dono do cover padrão (coverMediaAssetId). Schema próprio do plugin, FK real
// permitida porque jobs.categoryId aponta pra tabela do PRÓPRIO domínio vagas (mesmo padrão de
// media.assets.categoryId -> media.categories.id). coverMediaAssetId é loose ref pro media do
// core (plugin nunca FK em tabela de outro schema).
export const vagasJobCategories = vagasSchema.table("job_categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  key: text("key").notNull().unique(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  coverMediaAssetId: text("cover_media_asset_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// createdByUserId é texto solto, sem FK pra auth.users: um plugin não pode importar
// contexts/auth/database/schema (regra 7 — "nunca de store, schema, database/client... vale
// tanto pra leitura quanto escrita"). Mesmo tratamento de birthdays.createdByUserId. Usuário
// apagado deixa o id órfão aqui — a camada de exibição precisa tolerar isso.
//
// status só tem CHECK de valor permitido — a listagem pública (list-public-jobs) filtra por
// status = 'open', fechar/pausar uma vaga nunca some do cadastro admin, só do público.
//
// categoryId é FK real (mesmo schema); coverMediaAssetId é override opcional por vaga — se nulo,
// a capa efetiva cai na da categoria (resolvida em view.ts das features públicas). customFormFields
// é a lista de campos extras que o RH monta por vaga (ver shared/application-fields.ts) — o
// formulário básico (nome/e-mail/telefone) é fixo no código, não fica aqui. requiresDisc liga/
// desliga a etapa de Test DISC nessa vaga especificamente.
export const vagasJobs = vagasSchema.table(
  "jobs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    department: text("department"),
    location: text("location"),
    description: text("description").notNull(),
    requirements: text("requirements"),
    applyContact: text("apply_contact"),
    status: text("status").notNull().default("open"),
    categoryId: text("category_id").references(() => vagasJobCategories.id, { onDelete: "restrict" }),
    coverMediaAssetId: text("cover_media_asset_id"),
    customFormFields: jsonb("custom_form_fields").notNull().default([]),
    requiresDisc: boolean("requires_disc").notNull().default(true),
    // "ambiente" do Test DISC (vocabulário do próprio disc, ver DiscInstanceRecord.environmentLabel)
    // — nulo cai no título da vaga (features/submit-application/service.ts).
    discEnvironmentLabel: text("disc_environment_label"),
    // fixed/hourly guardam salaryAmount; negotiable/interview ignoram (nunca aparece na UI).
    salaryType: text("salary_type").notNull().default("negotiable"),
    salaryAmount: numeric("salary_amount", { precision: 10, scale: 2 }),
    // Single-select — FK direta (não job_tags), catálogo próprio (category='contract_regime').
    contractRegimeId: text("contract_regime_id").references(() => vagasTagItems.id, { onDelete: "set null" }),
    contractType: text("contract_type"),
    // "fixed": horário diário fixo (dailyStartTime/dailyEndTime) em dias específicos
    // (scheduleWeekDays) — weeklyHours aqui é só informativo ("36h"). "weekly_hours": só a carga
    // semanal importa, sem horário/dias fixos ("20h semanais") — os 3 campos de horário ficam nulos.
    scheduleType: text("schedule_type").notNull().default("weekly_hours"),
    weeklyHours: numeric("weekly_hours", { precision: 5, scale: 2 }),
    dailyStartTime: text("daily_start_time"),
    dailyEndTime: text("daily_end_time"),
    scheduleWeekDays: jsonb("schedule_week_days").notNull().default([]),
    managerEmail: text("manager_email"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    closesAt: timestamp("closes_at", { withTimezone: true }),
    createdByUserId: text("created_by_user_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("vagas_jobs_status_check", sql`${table.status} in ('open', 'paused', 'closed')`),
    check(
      "vagas_jobs_salary_type_check",
      sql`${table.salaryType} in ('fixed', 'hourly', 'negotiable', 'interview')`,
    ),
    check(
      "vagas_jobs_contract_type_check",
      sql`${table.contractType} is null or ${table.contractType} in ('indeterminate', 'determinate')`,
    ),
    check("vagas_jobs_schedule_type_check", sql`${table.scheduleType} in ('fixed', 'weekly_hours')`),
  ],
);

// N:N pros 5 grupos multi-seleção de tag_items (nunca 'contract_regime', que é FK direta em
// jobs.contractRegimeId). onDelete cascade nos dois lados: apagar a vaga ou apagar o item do
// catálogo remove só o vínculo, nunca deixa linha órfã.
export const vagasJobTags = vagasSchema.table(
  "job_tags",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    jobId: text("job_id")
      .notNull()
      .references(() => vagasJobs.id, { onDelete: "cascade" }),
    tagItemId: text("tag_item_id")
      .notNull()
      .references(() => vagasTagItems.id, { onDelete: "cascade" }),
  },
  (table) => [uniqueIndex("vagas_job_tags_unique_idx").on(table.jobId, table.tagItemId)],
);

// Ponto de partida reaproveitável pro editor de campos de candidatura (CustomFieldsEditor) — job
// NÃO guarda referência ao template usado; carregar um template só pré-preenche
// jobs.customFormFields no momento da edição, sem acoplamento depois disso.
export const vagasFormTemplates = vagasSchema.table("form_templates", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  fields: jsonb("fields").notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Uma candidatura por envio do formulário público (routes/public/job-apply). resumeMediaAssetId é
// loose ref pro media do core (upload anônimo, ver uploadReservedCategoryAssetPublic).
// discInstanceId/discReportId são loose refs pro plugin disc (dependência OPCIONAL — regra 2, sem
// FK cross-plugin; ver shared/disc-bridge.ts). formResponses é keyed por CustomApplicationField.id.
//
// status: 'submitted' (sem etapa DISC, ou candidatura acabou de ser criada aguardando decidir se
// tem DISC) -> 'awaiting_disc' (instância DISC criada, candidato ainda não voltou) ->
// 'completed' (DISC concluído OU vaga não exige DISC).
export const vagasApplications = vagasSchema.table(
  "applications",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    jobId: text("job_id")
      .notNull()
      .references(() => vagasJobs.id, { onDelete: "cascade" }),
    candidateName: text("candidate_name").notNull(),
    candidateEmail: text("candidate_email").notNull(),
    candidatePhone: text("candidate_phone"),
    resumeMediaAssetId: text("resume_media_asset_id"),
    formResponses: jsonb("form_responses").notNull().default({}),
    discInstanceId: text("disc_instance_id"),
    discReportId: text("disc_report_id"),
    status: text("status").notNull().default("submitted"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("vagas_applications_status_check", sql`${table.status} in ('submitted', 'awaiting_disc', 'completed')`),
  ],
);
