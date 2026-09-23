import { findAllJobCategories } from "./store";
import type { ListJobCategoriesResult } from "./types";

export async function listJobCategories(): Promise<ListJobCategoriesResult> {
  return { success: true, data: await findAllJobCategories() };
}
