import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { updateJobCategory } from "./service";
import { validateUpdateJobCategoryInput } from "./validation";
import type { UpdateJobCategoryInput, UpdateJobCategoryResult } from "./types";

export async function updateJobCategoryHandler(input: UpdateJobCategoryInput): Promise<UpdateJobCategoryResult> {
  const validationError = validateUpdateJobCategoryInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const authz = await authorizeActor("vagas.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return updateJobCategory({ ...input, actorId: authz.actorId });
}
