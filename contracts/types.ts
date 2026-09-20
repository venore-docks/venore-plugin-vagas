export type JobStatus = "open" | "paused" | "closed";

export type JobRecord = {
  id: string;
  title: string;
  slug: string;
  department: string | null;
  location: string | null;
  description: string;
  requirements: string | null;
  applyContact: string | null;
  status: JobStatus;
  publishedAt: Date | null;
  closesAt: Date | null;
  createdByUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
};
