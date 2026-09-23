import { VAGAS_TAG_CATEGORIES } from "../../database/schema";
import type { TagCategory, TagItemRecord } from "../../contracts/types";
import { findAllTagItems, findTagItemsByCategory } from "./store";
import type { ListAllTagCatalogsResult, ListTagItemsInput, ListTagItemsResult } from "./types";

export async function listTagItems(input: ListTagItemsInput): Promise<ListTagItemsResult> {
  return { success: true, data: await findTagItemsByCategory(input.category) };
}

export async function listAllTagCatalogs(): Promise<ListAllTagCatalogsResult> {
  const items = await findAllTagItems();
  const grouped = Object.fromEntries(VAGAS_TAG_CATEGORIES.map((category) => [category, [] as TagItemRecord[]])) as Record<
    TagCategory,
    TagItemRecord[]
  >;
  for (const item of items) grouped[item.category].push(item);
  return { success: true, data: grouped };
}
