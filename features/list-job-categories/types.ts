import type { OperationResult } from "@venore/plugin-sdk";
import type { JobCategoryRecord } from "../../contracts/types";

export type ListJobCategoriesResult = OperationResult<JobCategoryRecord[]>;
