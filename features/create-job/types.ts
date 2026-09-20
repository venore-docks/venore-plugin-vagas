import type { OperationResult } from "@venore/plugin-sdk";
import type { JobRecord, JobStatus } from "../../contracts/types";

export type CreateJobCommand = {
  title: string;
  department?: string | null;
  location?: string | null;
  description: string;
  requirements?: string | null;
  applyContact?: string | null;
  status?: JobStatus;
  actorId: string;
};

export type CreateJobInput = Omit<CreateJobCommand, "actorId">;
export type CreateJobResult = OperationResult<JobRecord>;
