import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { updateTagItem } from "./service";
import type { UpdateTagItemInput, UpdateTagItemResult } from "./types";

export async function updateTagItemHandler(input: UpdateTagItemInput): Promise<UpdateTagItemResult> {
  if (input.tagItemId.trim().length === 0) {
    return { success: false, error: { code: "vagas.invalid_id", message: "tagItemId não pode ser vazio." } };
  }
  if (input.label.trim().length === 0) {
    return { success: false, error: { code: "vagas.invalid_tag_label", message: "O nome do item não pode ser vazio." } };
  }

  const authz = await authorizeActor("vagas.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return updateTagItem({ ...input, actorId: authz.actorId });
}
