import { isValidCustomApplicationField } from "../../shared/application-fields";
import { validateSalaryAndScheduleFields } from "../../shared/job-field-validation";
import type { JobValidationError } from "../create-job/validation";
import type { UpdateJobInput } from "./types";

export function validateUpdateJobInput(input: UpdateJobInput): JobValidationError | null {
  if (input.jobId.trim().length === 0) {
    return { code: "vagas.invalid_id", message: "jobId não pode ser vazio." };
  }
  if (input.title.trim().length === 0) {
    return { code: "vagas.invalid_title", message: "O título da vaga não pode ser vazio." };
  }
  if (input.description.trim().length === 0) {
    return { code: "vagas.invalid_description", message: "A descrição da vaga não pode ser vazia." };
  }
  if (!input.customFormFields.every(isValidCustomApplicationField)) {
    return { code: "vagas.invalid_custom_form_fields", message: "Campo customizado do formulário inválido." };
  }
  return validateSalaryAndScheduleFields(input);
}
