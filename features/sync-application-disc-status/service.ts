import { loadTests } from "../../shared/tests-bridge";
import { findApplicationById, markApplicationCompleted } from "./store";
import type { SyncApplicationDiscStatusInput, SyncApplicationDiscStatusResult } from "./types";

// Fecha o laço candidatura<->DISC sem webhook: chamado tanto pela página pública de confirmação
// (depois do redirect do disc/teste) quanto pelo botão "verificar DISC" no admin (candidato que
// terminou o teste mas não voltou pra página de confirmação). Idempotente — reprocessar uma
// candidatura já "completed" só devolve o registro como está.
export async function syncApplicationDiscStatus(input: SyncApplicationDiscStatusInput): Promise<SyncApplicationDiscStatusResult> {
  const application = await findApplicationById(input.applicationId);
  if (!application) {
    return { success: false, error: { code: "vagas.not_found", message: "Candidatura não encontrada." } };
  }

  if (application.status === "completed" || !application.discInstanceId) {
    return { success: true, data: application };
  }

  const tests = await loadTests();
  if (!tests) {
    return { success: true, data: application };
  }

  const reports = await tests.listTestInstanceResultsExternal(application.discInstanceId);
  if (!reports.success || reports.data.results.length === 0) {
    return { success: true, data: application };
  }

  const [mostRecentReport] = reports.data.results;
  const updated = await markApplicationCompleted(application.id, mostRecentReport.id);
  return { success: true, data: updated };
}
