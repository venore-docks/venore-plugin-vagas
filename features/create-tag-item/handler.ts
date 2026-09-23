import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { createTagItem } from "./service";
import { validateCreateTagItemInput } from "./validation";
import type { CreateTagItemInput, CreateTagItemResult } from "./types";

export async function createTagItemHandler(input: CreateTagItemInput): Promise<CreateTagItemResult> {
  const validationError = validateCreateTagItemInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const authz = await authorizeActor("vagas.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return createTagItem({ ...input, actorId: authz.actorId });
}
