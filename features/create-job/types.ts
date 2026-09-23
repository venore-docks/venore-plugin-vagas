import type { OperationResult } from "@venore/plugin-sdk";
import type { CustomApplicationField, JobRecord, JobStatus } from "../../contracts/types";

export type CreateJobCommand = {
  title: string;
  department?: string | null;
  location?: string | null;
  description: string;
  requirements?: string | null;
  applyContact?: string | null;
  status?: JobStatus;
  categoryId?: string | null;
  coverMediaAssetId?: string | null;
  customFormFields?: CustomApplicationField[];
  requiresDisc?: boolean;
  actorId: string;
};

export type CreateJobInput = Omit<CreateJobCommand, "actorId">;
export type CreateJobResult = OperationResult<JobRecord>;
