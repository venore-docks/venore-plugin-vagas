import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { deleteJobById } from "./store";
import type { DeleteJobCommand, DeleteJobResult } from "./types";

export async function deleteJob(command: DeleteJobCommand): Promise<DeleteJobResult> {
  const handle = beginOperation({
    useCase: "vagas.delete-job",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const deleted = await deleteJobById(command.jobId);
  if (!deleted) {
    const error = { code: "vagas.not_found", message: `Vaga "${command.jobId}" não encontrada.` };
    endOperation(handle, { success: false, error });
    return { success: false, error };
  }

  endOperation(handle, { success: true });
  return { success: true, data: { jobId: command.jobId } };
}
