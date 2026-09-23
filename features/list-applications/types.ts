import type { OperationResult } from "@venore/plugin-sdk";
import type { ApplicationRecord } from "../../contracts/types";

export type ApplicationAdminView = ApplicationRecord & {
  resumeUrl: string | null;
  discProfile: { profileKey: string; profileKeySecondary: string } | null;
};

export type ListApplicationsInput = { jobId: string };
export type ListApplicationsResult = OperationResult<ApplicationAdminView[]>;
