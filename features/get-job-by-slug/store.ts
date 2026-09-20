import { and, eq } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { vagasJobs } from "../../database/schema";
import type { JobRecord } from "../../contracts/types";

export async function findOpenJobBySlug(slug: string): Promise<JobRecord | null> {
  const [row] = await db
    .select()
    .from(vagasJobs)
    .where(and(eq(vagasJobs.slug, slug), eq(vagasJobs.status, "open")))
    .limit(1);
  return (row as JobRecord) ?? null;
}
