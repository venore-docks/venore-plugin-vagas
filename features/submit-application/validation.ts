import type { SubmitApplicationInput } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ApplicationValidationError = { code: string; message: string };

// Só o que não depende de buscar a vaga no banco (nome/e-mail/currículo) — obrigatoriedade dos
// campos customizados é checada em service.ts, depois de carregar job.customFormFields.
export function validateSubmitApplicationInput(input: SubmitApplicationInput): ApplicationValidationError | null {
  if (input.jobId.trim().length === 0) {
    return { code: "vagas.invalid_id", message: "jobId não pode ser vazio." };
  }
  if (input.candidateName.trim().length === 0) {
    return { code: "vagas.invalid_candidate_name", message: "Informe seu nome." };
  }
  if (!EMAIL_PATTERN.test(input.candidateEmail.trim())) {
    return { code: "vagas.invalid_candidate_email", message: "Informe um e-mail válido." };
  }
  if (input.resume.size <= 0) {
    return { code: "vagas.invalid_resume", message: "Anexe seu currículo em PDF." };
  }
  if (input.resume.contentType !== "application/pdf") {
    return { code: "vagas.invalid_resume_type", message: "O currículo precisa ser um arquivo PDF." };
  }
  return null;
}
