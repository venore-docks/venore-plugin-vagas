import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { listJobCategories } from "./service";
import type { ListJobCategoriesResult } from "./types";

export async function listJobCategoriesHandler(): Promise<ListJobCategoriesResult> {
  const authz = await authorizeActor("vagas.read");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return listJobCategories();
}
