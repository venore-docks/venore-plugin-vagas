import { loadDisc } from "../../shared/disc-bridge";
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

  const disc = await loadDisc();
  if (!disc) {
    return { success: false, error: { code: "vagas.disc_unavailable", message: "O plugin Teste DISC não está instalado ou ativo." } };
  }

  // getDiscReport (não o handler com claim) é público por design, sem sessão nem efeito
  // colateral — ver comentário em shared/disc-bridge.ts.
  const result = await disc.getDiscReport({ reportId: application.discReportId });
  if (!result.success) {
    return result;
  }

  return { success: true, data: { candidateName: application.candidateName, jobTitle: job.title, report: result.data } };
}
