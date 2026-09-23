import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { listFormTemplates } from "./service";
import type { ListFormTemplatesResult } from "./types";

export async function listFormTemplatesHandler(): Promise<ListFormTemplatesResult> {
  const authz = await authorizeActor("vagas.read");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }
  return listFormTemplates();
}
