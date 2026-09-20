import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { updateJob } from "./service";
import { validateUpdateJobInput } from "./validation";
import type { UpdateJobInput, UpdateJobResult } from "./types";

export async function updateJobHandler(input: UpdateJobInput): Promise<UpdateJobResult> {
  const validationError = validateUpdateJobInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const authz = await authorizeActor("vagas.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return updateJob({ ...input, actorId: authz.actorId });
}
