import type { OperationResult } from "@venore/plugin-sdk";

export type PublicJobView = {
  id: string;
  title: string;
  slug: string;
  department: string | null;
  location: string | null;
  publishedAt: Date | null;
};

export type ListPublicJobsResult = OperationResult<PublicJobView[]>;
