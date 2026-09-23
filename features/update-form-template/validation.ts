import { isValidCustomApplicationField } from "../../shared/application-fields";
import type { JobValidationError } from "../create-job/validation";
import type { UpdateFormTemplateInput } from "./types";

export function validateUpdateFormTemplateInput(input: UpdateFormTemplateInput): JobValidationError | null {
  if (input.templateId.trim().length === 0) {
    return { code: "vagas.invalid_id", message: "templateId não pode ser vazio." };
  }
  if (input.name.trim().length === 0) {
    return { code: "vagas.invalid_template_name", message: "O nome do template não pode ser vazio." };
  }
  if (!input.fields.every(isValidCustomApplicationField)) {
    return { code: "vagas.invalid_custom_form_fields", message: "Campo customizado do template inválido." };
  }
  return null;
}
