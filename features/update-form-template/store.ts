import { eq, sql } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { vagasFormTemplates } from "../../database/schema";
import type { FormTemplateRecord } from "../../contracts/types";

export async function findFormTemplateById(id: string): Promise<FormTemplateRecord | null> {
  const [row] = await db.select().from(vagasFormTemplates).where(eq(vagasFormTemplates.id, id)).limit(1);
  return (row as FormTemplateRecord) ?? null;
}

export async function applyFormTemplateUpdate(input: {
  id: string;
  name: string;
  fields: FormTemplateRecord["fields"];
}): Promise<FormTemplateRecord> {
  const [row] = await db
    .update(vagasFormTemplates)
    .set({ name: input.name, fields: input.fields, updatedAt: sql`now()` })
    .where(eq(vagasFormTemplates.id, input.id))
    .returning();
  return row as FormTemplateRecord;
}
