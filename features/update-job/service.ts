import { beginOperation, endOperation } from "@venore/plugin-sdk/observability";
import { syncJobTags } from "../../shared/job-tags";
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
    categoryId: command.categoryId,
    coverMediaAssetId: command.coverMediaAssetId,
    customFormFields: command.customFormFields,
    requiresDisc: command.requiresDisc,
    discEnvironmentLabel: command.discEnvironmentLabel?.trim() || null,
    salaryType: command.salaryType,
    salaryAmount: command.salaryAmount,
    contractRegimeId: command.contractRegimeId,
    contractType: command.contractType,
    scheduleType: command.scheduleType,
    weeklyHours: command.weeklyHours,
    dailyStartTime: command.dailyStartTime,
    dailyEndTime: command.dailyEndTime,
    scheduleWeekDays: command.scheduleWeekDays,
    managerEmail: command.managerEmail?.trim() || null,
    closesAt: command.closesAt,
  });

  const allTagIds = [...command.benefitIds, ...command.knowledgeIds, ...command.skillIds, ...command.attitudeIds, ...command.activityIds];
  await syncJobTags(command.jobId, allTagIds);

  endOperation(handle, { success: true });
  return { success: true, data: record };
}
