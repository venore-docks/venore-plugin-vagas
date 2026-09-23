import type { OperationResult } from "@venore/plugin-sdk";
import type { JobCategoryRecord } from "../../contracts/types";

export type UpdateJobCategoryCommand = {
  categoryId: string;
  name: string;
  coverMediaAssetId?: string | null;
  actorId: string;
};

export type UpdateJobCategoryInput = Omit<UpdateJobCategoryCommand, "actorId">;
export type UpdateJobCategoryResult = OperationResult<JobCategoryRecord>;
