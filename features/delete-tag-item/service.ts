import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { deleteTagItemById } from "./store";
import type { DeleteTagItemCommand, DeleteTagItemResult } from "./types";

export async function deleteTagItem(command: DeleteTagItemCommand): Promise<DeleteTagItemResult> {
  const handle = beginOperation({
    useCase: "vagas.delete-tag-item",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const deleted = await deleteTagItemById(command.tagItemId);
  if (!deleted) {
    const error = { code: "vagas.not_found", message: `Item "${command.tagItemId}" não encontrado.` };
    endOperation(handle, { success: false, error });
    return { success: false, error };
  }

  endOperation(handle, { success: true });
  return { success: true, data: { tagItemId: command.tagItemId } };
}
