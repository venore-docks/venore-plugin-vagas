import { getJobBySlug } from "./service";
import type { GetJobBySlugInput, GetJobBySlugResult } from "./types";

// Sem authorizeActor de propósito — detalhe de vaga aberta é público, mesmo racional de
// list-public-jobs.
export async function getJobBySlugHandler(input: GetJobBySlugInput): Promise<GetJobBySlugResult> {
  return getJobBySlug(input);
}
