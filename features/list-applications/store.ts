import { desc, eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { vagasApplications } from "../../database/schema";
import type { ApplicationRecord } from "../../contracts/types";

export async function findApplicationsByJobId(jobId: string): Promise<ApplicationRecord[]> {
  const rows = await db
    .select()
    .from(vagasApplications)
    .where(eq(vagasApplications.jobId, jobId))
    .orderBy(desc(vagasApplications.createdAt));
  return rows as ApplicationRecord[];
}
