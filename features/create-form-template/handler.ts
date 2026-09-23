import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { createFormTemplate } from "./service";
import { validateCreateFormTemplateInput } from "./validation";
import type { CreateFormTemplateInput, CreateFormTemplateResult } from "./types";

export async function createFormTemplateHandler(input: CreateFormTemplateInput): Promise<CreateFormTemplateResult> {
  const validationError = validateCreateFormTemplateInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const authz = await authorizeActor("vagas.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return createFormTemplate({ ...input, actorId: authz.actorId });
}
