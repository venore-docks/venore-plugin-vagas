import type { JobRecord } from "../../contracts/types";
import type { PublicJobView } from "./types";

export function toPublicJobView(record: JobRecord): PublicJobView {
  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    department: record.department,
    location: record.location,
    publishedAt: record.publishedAt,
  };
}
