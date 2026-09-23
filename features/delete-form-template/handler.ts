import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { deleteFormTemplate } from "./service";
import type { DeleteFormTemplateInput, DeleteFormTemplateResult } from "./types";

export async function deleteFormTemplateHandler(input: DeleteFormTemplateInput): Promise<DeleteFormTemplateResult> {
  if (input.templateId.trim().length === 0) {
    return { success: false, error: { code: "vagas.invalid_id", message: "templateId não pode ser vazio." } };
  }

  const authz = await authorizeActor("vagas.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return deleteFormTemplate({ templateId: input.templateId, actorId: authz.actorId });
}
