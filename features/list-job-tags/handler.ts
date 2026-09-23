import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { findJobTagIdsForJobs } from "../../shared/job-tags";
import type { ListJobTagsInput, ListJobTagsResult } from "./types";

// Usado pelo admin (edit-job-form) pra pré-selecionar os TagPicker de cada vaga — devolve um mapa
// jobId -> tagItemIds solto (agrupar por categoria é responsabilidade de quem chama, ver
// shared/job-tags.ts#groupTagIdsByCategory).
export async function listJobTagsHandler(input: ListJobTagsInput): Promise<ListJobTagsResult> {
  const authz = await authorizeActor("vagas.read");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  const map = await findJobTagIdsForJobs(input.jobIds);
  return { success: true, data: Object.fromEntries(map) };
}
