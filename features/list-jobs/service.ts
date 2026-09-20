import { findAllJobs } from "./store";
import type { ListJobsResult } from "./types";

export async function listJobs(): Promise<ListJobsResult> {
  return { success: true, data: await findAllJobs() };
}
