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
  publishedAt: Date | null;
  closesAt: Date | null;
  createdByUserId: string | null;
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
