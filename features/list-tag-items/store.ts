import { asc, eq, inArray } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { vagasTagItems } from "../../database/schema";
import type { TagCategory, TagItemRecord } from "../../contracts/types";

export async function findTagItemsByCategory(category: TagCategory): Promise<TagItemRecord[]> {
  const rows = await db.select().from(vagasTagItems).where(eq(vagasTagItems.category, category)).orderBy(asc(vagasTagItems.label));
  return rows as TagItemRecord[];
}

export async function findAllTagItems(): Promise<TagItemRecord[]> {
  const rows = await db.select().from(vagasTagItems).orderBy(asc(vagasTagItems.label));
  return rows as TagItemRecord[];
}

// Sem authorizeActor de propósito — usado pra resolver labels na página pública (mesmo racional
// de findJobCategoryByIdPublic em features/list-job-categories/store.ts). Não expõe nada além do
// próprio label, que já é público em qualquer vaga que use a tag.
export async function findTagItemsByIdsPublic(ids: string[]): Promise<TagItemRecord[]> {
  if (ids.length === 0) return [];
  const rows = await db.select().from(vagasTagItems).where(inArray(vagasTagItems.id, ids));
  return rows as TagItemRecord[];
}
