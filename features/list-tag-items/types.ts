import type { OperationResult } from "@venore/plugin-sdk";
import type { TagCategory, TagItemRecord } from "../../contracts/types";

export type ListTagItemsInput = { category: TagCategory };
export type ListTagItemsResult = OperationResult<TagItemRecord[]>;
export type ListAllTagCatalogsResult = OperationResult<Record<TagCategory, TagItemRecord[]>>;
