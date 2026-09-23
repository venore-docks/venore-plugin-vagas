import type { OperationResult } from "@venore/plugin-sdk";
import type { DiscReportViewExternal } from "../../shared/disc-bridge";

export type ApplicationDiscReportView = {
  candidateName: string;
  jobTitle: string;
  report: DiscReportViewExternal;
};

export type GetApplicationDiscReportInput = { applicationId: string };
export type GetApplicationDiscReportResult = OperationResult<ApplicationDiscReportView>;
