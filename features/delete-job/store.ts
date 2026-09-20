import { eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { vagasJobs } from "../../database/schema";

export async function deleteJobById(id: string): Promise<boolean> {
  const rows = await db.delete(vagasJobs).where(eq(vagasJobs.id, id)).returning({ id: vagasJobs.id });
  return rows.length > 0;
}
