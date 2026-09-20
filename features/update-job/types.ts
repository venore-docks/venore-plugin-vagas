import type { OperationResult } from "@venore/plugin-sdk";
import type { JobRecord, JobStatus } from "../../contracts/types";

export type UpdateJobCommand = {
  jobId: string;
  title: string;
  department?: string | null;
  location?: string | null;
  description: string;
  requirements?: string | null;
  applyContact?: string | null;
  status: JobStatus;
  actorId: string;
};

export type UpdateJobInput = Omit<UpdateJobCommand, "actorId">;
export type UpdateJobResult = OperationResult<JobRecord>;
