import { eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { vagasFormTemplates } from "../../database/schema";

export async function deleteFormTemplateById(id: string): Promise<boolean> {
  const rows = await db.delete(vagasFormTemplates).where(eq(vagasFormTemplates.id, id)).returning({ id: vagasFormTemplates.id });
  return rows.length > 0;
}
