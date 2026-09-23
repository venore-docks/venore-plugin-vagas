import { asc, eq, inArray } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { vagasJobCategories } from "../../database/schema";
import type { JobCategoryRecord } from "../../contracts/types";

export async function findAllJobCategories(): Promise<JobCategoryRecord[]> {
  const rows = await db.select().from(vagasJobCategories).orderBy(asc(vagasJobCategories.name));
  return rows as JobCategoryRecord[];
}

// Sem authorizeActor de propósito — chamado a partir das features públicas (list-public-jobs,
// get-job-by-slug) só pra resolver a capa efetiva da vaga, não expõe nada sensível (mesmos campos
// que já ficam públicos em JobCategoryRecord).
export async function findJobCategoryByIdPublic(id: string): Promise<JobCategoryRecord | null> {
  const [row] = await db.select().from(vagasJobCategories).where(eq(vagasJobCategories.id, id)).limit(1);
  return (row as JobCategoryRecord) ?? null;
}

export async function findJobCategoriesByIds(ids: string[]): Promise<JobCategoryRecord[]> {
  if (ids.length === 0) return [];
  const rows = await db.select().from(vagasJobCategories).where(inArray(vagasJobCategories.id, ids));
  return rows as JobCategoryRecord[];
}
