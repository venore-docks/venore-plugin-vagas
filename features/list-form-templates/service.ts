import { findAllFormTemplates } from "./store";
import type { ListFormTemplatesResult } from "./types";

export async function listFormTemplates(): Promise<ListFormTemplatesResult> {
  return { success: true, data: await findAllFormTemplates() };
}
