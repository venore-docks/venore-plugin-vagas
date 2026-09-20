import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { deleteJob } from "./service";
import type { DeleteJobInput, DeleteJobResult } from "./types";

export async function deleteJobHandler(input: DeleteJobInput): Promise<DeleteJobResult> {
  if (input.jobId.trim().length === 0) {
    return { success: false, error: { code: "vagas.invalid_id", message: "jobId não pode ser vazio." } };
  }

  const authz = await authorizeActor("vagas.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return deleteJob({ jobId: input.jobId, actorId: authz.actorId });
}
