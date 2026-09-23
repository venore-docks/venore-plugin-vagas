import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { applyFormTemplateUpdate, findFormTemplateById } from "./store";
import type { UpdateFormTemplateCommand, UpdateFormTemplateResult } from "./types";

export async function updateFormTemplate(command: UpdateFormTemplateCommand): Promise<UpdateFormTemplateResult> {
  const handle = beginOperation({
    useCase: "vagas.update-form-template",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const existing = await findFormTemplateById(command.templateId);
  if (!existing) {
    const error = { code: "vagas.not_found", message: `Template "${command.templateId}" não encontrado.` };
    endOperation(handle, { success: false, error });
    return { success: false, error };
  }

  const record = await applyFormTemplateUpdate({ id: command.templateId, name: command.name.trim(), fields: command.fields });

  endOperation(handle, { success: true });
  return { success: true, data: record };
}
