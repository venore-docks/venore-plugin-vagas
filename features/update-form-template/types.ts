import type { OperationResult } from "@venore/plugin-sdk";
import type { CustomApplicationField, FormTemplateRecord } from "../../contracts/types";

export type UpdateFormTemplateCommand = {
  templateId: string;
  name: string;
  fields: CustomApplicationField[];
  actorId: string;
};
export type UpdateFormTemplateInput = Omit<UpdateFormTemplateCommand, "actorId">;
export type UpdateFormTemplateResult = OperationResult<FormTemplateRecord>;
