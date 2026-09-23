import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { deleteJobCategory } from "./service";
import type { DeleteJobCategoryInput, DeleteJobCategoryResult } from "./types";

export async function deleteJobCategoryHandler(input: DeleteJobCategoryInput): Promise<DeleteJobCategoryResult> {
  if (input.categoryId.trim().length === 0) {
    return { success: false, error: { code: "vagas.invalid_id", message: "categoryId não pode ser vazio." } };
  }

  const authz = await authorizeActor("vagas.manage");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  // FK onDelete "restrict" (jobs.categoryId) — se alguma vaga ainda usa a categoria, o Postgres
  // recusa a exclusão; deixamos o erro (código 23503) borbulhar como falha genérica pro handler
  // devolver, sem precisar de um select prévio só pra checar uso (mesma economia de round-trip do
  // resto do plugin — ver comentário em create-job/store.ts sobre não checar disponibilidade antes).
  try {
    return await deleteJobCategory({ categoryId: input.categoryId, actorId: authz.actorId });
  } catch (cause) {
    const isForeignKeyViolation = cause instanceof Error && "code" in cause && (cause as { code?: string }).code === "23503";
    if (isForeignKeyViolation) {
      return {
        success: false,
        error: { code: "vagas.category_in_use", message: "Existem vagas usando esta categoria — mude a categoria delas antes de excluir." },
      };
    }
    throw cause;
  }
}
