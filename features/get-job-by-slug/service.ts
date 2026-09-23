import { resolveCoverImageUrls } from "../../shared/resolve-cover-image";
import { findOpenJobBySlug } from "./store";
import { toPublicJobDetailView } from "./view";
import type { GetJobBySlugInput, GetJobBySlugResult } from "./types";

export async function getJobBySlug(input: GetJobBySlugInput): Promise<GetJobBySlugResult> {
  const record = await findOpenJobBySlug(input.slug);
  if (!record) {
    return { success: true, data: null };
  }

  const coverImageUrls = await resolveCoverImageUrls([record]);
  return { success: true, data: toPublicJobDetailView(record, coverImageUrls.get(record.id) ?? null) };
}
