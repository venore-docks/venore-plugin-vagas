import { eq, sql } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { vagasApplications } from "../../database/schema";
import type { ApplicationRecord } from "../../contracts/types";

export async function findApplicationById(id: string): Promise<ApplicationRecord | null> {
  const [row] = await db.select().from(vagasApplications).where(eq(vagasApplications.id, id)).limit(1);
  return (row as ApplicationRecord) ?? null;
}

export async function markApplicationCompleted(applicationId: string, discReportId: string): Promise<ApplicationRecord> {
  const [row] = await db
    .update(vagasApplications)
    .set({ discReportId, status: "completed", updatedAt: sql`now()` })
    .where(eq(vagasApplications.id, applicationId))
    .returning();
  return row as ApplicationRecord;
}
