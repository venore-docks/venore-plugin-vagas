import { eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { vagasTagItems } from "../../database/schema";

export async function deleteTagItemById(id: string): Promise<boolean> {
  const rows = await db.delete(vagasTagItems).where(eq(vagasTagItems.id, id)).returning({ id: vagasTagItems.id });
  return rows.length > 0;
}
