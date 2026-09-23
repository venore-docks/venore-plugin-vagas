import type { OperationResult } from "@venore/plugin-sdk";

export type DeleteFormTemplateCommand = { templateId: string; actorId: string };
export type DeleteFormTemplateInput = Omit<DeleteFormTemplateCommand, "actorId">;
export type DeleteFormTemplateResult = OperationResult<{ templateId: string }>;
