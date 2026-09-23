import type { OperationResult } from "@venore/plugin-sdk";
import type { JobCategoryRecord } from "../../contracts/types";

export type CreateJobCategoryCommand = {
  name: string;
  coverMediaAssetId?: string | null;
  actorId: string;
};

export type CreateJobCategoryInput = Omit<CreateJobCategoryCommand, "actorId">;
export type CreateJobCategoryResult = OperationResult<JobCategoryRecord>;
