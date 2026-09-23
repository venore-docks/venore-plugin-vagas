import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { applyTagItemUpdate, findTagItemById } from "./store";
import type { UpdateTagItemCommand, UpdateTagItemResult } from "./types";

export async function updateTagItem(command: UpdateTagItemCommand): Promise<UpdateTagItemResult> {
  const handle = beginOperation({
    useCase: "vagas.update-tag-item",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const existing = await findTagItemById(command.tagItemId);
  if (!existing) {
    const error = { code: "vagas.not_found", message: `Item "${command.tagItemId}" não encontrado.` };
    endOperation(handle, { success: false, error });
    return { success: false, error };
  }

  try {
    const record = await applyTagItemUpdate(command.tagItemId, command.label.trim());
    endOperation(handle, { success: true });
    return { success: true, data: record };
  } catch (cause) {
    const isUniqueViolation = cause instanceof Error && "code" in cause && (cause as { code?: string }).code === "23505";
    const error = isUniqueViolation
      ? { code: "vagas.tag_item_already_exists", message: `"${command.label}" já existe nessa lista.` }
      : { code: "vagas.tag_item_update_failed", message: "Não foi possível atualizar o item." };
    endOperation(handle, { success: false, error });
    if (isUniqueViolation) return { success: false, error };
    throw cause;
  }
}
