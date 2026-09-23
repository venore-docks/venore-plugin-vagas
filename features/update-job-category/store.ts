import { eq, sql } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { vagasJobCategories } from "../../database/schema";
import type { JobCategoryRecord } from "../../contracts/types";

export async function findJobCategoryById(id: string): Promise<JobCategoryRecord | null> {
  const [row] = await db.select().from(vagasJobCategories).where(eq(vagasJobCategories.id, id)).limit(1);
  return (row as JobCategoryRecord) ?? null;
}

export async function applyJobCategoryUpdate(input: {
  id: string;
  name: string;
  coverMediaAssetId: string | null;
}): Promise<JobCategoryRecord> {
  const [row] = await db
    .update(vagasJobCategories)
    .set({ name: input.name, coverMediaAssetId: input.coverMediaAssetId, updatedAt: sql`now()` })
    .where(eq(vagasJobCategories.id, input.id))
    .returning();
  return row as JobCategoryRecord;
}
