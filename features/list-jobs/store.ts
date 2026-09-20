import { desc } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { vagasJobs } from "../../database/schema";
import type { JobRecord } from "../../contracts/types";

export async function findAllJobs(): Promise<JobRecord[]> {
  const rows = await db.select().from(vagasJobs).orderBy(desc(vagasJobs.createdAt));
  return rows as JobRecord[];
}
