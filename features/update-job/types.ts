import type { OperationResult } from "@venore/plugin-sdk";
import type { CustomApplicationField, JobRecord, JobStatus } from "../../contracts/types";

export type UpdateJobCommand = {
  jobId: string;
  title: string;
  department?: string | null;
  location?: string | null;
  description: string;
  requirements?: string | null;
  applyContact?: string | null;
  status: JobStatus;
  // Substituição completa (mesma semântica dos campos acima) — o form de edição sempre reenvia
  // os quatro, "limpar categoria/capa" é um valor null explícito, não ausência do campo.
  categoryId: string | null;
  coverMediaAssetId: string | null;
  customFormFields: CustomApplicationField[];
  requiresDisc: boolean;
  actorId: string;
};

export type UpdateJobInput = Omit<UpdateJobCommand, "actorId">;
export type UpdateJobResult = OperationResult<JobRecord>;
