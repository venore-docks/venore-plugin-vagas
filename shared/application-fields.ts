import type { ApplicationFieldType, CustomApplicationField } from "../contracts/types";

export const APPLICATION_FIELD_TYPES: Array<{ value: ApplicationFieldType; label: string }> = [
  { value: "text", label: "Texto curto" },
  { value: "textarea", label: "Texto longo" },
  { value: "select", label: "Lista de opções" },
  { value: "checkbox", label: "Caixa de marcar" },
];

// Formulário básico é fixo no código (nome/e-mail/telefone) — nunca editável pelo RH, sempre
// presente em toda candidatura. customFormFields (por vaga) só soma campos extras a ele.
export function isValidCustomApplicationField(field: unknown): field is CustomApplicationField {
  if (typeof field !== "object" || field === null) return false;
  const candidate = field as Partial<CustomApplicationField>;
  const validType = APPLICATION_FIELD_TYPES.some((option) => option.value === candidate.type);
  return (
    typeof candidate.id === "string" &&
    candidate.id.trim().length > 0 &&
    typeof candidate.label === "string" &&
    candidate.label.trim().length > 0 &&
    validType &&
    typeof candidate.required === "boolean"
  );
}

// Confere obrigatoriedade dos campos extras contra as respostas enviadas — não valida o
// formulário básico (nome/e-mail/telefone têm campo próprio, validados à parte).
export function findMissingRequiredField(
  fields: CustomApplicationField[],
  responses: Record<string, string | boolean>,
): CustomApplicationField | null {
  for (const field of fields) {
    if (!field.required) continue;
    const value = responses[field.id];
    if (field.type === "checkbox") {
      if (value !== true) return field;
      continue;
    }
    if (typeof value !== "string" || value.trim().length === 0) return field;
  }
  return null;
}
