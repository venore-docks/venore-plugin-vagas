import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { applyJobUpdate, findJobById } from "./store";
import type { UpdateJobCommand, UpdateJobResult } from "./types";

export async function updateJob(command: UpdateJobCommand): Promise<UpdateJobResult> {
  const handle = beginOperation({
    useCase: "vagas.update-job",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const existing = await findJobById(command.jobId);
  if (!existing) {
    const error = { code: "vagas.not_found", message: `Vaga "${command.jobId}" não encontrada.` };
    endOperation(handle, { success: false, error });
    return { success: false, error };
  }

  const record = await applyJobUpdate({
    id: command.jobId,
    title: command.title.trim(),
    department: command.department?.trim() || null,
    location: command.location?.trim() || null,
    description: command.description.trim(),
    requirements: command.requirements?.trim() || null,
    applyContact: command.applyContact?.trim() || null,
    status: command.status,
  });

  endOperation(handle, { success: true });
  return { success: true, data: record };
}
