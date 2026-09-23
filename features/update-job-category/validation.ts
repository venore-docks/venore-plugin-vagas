import type { JobValidationError } from "../create-job/validation";
import type { UpdateJobCategoryInput } from "./types";

export function validateUpdateJobCategoryInput(input: UpdateJobCategoryInput): JobValidationError | null {
  if (input.categoryId.trim().length === 0) {
    return { code: "vagas.invalid_id", message: "categoryId não pode ser vazio." };
  }
  if (input.name.trim().length === 0) {
    return { code: "vagas.invalid_category_name", message: "O nome da categoria não pode ser vazio." };
  }
  return null;
}
