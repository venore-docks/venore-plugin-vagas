import { eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { vagasTagItems } from "../../database/schema";
import type { TagItemRecord } from "../../contracts/types";

export async function findTagItemById(id: string): Promise<TagItemRecord | null> {
  const [row] = await db.select().from(vagasTagItems).where(eq(vagasTagItems.id, id)).limit(1);
  return (row as TagItemRecord) ?? null;
}

export async function applyTagItemUpdate(id: string, label: string): Promise<TagItemRecord> {
  const [row] = await db.update(vagasTagItems).set({ label }).where(eq(vagasTagItems.id, id)).returning();
  return row as TagItemRecord;
}
