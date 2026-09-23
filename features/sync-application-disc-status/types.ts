import type { OperationResult } from "@venore/plugin-sdk";
import type { ApplicationRecord } from "../../contracts/types";

export type SyncApplicationDiscStatusInput = { applicationId: string };
export type SyncApplicationDiscStatusResult = OperationResult<ApplicationRecord>;
