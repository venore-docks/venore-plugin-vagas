import { desc, eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { vagasJobs } from "../../database/schema";
import type { JobRecord } from "../../contracts/types";

export async function findOpenJobs(): Promise<JobRecord[]> {
  const rows = await db
    .select()
    .from(vagasJobs)
    .where(eq(vagasJobs.status, "open"))
    .orderBy(desc(vagasJobs.publishedAt));
  return rows as JobRecord[];
}
