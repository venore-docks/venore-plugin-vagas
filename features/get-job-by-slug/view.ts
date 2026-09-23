import type { JobRecord } from "../../contracts/types";
import type { PublicJobDetailView } from "./types";

export function toPublicJobDetailView(record: JobRecord, coverImageUrl: string | null): PublicJobDetailView {
  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    department: record.department,
    location: record.location,
    description: record.description,
    requirements: record.requirements,
    applyContact: record.applyContact,
    coverImageUrl,
    customFormFields: record.customFormFields,
    requiresDisc: record.requiresDisc,
    publishedAt: record.publishedAt,
  };
}
