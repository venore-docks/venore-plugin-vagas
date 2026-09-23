import type { OperationResult } from "@venore/plugin-sdk";
import type { TagCategory, TagItemRecord } from "../../contracts/types";

export type CreateTagItemCommand = { category: TagCategory; label: string; actorId: string };
export type CreateTagItemInput = Omit<CreateTagItemCommand, "actorId">;
export type CreateTagItemResult = OperationResult<TagItemRecord>;
