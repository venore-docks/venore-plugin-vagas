import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { deleteFormTemplateById } from "./store";
import type { DeleteFormTemplateCommand, DeleteFormTemplateResult } from "./types";

export async function deleteFormTemplate(command: DeleteFormTemplateCommand): Promise<DeleteFormTemplateResult> {
  const handle = beginOperation({
    useCase: "vagas.delete-form-template",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const deleted = await deleteFormTemplateById(command.templateId);
  if (!deleted) {
    const error = { code: "vagas.not_found", message: `Template "${command.templateId}" não encontrado.` };
    endOperation(handle, { success: false, error });
    return { success: false, error };
  }

  endOperation(handle, { success: true });
  return { success: true, data: { templateId: command.templateId } };
}
