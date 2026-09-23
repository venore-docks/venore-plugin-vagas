import { eq, inArray } from "drizzle-orm";
import { db } from "@venore/plugin-sdk";
import { vagasJobTags } from "../database/schema";

// Server-only (usa db diretamente) — nunca importar isto de um "use client" (ver
// shared/group-job-tags.ts pra função pura equivalente do lado UI).

// Substituição completa (mesma semântica de customFormFields/requiresDisc em update-job) — apaga
// todos os vínculos da vaga e reinsere os atuais, num único ponto reusado por create-job e
// update-job. category não importa aqui: quem já sabe a categoria de cada id é quem chama
// (job-fields.tsx manda os 5 grupos já separados só pra UI; aqui tudo vira uma lista só, porque
// tag_items.category já é a fonte da verdade de qual grupo cada tag pertence).
export async function syncJobTags(jobId: string, tagItemIds: string[]): Promise<void> {
  await db.delete(vagasJobTags).where(eq(vagasJobTags.jobId, jobId));
  if (tagItemIds.length > 0) {
    await db.insert(vagasJobTags).values(tagItemIds.map((tagItemId) => ({ jobId, tagItemId })));
  }
}

export async function findJobTagIds(jobId: string): Promise<string[]> {
  const rows = await db.select({ tagItemId: vagasJobTags.tagItemId }).from(vagasJobTags).where(eq(vagasJobTags.jobId, jobId));
  return rows.map((row) => row.tagItemId);
}

export async function findJobTagIdsForJobs(jobIds: string[]): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  if (jobIds.length === 0) return map;

  const rows = await db
    .select({ jobId: vagasJobTags.jobId, tagItemId: vagasJobTags.tagItemId })
    .from(vagasJobTags)
    .where(inArray(vagasJobTags.jobId, jobIds));

  for (const row of rows) {
    const list = map.get(row.jobId) ?? [];
    list.push(row.tagItemId);
    map.set(row.jobId, list);
  }
  return map;
}
