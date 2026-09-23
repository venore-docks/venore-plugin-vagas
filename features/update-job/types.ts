import type { OperationResult } from "@venore/plugin-sdk";
import type { ContractType, CustomApplicationField, JobRecord, JobStatus, SalaryType, ScheduleType, WeekDay } from "../../contracts/types";

export type UpdateJobCommand = {
  jobId: string;
  title: string;
  department?: string | null;
  location?: string | null;
  description: string;
  requirements?: string | null;
  applyContact?: string | null;
  status: JobStatus;
  // Substituição completa (mesma semântica dos campos abaixo) — o form de edição sempre reenvia
  // tudo, "limpar" é um valor null/[] explícito, não ausência do campo.
  categoryId: string | null;
  coverMediaAssetId: string | null;
  customFormFields: CustomApplicationField[];
  requiresDisc: boolean;
  discEnvironmentLabel: string | null;
  salaryType: SalaryType;
  salaryAmount: string | null;
  contractRegimeId: string | null;
  contractType: ContractType | null;
  scheduleType: ScheduleType;
  weeklyHours: string | null;
  dailyStartTime: string | null;
  dailyEndTime: string | null;
  scheduleWeekDays: WeekDay[];
  managerEmail: string | null;
  closesAt: Date | null;
  benefitIds: string[];
  knowledgeIds: string[];
  skillIds: string[];
  attitudeIds: string[];
  activityIds: string[];
  actorId: string;
};

export type UpdateJobInput = Omit<UpdateJobCommand, "actorId">;
export type UpdateJobResult = OperationResult<JobRecord>;
