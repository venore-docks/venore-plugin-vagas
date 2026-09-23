import type { OperationResult } from "@venore/plugin-sdk";
import type { ContractType, CustomApplicationField, JobRecord, JobStatus, SalaryType, ScheduleType, WeekDay } from "../../contracts/types";

export type CreateJobCommand = {
  title: string;
  department?: string | null;
  location?: string | null;
  description: string;
  requirements?: string | null;
  applyContact?: string | null;
  status?: JobStatus;
  categoryId?: string | null;
  coverMediaAssetId?: string | null;
  customFormFields?: CustomApplicationField[];
  requiresDisc?: boolean;
  discEnvironmentLabel?: string | null;
  salaryType?: SalaryType;
  salaryAmount?: string | null;
  contractRegimeId?: string | null;
  contractType?: ContractType | null;
  scheduleType?: ScheduleType;
  weeklyHours?: string | null;
  dailyStartTime?: string | null;
  dailyEndTime?: string | null;
  scheduleWeekDays?: WeekDay[];
  managerEmail?: string | null;
  closesAt?: Date | null;
  benefitIds?: string[];
  knowledgeIds?: string[];
  skillIds?: string[];
  attitudeIds?: string[];
  activityIds?: string[];
  actorId: string;
};

export type CreateJobInput = Omit<CreateJobCommand, "actorId">;
export type CreateJobResult = OperationResult<JobRecord>;
