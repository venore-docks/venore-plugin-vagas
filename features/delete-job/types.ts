import type { OperationResult } from "@venore/plugin-sdk";

export type DeleteJobCommand = { jobId: string; actorId: string };
export type DeleteJobInput = Omit<DeleteJobCommand, "actorId">;
export type DeleteJobResult = OperationResult<{ jobId: string }>;
