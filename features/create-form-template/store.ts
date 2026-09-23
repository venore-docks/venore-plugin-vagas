import { db } from "@venore/plugin-sdk";
import { vagasFormTemplates } from "../../database/schema";
import type { FormTemplateRecord } from "../../contracts/types";
import type { CreateFormTemplateCommand } from "./types";

export async function insertFormTemplate(command: CreateFormTemplateCommand): Promise<FormTemplateRecord> {
  const [row] = await db
    .insert(vagasFormTemplates)
    .values({ name: command.name.trim(), fields: command.fields })
    .returning();
  return row as FormTemplateRecord;
}
