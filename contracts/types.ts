export type JobStatus = "open" | "paused" | "closed";

export type ApplicationFieldType = "text" | "textarea" | "select" | "checkbox";

// Campo extra que o RH monta por vaga (formulário básico — nome/e-mail/telefone — é fixo no
// código, isto é só o que se soma a ele). id é a chave estável usada em
// ApplicationRecord.formResponses, não muda mesmo se o label for editado depois.
export type CustomApplicationField = {
  id: string;
  label: string;
  type: ApplicationFieldType;
  required: boolean;
  options?: string[];
};

export type JobCategoryRecord = {
  id: string;
  key: string;
  slug: string;
  name: string;
  coverMediaAssetId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Catálogo único e compartilhado entre vagas — 5 grupos multi-seleção + "contract_regime"
// (single-select, referenciado direto por jobs.contractRegimeId).
export type TagCategory = "benefit" | "knowledge" | "skill" | "attitude" | "activity" | "contract_regime";

export type TagItemRecord = {
  id: string;
  category: TagCategory;
  label: string;
  createdAt: Date;
};

export type SalaryType = "fixed" | "hourly" | "negotiable" | "interview";
export type ContractType = "indeterminate" | "determinate";
export type ScheduleType = "fixed" | "weekly_hours";
export type WeekDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type JobRecord = {
  id: string;
  title: string;
  slug: string;
  department: string | null;
  location: string | null;
  description: string;
  requirements: string | null;
  applyContact: string | null;
  status: JobStatus;
  categoryId: string | null;
  coverMediaAssetId: string | null;
  customFormFields: CustomApplicationField[];
  requiresDisc: boolean;
  discEnvironmentLabel: string | null;
  // numeric no Postgres/Drizzle vem como string (evita perda de precisão de float em dinheiro) —
  // formatação pra exibição fica em shared/format-job-details.ts.
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
  publishedAt: Date | null;
  closesAt: Date | null;
  createdByUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type FormTemplateRecord = {
  id: string;
  name: string;
  fields: CustomApplicationField[];
  createdAt: Date;
  updatedAt: Date;
};

export type ApplicationStatus = "submitted" | "awaiting_disc" | "completed";

export type ApplicationRecord = {
  id: string;
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string | null;
  resumeMediaAssetId: string | null;
  formResponses: Record<string, string | boolean>;
  discInstanceId: string | null;
  discReportId: string | null;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
};
