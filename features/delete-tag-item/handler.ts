import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { deleteTagItem } from "./service";
import type { DeleteTagItemInput, DeleteTagItemResult } from "./types";

export async function deleteTagItemHandler(input: DeleteTagItemInput): Promise<DeleteTagItemResult> {
  if (input.tagItemId.trim().length === 0) {
    return { success: false, error: { code: "vagas.invalid_id", message: "tagItemId não pode ser vazio." } };
  }

  const authz = await authorizeActor("vagas.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  // job_tags.tagItemId e jobs.contractRegimeId têm onDelete diferentes (cascade / set null) —
  // apagar um item de catálogo NUNCA falha por FK, só desvincula silenciosamente das vagas que o
  // usavam. Diferente de delete-job-category (onDelete restrict), aqui não precisa tratar 23503.
  return deleteTagItem({ tagItemId: input.tagItemId, actorId: authz.actorId });
}
