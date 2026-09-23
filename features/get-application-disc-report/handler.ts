import { authorizeActor } from "@venore/plugin-sdk/rbac";
import { getApplicationDiscReport } from "./service";
import type { GetApplicationDiscReportInput, GetApplicationDiscReportResult } from "./types";

export async function getApplicationDiscReportHandler(input: GetApplicationDiscReportInput): Promise<GetApplicationDiscReportResult> {
  if (input.applicationId.trim().length === 0) {
    return { success: false, error: { code: "vagas.invalid_id", message: "applicationId não pode ser vazio." } };
  }

  const authz = await authorizeActor("vagas.applications.review");
  if (!authz.authorized) {
    return { success: false, error: authz.error };
  }

  return getApplicationDiscReport(input);
}
