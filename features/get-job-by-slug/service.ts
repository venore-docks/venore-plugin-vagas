import { findOpenJobBySlug } from "./store";
import type { GetJobBySlugInput, GetJobBySlugResult } from "./types";

export async function getJobBySlug(input: GetJobBySlugInput): Promise<GetJobBySlugResult> {
  return { success: true, data: await findOpenJobBySlug(input.slug) };
}
