import { sql } from "drizzle-orm";
import { check, pgSchema, text, timestamp } from "drizzle-orm/pg-core";

export const vagasSchema = pgSchema("vagas");

// createdByUserId é texto solto, sem FK pra auth.users: um plugin não pode importar
// contexts/auth/database/schema (regra 7 — "nunca de store, schema, database/client... vale
// tanto pra leitura quanto escrita"). Mesmo tratamento de birthdays.createdByUserId. Usuário
// apagado deixa o id órfão aqui — a camada de exibição precisa tolerar isso.
//
// status só tem CHECK de valor permitido — a listagem pública (list-public-jobs) filtra por
// status = 'open', fechar/pausar uma vaga nunca some do cadastro admin, só do público.
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
    publishedAt: timestamp("published_at", { withTimezone: true }),
    closesAt: timestamp("closes_at", { withTimezone: true }),
    createdByUserId: text("created_by_user_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [check("vagas_jobs_status_check", sql`${table.status} in ('open', 'paused', 'closed')`)],
);
