import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { listAllTagCatalogs, listTagItems } from "./service";
import type { ListAllTagCatalogsResult, ListTagItemsInput, ListTagItemsResult } from "./types";

export async function listTagItemsHandler(input: ListTagItemsInput): Promise<ListTagItemsResult> {
  const authz = await authorizeActor("vagas.read");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }
  return listTagItems(input);
}

export async function listAllTagCatalogsHandler(): Promise<ListAllTagCatalogsResult> {
  const authz = await authorizeActor("vagas.read");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }
  return listAllTagCatalogs();
}
