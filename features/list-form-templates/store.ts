import { asc } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { vagasFormTemplates } from "../../database/schema";
import type { FormTemplateRecord } from "../../contracts/types";

export async function findAllFormTemplates(): Promise<FormTemplateRecord[]> {
  const rows = await db.select().from(vagasFormTemplates).orderBy(asc(vagasFormTemplates.name));
  return rows as FormTemplateRecord[];
}
