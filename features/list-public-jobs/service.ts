import { resolveCoverImageUrls } from "../../shared/resolve-cover-image";
import { findOpenJobs } from "./store";
import { toPublicJobView } from "./view";
import type { ListPublicJobsResult } from "./types";

export async function listPublicJobs(): Promise<ListPublicJobsResult> {
  const records = await findOpenJobs();
  const coverImageUrls = await resolveCoverImageUrls(records);
  return { success: true, data: records.map((record) => toPublicJobView(record, coverImageUrls.get(record.id) ?? null)) };
}
