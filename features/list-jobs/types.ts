import type { OperationResult } from "@venore/plugin-sdk";
import type { JobRecord } from "../../contracts/types";

export type ListJobsResult = OperationResult<JobRecord[]>;
