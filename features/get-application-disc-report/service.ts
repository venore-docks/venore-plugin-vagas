import { loadTests, VAGAS_TEST_MODULE_ID } from "../../shared/tests-bridge";
import { findApplicationById } from "../sync-application-disc-status/store";
import { findJobById } from "../update-job/store";
import type { GetApplicationDiscReportInput, GetApplicationDiscReportResult } from "./types";

export async function getApplicationDiscReport(input: GetApplicationDiscReportInput): Promise<GetApplicationDiscReportResult> {
  const application = await findApplicationById(input.applicationId);
  if (!application) {
    return { success: false, error: { code: "vagas.not_found", message: "Candidatura não encontrada." } };
  }
  if (!application.discReportId) {
    return { success: false, error: { code: "vagas.no_disc_report", message: "Esta candidatura ainda não tem um relatório DISC." } };
  }

  const job = await findJobById(application.jobId);
  if (!job) {
    return { success: false, error: { code: "vagas.not_found", message: "Vaga não encontrada." } };
  }

  const tests = await loadTests();
  if (!tests) {
    return { success: false, error: { code: "vagas.disc_unavailable", message: "O plugin Testes não está instalado ou ativo." } };
  }

  // getTestResultExternal (não o handler com claim) não exige sessão nem tem efeito colateral — ver
  // shared/tests-bridge.ts. A autorização (vagas.applications.review) já foi checada no handler.
  const result = await tests.getTestResultExternal(application.discReportId);
  if (!result.success) {
    return result;
  }
  if (result.data.testId !== VAGAS_TEST_MODULE_ID) {
    return { success: false, error: { code: "vagas.no_disc_report", message: "Esta candidatura ainda não tem um relatório DISC." } };
  }

  const footerText = await tests.getTestReportFooterText();
  return { success: true, data: { candidateName: application.candidateName, jobTitle: job.title, result: result.data, footerText } };
}
