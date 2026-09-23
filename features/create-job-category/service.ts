import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { insertJobCategory } from "./store";
import type { CreateJobCategoryCommand, CreateJobCategoryResult } from "./types";

export async function createJobCategory(command: CreateJobCategoryCommand): Promise<CreateJobCategoryResult> {
  const handle = beginOperation({
    useCase: "vagas.create-job-category",
    actor: { id: command.actorId, type: "user" },
    kind: "write",
  });

  const record = await insertJobCategory(command);

  endOperation(handle, { success: true });
  return { success: true, data: record };
}
