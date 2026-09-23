import { and, eq, sql } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { vagasApplications, vagasJobs } from "../../database/schema";
import type { ApplicationRecord, JobRecord } from "../../contracts/types";

// Mesma checagem de status='open' de get-job-by-slug/store.ts — reconfirmada aqui porque a
// candidatura pode chegar minutos depois de a página ter sido carregada (vaga pode ter fechado
// nesse meio tempo).
export async function findOpenJobById(id: string): Promise<JobRecord | null> {
  const [row] = await db
    .select()
    .from(vagasJobs)
    .where(and(eq(vagasJobs.id, id), eq(vagasJobs.status, "open")))
    .limit(1);
  return (row as JobRecord) ?? null;
}

export async function insertApplication(input: {
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string | null;
  resumeMediaAssetId: string;
  formResponses: Record<string, string | boolean>;
}): Promise<ApplicationRecord> {
  const [row] = await db.insert(vagasApplications).values(input).returning();
  return row as ApplicationRecord;
}

export async function markApplicationAwaitingDisc(applicationId: string, discInstanceId: string): Promise<ApplicationRecord> {
  const [row] = await db
    .update(vagasApplications)
    .set({ discInstanceId, status: "awaiting_disc", updatedAt: sql`now()` })
    .where(eq(vagasApplications.id, applicationId))
    .returning();
  return row as ApplicationRecord;
}
