import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { createJob } from "./service";
import { validateCreateJobInput } from "./validation";
import type { CreateJobInput, CreateJobResult } from "./types";

export async function createJobHandler(input: CreateJobInput): Promise<CreateJobResult> {
  const validationError = validateCreateJobInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const authz = await authorizeActor("vagas.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return createJob({ ...input, actorId: authz.actorId });
}
