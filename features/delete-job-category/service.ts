import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { deleteJobCategoryById } from "./store";
import type { DeleteJobCategoryCommand, DeleteJobCategoryResult } from "./types";

export async function deleteJobCategory(command: DeleteJobCategoryCommand): Promise<DeleteJobCategoryResult> {
  const handle = beginOperation({
    useCase: "vagas.delete-job-category",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const deleted = await deleteJobCategoryById(command.categoryId);
  if (!deleted) {
    const error = { code: "vagas.not_found", message: `Categoria "${command.categoryId}" não encontrada.` };
    endOperation(handle, { success: false, error });
    return { success: false, error };
  }

  endOperation(handle, { success: true });
  return { success: true, data: { categoryId: command.categoryId } };
}
