import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { createJobCategory } from "./service";
import { validateCreateJobCategoryInput } from "./validation";
import type { CreateJobCategoryInput, CreateJobCategoryResult } from "./types";

export async function createJobCategoryHandler(input: CreateJobCategoryInput): Promise<CreateJobCategoryResult> {
  const validationError = validateCreateJobCategoryInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const authz = await authorizeActor("vagas.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return createJobCategory({ ...input, actorId: authz.actorId });
}
