import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { insertFormTemplate } from "./store";
import type { CreateFormTemplateCommand, CreateFormTemplateResult } from "./types";

export async function createFormTemplate(command: CreateFormTemplateCommand): Promise<CreateFormTemplateResult> {
  const handle = beginOperation({
    useCase: "vagas.create-form-template",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const record = await insertFormTemplate(command);

  endOperation(handle, { success: true });
  return { success: true, data: record };
}
