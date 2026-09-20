import { eq, sql } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { vagasJobs } from "../../database/schema";
import type { JobRecord } from "../../contracts/types";

export async function findJobById(id: string): Promise<JobRecord | null> {
  const [row] = await db.select().from(vagasJobs).where(eq(vagasJobs.id, id)).limit(1);
  return (row as JobRecord) ?? null;
}

export async function applyJobUpdate(input: {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  description: string;
  requirements: string | null;
  applyContact: string | null;
  status: JobRecord["status"];
}): Promise<JobRecord> {
  const [row] = await db
    .update(vagasJobs)
    .set({
      title: input.title,
      department: input.department,
      location: input.location,
      description: input.description,
      requirements: input.requirements,
      applyContact: input.applyContact,
      status: input.status,
      updatedAt: sql`now()`,
    })
    .where(eq(vagasJobs.id, input.id))
    .returning();

  return row as JobRecord;
}
