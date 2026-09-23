import { resolveCoverImageUrls } from "../../shared/resolve-cover-image";
import { resolveJobTagLabels } from "../../shared/resolve-tag-labels";
import { findJobTagIds } from "../../shared/job-tags";
import { findOpenJobBySlug } from "./store";
import { toPublicJobDetailView } from "./view";
import type { GetJobBySlugInput, GetJobBySlugResult } from "./types";

export async function getJobBySlug(input: GetJobBySlugInput): Promise<GetJobBySlugResult> {
  const record = await findOpenJobBySlug(input.slug);
  if (!record) {
    return { success: true, data: null };
  }

  const [coverImageUrls, flatTagIds] = await Promise.all([resolveCoverImageUrls([record]), findJobTagIds(record.id)]);
  const tags = await resolveJobTagLabels(record, flatTagIds);

  return { success: true, data: toPublicJobDetailView(record, coverImageUrls.get(record.id) ?? null, tags) };
}
