import { isValidCustomApplicationField } from "../../shared/application-fields";
import type { JobValidationError } from "../create-job/validation";
import type { CreateFormTemplateInput } from "./types";

export function validateCreateFormTemplateInput(input: CreateFormTemplateInput): JobValidationError | null {
  if (input.name.trim().length === 0) {
    return { code: "vagas.invalid_template_name", message: "O nome do template não pode ser vazio." };
  }
  if (!input.fields.every(isValidCustomApplicationField)) {
    return { code: "vagas.invalid_custom_form_fields", message: "Campo customizado do template inválido." };
  }
  return null;
}
