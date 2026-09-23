import type { OperationResult } from "@venore/plugin-sdk";
import type { ContractType, CustomApplicationField, SalaryType, ScheduleType, WeekDay } from "../../contracts/types";

// Projeção pública — não é o JobRecord cru (evita vazar createdByUserId, categoryId interno,
// discEnvironmentLabel, managerEmail etc.), e já vem com a capa e os labels de tag resolvidos.
export type PublicJobDetailView = {
  id: string;
  title: string;
  slug: string;
  department: string | null;
  location: string | null;
  description: string;
  requirements: string | null;
  applyContact: string | null;
  coverImageUrl: string | null;
  customFormFields: CustomApplicationField[];
  requiresDisc: boolean;
  salaryType: SalaryType;
  salaryAmount: string | null;
  contractRegimeLabel: string | null;
  contractType: ContractType | null;
  scheduleType: ScheduleType;
  weeklyHours: string | null;
  dailyStartTime: string | null;
  dailyEndTime: string | null;
  scheduleWeekDays: WeekDay[];
  benefits: string[];
  knowledge: string[];
  skills: string[];
  attitudes: string[];
  activities: string[];
  closesAt: Date | null;
  publishedAt: Date | null;
};

export type GetJobBySlugInput = { slug: string };
export type GetJobBySlugResult = OperationResult<PublicJobDetailView | null>;
