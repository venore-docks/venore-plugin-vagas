import type { OperationResult } from "@venore/plugin-sdk";

export type ListJobTagsInput = { jobIds: string[] };
export type ListJobTagsResult = OperationResult<Record<string, string[]>>;
