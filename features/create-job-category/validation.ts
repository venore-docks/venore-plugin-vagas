import type { JobValidationError } from "../create-job/validation";
import type { CreateJobCategoryInput } from "./types";

export function validateCreateJobCategoryInput(input: CreateJobCategoryInput): JobValidationError | null {
  if (input.name.trim().length === 0) {
    return { code: "vagas.invalid_category_name", message: "O nome da categoria não pode ser vazio." };
  }
  return null;
}
