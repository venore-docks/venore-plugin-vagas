import type { OperationResult } from "@venore/plugin-sdk";
import type { JobRecord } from "../../contracts/types";

export type GetJobBySlugInput = { slug: string };
export type GetJobBySlugResult = OperationResult<JobRecord | null>;
