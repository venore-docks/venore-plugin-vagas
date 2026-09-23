import type { OperationResult } from "@venore/plugin-sdk";
import type { CustomApplicationField, FormTemplateRecord } from "../../contracts/types";

export type CreateFormTemplateCommand = { name: string; fields: CustomApplicationField[]; actorId: string };
export type CreateFormTemplateInput = Omit<CreateFormTemplateCommand, "actorId">;
export type CreateFormTemplateResult = OperationResult<FormTemplateRecord>;
