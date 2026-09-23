import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { listApplications } from "./service";
import type { ListApplicationsInput, ListApplicationsResult } from "./types";

export async function listApplicationsHandler(input: ListApplicationsInput): Promise<ListApplicationsResult> {
  if (input.jobId.trim().length === 0) {
    return { success: false, error: { code: "vagas.invalid_id", message: "jobId não pode ser vazio." } };
  }

  const authz = await authorizeActor("vagas.applications.review");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return listApplications(input);
}
