import { isTagCategory } from "../../shared/tag-categories";
import type { JobValidationError } from "../create-job/validation";
import type { CreateTagItemInput } from "./types";

export function validateCreateTagItemInput(input: CreateTagItemInput): JobValidationError | null {
  if (!isTagCategory(input.category)) {
    return { code: "vagas.invalid_tag_category", message: `Categoria de tag inválida: "${input.category}".` };
  }
  if (input.label.trim().length === 0) {
    return { code: "vagas.invalid_tag_label", message: "O nome do item não pode ser vazio." };
  }
  return null;
}
