import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { insertJob } from "./store";
import type { CreateJobCommand, CreateJobResult } from "./types";

export async function createJob(command: CreateJobCommand): Promise<CreateJobResult> {
  const handle = beginOperation({
    useCase: "vagas.create-job",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const record = await insertJob(command);

  endOperation(handle, { success: true });
  return { success: true, data: record };
}
