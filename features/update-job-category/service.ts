import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { applyJobCategoryUpdate, findJobCategoryById } from "./store";
import type { UpdateJobCategoryCommand, UpdateJobCategoryResult } from "./types";

export async function updateJobCategory(command: UpdateJobCategoryCommand): Promise<UpdateJobCategoryResult> {
  const handle = beginOperation({
    useCase: "vagas.update-job-category",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const existing = await findJobCategoryById(command.categoryId);
  if (!existing) {
    const error = { code: "vagas.not_found", message: `Categoria "${command.categoryId}" não encontrada.` };
    endOperation(handle, { success: false, error });
    return { success: false, error };
  }

  const record = await applyJobCategoryUpdate({
    id: command.categoryId,
    name: command.name.trim(),
    coverMediaAssetId: command.coverMediaAssetId || null,
  });

  endOperation(handle, { success: true });
  return { success: true, data: record };
}
