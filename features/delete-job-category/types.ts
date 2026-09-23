import type { OperationResult } from "@venore/plugin-sdk";

export type DeleteJobCategoryCommand = { categoryId: string; actorId: string };
export type DeleteJobCategoryInput = Omit<DeleteJobCategoryCommand, "actorId">;
export type DeleteJobCategoryResult = OperationResult<{ categoryId: string }>;
