import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { updateFormTemplate } from "./service";
import { validateUpdateFormTemplateInput } from "./validation";
import type { UpdateFormTemplateInput, UpdateFormTemplateResult } from "./types";

export async function updateFormTemplateHandler(input: UpdateFormTemplateInput): Promise<UpdateFormTemplateResult> {
  const validationError = validateUpdateFormTemplateInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const authz = await authorizeActor("vagas.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return updateFormTemplate({ ...input, actorId: authz.actorId });
}
