import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { listJobs } from "./service";
import type { ListJobsResult } from "./types";

export async function listJobsHandler(): Promise<ListJobsResult> {
  const authz = await authorizeActor("vagas.read");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return listJobs();
}
