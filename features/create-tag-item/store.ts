import { db } from "@venore/plugin-sdk";
import { vagasTagItems } from "../../database/schema";
import type { TagItemRecord } from "../../contracts/types";
import type { CreateTagItemCommand } from "./types";

export async function insertTagItem(command: CreateTagItemCommand): Promise<TagItemRecord> {
  const [row] = await db
    .insert(vagasTagItems)
    .values({ category: command.category, label: command.label.trim() })
    .returning();
  return row as TagItemRecord;
}
