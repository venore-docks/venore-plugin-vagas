import { eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { vagasJobCategories } from "../../database/schema";

export async function deleteJobCategoryById(id: string): Promise<boolean> {
  const rows = await db.delete(vagasJobCategories).where(eq(vagasJobCategories.id, id)).returning({ id: vagasJobCategories.id });
  return rows.length > 0;
}
