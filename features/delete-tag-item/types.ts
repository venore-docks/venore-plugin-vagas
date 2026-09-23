import type { OperationResult } from "@venore/plugin-sdk";

export type DeleteTagItemCommand = { tagItemId: string; actorId: string };
export type DeleteTagItemInput = Omit<DeleteTagItemCommand, "actorId">;
export type DeleteTagItemResult = OperationResult<{ tagItemId: string }>;
