import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { insertTagItem } from "./store";
import type { CreateTagItemCommand, CreateTagItemResult } from "./types";

export async function createTagItem(command: CreateTagItemCommand): Promise<CreateTagItemResult> {
  const handle = beginOperation({
    useCase: "vagas.create-tag-item",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  try {
    const record = await insertTagItem(command);
    endOperation(handle, { success: true });
    return { success: true, data: record };
  } catch (cause) {
    const isUniqueViolation = cause instanceof Error && "code" in cause && (cause as { code?: string }).code === "23505";
    const error = isUniqueViolation
      ? { code: "vagas.tag_item_already_exists", message: `"${command.label}" já existe nessa lista.` }
      : { code: "vagas.tag_item_insert_failed", message: "Não foi possível cadastrar o item." };
    endOperation(handle, { success: false, error });
    if (isUniqueViolation) return { success: false, error };
    throw cause;
  }
}
