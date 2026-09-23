import type { OperationResult } from "@venore/plugin-sdk";
import type { TagItemRecord } from "../../contracts/types";

export type UpdateTagItemCommand = { tagItemId: string; label: string; actorId: string };
export type UpdateTagItemInput = Omit<UpdateTagItemCommand, "actorId">;
export type UpdateTagItemResult = OperationResult<TagItemRecord>;
