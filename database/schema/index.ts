import { sql } from "drizzle-orm";
import { boolean, check, jsonb, pgSchema, text, timestamp } from "drizzle-orm/pg-core";

export const vagasSchema = pgSchema("vagas");

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
    publishedAt: timestamp("published_at", { withTimezone: true }),
    closesAt: timestamp("closes_at", { withTimezone: true }),
    createdByUserId: text("created_by_user_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [check("vagas_jobs_status_check", sql`${table.status} in ('open', 'paused', 'closed')`)],
);

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
