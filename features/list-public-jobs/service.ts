import { findOpenJobs } from "./store";
import { toPublicJobView } from "./view";
import type { ListPublicJobsResult } from "./types";

export async function listPublicJobs(): Promise<ListPublicJobsResult> {
  const records = await findOpenJobs();
  return { success: true, data: records.map(toPublicJobView) };
}
