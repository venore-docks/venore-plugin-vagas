import { isValidCustomApplicationField } from "../../shared/application-fields";
import type { CreateJobInput } from "./types";

export type JobValidationError = { code: string; message: string };

export function validateCreateJobInput(input: CreateJobInput): JobValidationError | null {
  if (input.title.trim().length === 0) {
    return { code: "vagas.invalid_title", message: "O título da vaga não pode ser vazio." };
  }
  if (input.description.trim().length === 0) {
    return { code: "vagas.invalid_description", message: "A descrição da vaga não pode ser vazia." };
  }
  if (input.customFormFields && !input.customFormFields.every(isValidCustomApplicationField)) {
    return { code: "vagas.invalid_custom_form_fields", message: "Campo customizado do formulário inválido." };
  }
  return null;
}
