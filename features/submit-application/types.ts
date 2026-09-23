import type { OperationResult } from "@venore/plugin-sdk";
import type { ApplicationRecord } from "../../contracts/types";

export type SubmitApplicationResumeFile = {
  filename: string;
  contentType: string;
  size: number;
  data: Buffer;
};

// Sem actorId — candidatura é sempre anônima (ver shared/disc-bridge.ts e o comentário em
// service.ts sobre o upload de currículo público).
export type SubmitApplicationInput = {
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string | null;
  formResponses: Record<string, string | boolean>;
  resume: SubmitApplicationResumeFile;
};

export type SubmitApplicationOutcome = {
  application: ApplicationRecord;
  // Pra onde mandar o candidato a seguir: /disc/teste?slug=... quando a vaga exige DISC e o
  // plugin está ativo, senão a própria página de confirmação do vagas.
  nextUrl: string;
};

export type SubmitApplicationResult = OperationResult<SubmitApplicationOutcome>;
