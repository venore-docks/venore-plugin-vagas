import { buildEmptyTagCatalogs } from "../../shared/empty-tag-catalogs";
import { findAllTagItems, findTagItemsByCategory } from "./store";
import type { ListAllTagCatalogsResult, ListTagItemsInput, ListTagItemsResult } from "./types";

export async function listTagItems(input: ListTagItemsInput): Promise<ListTagItemsResult> {
  return { success: true, data: await findTagItemsByCategory(input.category) };
}

export async function listAllTagCatalogs(): Promise<ListAllTagCatalogsResult> {
  const items = await findAllTagItems();
  // Sempre uma instância nova (nunca a constante compartilhada EMPTY_TAG_CATALOGS) — isto muta
  // os arrays por categoria logo abaixo, mutar o módulo compartilhado vazaria itens entre
  // requests.
  const grouped = buildEmptyTagCatalogs();
  for (const item of items) grouped[item.category].push(item);
  return { success: true, data: grouped };
}
